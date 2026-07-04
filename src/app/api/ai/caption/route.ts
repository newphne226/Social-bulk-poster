// POST /api/ai/caption — generate mock caption variations based on tone.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { canUseAI } from "@/lib/permissions";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  if (!canUseAI(auth.user.plan)) {
    return NextResponse.json(
      { error: "AI features require the VIP Pro plan or higher." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const { topic, tone = "professional", platform = "facebook" } = body ?? {};
  if (!topic) {
    return NextResponse.json({ error: "topic is required." }, { status: 400 });
  }

  // Simple switch on tone — return 3 mock variations.
  let variations: string[];
  switch (tone) {
    case "professional":
      variations = [
        `${topic}: a strategic overview for forward-thinking professionals. 📊`,
        `Introducing ${topic} — designed to elevate how your team works. Learn more today.`,
        `Why ${topic} matters in 2026: an in-depth look at trends and best practices.`,
      ];
      break;
    case "casual":
      variations = [
        `Okay but can we talk about ${topic}?? 👀 It's kind of a big deal.`,
        `Just discovered ${topic} and my mind is blown 🤯 Drop a 🙋 if you've tried it!`,
        `${topic} = weekend sorted. Who's with me? 😎`,
      ];
      break;
    case "humorous":
      variations = [
        `Me: I have a to-do list.\nAlso me: let me research ${topic} for 3 hours instead. 🙃`,
        `${topic} walked so my productivity could run. 🏃‍♂️💨`,
        `POV: you thought you understood ${topic} and then this happened 😂`,
      ];
      break;
    case "inspirational":
      variations = [
        `Every great journey begins with a single step. Let ${topic} be yours. ✨`,
        `${topic} isn't just a destination — it's the path to who you're becoming. 🌟`,
        `Dream big. Start small. Master ${topic} one day at a time. 💪`,
      ];
      break;
    default:
      variations = [
        `${topic} — here's what you need to know.`,
        `Everything about ${topic}, explained simply.`,
        `${topic}: tips, tricks, and insights.`,
      ];
  }

  return NextResponse.json({ topic, tone, platform, variations });
}
