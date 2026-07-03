// GET /api/admin/coupons — list coupons.
// POST /api/admin/coupons — create a coupon.
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { ADMIN_COUPONS, type AdminCoupon } from "@/lib/admin-mock";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const active = searchParams.get("active");

  let result = ADMIN_COUPONS;
  if (active === "true") result = result.filter((c) => c.active);
  if (active === "false") result = result.filter((c) => !c.active);

  return NextResponse.json({ coupons: result, total: result.length });
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const { code, percentOff, duration = "ONCE", maxRedemptions, expiresAt } = body ?? {};
  if (!code || typeof percentOff !== "number") {
    return NextResponse.json(
      { error: "code and percentOff are required." },
      { status: 400 }
    );
  }
  if (ADMIN_COUPONS.some((c) => c.code === code.toUpperCase())) {
    return NextResponse.json({ error: "Coupon code already exists." }, { status: 409 });
  }

  const newCoupon: AdminCoupon = {
    id: `c${Date.now()}`,
    code: code.toUpperCase(),
    percentOff,
    duration,
    active: true,
    redeemed: 0,
    maxRedemptions: maxRedemptions ?? null,
    expiresAt: expiresAt ?? null,
  };
  ADMIN_COUPONS.push(newCoupon);

  return NextResponse.json({ coupon: newCoupon }, { status: 201 });
}
