// GET /api/posts — list posts (filters: status, platform, accountId).
// POST /api/posts — create post (validates plan limits via canSchedulePost).
//
// The extension popup sends: { caption, accountIds: [a1, a2, ...], hashtags?, mediaUrls?, status? }
// The web dashboard sends: { caption, platform, accountId, type, scheduledAt?, ... }
// We accept BOTH shapes.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { canSchedulePost } from "@/lib/permissions";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const platform = searchParams.get("platform");
  const accountId = searchParams.get("accountId");

  const where: any = { userId: auth.user.id };
  if (status) where.status = status.toUpperCase();
  if (platform) where.platform = platform;
  if (accountId) where.accountId = accountId;

  const posts = await db.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { account: true },
  });

  const formattedPosts = posts.map((post) => ({
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
    retryCount: post.retryCount,
  }));

  return NextResponse.json({ posts: formattedPosts, total: formattedPosts.length });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const {
    caption, platform, accountId, accountIds, type,
    scheduledAt, mediaUrls, hashtags, status,
  } = body ?? {};

  if (!caption) {
    return NextResponse.json(
      { error: "caption is required." },
      { status: 400 }
    );
  }

  // Determine which accounts to post to.
  // Shape A (extension popup): accountIds = [a1, a2, ...]
  // Shape B (web dashboard): accountId = "a1" + platform = "facebook"
  const targetAccountIds: string[] = Array.isArray(accountIds) && accountIds.length > 0
    ? accountIds
    : accountId
    ? [accountId]
    : [];

  if (targetAccountIds.length === 0 && status !== "DRAFT") {
    return NextResponse.json(
      { error: "At least one account is required (accountIds array or single accountId)." },
      { status: 400 }
    );
  }

  // Verify accounts belong to user
  if (targetAccountIds.length > 0) {
    const accounts = await db.socialAccount.findMany({
      where: { id: { in: targetAccountIds }, userId: auth.user.id },
      select: { id: true },
    });
    if (accounts.length !== targetAccountIds.length) {
      return NextResponse.json({ error: "One or more accounts not found or unauthorized." }, { status: 403 });
    }
  }

  // Enforce scheduled-post limit based on plan tier.
  const scheduledCount = await db.post.count({
    where: { userId: auth.user.id, status: { in: ["SCHEDULED", "QUEUED"] } },
  });
  const check = canSchedulePost(auth.user.plan, scheduledCount);
  if (!check.allowed) {
    return NextResponse.json({ error: check.reason }, { status: 403 });
  }

  // Create one post per account (or a single draft if no accounts)
  const createdPosts: any[] = [];
  const accountsToProcess = targetAccountIds.length > 0 ? targetAccountIds : [null];

  for (const acctId of accountsToProcess) {
    let postPlatform = platform || "facebook";
    let postUsername = "@newaccount";

    if (acctId) {
      const account = await db.socialAccount.findUnique({
        where: { id: acctId },
        select: { platform: true, username: true },
      });
      if (account) {
        postPlatform = account.platform;
        postUsername = account.username || "@newaccount";
      }
    }

    const newPost = await db.post.create({
      data: {
        userId: auth.user.id,
        accountId: acctId,
        caption,
        platform: postPlatform,
        type: type ?? "TEXT",
        status: status || (scheduledAt ? "SCHEDULED" : "DRAFT"),
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        mediaUrls: JSON.stringify(mediaUrls ?? []),
        hashtags: JSON.stringify(hashtags ?? []),
      },
    });

    createdPosts.push({
      id: newPost.id,
      caption: newPost.caption,
      platform: newPost.platform,
      accountUsername: postUsername,
      accountId: newPost.accountId,
      status: newPost.status,
      type: newPost.type,
      scheduledAt: newPost.scheduledAt?.toISOString() ?? null,
      publishedAt: null,
      mediaUrls: mediaUrls ?? [],
      hashtags: hashtags ?? [],
      retryCount: 0,
    });
  }

  // If only one post was created, return it directly for backward compat
  if (createdPosts.length === 1) {
    return NextResponse.json({ post: createdPosts[0], ok: true }, { status: 201 });
  }

  return NextResponse.json({ posts: createdPosts, ok: true, count: createdPosts.length }, { status: 201 });
}