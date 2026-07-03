// POST /api/billing/checkout — return a mock Stripe Checkout URL or redirect to crypto.
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
  const { plan, cycle = "monthly", method = "card" } = body ?? {};
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

  // If user wants to pay with crypto, return a redirect to the crypto checkout
  // The client should call /api/billing/crypto/checkout to create a session.
  if (method === "crypto") {
    return NextResponse.json(
      {
        method: "crypto",
        redirect: "/api/billing/crypto/checkout",
        plan,
        cycle,
        amount: price,
        currency: "usdt",
        network: "BEP20",
        instructions:
          "POST to /api/billing/crypto/checkout with { plan, cycle } to create a crypto payment session.",
      },
      { status: 201 }
    );
  }

  // Default: Stripe card checkout
  const sessionId = `cs_demo_${Date.now()}`;
  const checkoutUrl = `https://checkout.stripe.com/demo/${sessionId}?plan=${plan}&cycle=${cycle}`;

  return NextResponse.json(
    {
      method: "card",
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
