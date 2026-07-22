// POST /api/auth/refresh — refreshes an auth token.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateToken, verifyToken } from "@/lib/tokens";

export async function POST(request: NextRequest) {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  const currentToken = match?.[1]?.trim();

  const refreshHeader = request.headers.get("x-refresh-token");

  let userId: string | null = null;

  // Try the current bearer token first
  if (currentToken) {
    const payload = verifyToken(currentToken);
    if (payload) {
      userId = payload.userId;
    }
  }

  // If that didn't work, try the X-Refresh-Token header
  if (!userId && refreshHeader) {
    const payload = verifyToken(refreshHeader);
    if (payload) {
      userId = payload.userId;
    }
  }

  if (!userId) {
    return NextResponse.json(
      { error: "No valid session to refresh. Please sign in again." },
      { status: 401 }
    );
  }

  try {
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

    const newToken = generateToken(userId, true);

    return NextResponse.json({
      token: newToken,
      issuedAt: Date.now(),
      expiresIn: 30 * 24 * 60 * 60 * 1000,
    });
  } catch (err) {
    console.error("[auth/refresh] error", err);
    return NextResponse.json(
      { error: "Token refresh failed." },
      { status: 500 }
    );
  }
}
