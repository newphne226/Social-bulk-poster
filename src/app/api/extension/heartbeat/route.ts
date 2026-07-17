// POST /api/extension/heartbeat — called by the extension every 30s.
// Returns 200 + any new notifications since the last heartbeat.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const deviceId = body?.deviceId ?? "unknown-device";

  try {
    // Get or create device record
    let device = await db.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      device = await db.device.create({
        data: {
          id: deviceId,
          userId: auth.user.id,
          deviceName: "Extension",
          deviceType: "extension",
          lastActiveAt: new Date(),
        },
      });
    } else {
      await db.device.update({
        where: { id: deviceId },
        data: { lastActiveAt: new Date() },
      });
    }

    // Get notifications created after device's lastActiveAt (before update)
    const lastSeen = device.lastActiveAt;
    const newNotifications = await db.notification.findMany({
      where: {
        userId: auth.user.id,
        createdAt: { gt: lastSeen },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      ok: true,
      deviceId,
      serverTime: new Date().toISOString(),
      newNotifications: newNotifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
      nextHeartbeatInMs: 30000,
    });
  } catch (err) {
    console.error("[extension/heartbeat] error", err);
    return NextResponse.json({ error: "Heartbeat failed" }, { status: 500 });
  }
}