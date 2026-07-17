// GET /api/admin/stats — admin dashboard stats (admin only).
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    activeUsers30d,
    payingUsers,
    postsScheduledToday,
    postsPublishedToday,
    failedPosts24h,
    dailyActiveUsers,
    revenueByPlan,
    postsByPlatform,
    mrr,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({
      where: { lastLoginAt: { gte: thirtyDaysAgo } },
    }),
    db.user.count({
      where: { subscription: { status: "ACTIVE", plan: { tier: { not: "FREE" } } } },
    }),
    db.post.count({
      where: { status: "SCHEDULED", scheduledAt: { gte: oneDayAgo } },
    }),
    db.post.count({
      where: { status: "PUBLISHED", publishedAt: { gte: oneDayAgo } },
    }),
    db.post.count({
      where: { status: "FAILED", failedAt: { gte: oneDayAgo } },
    }),
    // Daily active users for last 7 days
    Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const start = new Date(date.setHours(0, 0, 0, 0));
        const end = new Date(date.setHours(23, 59, 59, 999));
        return db.user.count({
          where: { lastLoginAt: { gte: start, lte: end } },
        }).then((value) => ({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          value,
        }));
      })
    ),
    // Revenue by plan
    db.subscription.groupBy({
      by: ["planId"],
      where: { status: "ACTIVE" },
      _sum: { plan: { priceMonthly: true } },
    }).then(async (results) => {
      const planIds = results.map((r) => r.planId);
      const plans = await db.plan.findMany({ where: { id: { in: planIds } } });
      return results.map((r) => {
        const plan = plans.find((p) => p.id === r.planId);
        return {
          name: plan?.name ?? "Unknown",
          value: r._sum.plan?.priceMonthly ?? 0,
          color: plan?.tier === "VIP_PRO" ? "#f59e0b" : plan?.tier === "SILVER" ? "#cbd5e1" : "#94a3b8",
        };
      });
    }),
    // Posts by platform
    db.post.groupBy({
      by: ["platform"],
      where: { scheduledAt: { gte: thirtyDaysAgo } },
      _count: { id: true },
    }).then((results) => {
      const colors: Record<string, string> = {
        facebook: "#1877F2",
        instagram: "#E4405F",
        x: "#000000",
        linkedin: "#0A66C2",
        pinterest: "#BD081C",
      };
      return results.map((r) => ({
        platform: r.platform,
        count: r._count.id,
        color: colors[r.platform] ?? "#64748B",
      }));
    }),
    // MRR
    db.subscription.aggregate({
      where: { status: "ACTIVE" },
      _sum: { plan: { priceMonthly: true } },
    }).then((r) => r._sum.plan?.priceMonthly ?? 0),
  ]);

  return NextResponse.json({
    stats: {
      totalUsers,
      activeUsers30d,
      payingUsers,
      mrr,
      postsScheduledToday,
      postsPublishedToday,
      failedPosts24h,
      dailyActiveUsers: dailyActiveUsers.reverse(),
      revenueByPlan,
      postsByPlatform,
    },
    generatedAt: new Date().toISOString(),
  });
}