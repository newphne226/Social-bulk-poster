// GET /api/auth/me — returns the current user from the bearer token.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  // Load the full user record from DB to get avatarUrl + createdAt
  let avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(auth.user.name || auth.user.email)}`;
  let createdAt = new Date().toISOString();

  try {
    const dbUser = await db.user.findUnique({
      where: { id: auth.user.id },
      select: { avatarUrl: true, createdAt: true },
    });
    if (dbUser) {
      if (dbUser.avatarUrl) avatarUrl = dbUser.avatarUrl;
      if (dbUser.createdAt) createdAt = dbUser.createdAt.toISOString();
    }
  } catch (err) {
    console.warn("[auth/me] DB lookup failed, using fallback", err);
  }

  return NextResponse.json({
    user: {
      id: auth.user.id,
      email: auth.user.email,
      name: auth.user.name,
      avatarUrl,
      role: auth.user.role,
      plan: auth.user.plan,
      createdAt,
    },
  });
}
