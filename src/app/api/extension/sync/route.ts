// GET /api/extension/sync — returns everything the browser extension needs in one payload.
// This is the "real-time sync" endpoint the extension polls on a schedule.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const now = new Date().toISOString();

  try {
    const [user, accounts, posts, notifications, settings, subscription] = await Promise.all([
      db.user.findUnique({
        where: { id: auth.user.id },
        include: {
          subscription: {
            include: { plan: true },
          },
        },
      }),
      db.socialAccount.findMany({
        where: { userId: auth.user.id },
        orderBy: { createdAt: "asc" },
      }),
      db.post.findMany({
        where: { userId: auth.user.id },
        orderBy: { scheduledAt: "asc" },
        take: 100,
        include: { account: true },
      }),
      db.notification.findMany({
        where: { userId: auth.user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.userSettings.findUnique({
        where: { userId: auth.user.id },
      }),
      db.subscription.findUnique({
        where: { userId: auth.user.id },
        include: { plan: true },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const payload = {
      syncedAt: now,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || user.email)}`,
        plan: auth.user.plan,
        role: user.role,
      },
      subscription: subscription
        ? {
            plan: subscription.plan?.tier ?? "FREE",
            status: subscription.status,
            billingCycle: subscription.billingCycle,
            currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd ?? false,
          }
        : {
            plan: "FREE",
            status: "ACTIVE",
            billingCycle: "MONTHLY",
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
          },
      accounts: accounts.map((acc) => ({
        id: acc.id,
        platform: acc.platform,
        displayName: acc.displayName,
        username: acc.username,
        followerCount: acc.followerCount,
        isEnabled: acc.isEnabled,
        isConnected: acc.isConnected,
        lastSyncAt: acc.lastSyncAt?.toISOString() ?? now,
      })),
      posts: posts.map((post) => ({
        id: post.id,
        caption: post.caption,
        platform: post.platform,
        accountUsername: post.account?.username ?? "",
        accountId: post.accountId,
        status: post.status,
        type: post.type,
        scheduledAt: post.scheduledAt?.toISOString() ?? null,
        publishedAt: post.publishedAt?.toISOString() ?? null,
        hashtags: JSON.parse(post.hashtags || "[]"),
        retryCount: post.retryCount,
      })),
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
      settings: settings
        ? {
            darkMode: settings.theme === "dark",
            timezone: settings.timezone,
            schedulePaused: settings.schedulePaused,
            workingHoursStart: settings.workingHoursStart,
            workingHoursEnd: settings.workingHoursEnd,
          }
        : {
            darkMode: false,
            timezone: "Asia/Dhaka",
            schedulePaused: false,
            workingHoursStart: "09:00",
            workingHoursEnd: "21:00",
          },
    };

    return NextResponse.json(payload);
  } catch (err) {
    console.error("[extension/sync] error", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}