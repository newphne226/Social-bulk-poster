import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const category = await db.productCategory.findUnique({
    where: { id },
    include: {
      subcategories: { orderBy: { sortOrder: "asc" } },
      _count: { select: { products: true } },
    },
  });

  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ category });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const { name, slug, description, imageUrl, sortOrder, isActive } = body;

  const updates: any = {};
  if (name) updates.name = name;
  if (slug) updates.slug = slug;
  if (description !== undefined) updates.description = description;
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (sortOrder !== undefined) updates.sortOrder = sortOrder;
  if (isActive !== undefined) updates.isActive = isActive;

  const category = await db.productCategory.update({ where: { id }, data: updates });
  return NextResponse.json({ category });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const count = await db.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json({ error: `Cannot delete: ${count} products use this category` }, { status: 409 });
  }

  await db.productCategory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
