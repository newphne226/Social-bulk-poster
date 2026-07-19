import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const post = await db.post.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      account: { select: { displayName: true, platform: true, username: true, avatarUrl: true } },
      jobs: { orderBy: { createdAt: "desc" }, take: 5 },
      schedule: true,
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    order: {
      id: post.id,
      caption: post.caption,
      mediaUrls: JSON.parse(post.mediaUrls || "[]"),
      hashtags: JSON.parse(post.hashtags || "[]"),
      mentions: JSON.parse(post.mentions || "[]"),
      platform: post.platform,
      status: post.status,
      type: post.type,
      scheduledAt: post.scheduledAt?.toISOString() ?? null,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      failedAt: post.failedAt?.toISOString() ?? null,
      failureReason: post.failureReason ?? null,
      platformPostId: post.platformPostId ?? null,
      permalink: post.permalink ?? null,
      retryCount: post.retryCount,
      maxRetries: post.maxRetries,
      tags: JSON.parse(post.tags || "[]"),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      user: post.user,
      account: post.account,
      jobs: post.jobs.map((j) => ({
        id: j.id,
        jobType: j.jobType,
        status: j.status,
        scheduledFor: j.scheduledFor.toISOString(),
        startedAt: j.startedAt?.toISOString() ?? null,
        completedAt: j.completedAt?.toISOString() ?? null,
        failedAt: j.failedAt?.toISOString() ?? null,
        errorMessage: j.errorMessage ?? null,
        attempts: j.attempts,
      })),
      schedule: post.schedule ? {
        timezone: post.schedule.timezone,
        randomDelayMin: post.schedule.randomDelayMin,
        randomDelayMax: post.schedule.randomDelayMax,
      } : null,
    },
  });
}
