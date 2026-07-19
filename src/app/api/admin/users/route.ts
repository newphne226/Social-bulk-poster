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
        _count: { select: { posts: true, accounts: true } },
        cryptoPayments: { where: { status: "CONFIRMED" }, orderBy: { createdAt: "desc" }, take: 1 },
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
      approvalStatus: u.approvalStatus,
      plan: u.cryptoPayments?.[0]?.plan || "FREE",
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

  // Prevent admin from performing dangerous actions on themselves
  if (userId === auth.user.id && ["ban", "suspend", "demote", "delete"].includes(action)) {
    return NextResponse.json({ error: `You cannot ${action} yourself.` }, { status: 400 });
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
    case "approve":
      updateData = { approvalStatus: "APPROVED", approvedAt: new Date(), approvedBy: auth.user.id };
      break;
    case "reject":
      updateData = { approvalStatus: "REJECTED", rejectedAt: new Date(), rejectedReason: value ?? "Rejected by admin" };
      break;
    case "pending":
      updateData = { approvalStatus: "PENDING", approvedAt: null, rejectedAt: null, rejectedReason: null };
      break;
    case "setRole":
      if (!["USER", "ADMIN", "OWNER"].includes(value)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      updateData = { role: value };
      break;
    case "setPlan": {
      const allowedPlans = ["FREE", "CONTENT", "REELS", "ALL_ACCESS"];
      const plan = allowedPlans.includes(value) ? value : "FREE";
      // Find or create subscription
      const existingSub = await db.subscription.findUnique({ where: { userId } });
      if (existingSub) {
        await db.subscription.update({
          where: { id: existingSub.id },
          data: { status: plan === "FREE" ? "CANCELED" : "ACTIVE" },
        });
      } else if (plan !== "FREE") {
        // Create a basic subscription record
        await db.subscription.create({
          data: { userId, planId: plan, status: "ACTIVE", billingCycle: "MONTHLY" },
        }).catch(() => {}); // Ignore if planId doesn't exist
      }
      return NextResponse.json({ user: { id: userId, plan } });
    }
    case "delete":
      updateData = { status: "DELETED", deletedAt: new Date() };
      break;
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, status: true, approvalStatus: true },
  });

  return NextResponse.json({ user: updated });
}
