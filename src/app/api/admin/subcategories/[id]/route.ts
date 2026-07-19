import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const { name, slug, description, sortOrder, isActive } = body;

  const updates: any = {};
  if (name) updates.name = name;
  if (slug) updates.slug = slug;
  if (description !== undefined) updates.description = description;
  if (sortOrder !== undefined) updates.sortOrder = sortOrder;
  if (isActive !== undefined) updates.isActive = isActive;

  const subcategory = await db.productSubcategory.update({ where: { id }, data: updates });
  return NextResponse.json({ subcategory });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const count = await db.product.count({ where: { subcategoryId: id } });
  if (count > 0) {
    return NextResponse.json({ error: `Cannot delete: ${count} products use this subcategory` }, { status: 409 });
  }

  await db.productSubcategory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
