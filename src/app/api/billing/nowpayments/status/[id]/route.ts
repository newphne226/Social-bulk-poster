import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const cryptoPayment = await db.cryptoPayment.findFirst({
    where: {
      id,
      userId: auth.user.id,
    },
  });

  if (!cryptoPayment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let metadata: any = {};
  try { metadata = JSON.parse(cryptoPayment.metadata); } catch {}

  return NextResponse.json({
    id: cryptoPayment.id,
    status: cryptoPayment.status,
    amount: cryptoPayment.amount,
    amountUsd: cryptoPayment.amountUsd,
    asset: cryptoPayment.asset,
    network: cryptoPayment.network,
    plan: cryptoPayment.plan,
    cycle: cryptoPayment.cycle,
    txHash: cryptoPayment.txHash,
    fromAddress: cryptoPayment.fromAddress,
    confirmations: cryptoPayment.confirmations,
    createdAt: cryptoPayment.createdAt.toISOString(),
    expiresAt: cryptoPayment.expiresAt.toISOString(),
    confirmedAt: cryptoPayment.confirmedAt?.toISOString() || null,
    payAddress: metadata.payAddress || null,
    invoiceId: metadata.invoiceId || null,
    paymentId: metadata.paymentId || null,
  });
}
