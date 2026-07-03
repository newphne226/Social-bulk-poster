// PUT /api/admin/users/[id] — update user (suspend / ban / delete / restore).
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { ADMIN_USERS, type AdminUserRow } from "@/lib/admin-mock";

// Mutate in-place (demo only — no persistence).
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const idx = ADMIN_USERS.findIndex((u) => u.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const { action } = body ?? {};
  const validActions: AdminUserRow["status"][] = ["ACTIVE", "SUSPENDED", "BANNED", "DELETED"];
  if (!action || !validActions.includes(action)) {
    return NextResponse.json(
      { error: `action must be one of: ${validActions.join(", ")}.` },
      { status: 400 }
    );
  }

  // Prevent self-suspension / self-ban.
  if (auth.user.id === id && (action === "SUSPENDED" || action === "BANNED" || action === "DELETED")) {
    return NextResponse.json(
      { error: "You cannot suspend, ban, or delete your own admin account." },
      { status: 400 }
    );
  }

  ADMIN_USERS[idx].status = action;
  return NextResponse.json({
    user: ADMIN_USERS[idx],
    message: `User status updated to ${action}.`,
  });
}
