// POST /api/extension/heartbeat — called by the extension every 30s.
// Returns 200 + any new notifications since the last heartbeat.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

// Track the last heartbeat timestamp per device (demo only).
const lastHeartbeat: Record<string, string> = {};

// Static pool of mock notifications to "discover" on heartbeats.
const ALL_NOTIFICATIONS = [
  { id: "n1", type: "POST_FAILED", title: "Post failed to publish", body: "LinkedIn post failed: token expired.", isRead: false, createdAt: "2026-07-03T08:00:00Z" },
  { id: "n2", type: "POST_PUBLISHED", title: "Post published", body: "Your X post is now live.", isRead: false, createdAt: "2026-07-03T07:00:00Z" },
  { id: "n3", type: "ACCOUNT_DISCONNECTED", title: "Account disconnected", body: "Pinterest account needs reconnection.", isRead: false, createdAt: "2026-07-03T05:00:00Z" },
];

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const deviceId = body?.deviceId ?? "unknown-device";
  const lastSeen = lastHeartbeat[deviceId];
  const now = new Date().toISOString();
  lastHeartbeat[deviceId] = now;

  // Return notifications created after the last heartbeat (or all if first call).
  const newNotifications = lastSeen
    ? ALL_NOTIFICATIONS.filter((n) => n.createdAt > lastSeen)
    : ALL_NOTIFICATIONS;

  return NextResponse.json({
    ok: true,
    deviceId,
    serverTime: now,
    newNotifications,
    nextHeartbeatInMs: 30000,
  });
}
