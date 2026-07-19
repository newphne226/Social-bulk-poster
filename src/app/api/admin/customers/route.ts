import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const tab = searchParams.get("tab") ?? "";

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const where: any = { deletedAt: null };
  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status;
  if (tab === "new") {
    where.createdAt = { gte: weekAgo };
  }

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        subscription: { include: { plan: true } },
        _count: { select: { posts: true, accounts: true, tickets: true, payments: true } },
      },
    }),
    db.user.count({ where }),
  ]);

  return NextResponse.json({
    customers: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl,
      role: u.role,
      status: u.status,
      plan: u.subscription?.plan?.tier ?? "FREE",
      planName: u.subscription?.plan?.name ?? "Free",
      postsCount: u._count.posts,
      accountsCount: u._count.accounts,
      ticketsCount: u._count.tickets,
      paymentsCount: u._count.payments,
      lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
      createdAt: u.createdAt.toISOString(),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
