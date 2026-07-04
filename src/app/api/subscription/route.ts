// GET /api/subscription — current subscription.
// PUT /api/subscription — update (upgrade/downgrade/cancel).
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

// In-memory subscription state for the demo user.
let SUBSCRIPTION = {
  plan: "VIP_PRO",
  status: "ACTIVE",
  billingCycle: "MONTHLY",
  currentPeriodStart: "2026-07-01T00:00:00Z",
  currentPeriodEnd: "2026-08-01T00:00:00Z",
  cancelAtPeriodEnd: false,
  canceledAt: null as string | null,
};

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  return NextResponse.json({ subscription: SUBSCRIPTION });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const { action, plan, billingCycle } = body ?? {};

  if (action === "cancel") {
    SUBSCRIPTION = {
      ...SUBSCRIPTION,
      cancelAtPeriodEnd: true,
      canceledAt: new Date().toISOString(),
    };
    return NextResponse.json({
      subscription: SUBSCRIPTION,
      message: "Subscription will cancel at the end of the current period.",
    });
  }

  if (action === "upgrade" || action === "downgrade") {
    if (!plan) {
      return NextResponse.json({ error: "plan is required for upgrade/downgrade." }, { status: 400 });
    }
    SUBSCRIPTION = {
      ...SUBSCRIPTION,
      plan,
      billingCycle: billingCycle ?? SUBSCRIPTION.billingCycle,
      cancelAtPeriodEnd: false,
      canceledAt: null,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
    };
    return NextResponse.json({
      subscription: SUBSCRIPTION,
      message: `Subscription ${action}ed to ${plan}.`,
    });
  }

  return NextResponse.json(
    { error: 'action must be "upgrade", "downgrade", or "cancel".' },
    { status: 400 }
  );
}
