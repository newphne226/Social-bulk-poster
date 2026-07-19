import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab") || "pending";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
  const search = searchParams.get("search") || "";

  const where: any = {};
  if (tab === "pending") where.approvalStatus = "PENDING";
  else if (tab === "approved") where.approvalStatus = "APPROVED";
  else if (tab === "rejected") where.approvalStatus = "REJECTED";

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      include: {
        subscription: { include: { plan: { select: { name: true } } } },
        _count: { select: { posts: true, accounts: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.user.count({ where }),
  ]);

  // Stats
  const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
    db.user.count({ where: { approvalStatus: "PENDING" } }),
    db.user.count({ where: { approvalStatus: "APPROVED" } }),
    db.user.count({ where: { approvalStatus: "REJECTED" } }),
  ]);

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl,
      approvalStatus: u.approvalStatus,
      approvedAt: u.approvedAt?.toISOString() || null,
      rejectedAt: u.rejectedAt?.toISOString() || null,
      rejectedReason: u.rejectedReason,
      createdAt: u.createdAt.toISOString(),
      lastLoginAt: u.lastLoginAt?.toISOString() || null,
      plan: u.subscription?.plan?.name ?? "Free",
      postsCount: u._count.posts,
      accountsCount: u._count.accounts,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
    stats: { pendingCount, approvedCount, rejectedCount },
  });
}
