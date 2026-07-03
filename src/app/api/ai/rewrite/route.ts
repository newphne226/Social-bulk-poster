// POST /api/ai/rewrite — rewrite/shorten/expand text.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { canUseAI } from "@/lib/permissions";

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
  const { text, action = "rewrite" } = body ?? {};
  if (!text) {
    return NextResponse.json({ error: "text is required." }, { status: 400 });
  }

  let result: string;
  switch (action) {
    case "shorten":
      // Demo: keep the first sentence, append an ellipsis if cut off.
      result = text.split(/[.!?]\s/)[0].trim();
      if (result.length < text.length) result += "…";
      break;
    case "expand":
      // Demo: pad with a templated elaboration.
      result = `${text} Here's why this matters: it helps you connect with your audience, drive meaningful engagement, and stay ahead of the curve in today's fast-moving landscape.`;
      break;
    case "rewrite":
    default:
      // Demo: prefix with a strong opener.
      result = `Here's the thing — ${text.toLowerCase().replace(/^./, (c) => c.toUpperCase())}. And that's just the beginning.`;
      break;
  }

  return NextResponse.json({ action, original: text, rewritten: result });
}
