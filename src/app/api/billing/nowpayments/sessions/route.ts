import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const sessions = await db.cryptoPayment.findMany({
    where: { userId: auth.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    sessions: sessions.map((s) => {
      let metadata: any = {};
      try { metadata = JSON.parse(s.metadata); } catch {}
      return {
        id: s.id,
        status: s.status,
        amount: s.amount,
        amountUsd: s.amountUsd,
        asset: s.asset,
        network: s.network,
        plan: s.plan,
        cycle: s.cycle,
        txHash: s.txHash,
        createdAt: s.createdAt.toISOString(),
        expiresAt: s.expiresAt.toISOString(),
        confirmedAt: s.confirmedAt?.toISOString() || null,
        payAddress: metadata.payAddress || null,
      };
    }),
  });
}
