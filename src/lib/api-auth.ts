// =====================================================================
// API auth helpers — shared across all route handlers
// Stateless token verification — works on Vercel serverless.
// =====================================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/app/api/auth/register/route";

export type PlanTier = "FREE" | "BASIC" | "SILVER" | "PRO";

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
 * Reads the Authorization header, verifies the stateless token, and
 * loads the matching user from the database.
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
  const payload = verifyToken(token);

  if (!payload) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized — invalid or expired token." },
        { status: 401 }
      ),
    };
  }

  try {
    const dbUser = await db.user.findUnique({
      where: { id: payload.userId },
    });

    if (!dbUser || dbUser.deletedAt) {
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

    const isAdminByRole = dbUser.role === "ADMIN" || dbUser.role === "OWNER";
    if (!isAdminByRole && dbUser.approvalStatus !== "APPROVED") {
      const statusLabel = dbUser.approvalStatus === "REJECTED" ? "rejected" : "pending approval";
      return {
        ok: false,
        response: NextResponse.json(
          { error: `Account is ${statusLabel}. Please contact an administrator.`, approvalRequired: true },
          { status: 403 }
        ),
      };
    }

    // Load real plan from Subscription model
    let plan: PlanTier = "FREE";
    try {
      const sub = await db.subscription.findUnique({
        where: { userId: dbUser.id },
        select: { status: true, plan: { select: { name: true } } },
      });
      if (sub && sub.status === "ACTIVE" && sub.plan) {
        const name = sub.plan.name;
        if (name === "Basic") plan = "BASIC";
        else if (name === "Silver") plan = "SILVER";
        else if (name === "Pro") plan = "PRO";
      }
    } catch {}

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
 *  - the user's role is ADMIN or OWNER.
 */
export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth;

  const isAdminByRole = auth.user.role === "ADMIN" || auth.user.role === "OWNER";

  if (!isAdminByRole) {
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
