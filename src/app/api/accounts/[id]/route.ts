// DELETE /api/accounts/[id] — remove account.
// PUT /api/accounts/[id] — rename / enable / disable.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const ACCOUNTS = [
  { id: "a1", platform: "facebook", displayName: "Acme Corp", username: "@acmecorp", avatarUrl: "", followerCount: 12450, isEnabled: true, isConnected: true, lastSyncAt: "2026-07-03T01:42:00Z" },
  { id: "a2", platform: "facebook", displayName: "Acme Careers", username: "@acmecareers", avatarUrl: "", followerCount: 3280, isEnabled: true, isConnected: true, lastSyncAt: "2026-07-03T01:40:00Z" },
  { id: "a3", platform: "instagram", displayName: "Acme Lifestyle", username: "@acme.lifestyle", avatarUrl: "", followerCount: 28900, isEnabled: true, isConnected: true, lastSyncAt: "2026-07-03T01:38:00Z" },
  { id: "a4", platform: "instagram", displayName: "Acme Food", username: "@acme.food", avatarUrl: "", followerCount: 5621, isEnabled: false, isConnected: true, lastSyncAt: "2026-07-02T22:10:00Z" },
];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const idx = ACCOUNTS.findIndex((a) => a.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const { displayName, isEnabled } = body ?? {};
  if (typeof displayName === "string") ACCOUNTS[idx].displayName = displayName;
  if (typeof isEnabled === "boolean") ACCOUNTS[idx].isEnabled = isEnabled;

  return NextResponse.json({ account: ACCOUNTS[idx] });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const idx = ACCOUNTS.findIndex((a) => a.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }
  const [removed] = ACCOUNTS.splice(idx, 1);
  return NextResponse.json({ deleted: true, id: removed.id });
}
