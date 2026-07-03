// GET /api/admin/stats — admin dashboard stats (admin only).
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { ADMIN_STATS } from "@/lib/admin-mock";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  return NextResponse.json({
    stats: ADMIN_STATS,
    generatedAt: new Date().toISOString(),
  });
}
