// =====================================================================
// API auth helpers — shared across all route handlers
// Demo mode: any non-empty Bearer token is accepted.
// Admin: requires x-admin-token header to equal ADMIN_SECRET below,
//        OR the bearer-token user email matches ADMIN_EMAIL.
// =====================================================================

import { NextRequest, NextResponse } from "next/server";

// Demo "secret" admin token. In production this would be a real secret.
const ADMIN_SECRET_TOKEN = "admin-secret-token";
const ADMIN_EMAIL = "alex@socialpilot.io";

// Mirror of the Prisma `PlanTier` enum so this helper doesn't pull in
// @prisma/client (whose generated client is out-of-date in this demo).
export type PlanTier = "FREE" | "SILVER" | "VIP_PRO" | "ENTERPRISE";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  plan: PlanTier;
  role: "USER" | "ADMIN";
}

export type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; response: NextResponse };

// Demo user returned for any valid (non-empty) bearer token.
const DEMO_USER: AuthUser = {
  id: "u_001",
  email: "alex@socialpilot.io",
  name: "Alex Morgan",
  plan: "VIP_PRO",
  role: "ADMIN",
};

/**
 * Reads the Authorization header and returns the demo user when a
 * non-empty Bearer token is present. Returns 401 otherwise.
 */
export function requireAuth(request: NextRequest): AuthResult {
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
  return { ok: true, user: DEMO_USER };
}

/**
 * Same as requireAuth, but additionally gates on admin access:
 *  - `x-admin-token` header equal to ADMIN_SECRET_TOKEN, OR
 *  - the demo user's email equals ADMIN_EMAIL (already true in demo).
 */
export function requireAdmin(request: NextRequest): AuthResult {
  const auth = requireAuth(request);
  if (!auth.ok) return auth;

  const adminToken = request.headers.get("x-admin-token");
  const isAdminByToken = adminToken === ADMIN_SECRET_TOKEN;
  const isAdminByEmail = auth.user.email === ADMIN_EMAIL;

  if (!isAdminByToken && !isAdminByEmail) {
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
