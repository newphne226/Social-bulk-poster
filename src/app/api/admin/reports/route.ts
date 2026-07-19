import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

function dateRange(period: string, from?: string, to?: string) {
  const now = new Date();
  let start: Date;
  let end = now;
  switch (period) {
    case "daily": start = new Date(now.getFullYear(), now.getMonth(), now.getDate()); break;
    case "weekly": { const d = new Date(now); d.setDate(d.getDate() - 7); start = d; } break;
    case "monthly": { const d = new Date(now); d.setMonth(d.getMonth() - 1); start = d; } break;
    case "yearly": { const d = new Date(now); d.setFullYear(d.getFullYear() - 1); start = d; } break;
    case "custom": start = from ? new Date(from) : new Date(now.getFullYear(), now.getMonth(), 1); end = to ? new Date(to) : now; break;
    default: start = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return { start, end };
}

function groupByDate(start: Date, end: Date, period: string) {
  const days = Math.ceil((end.getTime() - start.getTime()) / 86400000);
  if (days <= 31) return "day";
  if (days <= 90) return "week";
  return "month";
}

async function salesReport(start: Date, end: Date) {
  const payments = await db.payment.findMany({
    where: { createdAt: { gte: start, lte: end } },
    select: { amount: true, status: true, refundAmount: true, method: true, createdAt: true },
  });

  const totalSales = payments.filter((p) => p.status === "SUCCEEDED").reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.reduce((s, p) => s + p.refundAmount, 0);
  const netRevenue = totalSales - totalRefunded;
  const transactionCount = payments.length;
  const successfulCount = payments.filter((p) => p.status === "SUCCEEDED").length;
  const failedCount = payments.filter((p) => p.status === "FAILED").length;
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;
  const avgOrderValue = successfulCount > 0 ? Math.round(totalSales / successfulCount) : 0;

  const byMethod: Record<string, { count: number; amount: number }> = {};
  for (const p of payments.filter((p) => p.status === "SUCCEEDED")) {
    if (!byMethod[p.method]) byMethod[p.method] = { count: 0, amount: 0 };
    byMethod[p.method].count++;
    byMethod[p.method].amount += p.amount;
  }

  return {
    summary: { totalSales, totalRefunded, netRevenue, transactionCount, successfulCount, failedCount, pendingCount, avgOrderValue },
    byMethod: Object.entries(byMethod).map(([method, data]) => ({ method, ...data })),
  };
}

async function orderReport(start: Date, end: Date) {
  const posts = await db.post.findMany({
    where: { createdAt: { gte: start, lte: end } },
    select: { status: true, platform: true, createdAt: true, type: true },
  });

  const byStatus: Record<string, number> = {};
  const byPlatform: Record<string, number> = {};
  for (const p of posts) {
    byStatus[p.status] = (byStatus[p.status] || 0) + 1;
    byPlatform[p.platform] = (byPlatform[p.platform] || 0) + 1;
  }

  return {
    summary: { totalOrders: posts.length, published: posts.filter((p) => p.status === "PUBLISHED").length, scheduled: posts.filter((p) => p.status === "SCHEDULED").length, failed: posts.filter((p) => p.status === "FAILED").length, draft: posts.filter((p) => p.status === "DRAFT").length },
    byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
    byPlatform: Object.entries(byPlatform).map(([platform, count]) => ({ platform, count })),
  };
}

async function customerReport(start: Date, end: Date) {
  const [newUsers, totalUsers, activeSubscriptions] = await Promise.all([
    db.user.findMany({
      where: { createdAt: { gte: start, lte: end }, role: "USER" },
      select: { id: true, plan: true, status: true, createdAt: true },
    }),
    db.user.count({ where: { role: "USER" } }),
    db.subscription.count({ where: { status: "ACTIVE" } }),
  ]);

  const byPlan: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  for (const u of newUsers) {
    byPlan[u.plan] = (byPlan[u.plan] || 0) + 1;
    byStatus[u.status] = (byStatus[u.status] || 0) + 1;
  }

  return {
    summary: { newCustomers: newUsers.length, totalCustomers: totalUsers, activeSubscriptions },
    newByPlan: Object.entries(byPlan).map(([plan, count]) => ({ plan, count })),
    newByStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
  };
}

async function revenueReport(start: Date, end: Date) {
  const payments = await db.payment.findMany({
    where: { createdAt: { gte: start, lte: end }, status: "SUCCEEDED" },
    select: { amount: true, refundAmount: true, createdAt: true },
  });

  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.reduce((s, p) => s + p.refundAmount, 0);
  const netRevenue = totalRevenue - totalRefunded;

  // Group by day
  const byDay: Record<string, { revenue: number; refunds: number; count: number }> = {};
  for (const p of payments) {
    const day = p.createdAt.toISOString().split("T")[0];
    if (!byDay[day]) byDay[day] = { revenue: 0, refunds: 0, count: 0 };
    byDay[day].revenue += p.amount;
    byDay[day].refunds += p.refundAmount;
    byDay[day].count++;
  }

  const dailyData = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({ date, ...data }));

  return {
    summary: { totalRevenue, totalRefunded, netRevenue, transactionCount: payments.length },
    daily: dailyData,
  };
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const report = searchParams.get("report") || "sales";
  const period = searchParams.get("period") || "monthly";
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const { start, end } = dateRange(period, from, to);

  try {
    let data: any;
    switch (report) {
      case "sales": data = await salesReport(start, end); break;
      case "orders": data = await orderReport(start, end); break;
      case "customers": data = await customerReport(start, end); break;
      case "revenue": data = await revenueReport(start, end); break;
      default: return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }

    return NextResponse.json({
      report,
      period,
      from: start.toISOString(),
      to: end.toISOString(),
      ...data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Report generation failed" }, { status: 500 });
  }
}
