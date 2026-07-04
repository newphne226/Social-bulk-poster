// GET /api/admin/logs — query system logs (filter by level).
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { ADMIN_LOGS } from "@/lib/admin-mock";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level")?.toLowerCase();
  const source = searchParams.get("source")?.toLowerCase();
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 100;

  let result = ADMIN_LOGS;
  if (level) result = result.filter((l) => l.level === level);
  if (source) result = result.filter((l) => l.source === source);

  // Newest first.
  result = [...result]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  return NextResponse.json({
    logs: result,
    total: result.length,
    filters: { level, source, limit },
  });
}
