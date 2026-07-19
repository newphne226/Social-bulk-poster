import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const method = searchParams.get("method") || "";
  const tab = searchParams.get("tab") || "";

  const where: any = {};
  if (search) {
    where.OR = [
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      { stripePaymentIntentId: { contains: search, mode: "insensitive" } },
      { stripeInvoiceId: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status;
  if (method) where.method = method;

  // Tab-based filtering
  if (tab === "pending") where.status = "PENDING";
  else if (tab === "successful") where.status = "SUCCEEDED";
  else if (tab === "failed") where.status = "FAILED";
  else if (tab === "refunded") where.status = { in: ["REFUNDED", "PARTIALLY_REFUNDED"] };

  const [payments, total, stats] = await Promise.all([
    db.payment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        subscription: { select: { id: true, plan: { select: { name: true } } } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.payment.count({ where }),
    db.payment.aggregate({
      _sum: { amount: true, refundAmount: true },
      _count: true,
      where: {},
    }),
  ]);

  // Stats by status
  const [pendingCount, succeededCount, failedCount, refundedCount, pendingSum, succeededSum] = await Promise.all([
    db.payment.count({ where: { status: "PENDING" } }),
    db.payment.count({ where: { status: "SUCCEEDED" } }),
    db.payment.count({ where: { status: "FAILED" } }),
    db.payment.count({ where: { status: { in: ["REFUNDED", "PARTIALLY_REFUNDED"] } } }),
    db.payment.aggregate({ _sum: { amount: true }, where: { status: "PENDING" } }),
    db.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCEEDED" } }),
  ]);

  return NextResponse.json({
    payments,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    stats: {
      totalRevenue: stats._sum.amount ?? 0,
      totalRefunded: stats._sum.refundAmount ?? 0,
      totalTransactions: stats._count,
      pendingCount,
      pendingAmount: pendingSum._sum.amount ?? 0,
      succeededCount,
      succeededAmount: succeededSum._sum.amount ?? 0,
      failedCount,
      refundedCount,
    },
  });
}
