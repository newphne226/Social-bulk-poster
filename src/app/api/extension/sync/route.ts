// GET /api/extension/sync — returns everything the browser extension needs in one payload.
// This is the "real-time sync" endpoint the extension polls on a schedule.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const now = new Date().toISOString();

  // Inline (server-only) snapshot of everything the extension needs.
  const payload = {
    syncedAt: now,
    user: {
      id: auth.user.id,
      email: auth.user.email,
      name: auth.user.name,
      plan: auth.user.plan,
    },
    accounts: [
      { id: "a1", platform: "facebook", displayName: "Acme Corp", username: "@acmecorp", isEnabled: true, isConnected: true },
      { id: "a3", platform: "instagram", displayName: "Acme Lifestyle", username: "@acme.lifestyle", isEnabled: true, isConnected: true },
      { id: "a5", platform: "x", displayName: "Acme", username: "@acme", isEnabled: true, isConnected: true },
      { id: "a6", platform: "linkedin", displayName: "Acme Inc.", username: "acme-inc", isEnabled: true, isConnected: true },
    ],
    scheduledPosts: [
      { id: "p1", caption: "🚀 Summer sale starts Friday!", platform: "facebook", scheduledAt: new Date(Date.now() + 45 * 60000).toISOString(), status: "SCHEDULED" },
      { id: "p6", caption: "Weekend vibes ☀️", platform: "instagram", scheduledAt: new Date(Date.now() + 180 * 60000).toISOString(), status: "QUEUED" },
      { id: "p7", caption: "10 minimalist workspace ideas", platform: "pinterest", scheduledAt: new Date(Date.now() + 720 * 60000).toISOString(), status: "SCHEDULED" },
    ],
    notifications: [
      { id: "n1", type: "POST_FAILED", title: "Post failed to publish", body: "LinkedIn post failed: token expired.", isRead: false, createdAt: now },
      { id: "n2", type: "POST_PUBLISHED", title: "Post published", body: "Your X post is now live.", isRead: false, createdAt: now },
    ],
    settings: {
      schedulePaused: false,
      workingHoursStart: "09:00",
      workingHoursEnd: "21:00",
    },
  };

  return NextResponse.json(payload);
}
