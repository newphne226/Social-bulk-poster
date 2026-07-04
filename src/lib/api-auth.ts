// =====================================================================
// API auth helpers — shared across all route handlers
// Verifies the Bearer token against the in-memory token store AND
// loads the real user from the Prisma database.
// =====================================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_SECRET_TOKEN = "admin-secret-token";

export type PlanTier = "FREE" | "SILVER" | "VIP_PRO" | "ENTERPRISE";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  plan: PlanTier;
  role: "USER" | "ADMIN" | "OWNER";
}

export type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; response: NextResponse };

/**
 * Reads the Authorization header, looks up the token in the activeTokens
 * store, and loads the matching user from the database. Returns 401 if the
 * token is missing, expired, or doesn't map to a user.
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match || !match[1].trim()) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized — missing or invalid Bearer token." },
        { status: 401 }
      ),
    };
  }

  const token = match[1].trim();

  // Import the token store dynamically to avoid circular imports
  const { activeTokens } = await import("@/app/api/auth/register/route");
  const session = activeTokens.get(token);

  if (!session) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized — invalid or expired token." },
        { status: 401 }
      ),
    };
  }

  if (session.expiresAt < Date.now()) {
    activeTokens.delete(token);
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized — session expired. Please sign in again." },
        { status: 401 }
      ),
    };
  }

  try {
    const dbUser = await db.user.findUnique({
      where: { id: session.userId },
      include: {
        subscription: {
          include: { plan: true },
        },
      },
    });

    if (!dbUser || dbUser.deletedAt) {
      activeTokens.delete(token);
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Unauthorized — user not found." },
          { status: 401 }
        ),
      };
    }

    if (dbUser.status === "BANNED" || dbUser.status === "SUSPENDED") {
      return {
        ok: false,
        response: NextResponse.json(
          { error: `Account is ${dbUser.status.toLowerCase()}.` },
          { status: 403 }
        ),
      };
    }

    const plan = (dbUser.subscription?.plan?.tier as PlanTier) ?? "FREE";

    return {
      ok: true,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name ?? dbUser.email,
        plan,
        role: dbUser.role,
      },
    };
  } catch (err) {
    console.error("[requireAuth] DB error", err);
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Auth lookup failed." },
        { status: 500 }
      ),
    };
  }
}

/**
 * Same as requireAuth, but additionally gates on admin access:
 *  - `x-admin-token` header equal to ADMIN_SECRET_TOKEN, OR
 *  - the user's role is ADMIN or OWNER.
 */
export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth;

  const adminToken = request.headers.get("x-admin-token");
  const isAdminByToken = adminToken === ADMIN_SECRET_TOKEN;
  const isAdminByRole = auth.user.role === "ADMIN" || auth.user.role === "OWNER";

  if (!isAdminByToken && !isAdminByRole) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Forbidden — admin privileges required." },
        { status: 403 }
      ),
    };
  }
  return auth;
}
