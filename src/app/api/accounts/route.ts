// GET /api/accounts — list connected social accounts.
// POST /api/accounts — add a new social account (validates plan limits).
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { canConnectAccount } from "@/lib/permissions";

// Inline mock dataset (server-only).
const ACCOUNTS = [
  { id: "a1", platform: "facebook", displayName: "Acme Corp", username: "@acmecorp", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=acme", followerCount: 12450, isEnabled: true, isConnected: true, lastSyncAt: "2026-07-03T01:42:00Z" },
  { id: "a2", platform: "facebook", displayName: "Acme Careers", username: "@acmecareers", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=careers", followerCount: 3280, isEnabled: true, isConnected: true, lastSyncAt: "2026-07-03T01:40:00Z" },
  { id: "a3", platform: "instagram", displayName: "Acme Lifestyle", username: "@acme.lifestyle", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=lifestyle", followerCount: 28900, isEnabled: true, isConnected: true, lastSyncAt: "2026-07-03T01:38:00Z" },
  { id: "a4", platform: "instagram", displayName: "Acme Food", username: "@acme.food", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=food", followerCount: 5621, isEnabled: false, isConnected: true, lastSyncAt: "2026-07-02T22:10:00Z" },
  { id: "a5", platform: "x", displayName: "Acme", username: "@acme", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=acmex", followerCount: 45120, isEnabled: true, isConnected: true, lastSyncAt: "2026-07-03T01:35:00Z" },
  { id: "a6", platform: "linkedin", displayName: "Acme Inc.", username: "acme-inc", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=acmelink", followerCount: 18900, isEnabled: true, isConnected: true, lastSyncAt: "2026-07-03T01:30:00Z" },
];

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  // Optional query filters
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");
  const enabled = searchParams.get("enabled");

  let result = ACCOUNTS;
  if (platform) result = result.filter((a) => a.platform === platform);
  if (enabled === "true") result = result.filter((a) => a.isEnabled);
  if (enabled === "false") result = result.filter((a) => !a.isEnabled);

  return NextResponse.json({ accounts: result, total: result.length });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const { platform, displayName, username } = body ?? {};
  if (!platform || !displayName) {
    return NextResponse.json(
      { error: "platform and displayName are required." },
      { status: 400 }
    );
  }

  // Enforce per-platform account limit based on plan tier.
  const existingForPlatform = ACCOUNTS.filter((a) => a.platform === platform).length;
  const check = canConnectAccount(auth.user.plan, existingForPlatform);
  if (!check.allowed) {
    return NextResponse.json({ error: check.reason }, { status: 403 });
  }

  const newAccount = {
    id: `a${Date.now()}`,
    platform,
    displayName,
    username: username ?? `@${displayName.toLowerCase().replace(/\s+/g, "")}`,
    avatarUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(displayName)}`,
    followerCount: 0,
    isEnabled: true,
    isConnected: true,
    lastSyncAt: new Date().toISOString(),
  };
  ACCOUNTS.push(newAccount);

  return NextResponse.json({ account: newAccount }, { status: 201 });
}
