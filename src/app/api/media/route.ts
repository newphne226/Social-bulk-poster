// GET /api/media — list media items.
// POST /api/media — mock media upload (returns a fake URL).
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const MEDIA = [
  { id: "m1", name: "summer-banner.jpg", type: "IMAGE", url: "https://picsum.photos/seed/m1/800/600", thumbnailUrl: "https://picsum.photos/seed/m1/200/150", size: 245000, tags: ["summer", "banner"], createdAt: "2026-07-01T10:00:00Z", folder: "Campaigns" },
  { id: "m2", name: "product-shot.png", type: "IMAGE", url: "https://picsum.photos/seed/m2/800/800", thumbnailUrl: "https://picsum.photos/seed/m2/200/200", size: 512000, tags: ["product"], createdAt: "2026-06-30T12:00:00Z", folder: "Products" },
  { id: "m3", name: "promo-video.mp4", type: "VIDEO", url: "https://picsum.photos/seed/m3/1280/720", thumbnailUrl: "https://picsum.photos/seed/m3/200/120", size: 8400000, tags: ["promo"], createdAt: "2026-07-02T08:00:00Z", folder: "Videos" },
];

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const folder = searchParams.get("folder");

  let result = MEDIA;
  if (type) result = result.filter((m) => m.type === type.toUpperCase());
  if (folder) result = result.filter((m) => m.folder === folder);

  return NextResponse.json({ media: result, total: result.length });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const { name, type, size, folder } = body ?? {};
  if (!name || !type) {
    return NextResponse.json(
      { error: "name and type are required." },
      { status: 400 }
    );
  }

  // Mock: pretend we uploaded to cloud storage and got a URL back.
  const seed = `${name}-${Date.now()}`;
  const newMedia = {
    id: `m${Date.now()}`,
    name,
    type: type.toUpperCase(),
    url: `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`,
    thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(seed)}/200/150`,
    size: size ?? 0,
    tags: [],
    createdAt: new Date().toISOString(),
    folder: folder ?? "Uncategorized",
  };
  MEDIA.push(newMedia);

  return NextResponse.json({ media: newMedia }, { status: 201 });
}
