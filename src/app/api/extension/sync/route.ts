// GET /api/extension/sync — returns everything the browser extension needs in one payload.
// This is the "real-time sync" endpoint the extension polls on a schedule.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const now = new Date().toISOString();

  // Inline (server-only) snapshot of everything the extension needs.
  // Field names MUST match what background/service-worker.js and popup/popup.js expect:
  //   - posts (NOT scheduledPosts)
  //   - user.avatarUrl
  //   - subscription (top-level)
  const payload = {
    syncedAt: now,
    user: {
      id: auth.user.id,
      email: auth.user.email,
      name: auth.user.name,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(auth.user.name || auth.user.email)}`,
      plan: auth.user.plan,
      role: auth.user.role,
    },
    subscription: {
      plan: auth.user.plan,
      status: "ACTIVE",
      billingCycle: "MONTHLY",
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    },
    accounts: [
      { id: "a1", platform: "facebook", displayName: "Acme Corp", username: "@acmecorp", followerCount: 12450, isEnabled: true, isConnected: true, lastSyncAt: now },
      { id: "a3", platform: "instagram", displayName: "Acme Lifestyle", username: "@acme.lifestyle", followerCount: 28900, isEnabled: true, isConnected: true, lastSyncAt: now },
      { id: "a5", platform: "x", displayName: "Acme", username: "@acme", followerCount: 45120, isEnabled: true, isConnected: true, lastSyncAt: now },
      { id: "a6", platform: "linkedin", displayName: "Acme Inc.", username: "acme-inc", followerCount: 18900, isEnabled: true, isConnected: true, lastSyncAt: now },
    ],
    posts: [
      { id: "p1", caption: "🚀 Summer sale starts Friday!", platform: "facebook", accountUsername: "@acmecorp", accountId: "a1", status: "SCHEDULED", type: "IMAGE", scheduledAt: new Date(Date.now() + 45 * 60000).toISOString(), publishedAt: null, hashtags: ["SummerSale"], retryCount: 0 },
      { id: "p2", caption: "Behind the scenes of our new product photoshoot 📸", platform: "instagram", accountUsername: "@acme.lifestyle", accountId: "a3", status: "PUBLISHED", type: "IMAGE", scheduledAt: new Date(Date.now() - 120 * 60000).toISOString(), publishedAt: new Date(Date.now() - 118 * 60000).toISOString(), hashtags: ["BTS"], retryCount: 0 },
      { id: "p3", caption: "5 productivity tips every founder should know 🧵", platform: "x", accountUsername: "@acme", accountId: "a5", status: "PUBLISHED", type: "TEXT", scheduledAt: new Date(Date.now() - 240 * 60000).toISOString(), publishedAt: new Date(Date.now() - 239 * 60000).toISOString(), hashtags: ["productivity"], retryCount: 0 },
      { id: "p4", caption: "We're hiring a Senior Product Designer!", platform: "linkedin", accountUsername: "acme-inc", accountId: "a6", status: "FAILED", type: "IMAGE", scheduledAt: new Date(Date.now() - 360 * 60000).toISOString(), publishedAt: null, failureReason: "Token expired. Please reconnect the account.", hashtags: ["hiring"], retryCount: 2 },
      { id: "p5", caption: "New blog post: The Future of Social Media Automation in 2026", platform: "facebook", accountUsername: "@acmecorp", accountId: "a1", status: "DRAFT", type: "LINK", scheduledAt: null, publishedAt: null, hashtags: ["blog"], retryCount: 0 },
      { id: "p6", caption: "Weekend vibes ☀️ Tag someone who needs this view!", platform: "instagram", accountUsername: "@acme.lifestyle", accountId: "a3", status: "QUEUED", type: "IMAGE", scheduledAt: new Date(Date.now() + 180 * 60000).toISOString(), publishedAt: null, hashtags: ["weekend"], retryCount: 0 },
    ],
    notifications: [
      { id: "n1", type: "POST_FAILED", title: "Post failed to publish", body: "LinkedIn post failed: token expired.", isRead: false, createdAt: now },
      { id: "n2", type: "POST_PUBLISHED", title: "Post published", body: "Your X post is now live.", isRead: false, createdAt: now },
      { id: "n3", type: "POST_SCHEDULED", title: "Post scheduled", body: "Your Facebook post is scheduled for 2:45 PM.", isRead: true, createdAt: now },
      { id: "n4", type: "SUBSCRIPTION_RENEWED", title: "Subscription renewed", body: `Your ${auth.user.plan} subscription is active.`, isRead: true, createdAt: now },
    ],
    settings: {
      darkMode: false,
      timezone: "Asia/Dhaka",
      schedulePaused: false,
      workingHoursStart: "09:00",
      workingHoursEnd: "21:00",
    },
  };

  return NextResponse.json(payload);
}
