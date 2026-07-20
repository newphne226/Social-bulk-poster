import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

// GET — list subscription requests
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where: any = {};
  if (status) where.status = status;

  const [requests, total] = await Promise.all([
    db.subscriptionRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true } },
        cryptoPayment: { select: { id: true, status: true, amountUsd: true, confirmedAt: true } },
      },
    }),
    db.subscriptionRequest.count({ where }),
  ]);

  return NextResponse.json({
    requests: requests.map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.user.name ?? "No Name",
      userEmail: r.user.email,
      plan: r.plan,
      cycle: r.cycle,
      amountUsd: r.amountUsd,
      status: r.status,
      paymentStatus: r.cryptoPayment?.status ?? "UNKNOWN",
      paymentConfirmed: r.cryptoPayment?.confirmedAt != null,
      adminNote: r.adminNote,
      reviewedBy: r.reviewedBy,
      reviewedAt: r.reviewedAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// PATCH — approve or reject a subscription request
export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { requestId, action, note } = body;

  if (!requestId || !action) {
    return NextResponse.json({ error: "requestId and action required" }, { status: 400 });
  }

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 });
  }

  const subRequest = await db.subscriptionRequest.findUnique({
    where: { id: requestId },
    include: { cryptoPayment: true },
  });

  if (!subRequest) {
    return NextResponse.json({ error: "Subscription request not found" }, { status: 404 });
  }

  if (subRequest.status !== "PENDING") {
    return NextResponse.json({ error: "Request already reviewed" }, { status: 400 });
  }

  const newStatus = action === "approve" ? "APPROVED" : "REJECTED";

  await db.$transaction(async (tx) => {
    // Update the subscription request
    await tx.subscriptionRequest.update({
      where: { id: requestId },
      data: {
        status: newStatus,
        adminNote: note ?? null,
        reviewedBy: auth.user.id,
        reviewedAt: new Date(),
      },
    });

    if (action === "approve") {
      // Find the plan in the database
      const planName = subRequest.plan === "PRO" ? "Pro" : subRequest.plan === "SILVER" ? "Silver" : "Basic";
      const plan = await tx.plan.findFirst({ where: { name: planName } });

      if (plan) {
        const now = new Date();
        const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Find or create subscription
        const existingSub = await tx.subscription.findUnique({ where: { userId: subRequest.userId } });

        if (existingSub) {
          await tx.subscription.update({
            where: { id: existingSub.id },
            data: {
              planId: plan.id,
              status: "ACTIVE",
              billingCycle: subRequest.cycle === "yearly" ? "YEARLY" : "MONTHLY",
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
              canceledAt: null,
              cancelAtPeriodEnd: false,
            },
          });
        } else {
          await tx.subscription.create({
            data: {
              userId: subRequest.userId,
              planId: plan.id,
              status: "ACTIVE",
              billingCycle: subRequest.cycle === "yearly" ? "YEARLY" : "MONTHLY",
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
            },
          });
        }
      }
    }
  });

  return NextResponse.json({
    success: true,
    message: action === "approve" ? "Subscription approved and activated." : "Subscription rejected.",
  });
}
