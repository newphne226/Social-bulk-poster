// GET /api/schedule — list scheduled jobs.
// POST /api/schedule — schedule a post.
//
// The extension popup sends: { caption, accountId, scheduledAt, hashtags?, mediaUrls? }
// We accept BOTH that shape AND the legacy { postId, scheduledFor } shape
// so the extension and the web dashboard both work.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const [jobs, settings] = await Promise.all([
    db.scheduledJob.findMany({
      where: { userId: auth.user.id },
      orderBy: { scheduledFor: "asc" },
      include: { post: { select: { caption: true, accountId: true } } },
    }),
    db.userSettings.findUnique({ where: { userId: auth.user.id } }),
  ]);

  const userSettings = settings
    ? {
        workingHoursStart: settings.workingHoursStart,
        workingHoursEnd: settings.workingHoursEnd,
        workingDays: JSON.parse(settings.workingDays || "[1,2,3,4,5]"),
        dailyPostingLimit: settings.dailyPostingLimit,
        weeklyPostingLimit: settings.weeklyPostingLimit,
        schedulePaused: settings.schedulePaused,
      }
    : {
        workingHoursStart: "09:00",
        workingHoursEnd: "21:00",
        workingDays: [1, 2, 3, 4, 5],
        dailyPostingLimit: 50,
        weeklyPostingLimit: 300,
        schedulePaused: false,
      };

  return NextResponse.json({
    jobs: jobs.map((j) => ({
      id: j.id,
      postId: j.postId,
      status: j.status,
      scheduledFor: j.scheduledFor.toISOString(),
      priority: j.priority,
      isPaused: j.isPaused,
      caption: j.post?.caption,
      accountId: j.post?.accountId,
    })),
    settings: userSettings,
    total: jobs.length,
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const settings = await db.userSettings.findUnique({ where: { userId: auth.user.id } });
  const userSettings = settings
    ? {
        workingHoursStart: settings.workingHoursStart,
        workingHoursEnd: settings.workingHoursEnd,
        workingDays: JSON.parse(settings.workingDays || "[1,2,3,4,5]"),
        dailyPostingLimit: settings.dailyPostingLimit,
        weeklyPostingLimit: settings.weeklyPostingLimit,
        schedulePaused: settings.schedulePaused,
      }
    : {
        workingHoursStart: "09:00",
        workingHoursEnd: "21:00",
        workingDays: [1, 2, 3, 4, 5],
        dailyPostingLimit: 50,
        weeklyPostingLimit: 300,
        schedulePaused: false,
      };

  if (userSettings.schedulePaused) {
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

    // Verify account belongs to user
    const account = await db.socialAccount.findFirst({
      where: { id: accountId, userId: auth.user.id },
    });
    if (!account) {
      return NextResponse.json({ error: "Account not found or unauthorized." }, { status: 403 });
    }

    // Create the post
    const newPost = await db.post.create({
      data: {
        userId: auth.user.id,
        accountId,
        caption,
        platform: account.platform,
        type: "TEXT",
        status: "SCHEDULED",
        scheduledAt: new Date(scheduledFor),
        mediaUrls: JSON.stringify(body.mediaUrls ?? []),
        hashtags: JSON.stringify(body.hashtags ?? []),
      },
    });
    postId = newPost.id;
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

    // Verify post belongs to user
    const post = await db.post.findFirst({
      where: { id: postId, userId: auth.user.id },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found or unauthorized." }, { status: 403 });
    }
  } else {
    return NextResponse.json(
      { error: "Missing required fields. Expected { caption, accountId, scheduledAt } or { postId, scheduledFor }." },
      { status: 400 }
    );
  }

  // ----- Validate scheduled time is in the future -----
  const date = new Date(scheduledFor!);
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
  const startHour = parseInt(userSettings.workingHoursStart.split(":")[0], 10);
  const endHour = parseInt(userSettings.workingHoursEnd.split(":")[0], 10);

  let workingHoursWarning: string | null = null;
  if (hour < startHour || hour >= endHour) {
    workingHoursWarning = `Note: ${date.toLocaleString()} is outside your working hours (${userSettings.workingHoursStart}–${userSettings.workingHoursEnd}).`;
  }
  if (!userSettings.workingDays.includes(dayOfWeek)) {
    workingHoursWarning = workingHoursWarning
      ? `${workingHoursWarning} Also outside working days.`
      : "Scheduled day is outside configured working days.";
  }

  // ----- Validate daily limit -----
  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todayEnd = new Date(today.setHours(23, 59, 59, 999));
  const todayJobs = await db.scheduledJob.count({
    where: {
      userId: auth.user.id,
      scheduledFor: { gte: todayStart, lte: todayEnd },
    },
  });
  if (todayJobs >= userSettings.dailyPostingLimit) {
    return NextResponse.json(
      { error: `Daily posting limit (${userSettings.dailyPostingLimit}) reached.` },
      { status: 403 }
    );
  }

  // Create scheduled job
  const newJob = await db.scheduledJob.create({
    data: {
      userId: auth.user.id,
      postId: postId!,
      jobType: "PUBLISH",
      status: "PENDING",
      scheduledFor: date,
      priority: 0,
      isPaused: false,
      payload: JSON.stringify({ caption, accountId }),
    },
  });

  return NextResponse.json(
    {
      job: {
        id: newJob.id,
        postId: newJob.postId,
        status: newJob.status,
        scheduledFor: newJob.scheduledFor.toISOString(),
        priority: newJob.priority,
        isPaused: newJob.isPaused,
        caption,
        accountId,
      },
      ...(workingHoursWarning ? { warning: workingHoursWarning } : {}),
    },
    { status: 201 }
  );
}