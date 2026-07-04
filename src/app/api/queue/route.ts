// GET /api/queue — return the publishing queue with aggregate stats.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const now = Date.now();
const iso = (offsetMin: number) => new Date(now + offsetMin * 60000).toISOString();

const QUEUE = [
  { id: "j1", postId: "p1", platform: "facebook", accountUsername: "@acmecorp", caption: "🚀 Summer sale starts Friday!", scheduledFor: iso(45), status: "PENDING", priority: 0 },
  { id: "j2", postId: "p6", platform: "instagram", accountUsername: "@acme.lifestyle", caption: "Weekend vibes ☀️", scheduledFor: iso(180), status: "PENDING", priority: 0 },
  { id: "j3", postId: "p7", platform: "pinterest", accountUsername: "@acmepins", caption: "10 minimalist workspace ideas", scheduledFor: iso(720), status: "PENDING", priority: 1 },
  { id: "j4", postId: "p8", platform: "linkedin", accountUsername: "acme-inc", caption: "Customer spotlight", scheduledFor: iso(1440), status: "PENDING", priority: 0 },
  { id: "j5", postId: "p10", platform: "facebook", accountUsername: "@acmecareers", caption: "Flash sale! 24 hours only 🔥", scheduledFor: iso(60), status: "PAUSED", priority: 0 },
];

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const stats = {
    total: QUEUE.length,
    pending: QUEUE.filter((q) => q.status === "PENDING").length,
    paused: QUEUE.filter((q) => q.status === "PAUSED").length,
    nextUp: QUEUE.filter((q) => q.status === "PENDING")
      .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())[0] ?? null,
  };

  return NextResponse.json({ queue: QUEUE, stats });
}
