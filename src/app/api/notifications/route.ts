// GET /api/notifications — list notifications.
// PUT /api/notifications — mark all as read.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const NOTIFICATIONS = [
  { id: "n1", type: "POST_FAILED", title: "Post failed to publish", body: "Your LinkedIn post 'We're hiring...' failed: Token expired.", isRead: false, createdAt: "2026-07-03T08:00:00Z" },
  { id: "n2", type: "POST_PUBLISHED", title: "Post published", body: "Your X post '5 productivity tips...' is now live.", isRead: false, createdAt: "2026-07-03T07:00:00Z" },
  { id: "n3", type: "ACCOUNT_DISCONNECTED", title: "Account disconnected", body: "Pinterest account '@acmepins' needs reconnection.", isRead: false, createdAt: "2026-07-03T05:00:00Z" },
  { id: "n4", type: "SUBSCRIPTION_RENEWED", title: "Subscription renewed", body: "Your VIP Pro subscription was renewed for $10.00.", isRead: true, createdAt: "2026-06-30T10:00:00Z" },
  { id: "n5", type: "POST_SCHEDULED", title: "Post scheduled", body: "Your Facebook post is scheduled for 2:45 PM.", isRead: true, createdAt: "2026-07-03T09:30:00Z" },
];

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const unread = searchParams.get("unread");

  let result = NOTIFICATIONS;
  if (unread === "true") result = result.filter((n) => !n.isRead);
  if (unread === "false") result = result.filter((n) => n.isRead);

  return NextResponse.json({
    notifications: result,
    total: result.length,
    unreadCount: NOTIFICATIONS.filter((n) => !n.isRead).length,
  });
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  // Mark all as read.
  NOTIFICATIONS.forEach((n) => {
    n.isRead = true;
  });

  return NextResponse.json({
    message: "All notifications marked as read.",
    updatedCount: NOTIFICATIONS.length,
  });
}
