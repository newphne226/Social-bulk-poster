// POST /api/schedule/pause — pause the entire schedule.
// POST /api/schedule/pause with {action:"resume"} — resume.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

// Shared mutable state (in-memory demo).
let SCHEDULE_PAUSED = false;

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const action = body?.action ?? "pause";

  if (action === "resume") {
    SCHEDULE_PAUSED = false;
    return NextResponse.json({
      paused: false,
      message: "Schedule resumed. Pending jobs will run at their scheduled times.",
    });
  }

  if (action === "pause") {
    SCHEDULE_PAUSED = true;
    return NextResponse.json({
      paused: true,
      message: "Schedule paused. No new posts will be published until resumed.",
    });
  }

  return NextResponse.json(
    { error: `Unknown action "${action}". Use "pause" or "resume".` },
    { status: 400 }
  );
}
