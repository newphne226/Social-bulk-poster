// POST /api/billing/portal — return a mock Stripe Customer Portal URL.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const portalUrl = `https://billing.stripe.com/demo/session_${Date.now()}`;

  return NextResponse.json({
    url: portalUrl,
    customerId: `cus_demo_${auth.user.id}`,
    expiresAt: new Date(Date.now() + 30 * 60000).toISOString(),
  });
}
