import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const [
    totalUsers,
    activeUsers,
    totalPosts,
    publishedPosts,
    scheduledPosts,
    totalRevenue,
    activeSubscriptions,
    totalAccounts,
  ] = await Promise.all([
    db.user.count({ where: { deletedAt: null } }),
    db.user.count({ where: { status: "ACTIVE", deletedAt: null } }),
    db.post.count(),
    db.post.count({ where: { status: "PUBLISHED" } }),
    db.post.count({ where: { status: "SCHEDULED" } }),
    db.payment.aggregate({ where: { status: "SUCCEEDED" }, _sum: { amount: true } }),
    db.subscription.count({ where: { status: "ACTIVE" } }),
    db.socialAccount.count(),
  ]);

  const recentUsers = await db.user.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  const planDistribution = await db.subscription.groupBy({
    by: ["planId"],
    _count: true,
  });

  return NextResponse.json({
    stats: {
      totalUsers,
      activeUsers,
      totalPosts,
      publishedPosts,
      scheduledPosts,
      totalRevenue: totalRevenue._sum.amount ?? 0,
      activeSubscriptions,
      totalAccounts,
    },
    recentUsers,
    planDistribution,
  });
}
