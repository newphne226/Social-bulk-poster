// GET /api/subscription — current subscription.
// PUT /api/subscription — update (upgrade/downgrade/cancel).
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";

const PLAN_FEATURES: Record<string, string[]> = {
  CONTENT: ["content_post", "photo_upload"],
  REELS: ["reels_upload", "video_upload", "ai_captions"],
  ALL_ACCESS: ["content_post", "photo_upload", "reels_upload", "video_upload", "ai_captions", "ai_hashtags", "smart_queue", "api_access"],
};

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  // Check for most recent confirmed crypto payment
  const lastPayment = await db.cryptoPayment.findFirst({
    where: { userId: auth.user.id, status: "CONFIRMED" },
    orderBy: { createdAt: "desc" },
  });

  if (lastPayment) {
    const plan = lastPayment.plan || "FREE";
    const created = new Date(lastPayment.createdAt);
    const expires = new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const isActive = now < expires && !lastPayment.metadata?.includes('"canceled":true');

    return NextResponse.json({
      subscription: {
        plan,
        status: isActive ? "ACTIVE" : "EXPIRED",
        billingCycle: lastPayment.cycle || "MONTHLY",
        currentPeriodStart: created.toISOString(),
        currentPeriodEnd: expires.toISOString(),
        cancelAtPeriodEnd: false,
        features: PLAN_FEATURES[plan] || [],
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
  const { action, plan } = body ?? {};

  if (action === "cancel") {
    const lastPayment = await db.cryptoPayment.findFirst({
      where: { userId: auth.user.id, status: "CONFIRMED" },
      orderBy: { createdAt: "desc" },
    });

    if (lastPayment && lastPayment.metadata) {
      const meta = JSON.parse(lastPayment.metadata || "{}");
      meta.canceled = true;
      await db.cryptoPayment.update({
        where: { id: lastPayment.id },
        data: { metadata: JSON.stringify(meta) },
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
