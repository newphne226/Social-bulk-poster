// POST /api/admin/users/[id]/impersonate — returns a temporary impersonation token.
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { activeTokens, generateToken } from "@/app/api/auth/register/route";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const targetUser = await db.user.findUnique({
    where: { id },
    include: { subscription: { include: { plan: true } } },
  });
  if (!targetUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  if (targetUser.role === "ADMIN") {
    return NextResponse.json(
      { error: "Cannot impersonate another admin." },
      { status: 403 }
    );
  }

  // Mint a short-lived impersonation token (30 min).
  const expiresAt = new Date(Date.now() + 30 * 60000);
  const impersonationToken = `imp_${targetUser.id}_${Date.now()}`;
  activeTokens.set(impersonationToken, {
    userId: targetUser.id,
    issuedAt: Date.now(),
    expiresAt: expiresAt.getTime(),
  });

  return NextResponse.json({
    token: impersonationToken,
    user: {
      id: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      plan: targetUser.subscription?.plan?.tier ?? "FREE",
    },
    impersonatedBy: auth.user.id,
    expiresAt: expiresAt.toISOString(),
    warning: "All actions performed during impersonation are logged.",
  });
}