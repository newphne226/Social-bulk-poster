// GET /api/accounts — list connected social accounts.
// POST /api/accounts — add a new social account (validates plan limits).
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { canConnectAccount } from "@/lib/permissions";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");
  const enabled = searchParams.get("enabled");

  const where: any = { userId: auth.user.id };
  if (platform) where.platform = platform;
  if (enabled === "true") where.isEnabled = true;
  if (enabled === "false") where.isEnabled = false;

  const accounts = await db.socialAccount.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    accounts: accounts.map((a) => ({
      id: a.id,
      platform: a.platform,
      displayName: a.displayName,
      username: a.username,
      avatarUrl: a.avatarUrl,
      followerCount: a.followerCount,
      isEnabled: a.isEnabled,
      isConnected: a.isConnected,
      lastSyncAt: a.lastSyncAt?.toISOString() ?? new Date().toISOString(),
    })),
    total: accounts.length,
  });
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
  const existingForPlatform = await db.socialAccount.count({
    where: { userId: auth.user.id, platform },
  });
  const check = canConnectAccount(auth.user.plan, existingForPlatform);
  if (!check.allowed) {
    return NextResponse.json({ error: check.reason }, { status: 403 });
  }

  const newAccount = await db.socialAccount.create({
    data: {
      userId: auth.user.id,
      platform,
      platformAccountId: `manual_${Date.now()}`,
      displayName,
      username: username ?? `@${displayName.toLowerCase().replace(/\s+/g, "")}`,
      avatarUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(displayName)}`,
      accessToken: `manual_${Date.now()}`, // Dummy for manual accounts
      followerCount: 0,
      isEnabled: true,
      isConnected: true,
      lastSyncAt: new Date(),
    },
  });

  return NextResponse.json(
    {
      account: {
        id: newAccount.id,
        platform: newAccount.platform,
        displayName: newAccount.displayName,
        username: newAccount.username,
        avatarUrl: newAccount.avatarUrl,
        followerCount: newAccount.followerCount,
        isEnabled: newAccount.isEnabled,
        isConnected: newAccount.isConnected,
        lastSyncAt: newAccount.lastSyncAt?.toISOString() ?? new Date().toISOString(),
      },
    },
    { status: 201 }
  );
}