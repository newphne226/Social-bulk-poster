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
  const coupon = await db.coupon.findUnique({
    where: { id },
    include: {
      plan: { select: { id: true, name: true, tier: true } },
      usages: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      _count: { select: { usages: true } },
    },
  });

  if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ coupon });
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

  if (action === "toggle-active") {
    const coupon = await db.coupon.findUnique({ where: { id } });
    if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await db.coupon.update({ where: { id }, data: { isActive: !coupon.isActive } });
    return NextResponse.json({ ok: true });
  }

  const allowed = [
    "code", "name", "description", "type", "planId", "percentOff", "amountOff",
    "currency", "duration", "durationInMonths", "maxRedemptions", "minPurchase",
    "maxDiscount", "validFrom", "validUntil", "isActive", "isPublic",
  ];
  const updates: any = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === "validFrom" || key === "validUntil") {
        updates[key] = body[key] ? new Date(body[key]) : null;
      } else if (key === "code" && body[key]) {
        updates[key] = body[key].toUpperCase().trim();
      } else {
        updates[key] = body[key];
      }
    }
  }

  const coupon = await db.coupon.update({
    where: { id },
    data: updates,
    include: { plan: { select: { name: true } } },
  });

  return NextResponse.json({ coupon });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  await db.coupon.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
