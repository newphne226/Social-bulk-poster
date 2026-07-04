// POST /api/auth/refresh — refreshes an auth token.
// In this demo, we accept the existing token (even if close to expiry)
// and issue a new one. In production, this would verify a refresh-token
// cookie or separate refresh token and issue a new access token.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activeTokens, generateToken } from "../register/route";

export async function POST(request: NextRequest) {
  // Read the current bearer token (even if about to expire)
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  const currentToken = match?.[1]?.trim();

  // Also accept X-Refresh-Token header (for SW that stores it separately)
  const refreshHeader = request.headers.get("x-refresh-token");

  let userId: string | null = null;

  // Try the current bearer token first
  if (currentToken) {
    const session = activeTokens.get(currentToken);
    if (session) {
      userId = session.userId;
      // Remove the old token
      activeTokens.delete(currentToken);
    }
  }

  // If that didn't work, try the X-Refresh-Token header
  if (!userId && refreshHeader) {
    const session = activeTokens.get(refreshHeader);
    if (session) {
      userId = session.userId;
      activeTokens.delete(refreshHeader);
    }
  }

  if (!userId) {
    return NextResponse.json(
      { error: "No valid session to refresh. Please sign in again." },
      { status: 401 }
    );
  }

  try {
    // Verify the user still exists and is active
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, status: true, deletedAt: true },
    });
    if (!user || user.deletedAt || user.status === "BANNED" || user.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "Account no longer accessible." },
        { status: 403 }
      );
    }

    // Issue a new token (24h default, or 30d if "remember" was set)
    // We use 24h for refreshes by default; the original login sets the longer
    // expiry when "remember me" is checked.
    const newToken = generateToken(userId, true);

    return NextResponse.json({
      token: newToken,
      issuedAt: Date.now(),
      expiresIn: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    });
  } catch (err) {
    console.error("[auth/refresh] error", err);
    return NextResponse.json(
      { error: "Token refresh failed." },
      { status: 500 }
    );
  }
}
