import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId") || "";

  const where: any = {};
  if (categoryId) where.categoryId = categoryId;

  const subcategories = await db.productSubcategory.findMany({
    where,
    include: {
      category: { select: { id: true, name: true } },
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ subcategories });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { name, slug, categoryId, description, sortOrder } = body;

  if (!name || !categoryId) return NextResponse.json({ error: "Name and categoryId required" }, { status: 400 });

  const subSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const existing = await db.productSubcategory.findUnique({ where: { slug: subSlug } });
  if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

  const subcategory = await db.productSubcategory.create({
    data: { name, slug: subSlug, categoryId, description: description || null, sortOrder: sortOrder || 0 },
  });

  return NextResponse.json({ subcategory }, { status: 201 });
}
