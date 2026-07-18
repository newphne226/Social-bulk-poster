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

  const where: any = { deletedAt: null };
  if (search) {
    where.OR = [
      { email: { contains: search } },
      { name: { contains: search } },
    ];
  }
  if (status) {
    where.status = status;
  }

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        subscription: { include: { plan: true } },
        _count: { select: { posts: true, accounts: true } },
      },
    }),
    db.user.count({ where }),
  ]);

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      plan: u.subscription?.plan?.tier ?? "FREE",
      postsCount: u._count.posts,
      accountsCount: u._count.accounts,
      createdAt: u.createdAt.toISOString(),
      lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { userId, action, value } = body;

  if (!userId || !action) {
    return NextResponse.json({ error: "userId and action are required" }, { status: 400 });
  }

  let updateData: any = {};

  switch (action) {
    case "ban":
      updateData = { status: "BANNED", bannedAt: new Date() };
      break;
    case "suspend":
      updateData = { status: "SUSPENDED", suspendedAt: new Date(), suspendedReason: value ?? "Suspended by admin" };
      break;
    case "activate":
      updateData = { status: "ACTIVE", bannedAt: null, suspendedAt: null, suspendedReason: null };
      break;
    case "promote":
      updateData = { role: "ADMIN" };
      break;
    case "demote":
      updateData = { role: "USER" };
      break;
    case "delete":
      updateData = { status: "DELETED", deletedAt: new Date() };
      break;
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  return NextResponse.json({ user: updated });
}
