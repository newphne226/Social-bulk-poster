// DELETE /api/media/[id] — remove a media item.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const MEDIA = [
  { id: "m1", name: "summer-banner.jpg", type: "IMAGE", url: "", thumbnailUrl: "", size: 245000, tags: [], createdAt: "", folder: "Campaigns" },
  { id: "m2", name: "product-shot.png", type: "IMAGE", url: "", thumbnailUrl: "", size: 512000, tags: [], createdAt: "", folder: "Products" },
  { id: "m3", name: "promo-video.mp4", type: "VIDEO", url: "", thumbnailUrl: "", size: 8400000, tags: [], createdAt: "", folder: "Videos" },
];

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const idx = MEDIA.findIndex((m) => m.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Media not found." }, { status: 404 });
  }
  const [removed] = MEDIA.splice(idx, 1);
  return NextResponse.json({ deleted: true, id: removed.id });
}
