import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const categories = await db.productCategory.findMany({
    include: {
      _count: { select: { products: true, subcategories: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { name, slug, description, imageUrl, sortOrder } = body;

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const existing = await db.productCategory.findUnique({ where: { slug: catSlug } });
  if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

  const category = await db.productCategory.create({
    data: { name, slug: catSlug, description: description || null, imageUrl: imageUrl || null, sortOrder: sortOrder || 0 },
  });

  return NextResponse.json({ category }, { status: 201 });
}
