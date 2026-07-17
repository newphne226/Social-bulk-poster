// GET /api/admin/coupons — list coupons.
// POST /api/admin/coupons — create a coupon.
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const active = searchParams.get("active");

  const where: any = {};
  if (active === "true") where.isActive = true;
  if (active === "false") where.isActive = false;

  const coupons = await db.coupon.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { plan: true },
  });

  return NextResponse.json({
    coupons: coupons.map((c) => ({
      id: c.id,
      code: c.code,
      planId: c.planId,
      planName: c.plan?.name,
      percentOff: c.percentOff,
      amountOff: c.amountOff,
      currency: c.currency,
      duration: c.duration,
      durationInMonths: c.durationInMonths,
      maxRedemptions: c.maxRedemptions,
      timesRedeemed: c.timesRedeemed,
      validFrom: c.validFrom?.toISOString(),
      validUntil: c.validUntil?.toISOString(),
      isActive: c.isActive,
      createdAt: c.createdAt.toISOString(),
    })),
    total: coupons.length,
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const { code, percentOff, amountOff, currency, duration = "ONCE", durationInMonths, maxRedemptions, validUntil, planId } = body ?? {};

  if (!code || (typeof percentOff !== "number" && typeof amountOff !== "number")) {
    return NextResponse.json(
      { error: "code and percentOff (or amountOff) are required." },
      { status: 400 }
    );
  }

  const existing = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (existing) {
    return NextResponse.json({ error: "Coupon code already exists." }, { status: 409 });
  }

  const newCoupon = await db.coupon.create({
    data: {
      code: code.toUpperCase(),
      percentOff: percentOff ?? null,
      amountOff: amountOff ?? null,
      currency: currency ?? "usd",
      duration,
      durationInMonths: durationInMonths ?? null,
      maxRedemptions: maxRedemptions ?? null,
      validUntil: validUntil ? new Date(validUntil) : null,
      planId: planId ?? null,
      isActive: true,
    },
  });

  return NextResponse.json(
    {
      coupon: {
        id: newCoupon.id,
        code: newCoupon.code,
        percentOff: newCoupon.percentOff,
        amountOff: newCoupon.amountOff,
        currency: newCoupon.currency,
        duration: newCoupon.duration,
        durationInMonths: newCoupon.durationInMonths,
        maxRedemptions: newCoupon.maxRedemptions,
        validUntil: newCoupon.validUntil?.toISOString(),
        isActive: newCoupon.isActive,
        createdAt: newCoupon.createdAt.toISOString(),
      },
    },
    { status: 201 }
  );
}