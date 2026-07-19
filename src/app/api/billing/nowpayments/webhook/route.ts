import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyIpnSignature, mapPaymentStatus } from "@/lib/nowpayments";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("ipn-signature") || "";

    // Verify IPN signature
    if (!verifyIpnSignature(rawBody, signature)) {
      console.error("[NOWPayments] Invalid IPN signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const {
      payment_id,
      payment_status,
      order_id,
      actually_paid,
      actually_paid_currency,
      pay_currency,
      fee,
      outcome_amount,
      outcome_currency,
      pay_address,
      created_at,
    } = payload;

    console.log(`[NOWPayments] IPN: order=${order_id} status=${payment_status} paid=${actually_paid}`);

    // Find the crypto payment by order_id in metadata
    const cryptoPayments = await db.cryptoPayment.findMany({
      where: { userId: { not: "" } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    let cryptoPayment = null;
    for (const cp of cryptoPayments) {
      try {
        const meta = JSON.parse(cp.metadata);
        if (meta.invoiceId?.toString() === order_id?.toString() || meta.paymentId?.toString() === payment_id?.toString()) {
          cryptoPayment = cp;
          break;
        }
      } catch {}
    }

    if (!cryptoPayment) {
      // Try finding by order_id pattern
      console.error(`[NOWPayments] No crypto payment found for order: ${order_id}`);
      return NextResponse.json({ ok: true }); // Return 200 to acknowledge
    }

    const newStatus = mapPaymentStatus(payment_status);

    // Update crypto payment
    await db.cryptoPayment.update({
      where: { id: cryptoPayment.id },
      data: {
        status: newStatus as any,
        txHash: payload.tx_hash || cryptoPayment.txHash,
        fromAddress: pay_address || cryptoPayment.fromAddress,
        confirmations: payload.confirmations || cryptoPayment.confirmations,
        confirmedAt: payment_status === "finished" ? new Date() : cryptoPayment.confirmedAt,
        metadata: JSON.stringify({
          ...JSON.parse(cryptoPayment.metadata),
          ipnPayload: payload,
          lastUpdate: new Date().toISOString(),
        }),
      },
    });

    // If payment confirmed, activate subscription
    if (payment_status === "finished" && cryptoPayment.plan && cryptoPayment.cycle) {
      // Find or create subscription
      const existingSub = await db.subscription.findUnique({ where: { userId: cryptoPayment.userId } });

      // Find plan
      const plan = await db.plan.findFirst({ where: { name: cryptoPayment.plan.replace("_PRO", " Pro") } });

      if (plan) {
        if (existingSub) {
          await db.subscription.update({
            where: { id: existingSub.id },
            data: {
              planId: plan.id,
              status: "ACTIVE",
              billingCycle: cryptoPayment.cycle === "yearly" ? "YEARLY" : "MONTHLY",
              currentPeriodEnd: new Date(Date.now() + (cryptoPayment.cycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000),
            },
          });
        } else {
          await db.subscription.create({
            data: {
              userId: cryptoPayment.userId,
              planId: plan.id,
              status: "ACTIVE",
              billingCycle: cryptoPayment.cycle === "yearly" ? "YEARLY" : "MONTHLY",
              currentPeriodEnd: new Date(Date.now() + (cryptoPayment.cycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000),
            },
          });
        }

        // Create payment record
        await db.payment.create({
          data: {
            userId: cryptoPayment.userId,
            amount: Math.round(cryptoPayment.amountUsd * 100),
            currency: "usd",
            status: "SUCCEEDED",
            method: "CRYPTO",
            cryptoPaymentId: cryptoPayment.id,
            metadata: JSON.stringify({ nowpayments_payment_id: payment_id }),
          },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[NOWPayments] Webhook error:", err);
    return NextResponse.json({ ok: true }); // Always return 200
  }
}
