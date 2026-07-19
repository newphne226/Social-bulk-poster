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
  const brand = await db.brand.findUnique({
    where: { id },
    include: {
      products: { where: { deletedAt: null }, take: 10, orderBy: { createdAt: "desc" } },
      _count: { select: { products: true } },
    },
  });

  if (!brand) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ brand });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const { name, slug, description, logoUrl, website, isActive } = body;

  const updates: any = {};
  if (name) updates.name = name;
  if (slug) updates.slug = slug;
  if (description !== undefined) updates.description = description;
  if (logoUrl !== undefined) updates.logoUrl = logoUrl;
  if (website !== undefined) updates.website = website;
  if (isActive !== undefined) updates.isActive = isActive;

  const brand = await db.brand.update({ where: { id }, data: updates });
  return NextResponse.json({ brand });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const count = await db.product.count({ where: { brandId: id } });
  if (count > 0) {
    return NextResponse.json({ error: `Cannot delete: ${count} products use this brand` }, { status: 409 });
  }

  await db.brand.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
