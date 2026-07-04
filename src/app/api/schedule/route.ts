// GET /api/schedule — list scheduled jobs.
// POST /api/schedule — schedule a post.
//
// The extension popup sends: { caption, accountId, scheduledAt, hashtags?, mediaUrls? }
// We accept BOTH that shape AND the legacy { postId, scheduledFor } shape
// so the extension and the web dashboard both work.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

// Mock "user settings" used for working-hours & limit checks.
const USER_SETTINGS = {
  workingHoursStart: "09:00",
  workingHoursEnd: "21:00",
  workingDays: [1, 2, 3, 4, 5], // Mon–Fri
  dailyPostingLimit: 50,
  weeklyPostingLimit: 300,
  schedulePaused: false,
};

const now = Date.now();
const iso = (offsetMin: number) => new Date(now + offsetMin * 60000).toISOString();

// Inline mock scheduled jobs.
const JOBS: any[] = [
  { id: "j1", postId: "p1", status: "PENDING", scheduledFor: iso(45), priority: 0, isPaused: false },
  { id: "j2", postId: "p6", status: "PENDING", scheduledFor: iso(180), priority: 0, isPaused: false },
  { id: "j3", postId: "p7", status: "PENDING", scheduledFor: iso(720), priority: 0, isPaused: false },
  { id: "j4", postId: "p8", status: "PENDING", scheduledFor: iso(1440), priority: 1, isPaused: false },
];

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  return NextResponse.json({
    jobs: JOBS,
    settings: USER_SETTINGS,
    total: JOBS.length,
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  if (USER_SETTINGS.schedulePaused) {
    return NextResponse.json(
      { error: "Schedule is currently paused. Resume scheduling to add new jobs." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));

  // ----- Accept BOTH payload shapes -----
  // Shape A (from extension popup): { caption, accountId, scheduledAt, hashtags?, mediaUrls? }
  // Shape B (from web dashboard):  { postId, scheduledFor, accountId? }
  let postId: string | undefined;
  let scheduledFor: string | undefined;
  let caption: string | undefined;
  let accountId: string | undefined;

  if (body?.scheduledAt) {
    // Shape A — extension popup. Create the post first, then schedule.
    caption = body.caption;
    accountId = body.accountId;
    scheduledFor = body.scheduledAt;

    if (!caption || !accountId || !scheduledFor) {
      return NextResponse.json(
        { error: "caption, accountId, and scheduledAt are required." },
        { status: 400 }
      );
    }

    // Generate a postId for the new post
    postId = `p${Date.now()}`;
  } else if (body?.scheduledFor) {
    // Shape B — web dashboard
    postId = body.postId;
    scheduledFor = body.scheduledFor;
    accountId = body.accountId;

    if (!postId || !scheduledFor) {
      return NextResponse.json(
        { error: "postId and scheduledFor are required." },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Missing required fields. Expected { caption, accountId, scheduledAt } or { postId, scheduledFor }." },
      { status: 400 }
    );
  }

  // ----- Validate scheduled time is in the future -----
  const date = new Date(scheduledFor);
  if (isNaN(date.getTime())) {
    return NextResponse.json(
      { error: "Invalid scheduledAt/scheduledFor value." },
      { status: 400 }
    );
  }
  if (date.getTime() <= Date.now()) {
    return NextResponse.json(
      { error: "Scheduled time must be in the future." },
      { status: 400 }
    );
  }

  // ----- Validate working hours -----
  const hour = date.getHours();
  const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // Mon=1..Sun=7
  const startHour = parseInt(USER_SETTINGS.workingHoursStart.split(":")[0], 10);
  const endHour = parseInt(USER_SETTINGS.workingHoursEnd.split(":")[0], 10);

  // Soft warning (don't block) — extension users may legitimately want off-hours posts
  let workingHoursWarning: string | null = null;
  if (hour < startHour || hour >= endHour) {
    workingHoursWarning = `Note: ${date.toLocaleString()} is outside your working hours (${USER_SETTINGS.workingHoursStart}–${USER_SETTINGS.workingHoursEnd}).`;
  }
  if (!USER_SETTINGS.workingDays.includes(dayOfWeek)) {
    workingHoursWarning = workingHoursWarning
      ? `${workingHoursWarning} Also outside working days.`
      : "Scheduled day is outside configured working days.";
  }

  // ----- Validate daily limit -----
  const today = new Date();
  const todayJobs = JOBS.filter((j) => {
    const d = new Date(j.scheduledFor);
    return d.toDateString() === today.toDateString();
  }).length;
  if (todayJobs >= USER_SETTINGS.dailyPostingLimit) {
    return NextResponse.json(
      { error: `Daily posting limit (${USER_SETTINGS.dailyPostingLimit}) reached.` },
      { status: 403 }
    );
  }

  const newJob = {
    id: `j${Date.now()}`,
    postId,
    status: "PENDING",
    scheduledFor,
    priority: 0,
    isPaused: false,
    ...(caption ? { caption } : {}),
    ...(accountId ? { accountId } : {}),
  };
  JOBS.push(newJob);

  return NextResponse.json(
    {
      job: newJob,
      ...(workingHoursWarning ? { warning: workingHoursWarning } : {}),
    },
    { status: 201 }
  );
}
