// PUT /api/admin/users/[id] — update user (suspend / ban / delete / restore).
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const { action } = body ?? {};

  const validActions = ["ACTIVE", "SUSPENDED", "BANNED", "DELETED"];
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

  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const updated = await db.user.update({
    where: { id },
    data: {
      status: action,
      ...(action === "DELETED" ? { deletedAt: new Date() } : {}),
      ...(action === "SUSPENDED" ? { suspendedAt: new Date() } : {}),
      ...(action === "BANNED" ? { bannedAt: new Date() } : {}),
    },
  });

  return NextResponse.json({
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      status: updated.status,
      plan: updated.subscription?.plan?.tier ?? "FREE",
      createdAt: updated.createdAt.toISOString(),
    },
    message: `User status updated to ${action}.`,
  });
}