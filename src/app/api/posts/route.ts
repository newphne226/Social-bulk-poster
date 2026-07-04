// GET /api/posts — list posts (filters: status, platform, accountId).
// POST /api/posts — create post (validates plan limits via canSchedulePost).
//
// The extension popup sends: { caption, accountIds: [a1, a2, ...], hashtags?, mediaUrls?, status? }
// The web dashboard sends: { caption, platform, accountId, type, scheduledAt?, ... }
// We accept BOTH shapes.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { canSchedulePost } from "@/lib/permissions";

const now = Date.now();
const iso = (offsetMin: number) => new Date(now + offsetMin * 60000).toISOString();

// Inline mock dataset (server-only).
const POSTS: any[] = [
  { id: "p1", caption: "🚀 Big announcement! Our summer sale starts this Friday.", platform: "facebook", accountUsername: "@acmecorp", accountId: "a1", status: "SCHEDULED", type: "IMAGE", scheduledAt: iso(45), publishedAt: null, mediaUrls: ["https://picsum.photos/seed/p1/800/600"], hashtags: ["SummerSale"], retryCount: 0 },
  { id: "p2", caption: "Behind the scenes of our new product photoshoot 📸", platform: "instagram", accountUsername: "@acme.lifestyle", accountId: "a3", status: "PUBLISHED", type: "IMAGE", scheduledAt: iso(-120), publishedAt: iso(-118), mediaUrls: [], hashtags: ["BTS"], retryCount: 0 },
  { id: "p3", caption: "5 productivity tips every founder should know 🧵", platform: "x", accountUsername: "@acme", accountId: "a5", status: "PUBLISHED", type: "TEXT", scheduledAt: iso(-240), publishedAt: iso(-239), mediaUrls: [], hashtags: ["productivity"], retryCount: 0 },
  { id: "p4", caption: "We're hiring a Senior Product Designer!", platform: "linkedin", accountUsername: "acme-inc", accountId: "a6", status: "FAILED", type: "IMAGE", scheduledAt: iso(-360), publishedAt: null, mediaUrls: [], hashtags: ["hiring"], failureReason: "Token expired. Please reconnect the account.", retryCount: 2 },
  { id: "p5", caption: "New blog post: The Future of Social Media Automation in 2026", platform: "facebook", accountUsername: "@acmecorp", accountId: "a1", status: "DRAFT", type: "LINK", scheduledAt: null, publishedAt: null, mediaUrls: [], hashtags: ["blog"], retryCount: 0 },
  { id: "p6", caption: "Weekend vibes ☀️ Tag someone who needs this view!", platform: "instagram", accountUsername: "@acme.lifestyle", accountId: "a3", status: "QUEUED", type: "IMAGE", scheduledAt: iso(180), publishedAt: null, mediaUrls: [], hashtags: ["weekend"], retryCount: 0 },
];

// Mock account→platform mapping (for multi-account create)
const ACCOUNT_MAP: Record<string, { platform: string; username: string }> = {
  a1: { platform: "facebook", username: "@acmecorp" },
  a3: { platform: "instagram", username: "@acme.lifestyle" },
  a5: { platform: "x", username: "@acme" },
  a6: { platform: "linkedin", username: "acme-inc" },
};

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const platform = searchParams.get("platform");
  const accountId = searchParams.get("accountId");

  let result = POSTS;
  if (status) result = result.filter((p) => p.status === status.toUpperCase());
  if (platform) result = result.filter((p) => p.platform === platform);
  if (accountId) result = result.filter((p) => p.accountId === accountId);

  return NextResponse.json({ posts: result, total: result.length });
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

  // Enforce scheduled-post limit based on plan tier.
  const scheduledCount = POSTS.filter((p) => p.status === "SCHEDULED" || p.status === "QUEUED").length;
  const check = canSchedulePost(auth.user.plan, scheduledCount);
  if (!check.allowed) {
    return NextResponse.json({ error: check.reason }, { status: 403 });
  }

  // Create one post per account (or a single draft if no accounts)
  const createdPosts: any[] = [];
  const accountsToProcess = targetAccountIds.length > 0 ? targetAccountIds : [null];

  for (const acctId of accountsToProcess) {
    const acctInfo = acctId ? ACCOUNT_MAP[acctId] : null;
    const postPlatform = platform || acctInfo?.platform || "facebook";
    const postUsername = acctInfo?.username || "@newaccount";

    const newPost: any = {
      id: `p${Date.now()}${createdPosts.length > 0 ? `_${createdPosts.length}` : ""}`,
      caption,
      platform: postPlatform,
      accountId: acctId || null,
      accountUsername: postUsername,
      status: status || (scheduledAt ? "SCHEDULED" : "DRAFT"),
      type: type ?? "TEXT",
      scheduledAt: scheduledAt ?? null,
      publishedAt: null,
      mediaUrls: mediaUrls ?? [],
      hashtags: hashtags ?? [],
      retryCount: 0,
    };
    POSTS.push(newPost);
    createdPosts.push(newPost);
  }

  // If only one post was created, return it directly for backward compat
  if (createdPosts.length === 1) {
    return NextResponse.json({ post: createdPosts[0], ok: true }, { status: 201 });
  }

  return NextResponse.json({ posts: createdPosts, ok: true, count: createdPosts.length }, { status: 201 });
}
