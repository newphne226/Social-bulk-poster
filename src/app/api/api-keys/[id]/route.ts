// DELETE /api/api-keys/[id] — revoke an API key.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const API_KEYS = [
  { id: "k1", name: "Production server", keyPrefix: "sk_live_ab12", permissions: [], lastUsedAt: null, createdAt: "", isActive: true },
  { id: "k2", name: "Zapier integration", keyPrefix: "sk_live_cd34", permissions: [], lastUsedAt: null, createdAt: "", isActive: true },
];

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const idx = API_KEYS.findIndex((k) => k.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "API key not found." }, { status: 404 });
  }

  API_KEYS[idx].isActive = false;
  return NextResponse.json({
    revoked: true,
    id,
    name: API_KEYS[idx].name,
    message: "API key revoked. Requests using it will be rejected.",
  });
}
