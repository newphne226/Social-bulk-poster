import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalPosts,
    todayPosts,
    pendingPosts,
    completedPosts,
    cancelledPosts,
    failedPosts,
    totalRevenue,
    totalUsers,
    newCustomers,
    activeSubscriptions,
    totalAccounts,
  ] = await Promise.all([
    db.post.count(),
    db.post.count({ where: { createdAt: { gte: todayStart } } }),
    db.post.count({ where: { status: "SCHEDULED" } }),
    db.post.count({ where: { status: "PUBLISHED" } }),
    db.post.count({ where: { status: "CANCELED" } }),
    db.post.count({ where: { status: "FAILED" } }),
    db.payment.aggregate({ where: { status: "SUCCEEDED" }, _sum: { amount: true } }),
    db.user.count({ where: { deletedAt: null } }),
    db.user.count({ where: { createdAt: { gte: weekAgo }, deletedAt: null } }),
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

  // Revenue last 7 days
  const revenueByDay: { date: string; amount: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
    const dayRevenue = await db.payment.aggregate({
      where: { status: "SUCCEEDED", createdAt: { gte: dayStart, lt: dayEnd } },
      _sum: { amount: true },
    });
    revenueByDay.push({
      date: dayStart.toISOString().split("T")[0],
      amount: dayRevenue._sum.amount ?? 0,
    });
  }

  // Posts last 7 days
  const postsByDay: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
    const dayCount = await db.post.count({
      where: { createdAt: { gte: dayStart, lt: dayEnd } },
    });
    postsByDay.push({
      date: dayStart.toISOString().split("T")[0],
      count: dayCount,
    });
  }

  // Users last 7 days
  const usersByDay: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
    const dayCount = await db.user.count({
      where: { createdAt: { gte: dayStart, lt: dayEnd }, deletedAt: null },
    });
    usersByDay.push({
      date: dayStart.toISOString().split("T")[0],
      count: dayCount,
    });
  }

  return NextResponse.json({
    stats: {
      totalOrders: totalPosts,
      todayOrders: todayPosts,
      pendingOrders: pendingPosts,
      completedOrders: completedPosts,
      cancelledOrders: cancelledPosts,
      failedOrders: failedPosts,
      totalSales: totalRevenue._sum.amount ?? 0,
      newCustomers,
      totalUsers,
      activeSubscriptions,
      totalAccounts,
    },
    charts: {
      revenueByDay,
      postsByDay,
      usersByDay,
    },
    recentUsers,
  });
}
