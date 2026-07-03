// POST /api/auth/login — demo login. Always succeeds.
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body ?? {};

  // Demo validation — accept anything but check shape.
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  // Always succeed in demo mode — return a fake token + user + subscription.
  const user = {
    id: "u_001",
    email,
    name: "Alex Morgan",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    role: "ADMIN",
    plan: "VIP_PRO",
    createdAt: "2025-09-15T10:00:00Z",
  };

  const subscription = {
    plan: "VIP_PRO",
    status: "ACTIVE",
    billingCycle: "MONTHLY",
    currentPeriodEnd: "2026-08-01T00:00:00Z",
    cancelAtPeriodEnd: false,
  };

  return NextResponse.json(
    {
      token: `demo-token-${Date.now()}`,
      user,
      subscription,
    },
    { status: 200 }
  );
}
