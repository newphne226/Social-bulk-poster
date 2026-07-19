import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const activeOnly = searchParams.get("active") === "true";

  const where: any = {};
  if (search) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (type) where.type = type;
  if (activeOnly) where.isActive = true;

  const [coupons, total] = await Promise.all([
    db.coupon.findMany({
      where,
      include: { plan: { select: { name: true } }, _count: { select: { usages: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.coupon.count({ where }),
  ]);

  // Usage stats
  const [totalCoupons, activeCoupons, totalRedemptions, totalDiscount] = await Promise.all([
    db.coupon.count(),
    db.coupon.count({ where: { isActive: true } }),
    db.coupon.aggregate({ _sum: { timesRedeemed: true } }),
    db.couponUsage.aggregate({ _sum: { discountAmount: true } }),
  ]);

  return NextResponse.json({
    coupons,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    stats: {
      totalCoupons,
      activeCoupons,
      totalRedemptions: totalRedemptions._sum.timesRedeemed ?? 0,
      totalDiscount: totalDiscount._sum.discountAmount ?? 0,
    },
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { code, name, description, type, planId, percentOff, amountOff, currency,
    duration, durationInMonths, maxRedemptions, minPurchase, maxDiscount,
    validFrom, validUntil, isActive, isPublic } = body;

  if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 });
  if (!percentOff && !amountOff) return NextResponse.json({ error: "Must specify percentOff or amountOff" }, { status: 400 });

  const existing = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (existing) return NextResponse.json({ error: "Code already exists" }, { status: 409 });

  const coupon = await db.coupon.create({
    data: {
      code: code.toUpperCase().trim(),
      name: name || null,
      description: description || null,
      type: type || "PROMO_CODE",
      planId: planId || null,
      percentOff: percentOff || null,
      amountOff: amountOff || null,
      currency: currency || "usd",
      duration: duration || "ONCE",
      durationInMonths: durationInMonths || null,
      maxRedemptions: maxRedemptions || null,
      minPurchase: minPurchase || null,
      maxDiscount: maxDiscount || null,
      validFrom: validFrom ? new Date(validFrom) : null,
      validUntil: validUntil ? new Date(validUntil) : null,
      isActive: isActive !== false,
      isPublic: isPublic || false,
    },
    include: { plan: { select: { name: true } } },
  });

  return NextResponse.json({ coupon }, { status: 201 });
}
