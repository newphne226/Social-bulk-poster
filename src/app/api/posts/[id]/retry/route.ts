// POST /api/posts/[id]/retry — retry a failed post.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const FAILED_POSTS: Record<string, { id: string; caption: string; retryCount: number; maxRetries: number }> = {
  p4: { id: "p4", caption: "We're hiring a Senior Product Designer!", retryCount: 2, maxRetries: 3 },
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const post = FAILED_POSTS[id];
  if (!post) {
    return NextResponse.json({ error: "Post not found or not retryable." }, { status: 404 });
  }
  if (post.retryCount >= post.maxRetries) {
    return NextResponse.json(
      { error: `Max retries (${post.maxRetries}) exceeded for this post.` },
      { status: 400 }
    );
  }

  post.retryCount += 1;
  return NextResponse.json({
    message: "Retry scheduled.",
    postId: id,
    retryCount: post.retryCount,
    nextAttemptAt: new Date(Date.now() + 60000).toISOString(),
  });
}
