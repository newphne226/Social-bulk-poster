// DELETE /api/accounts/[id] — remove account.
// PUT /api/accounts/[id] — rename / enable / disable.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const account = await db.socialAccount.findFirst({
    where: { id, userId: auth.user.id },
  });
  if (!account) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const { displayName, isEnabled } = body ?? {};
  const updateData: any = {};
  if (typeof displayName === "string") updateData.displayName = displayName;
  if (typeof isEnabled === "boolean") updateData.isEnabled = isEnabled;

  const updated = await db.socialAccount.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({
    account: {
      id: updated.id,
      platform: updated.platform,
      displayName: updated.displayName,
      username: updated.username,
      isEnabled: updated.isEnabled,
      isConnected: updated.isConnected,
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const account = await db.socialAccount.findFirst({
    where: { id, userId: auth.user.id },
  });
  if (!account) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  await db.socialAccount.delete({ where: { id } });
  return NextResponse.json({ deleted: true, id });
}
