import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id },
    include: {
      subscription: { include: { plan: true } },
      accounts: { select: { id: true, platform: true, displayName: true, isConnected: true, createdAt: true } },
      posts: { orderBy: { createdAt: "desc" }, take: 10, select: { id: true, caption: true, platform: true, status: true, createdAt: true } },
      payments: { orderBy: { createdAt: "desc" }, take: 10, select: { id: true, amount: true, status: true, method: true, createdAt: true } },
      tickets: { orderBy: { createdAt: "desc" }, take: 5, select: { id: true, subject: true, status: true, priority: true, createdAt: true } },
      customerNotes: { orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } } } },
      _count: { select: { posts: true, accounts: true, payments: true, tickets: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json({
    customer: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      status: user.status,
      bannedAt: user.bannedAt?.toISOString() ?? null,
      suspendedAt: user.suspendedAt?.toISOString() ?? null,
      suspendedReason: user.suspendedReason ?? null,
      plan: user.subscription?.plan?.tier ?? "FREE",
      planName: user.subscription?.plan?.name ?? "Free",
      billingCycle: user.subscription?.billingCycle ?? null,
      currentPeriodEnd: user.subscription?.currentPeriodEnd?.toISOString() ?? null,
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      counts: {
        posts: user._count.posts,
        accounts: user._count.accounts,
        payments: user._count.payments,
        tickets: user._count.tickets,
      },
      accounts: user.accounts,
      recentPosts: user.posts.map((p) => ({
        id: p.id,
        caption: p.caption.substring(0, 100),
        platform: p.platform,
        status: p.status,
        createdAt: p.createdAt.toISOString(),
      })),
      recentPayments: user.payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        method: p.method,
        createdAt: p.createdAt.toISOString(),
      })),
      recentTickets: user.tickets.map((t) => ({
        id: t.id,
        subject: t.subject,
        status: t.status,
        priority: t.priority,
        createdAt: t.createdAt.toISOString(),
      })),
      notes: user.customerNotes.map((n) => ({
        id: n.id,
        body: n.body,
        adminName: n.user.name ?? n.user.email,
        createdAt: n.createdAt.toISOString(),
      })),
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const { action } = body;

  let updateData: any = {};
  switch (action) {
    case "block":
      updateData = { status: "BANNED", bannedAt: new Date() };
      break;
    case "unblock":
      updateData = { status: "ACTIVE", bannedAt: null, suspendedAt: null, suspendedReason: null };
      break;
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id },
    data: updateData,
    select: { id: true, status: true },
  });

  return NextResponse.json({ customer: updated });
}
