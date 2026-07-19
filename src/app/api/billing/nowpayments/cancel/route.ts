import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";

// POST /api/billing/nowpayments/cancel - Cancel a pending crypto payment session
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { sessionId } = body;

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const session = await db.cryptoPayment.findFirst({
    where: { id: sessionId, userId: auth.user.id },
  });

  if (!session) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (session.status !== "PENDING") {
    return NextResponse.json({ error: "Only pending sessions can be cancelled" }, { status: 400 });
  }

  await db.cryptoPayment.update({
    where: { id: sessionId },
    data: { status: "EXPIRED" },
  });

  return NextResponse.json({ ok: true });
}
