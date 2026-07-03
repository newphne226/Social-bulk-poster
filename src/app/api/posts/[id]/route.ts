// GET / PUT / DELETE /api/posts/[id] — single-post operations.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const POSTS = [
  { id: "p1", caption: "🚀 Big announcement! Our summer sale starts this Friday.", platform: "facebook", accountUsername: "@acmecorp", accountId: "a1", status: "SCHEDULED", type: "IMAGE", scheduledAt: "2026-07-03T10:30:00Z", publishedAt: null, mediaUrls: [], hashtags: ["SummerSale"], retryCount: 0 },
  { id: "p2", caption: "Behind the scenes of our new product photoshoot 📸", platform: "instagram", accountUsername: "@acme.lifestyle", accountId: "a3", status: "PUBLISHED", type: "IMAGE", scheduledAt: "2026-07-03T07:30:00Z", publishedAt: "2026-07-03T07:32:00Z", mediaUrls: [], hashtags: ["BTS"], retryCount: 0 },
  { id: "p4", caption: "We're hiring a Senior Product Designer!", platform: "linkedin", accountUsername: "acme-inc", accountId: "a6", status: "FAILED", type: "IMAGE", scheduledAt: "2026-07-03T05:30:00Z", publishedAt: null, mediaUrls: [], hashtags: ["hiring"], failureReason: "Token expired. Please reconnect the account.", retryCount: 2 },
  { id: "p5", caption: "New blog post: The Future of Social Media Automation in 2026", platform: "facebook", accountUsername: "@acmecorp", accountId: "a1", status: "DRAFT", type: "LINK", scheduledAt: null, publishedAt: null, mediaUrls: [], hashtags: ["blog"], retryCount: 0 },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const post = POSTS.find((p) => p.id === id);
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const idx = POSTS.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  POSTS[idx] = { ...POSTS[idx], ...body, id };
  return NextResponse.json({ post: POSTS[idx] });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const idx = POSTS.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  const [removed] = POSTS.splice(idx, 1);
  return NextResponse.json({ deleted: true, id: removed.id });
}
