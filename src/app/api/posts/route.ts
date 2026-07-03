// GET /api/posts — list posts (filters: status, platform, accountId).
// POST /api/posts — create post (validates plan limits via canSchedulePost).
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { canSchedulePost } from "@/lib/permissions";

const now = Date.now();
const iso = (offsetMin: number) => new Date(now + offsetMin * 60000).toISOString();

// Inline mock dataset (server-only).
const POSTS = [
  { id: "p1", caption: "🚀 Big announcement! Our summer sale starts this Friday.", platform: "facebook", accountUsername: "@acmecorp", accountId: "a1", status: "SCHEDULED", type: "IMAGE", scheduledAt: iso(45), publishedAt: null, mediaUrls: ["https://picsum.photos/seed/p1/800/600"], hashtags: ["SummerSale"], retryCount: 0 },
  { id: "p2", caption: "Behind the scenes of our new product photoshoot 📸", platform: "instagram", accountUsername: "@acme.lifestyle", accountId: "a3", status: "PUBLISHED", type: "IMAGE", scheduledAt: iso(-120), publishedAt: iso(-118), mediaUrls: [], hashtags: ["BTS"], retryCount: 0 },
  { id: "p3", caption: "5 productivity tips every founder should know 🧵", platform: "x", accountUsername: "@acme", accountId: "a5", status: "PUBLISHED", type: "TEXT", scheduledAt: iso(-240), publishedAt: iso(-239), mediaUrls: [], hashtags: ["productivity"], retryCount: 0 },
  { id: "p4", caption: "We're hiring a Senior Product Designer!", platform: "linkedin", accountUsername: "acme-inc", accountId: "a6", status: "FAILED", type: "IMAGE", scheduledAt: iso(-360), publishedAt: null, mediaUrls: [], hashtags: ["hiring"], failureReason: "Token expired. Please reconnect the account.", retryCount: 2 },
  { id: "p5", caption: "New blog post: The Future of Social Media Automation in 2026", platform: "facebook", accountUsername: "@acmecorp", accountId: "a1", status: "DRAFT", type: "LINK", scheduledAt: null, publishedAt: null, mediaUrls: [], hashtags: ["blog"], retryCount: 0 },
  { id: "p6", caption: "Weekend vibes ☀️ Tag someone who needs this view!", platform: "instagram", accountUsername: "@acme.lifestyle", accountId: "a3", status: "QUEUED", type: "IMAGE", scheduledAt: iso(180), publishedAt: null, mediaUrls: [], hashtags: ["weekend"], retryCount: 0 },
];

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
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
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const { caption, platform, accountId, type, scheduledAt, mediaUrls, hashtags } = body ?? {};
  if (!caption || !platform || !accountId) {
    return NextResponse.json(
      { error: "caption, platform, and accountId are required." },
      { status: 400 }
    );
  }

  // Enforce scheduled-post limit based on plan tier.
  const scheduledCount = POSTS.filter((p) => p.status === "SCHEDULED" || p.status === "QUEUED").length;
  const check = canSchedulePost(auth.user.plan, scheduledCount);
  if (!check.allowed) {
    return NextResponse.json({ error: check.reason }, { status: 403 });
  }

  const newPost = {
    id: `p${Date.now()}`,
    caption,
    platform,
    accountId,
    accountUsername: "@newaccount",
    status: scheduledAt ? "SCHEDULED" : "DRAFT",
    type: type ?? "TEXT",
    scheduledAt: scheduledAt ?? null,
    publishedAt: null,
    mediaUrls: mediaUrls ?? [],
    hashtags: hashtags ?? [],
    retryCount: 0,
  };
  POSTS.push(newPost);

  return NextResponse.json({ post: newPost }, { status: 201 });
}
