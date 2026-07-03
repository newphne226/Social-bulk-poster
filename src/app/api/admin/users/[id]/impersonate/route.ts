// POST /api/admin/users/[id]/impersonate — returns a temporary impersonation token.
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { ADMIN_USERS } from "@/lib/admin-mock";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const targetUser = ADMIN_USERS.find((u) => u.id === id);
  if (!targetUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  if (targetUser.role === "ADMIN") {
    return NextResponse.json(
      { error: "Cannot impersonate another admin." },
      { status: 403 }
    );
  }

  // Mint a short-lived impersonation token. In production this would be
  // a signed JWT with the original admin encoded in metadata for audit.
  const expiresAt = new Date(Date.now() + 30 * 60000).toISOString();
  const impersonationToken = `imp_${targetUser.id}_${Date.now()}`;

  return NextResponse.json({
    token: impersonationToken,
    user: {
      id: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      plan: targetUser.plan,
    },
    impersonatedBy: auth.user.id,
    expiresAt,
    warning: "All actions performed during impersonation are logged.",
  });
}
