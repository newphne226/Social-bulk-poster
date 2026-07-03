// POST /api/billing/checkout — return a mock Stripe Checkout URL.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  FREE: { monthly: 0, yearly: 0 },
  SILVER: { monthly: 3, yearly: 30 },
  VIP_PRO: { monthly: 10, yearly: 100 },
  ENTERPRISE: { monthly: 99, yearly: 990 },
};

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const { plan, cycle = "monthly" } = body ?? {};
  if (!plan || !PLAN_PRICES[plan]) {
    return NextResponse.json(
      { error: `Invalid plan. Must be one of: ${Object.keys(PLAN_PRICES).join(", ")}.` },
      { status: 400 }
    );
  }
  if (cycle !== "monthly" && cycle !== "yearly") {
    return NextResponse.json(
      { error: "cycle must be 'monthly' or 'yearly'." },
      { status: 400 }
    );
  }

  const price = PLAN_PRICES[plan][cycle];
  const sessionId = `cs_demo_${Date.now()}`;
  const checkoutUrl = `https://checkout.stripe.com/demo/${sessionId}?plan=${plan}&cycle=${cycle}`;

  return NextResponse.json(
    {
      sessionId,
      url: checkoutUrl,
      plan,
      cycle,
      amount: price,
      currency: "usd",
    },
    { status: 201 }
  );
}
