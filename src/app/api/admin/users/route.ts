// GET /api/admin/users — list all users (admin only).
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { ADMIN_USERS } from "@/lib/admin-mock";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const plan = searchParams.get("plan");
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.toLowerCase();

  let result = ADMIN_USERS;
  if (plan) result = result.filter((u) => u.plan === plan.toUpperCase());
  if (status) result = result.filter((u) => u.status === status.toUpperCase());
  if (q) {
    result = result.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    users: result,
    total: result.length,
  });
}
