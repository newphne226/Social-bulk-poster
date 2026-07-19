import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const status = searchParams.get("status") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const brandId = searchParams.get("brandId") || "";

  const where: any = { deletedAt: null };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (type) where.type = type;
  if (status) where.status = status;
  if (categoryId) where.categoryId = categoryId;
  if (brandId) where.brandId = brandId;

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { name, slug, description, sku, type, categoryId, subcategoryId, brandId,
    imageUrl, videoUrl, price, compareAtPrice, costPrice, currency, taxRate,
    trackInventory, stockQuantity, lowStockThreshold, allowBackorder,
    weight, metaTitle, metaDescription, isActive, isFeatured, tags, status } = body;

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const existing = await db.product.findUnique({ where: { slug: productSlug } });
  if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

  if (sku) {
    const skuExists = await db.product.findUnique({ where: { sku } });
    if (skuExists) return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
  }

  const product = await db.product.create({
    data: {
      name,
      slug: productSlug,
      description: description || null,
      sku: sku || null,
      type: type || "PHYSICAL",
      status: status || "DRAFT",
      categoryId: categoryId || null,
      subcategoryId: subcategoryId || null,
      brandId: brandId || null,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
      price: price || 0,
      compareAtPrice: compareAtPrice ?? null,
      costPrice: costPrice ?? null,
      currency: currency || "usd",
      taxRate: taxRate || 0,
      trackInventory: trackInventory || false,
      stockQuantity: stockQuantity || 0,
      lowStockThreshold: lowStockThreshold || 5,
      allowBackorder: allowBackorder || false,
      weight: weight ?? null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      isActive: isActive !== false,
      isFeatured: isFeatured || false,
      tags: JSON.stringify(tags || []),
    },
    include: {
      category: { select: { id: true, name: true } },
      subcategory: { select: { id: true, name: true } },
      brand: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
