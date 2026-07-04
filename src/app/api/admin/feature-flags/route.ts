// GET /api/admin/feature-flags — list feature flags.
// POST /api/admin/feature-flags — create or update a feature flag.
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { ADMIN_FEATURE_FLAGS, type AdminFeatureFlag } from "@/lib/admin-mock";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const enabled = searchParams.get("enabled");

  let result = ADMIN_FEATURE_FLAGS;
  if (enabled === "true") result = result.filter((f) => f.enabled);
  if (enabled === "false") result = result.filter((f) => !f.enabled);

  return NextResponse.json({ featureFlags: result, total: result.length });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const { key, description = "", enabled = false, rollout = 0, plans = [] } = body ?? {};
  if (!key) {
    return NextResponse.json({ error: "key is required." }, { status: 400 });
  }
  if (rollout < 0 || rollout > 100) {
    return NextResponse.json({ error: "rollout must be between 0 and 100." }, { status: 400 });
  }

  // Update existing or create new.
  const existingIdx = ADMIN_FEATURE_FLAGS.findIndex((f) => f.key === key);
  const updatedAt = new Date().toISOString();

  if (existingIdx !== -1) {
    ADMIN_FEATURE_FLAGS[existingIdx] = {
      ...ADMIN_FEATURE_FLAGS[existingIdx],
      description,
      enabled,
      rollout,
      plans,
      updatedAt,
    };
    return NextResponse.json({ featureFlag: ADMIN_FEATURE_FLAGS[existingIdx] });
  }

  const newFlag: AdminFeatureFlag = {
    id: `f${Date.now()}`,
    key,
    description,
    enabled,
    rollout,
    plans,
    updatedAt,
  };
  ADMIN_FEATURE_FLAGS.push(newFlag);
  return NextResponse.json({ featureFlag: newFlag }, { status: 201 });
}
