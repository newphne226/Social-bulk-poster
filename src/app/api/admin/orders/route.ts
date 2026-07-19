import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const status = searchParams.get("status") ?? "";
  const platform = searchParams.get("platform") ?? "";
  const search = searchParams.get("search") ?? "";

  const where: any = {};
  if (status) where.status = status;
  if (platform) where.platform = platform;
  if (search) {
    where.OR = [
      { caption: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      { user: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [posts, total] = await Promise.all([
    db.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true } },
        account: { select: { displayName: true, platform: true } },
      },
    }),
    db.post.count({ where }),
  ]);

  return NextResponse.json({
    orders: posts.map((p) => ({
      id: p.id,
      caption: p.caption.substring(0, 200),
      platform: p.platform,
      status: p.status,
      type: p.type,
      userName: p.user.name ?? p.user.email,
      userId: p.user.id,
      accountName: p.account.displayName,
      scheduledAt: p.scheduledAt?.toISOString() ?? null,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      failedAt: p.failedAt?.toISOString() ?? null,
      failureReason: p.failureReason ?? null,
      retryCount: p.retryCount,
      createdAt: p.createdAt.toISOString(),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
