import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const brands = await db.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ brands });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { name, slug, description, logoUrl, website } = body;

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const brandSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const existing = await db.brand.findUnique({ where: { slug: brandSlug } });
  if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

  const brand = await db.brand.create({
    data: { name, slug: brandSlug, description: description || null, logoUrl: logoUrl || null, website: website || null },
  });

  return NextResponse.json({ brand }, { status: 201 });
}
