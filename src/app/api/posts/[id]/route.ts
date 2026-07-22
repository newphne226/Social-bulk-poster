// GET / PUT / DELETE /api/posts/[id] — single-post operations.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const post = await db.post.findFirst({
    where: { id, userId: auth.user.id },
    include: { account: true },
  });
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  return NextResponse.json({
    post: {
      id: post.id,
      caption: post.caption,
      platform: post.platform,
      accountUsername: post.account?.username ?? "",
      accountId: post.accountId,
      status: post.status,
      type: post.type,
      scheduledAt: post.scheduledAt?.toISOString() ?? null,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      mediaUrls: JSON.parse(post.mediaUrls || "[]"),
      hashtags: JSON.parse(post.hashtags || "[]"),
      mentions: JSON.parse(post.mentions || "[]"),
      tags: JSON.parse(post.tags || "[]"),
      retryCount: post.retryCount,
      failureReason: post.failureReason,
    },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const existing = await db.post.findFirst({
    where: { id, userId: auth.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const {
    caption, platform, accountId, status, type,
    scheduledAt, mediaUrls, hashtags, mentions, tags,
  } = body ?? {};

  // If accountId changed, verify it belongs to user
  if (accountId && accountId !== existing.accountId) {
    const account = await db.socialAccount.findFirst({
      where: { id: accountId, userId: auth.user.id },
      select: { id: true, platform: true },
    });
    if (!account) {
      return NextResponse.json({ error: "Account not found or unauthorized." }, { status: 403 });
    }
  }

  const updateData: any = {};
  if (caption !== undefined) updateData.caption = caption;
  if (platform !== undefined) updateData.platform = platform;
  if (accountId !== undefined) updateData.accountId = accountId;
  if (status !== undefined) updateData.status = status;
  if (type !== undefined) updateData.type = type;
  if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
  if (mediaUrls !== undefined) updateData.mediaUrls = JSON.stringify(mediaUrls);
  if (hashtags !== undefined) updateData.hashtags = JSON.stringify(hashtags);
  if (mentions !== undefined) updateData.mentions = JSON.stringify(mentions);
  if (tags !== undefined) updateData.tags = JSON.stringify(tags);

  const updated = await db.post.update({
    where: { id },
    data: updateData,
    include: { account: true },
  });

  return NextResponse.json({
    post: {
      id: updated.id,
      caption: updated.caption,
      platform: updated.platform,
      accountUsername: updated.account?.username ?? "",
      accountId: updated.accountId,
      status: updated.status,
      type: updated.type,
      scheduledAt: updated.scheduledAt?.toISOString() ?? null,
      publishedAt: updated.publishedAt?.toISOString() ?? null,
      mediaUrls: JSON.parse(updated.mediaUrls || "[]"),
      hashtags: JSON.parse(updated.hashtags || "[]"),
      mentions: JSON.parse(updated.mentions || "[]"),
      tags: JSON.parse(updated.tags || "[]"),
      retryCount: updated.retryCount,
      failureReason: updated.failureReason,
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const existing = await db.post.findFirst({
    where: { id, userId: auth.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  await db.post.delete({ where: { id } });
  return NextResponse.json({ deleted: true, id });
}
