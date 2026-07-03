// POST /api/auth/register — demo registration. Always succeeds.
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { email, password, name } = body ?? {};

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "Email, password, and name are required." },
      { status: 400 }
    );
  }

  // Demo: always succeed. New users start on FREE plan.
  const user = {
    id: `u_${Date.now()}`,
    email,
    name,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    role: "USER",
    plan: "FREE",
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(
    {
      token: `demo-token-${Date.now()}`,
      user,
    },
    { status: 201 }
  );
}
