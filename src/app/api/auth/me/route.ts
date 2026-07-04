// GET /api/auth/me — returns the current user from the bearer token.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  return NextResponse.json({
    user: {
      id: auth.user.id,
      email: auth.user.email,
      name: auth.user.name,
      avatarUrl: "https://i.pravatar.cc/150?img=12",
      role: auth.user.role,
      plan: auth.user.plan,
      createdAt: "2025-09-15T10:00:00Z",
    },
  });
}
