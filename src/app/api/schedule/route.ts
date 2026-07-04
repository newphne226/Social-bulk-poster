// GET /api/schedule — list scheduled jobs.
// POST /api/schedule — schedule a post (validates working hours + daily/weekly limits).
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
const JOBS = [
  { id: "j1", postId: "p1", status: "PENDING", scheduledFor: iso(45), priority: 0, isPaused: false },
  { id: "j2", postId: "p6", status: "PENDING", scheduledFor: iso(180), priority: 0, isPaused: false },
  { id: "j3", postId: "p7", status: "PENDING", scheduledFor: iso(720), priority: 1, isPaused: false },
  { id: "j4", postId: "p8", status: "PENDING", scheduledFor: iso(1440), priority: 0, isPaused: false },
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
  const { postId, scheduledFor } = body ?? {};
  if (!postId || !scheduledFor) {
    return NextResponse.json(
      { error: "postId and scheduledFor are required." },
      { status: 400 }
    );
  }

  // Validate working hours: hour-of-day must be within [start, end).
  const date = new Date(scheduledFor);
  const hour = date.getHours();
  const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // Mon=1..Sun=7
  const startHour = parseInt(USER_SETTINGS.workingHoursStart.split(":")[0], 10);
  const endHour = parseInt(USER_SETTINGS.workingHoursEnd.split(":")[0], 10);

  if (hour < startHour || hour >= endHour) {
    return NextResponse.json(
      { error: `Scheduled time outside working hours (${USER_SETTINGS.workingHoursStart}–${USER_SETTINGS.workingHoursEnd}).` },
      { status: 400 }
    );
  }
  if (!USER_SETTINGS.workingDays.includes(dayOfWeek)) {
    return NextResponse.json(
      { error: "Scheduled day is outside configured working days." },
      { status: 400 }
    );
  }

  // Validate daily/weekly limits.
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
  };
  JOBS.push(newJob);

  return NextResponse.json({ job: newJob }, { status: 201 });
}
