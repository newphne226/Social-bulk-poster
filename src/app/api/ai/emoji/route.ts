// POST /api/ai/emoji — suggest emojis based on caption content.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { canUseAI } from "@/lib/permissions";

// Tiny keyword → emoji map (demo only).
const EMOJI_MAP: Record<string, string> = {
  sale: "🛍️", discount: "💸", launch: "🚀", new: "✨", free: "🎁",
  love: "❤️", happy: "😊", weekend: "☀️", monday: "💪", friday: "🎉",
  hiring: "🧑‍💼", job: "💼", work: "💼", product: "📦", tip: "💡",
  growth: "📈", analytics: "📊", team: "👥", food: "🍔", travel: "✈️",
  summer: "🌞", winter: "❄️", coffee: "☕", money: "💰", success: "🏆",
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
  const { caption } = body ?? {};
  if (!caption) {
    return NextResponse.json({ error: "caption is required." }, { status: 400 });
  }

  const lower = caption.toLowerCase();
  const matched = Object.entries(EMOJI_MAP).filter(([kw]) => lower.includes(kw));
  const emojis = matched.length
    ? Array.from(new Set(matched.map(([, e]) => e)))
    : ["📌", "👍", "✨"]; // sensible defaults

  return NextResponse.json({
    emojis,
    suggestedString: `${caption} ${emojis.slice(0, 3).join("")}`,
  });
}
