import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { createInvoice, getPlanPrice } from "@/lib/nowpayments";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { plan, cycle } = body;

  if (!plan || !cycle) {
    return NextResponse.json({ error: "plan and cycle required" }, { status: 400 });
  }

  const priceCents = getPlanPrice(plan, cycle);
  if (priceCents <= 0) {
    return NextResponse.json({ error: "Invalid plan or cycle" }, { status: 400 });
  }

  const priceUsd = priceCents / 100;
  const orderId = `np_${auth.user.id}_${plan}_${cycle}_${Date.now()}`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smtools.online";

  try {
    const invoice = await createInvoice({
      priceAmount: priceUsd,
      priceCurrency: "usd",
      orderId,
      orderDescription: `${plan} plan (${cycle})`,
      ipnCallbackUrl: `${baseUrl}/api/billing/nowpayments/webhook`,
      successUrl: `${baseUrl}/checkout/success?order=${orderId}`,
      cancelUrl: `${baseUrl}/checkout?plan=${plan}&cycle=${cycle}`,
    });

    // Save to DB
    await db.cryptoPayment.create({
      data: {
        userId: auth.user.id,
        amount: priceUsd,
        amountUsd: priceUsd,
        asset: "MULTI",
        network: "nowpayments",
        status: "PENDING",
        plan,
        cycle,
        metadata: JSON.stringify({
          invoiceId: invoice.id,
          paymentId: invoice.payment_id,
          payAddress: invoice.pay_address,
        }),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({
      invoiceId: invoice.id,
      paymentUrl: invoice.payment_url,
      payAddress: invoice.pay_address,
      payCurrency: invoice.pay_currency,
      priceAmount: priceUsd,
      orderId,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create invoice" }, { status: 500 });
  }
}
