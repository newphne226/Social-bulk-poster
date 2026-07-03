// POST /api/billing/webhook — mock Stripe webhook handler.
// Always returns 200 and logs the event type. No signature verification in demo.
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    // Allow empty body — some Stripe webhooks can be malformed in tests.
  }

  const eventType = body?.type ?? "unknown";
  const eventId = body?.id ?? `evt_${Date.now()}`;

  // In production this would route to handlers for:
  //  checkout.session.completed, invoice.paid, customer.subscription.updated, etc.
  console.log(`[webhook] Received Stripe event: ${eventId} type=${eventType}`);

  return NextResponse.json({
    received: true,
    eventId,
    type: eventType,
    processedAt: new Date().toISOString(),
  });
}
