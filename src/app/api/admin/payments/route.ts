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
  const tab = searchParams.get("tab") || "";
  const method = searchParams.get("method") || "";

  const where: any = {};
  if (search) {
    where.OR = [
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (method) where.method = method;

  if (tab === "pending") where.status = "PENDING";
  else if (tab === "successful") where.status = "SUCCEEDED";
  else if (tab === "failed") where.status = "FAILED";
  else if (tab === "refunded") where.status = { in: ["REFUNDED", "PARTIALLY_REFUNDED"] };

  try {
    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.payment.count({ where }),
    ]);

    // Stats
    const [pendingCount, succeededCount, failedCount, refundedCount, pendingSum, succeededSum, totalAgg] = await Promise.all([
      db.payment.count({ where: { status: "PENDING" } }),
      db.payment.count({ where: { status: "SUCCEEDED" } }),
      db.payment.count({ where: { status: "FAILED" } }),
      db.payment.count({ where: { status: { in: ["REFUNDED", "PARTIALLY_REFUNDED"] } } }),
      db.payment.aggregate({ _sum: { amount: true }, where: { status: "PENDING" } }),
      db.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCEEDED" } }),
      db.payment.aggregate({ _sum: { amount: true, refundAmount: true }, where: {} }),
    ]);

    return NextResponse.json({
      payments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalRevenue: totalAgg._sum.amount ?? 0,
        totalRefunded: totalAgg._sum.refundAmount ?? 0,
        totalTransactions: totalAgg._count ?? 0,
        pendingCount,
        pendingAmount: pendingSum._sum.amount ?? 0,
        succeededCount,
        succeededAmount: succeededSum._sum.amount ?? 0,
        failedCount,
        refundedCount,
      },
    });
  } catch (err: any) {
    console.error("[Admin Payments] Error:", err);
    return NextResponse.json({
      payments: [],
      total: 0,
      page: 1,
      totalPages: 0,
      stats: {
        totalRevenue: 0, totalRefunded: 0, totalTransactions: 0,
        pendingCount: 0, pendingAmount: 0, succeededCount: 0, succeededAmount: 0,
        failedCount: 0, refundedCount: 0,
      },
    });
  }
}
