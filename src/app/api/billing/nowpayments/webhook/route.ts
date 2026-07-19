import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyIpnSignature, mapPaymentStatus } from "@/lib/nowpayments";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("ipn-signature") || "";

    if (!verifyIpnSignature(rawBody, signature)) {
      console.error("[NOWPayments] Invalid IPN signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { payment_id, payment_status, order_id, actually_paid, pay_address } = payload;

    console.log(`[NOWPayments] IPN: order=${order_id} status=${payment_status} paid=${actually_paid}`);

    // Find the crypto payment by invoice/payment ID in metadata
    const cryptoPayments = await db.cryptoPayment.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 50,
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
      console.error(`[NOWPayments] No crypto payment found for order: ${order_id}`);
      return NextResponse.json({ ok: true });
    }

    const newStatus = mapPaymentStatus(payment_status);

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

    console.log(`[NOWPayments] Payment ${cryptoPayment.id} updated to ${newStatus}`);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[NOWPayments] Webhook error:", err);
    return NextResponse.json({ ok: true });
  }
}
