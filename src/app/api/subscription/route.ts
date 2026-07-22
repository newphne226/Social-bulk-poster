// GET /api/subscription — current subscription (with trial expiry check).
// PUT /api/subscription — update (cancel / renew).
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";

const PLAN_FEATURES: Record<string, string[]> = {
  FREE: [],
  BASIC: ["content_post", "photo_upload", "basic_analytics"],
  SILVER: ["content_post", "photo_upload", "reels_upload", "video_upload", "ai_captions", "advanced_analytics"],
  PRO: ["content_post", "photo_upload", "reels_upload", "video_upload", "ai_captions", "ai_hashtags", "smart_queue", "api_access", "unlimited_posts", "unlimited_accounts"],
};

function isTrialExpired(trialEndsAt: Date | null): boolean {
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt) < new Date();
}

function getRemainingTrialDays(trialEndsAt: Date | null): number {
  if (!trialEndsAt) return 0;
  const now = new Date();
  const end = new Date(trialEndsAt);
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const sub = await db.subscription.findUnique({
    where: { userId: auth.user.id },
    include: { plan: { select: { name: true, tier: true } } },
  });

  if (sub && sub.plan) {
    const planName = sub.plan.name;
    // Map DB plan names to UI plan names (admin uses: Free, Silver, VIP Pro, Enterprise)
    const uiPlan = planName === "Free" ? "FREE"
      : planName === "Basic" ? "BASIC"
      : planName === "Silver" ? "SILVER"
      : planName === "Pro" ? "PRO"
      : planName === "VIP Pro" ? "PRO"
      : "FREE";

    // Check if trial has expired for FREE plan
    const trialExpired = uiPlan === "FREE" && isTrialExpired(sub.trialEndsAt);
    const remainingDays = getRemainingTrialDays(sub.trialEndsAt);

    // If trial expired, show as expired
    const effectiveStatus = trialExpired ? "TRIAL_EXPIRED" : sub.status;
    const isActive = !trialExpired && sub.status === "ACTIVE";

    return NextResponse.json({
      subscription: {
        plan: uiPlan,
        status: effectiveStatus,
        billingCycle: sub.billingCycle,
        currentPeriodStart: sub.currentPeriodStart?.toISOString() ?? null,
        currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        trialEndsAt: sub.trialEndsAt?.toISOString() ?? null,
        remainingTrialDays: remainingDays,
        trialExpired,
        features: isActive ? (PLAN_FEATURES[uiPlan] || []) : [],
      },
    }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
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
        trialEndsAt: null,
        remainingTrialDays: 0,
        trialExpired: false,
        features: [],
        requestId: pendingRequest.id,
      },
    }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  }

  // No subscription — free plan (new user, trial starts now)
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  return NextResponse.json({
    subscription: {
      plan: "FREE",
      status: "ACTIVE",
      billingCycle: null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      trialEndsAt: trialEndsAt.toISOString(),
      remainingTrialDays: 14,
      trialExpired: false,
      features: [],
    },
  }, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
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

  if (action === "renew") {
    // Renew = reset trial for 14 more days
    const sub = await db.subscription.findUnique({
      where: { userId: auth.user.id },
      include: { plan: { select: { name: true } } },
    });

    if (sub && sub.plan?.name === "Free") {
      const newTrialEnds = new Date();
      newTrialEnds.setDate(newTrialEnds.getDate() + 14);

      await db.subscription.update({
        where: { id: sub.id },
        data: {
          status: "ACTIVE",
          currentPeriodStart: new Date(),
          currentPeriodEnd: newTrialEnds,
          trialEndsAt: newTrialEnds,
          canceledAt: null,
        },
      });

      return NextResponse.json({
        subscription: {
          plan: "FREE",
          status: "ACTIVE",
          trialEndsAt: newTrialEnds.toISOString(),
          remainingTrialDays: 14,
          trialExpired: false,
        },
        message: "Trial renewed for 14 days.",
      });
    }

    // For paid plans, just reactivate
    if (sub) {
      await db.subscription.update({
        where: { id: sub.id },
        data: { status: "ACTIVE", canceledAt: null },
      });

      return NextResponse.json({
        subscription: { plan: "FREE", status: "ACTIVE" },
        message: "Subscription renewed.",
      });
    }

    return NextResponse.json({ error: "No subscription found." }, { status: 404 });
  }

  return NextResponse.json(
    { error: 'action must be "cancel" or "renew".' },
    { status: 400 }
  );
}
