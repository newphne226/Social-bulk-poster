// POST /api/ai/hashtags — return mock hashtag suggestions for a caption.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { canUseAI } from "@/lib/permissions";

// Per-platform hashtag caps (mirrors @/lib/platforms limits for demo).
const PLATFORM_MAX: Record<string, number> = {
  facebook: 10,
  instagram: 30,
  x: 5,
  linkedin: 5,
  pinterest: 20,
};

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  if (!canUseAI(auth.user.plan)) {
    return NextResponse.json(
      { error: "AI features require the VIP Pro plan or higher." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const { caption, platform = "instagram" } = body ?? {};
  if (!caption) {
    return NextResponse.json({ error: "caption is required." }, { status: 400 });
  }

  // Derive keywords from caption (split on whitespace, strip punctuation).
  const words = caption
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const unique = Array.from(new Set(words)).slice(0, 8);

  // Always suggest a few evergreen tags.
  const generic = ["socialmedia", "content", "marketing", "trending", "viral"];

  const hashtags = Array.from(new Set([...unique, ...generic]))
    .slice(0, PLATFORM_MAX[platform] ?? 10)
    .map((t) => `#${t}`);

  return NextResponse.json({ platform, hashtags, count: hashtags.length });
}
