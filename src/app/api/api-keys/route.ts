// GET /api/api-keys — list API keys (key value redacted; only prefix shown).
// POST /api/api-keys — create a new API key (returns full key ONCE).
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { randomBytes } from "crypto";

interface ApiKeyRow {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  lastUsedAt: string | null;
  createdAt: string;
  isActive: boolean;
}

const API_KEYS: ApiKeyRow[] = [
  { id: "k1", name: "Production server", keyPrefix: "sk_live_ab12", permissions: ["posts:write", "accounts:read"], lastUsedAt: "2026-07-03T09:42:00Z", createdAt: "2026-06-01T12:00:00Z", isActive: true },
  { id: "k2", name: "Zapier integration", keyPrefix: "sk_live_cd34", permissions: ["posts:write"], lastUsedAt: "2026-07-02T18:00:00Z", createdAt: "2026-06-15T10:00:00Z", isActive: true },
];

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  return NextResponse.json({ apiKeys: API_KEYS, total: API_KEYS.length });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const { name, permissions = [] } = body ?? {};
  if (!name) {
    return NextResponse.json({ error: "name is required." }, { status: 400 });
  }

  // Generate a fake API key. Returned ONCE — store only the prefix in the list.
  const rawKey = `sk_live_${randomBytes(24).toString("hex")}`;
  const keyPrefix = rawKey.slice(0, 12);

  const newKey: ApiKeyRow = {
    id: `k${Date.now()}`,
    name,
    keyPrefix,
    permissions,
    lastUsedAt: null,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  API_KEYS.push(newKey);

  return NextResponse.json(
    {
      apiKey: newKey,
      key: rawKey, // full key — shown only this once
      warning: "Store this key securely. It will not be shown again.",
    },
    { status: 201 }
  );
}
