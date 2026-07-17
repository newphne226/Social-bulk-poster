// GET /api/admin/feature-flags — list feature flags.
// POST /api/admin/feature-flags — create or update a feature flag.
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const enabled = searchParams.get("enabled");

  const where: any = {};
  if (enabled === "true") where.enabled = true;
  if (enabled === "false") where.enabled = false;

  const flags = await db.featureFlag.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({
    featureFlags: flags.map((f) => ({
      id: f.id,
      key: f.key,
      description: f.description,
      enabled: f.enabled,
      rollout: f.rollout,
      plans: JSON.parse(f.plans || "[]"),
      metadata: JSON.parse(f.metadata || "{}"),
      updatedAt: f.updatedAt.toISOString(),
    })),
    total: flags.length,
  });
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

  const existing = await db.featureFlag.findUnique({ where: { key } });
  if (existing) {
    const updated = await db.featureFlag.update({
      where: { key },
      data: { description, enabled, rollout, plans: JSON.stringify(plans) },
    });
    return NextResponse.json({
      featureFlag: {
        id: updated.id,
        key: updated.key,
        description: updated.description,
        enabled: updated.enabled,
        rollout: updated.rollout,
        plans: JSON.parse(updated.plans || "[]"),
        metadata: JSON.parse(updated.metadata || "{}"),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  }

  const newFlag = await db.featureFlag.create({
    data: {
      key,
      description,
      enabled,
      rollout,
      plans: JSON.stringify(plans),
    },
  });

  return NextResponse.json(
    {
      featureFlag: {
        id: newFlag.id,
        key: newFlag.key,
        description: newFlag.description,
        enabled: newFlag.enabled,
        rollout: newFlag.rollout,
        plans: JSON.parse(newFlag.plans || "[]"),
        metadata: JSON.parse(newFlag.metadata || "{}"),
        updatedAt: newFlag.updatedAt.toISOString(),
      },
    },
    { status: 201 }
  );
}