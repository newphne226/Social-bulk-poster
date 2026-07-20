// GET /api/subscription — current subscription.
// PUT /api/subscription — update (cancel).
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";

const PLAN_FEATURES: Record<string, string[]> = {
  BASIC: ["content_post", "photo_upload", "basic_analytics"],
  SILVER: ["content_post", "photo_upload", "reels_upload", "video_upload", "ai_captions", "advanced_analytics"],
  PRO: ["content_post", "photo_upload", "reels_upload", "video_upload", "ai_captions", "ai_hashtags", "smart_queue", "api_access", "unlimited_posts", "unlimited_accounts"],
};

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  // Read from Subscription model (set by admin approval)
  const sub = await db.subscription.findUnique({
    where: { userId: auth.user.id },
    include: { plan: { select: { name: true, tier: true } } },
  });

  if (sub && sub.plan) {
    const planName = sub.plan.name; // "Free", "Basic", "Silver", "Pro"
    const uiPlan = planName === "Free" ? "FREE" : planName === "Basic" ? "BASIC" : planName === "Silver" ? "SILVER" : planName === "Pro" ? "PRO" : "FREE";
    const isActive = sub.status === "ACTIVE";

    return NextResponse.json({
      subscription: {
        plan: uiPlan,
        status: sub.status,
        billingCycle: sub.billingCycle,
        currentPeriodStart: sub.currentPeriodStart?.toISOString() ?? null,
        currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        features: isActive ? (PLAN_FEATURES[uiPlan] || []) : [],
      },
    });
  }

  // Check for pending subscription requests
  const pendingRequest = await db.subscriptionRequest.findFirst({
    where: { userId: auth.user.id, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  if (pendingRequest) {
    return NextResponse.json({
      subscription: {
        plan: pendingRequest.plan,
        status: "PENDING_APPROVAL",
        billingCycle: pendingRequest.cycle,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        features: [],
        requestId: pendingRequest.id,
      },
    });
  }

  // No subscription — free plan
  return NextResponse.json({
    subscription: {
      plan: "FREE",
      status: "ACTIVE",
      billingCycle: null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      features: [],
    },
  });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const { action } = body ?? {};

  if (action === "cancel") {
    const sub = await db.subscription.findUnique({ where: { userId: auth.user.id } });
    if (sub) {
      await db.subscription.update({
        where: { id: sub.id },
        data: { status: "CANCELED", canceledAt: new Date(), cancelAtPeriodEnd: false },
      });
    }

    return NextResponse.json({
      subscription: { plan: "FREE", status: "CANCELED" },
      message: "Subscription canceled.",
    });
  }

  return NextResponse.json(
    { error: 'action must be "cancel".' },
    { status: 400 }
  );
}
