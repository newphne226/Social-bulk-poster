// GET /api/admin/logs — query system logs (filter by level).
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level")?.toLowerCase();
  const source = searchParams.get("source")?.toLowerCase();
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 100;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const skip = (page - 1) * limit;

  const where: any = {};
  if (level) where.level = level;
  if (source) where.source = source;

  const [logs, total] = await Promise.all([
    db.systemLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.systemLog.count({ where }),
  ]);

  return NextResponse.json({
    logs: logs.map((l) => ({
      id: l.id,
      level: l.level,
      source: l.source,
      message: l.message,
      metadata: l.metadata ? JSON.parse(l.metadata) : {},
      createdAt: l.createdAt.toISOString(),
    })),
    total,
    page,
    limit,
    filters: { level, source },
  });
}