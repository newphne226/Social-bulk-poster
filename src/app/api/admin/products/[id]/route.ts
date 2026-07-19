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
  const product = await db.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      subcategory: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const { action } = body;

  if (action === "delete") {
    await db.product.update({ where: { id }, data: { deletedAt: new Date() } });
    return NextResponse.json({ ok: true });
  }

  if (action === "toggle-active") {
    const product = await db.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await db.product.update({ where: { id }, data: { isActive: !product.isActive } });
    return NextResponse.json({ ok: true });
  }

  if (action === "toggle-featured") {
    const product = await db.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await db.product.update({ where: { id }, data: { isFeatured: !product.isFeatured } });
    return NextResponse.json({ ok: true });
  }

  if (action === "update-stock") {
    const { quantity, reason } = body;
    const product = await db.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const newQty = product.stockQuantity + (quantity || 0);
    await db.product.update({ where: { id }, data: { stockQuantity: Math.max(0, newQty) } });
    return NextResponse.json({ ok: true, stockQuantity: Math.max(0, newQty) });
  }

  if (action === "update-pricing") {
    const { price, compareAtPrice, costPrice, taxRate } = body;
    const updates: any = {};
    if (price !== undefined) updates.price = price;
    if (compareAtPrice !== undefined) updates.compareAtPrice = compareAtPrice;
    if (costPrice !== undefined) updates.costPrice = costPrice;
    if (taxRate !== undefined) updates.taxRate = taxRate;
    await db.product.update({ where: { id }, data: updates });
    return NextResponse.json({ ok: true });
  }

  const allowed = [
    "name", "slug", "description", "sku", "type", "status", "categoryId", "subcategoryId", "brandId",
    "imageUrl", "videoUrl", "price", "compareAtPrice", "costPrice", "currency", "taxRate",
    "trackInventory", "stockQuantity", "lowStockThreshold", "allowBackorder",
    "weight", "metaTitle", "metaDescription", "isActive", "isFeatured", "isTaxable",
  ];
  const updates: any = {};
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (body.tags) updates.tags = JSON.stringify(body.tags);

  const product = await db.product.update({
    where: { id },
    data: updates,
    include: {
      category: { select: { id: true, name: true } },
      subcategory: { select: { id: true, name: true } },
      brand: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ product });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  await db.product.update({ where: { id }, data: { deletedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
