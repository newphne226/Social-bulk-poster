import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const payment = await db.payment.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true, role: true } },
      subscription: {
        select: {
          id: true, status: true, billingCycle: true, currentPeriodEnd: true,
          plan: { select: { name: true, tier: true, priceMonthly: true, priceYearly: true } },
        },
      },
    },
  });

  if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ payment });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const { action } = body;

  const payment = await db.payment.findUnique({ where: { id } });
  if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "refund") {
    const { amount, reason } = body;
    if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid refund amount" }, { status: 400 });

    const maxRefund = payment.amount - payment.refundAmount;
    if (amount > maxRefund) return NextResponse.json({ error: `Max refund is $${(maxRefund / 100).toFixed(2)}` }, { status: 400 });

    const newRefundAmount = payment.refundAmount + amount;
    const newStatus = newRefundAmount >= payment.amount ? "REFUNDED" : "PARTIALLY_REFUNDED";

    const updated = await db.payment.update({
      where: { id },
      data: {
        refundAmount: newRefundAmount,
        refundReason: reason || payment.refundReason,
        refundedAt: new Date(),
        refundedBy: auth.user.id,
        status: newStatus as any,
      },
    });

    return NextResponse.json({ payment: updated });
  }

  if (action === "retry") {
    if (payment.status !== "FAILED") {
      return NextResponse.json({ error: "Only failed payments can be retried" }, { status: 400 });
    }
    const updated = await db.payment.update({
      where: { id },
      data: { status: "PENDING", failureReason: null },
    });
    return NextResponse.json({ payment: updated });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
