// GET /api/notifications — list notifications.
// PUT /api/notifications — mark all as read.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const unread = searchParams.get("unread");

  const where: any = { userId: auth.user.id };
  if (unread === "true") where.isRead = false;
  if (unread === "false") where.isRead = true;

  const [notifications, total, unreadCount] = await Promise.all([
    db.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.notification.count({ where: { userId: auth.user.id } }),
    db.notification.count({ where: { userId: auth.user.id, isRead: false } }),
  ]);

  return NextResponse.json({
    notifications: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
    })),
    total,
    unreadCount,
  });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const result = await db.notification.updateMany({
    where: { userId: auth.user.id, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

  return NextResponse.json({
    message: "All notifications marked as read.",
    updatedCount: result.count,
  });
}