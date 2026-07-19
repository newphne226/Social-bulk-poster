"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Package, Edit, Trash2, Eye, Star, ShoppingCart,
  BarChart3, Tag, Globe, AlertCircle, CheckCircle, XCircle,
  Plus, Minus, Save,
} from "lucide-react";

interface Product {
  id: string; name: string; slug: string; sku: string | null; type: string; status: string;
  description: string | null; imageUrl: string | null; galleryUrls: string; videoUrl: string | null;
  price: number; compareAtPrice: number | null; costPrice: number | null; currency: string; taxRate: number;
  trackInventory: boolean; stockQuantity: number; lowStockThreshold: number; allowBackorder: boolean;
  weight: number | null; metaTitle: string | null; metaDescription: string | null;
  isActive: boolean; isFeatured: boolean; isTaxable: boolean;
  salesCount: number; viewCount: number; rating: number; reviewCount: number;
  tags: string; metadata: string;
  category: { id: string; name: string; slug: string } | null;
  subcategory: { id: string; name: string; slug: string } | null;
  brand: { id: string; name: string; slug: string } | null;
  createdAt: string; updatedAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [activeSection, setActiveSection] = React.useState("details");
  const [stockAdjust, setStockAdjust] = React.useState(0);
  const [editingPrice, setEditingPrice] = React.useState(false);
  const [priceForm, setPriceForm] = React.useState({ price: 0, compareAtPrice: "", costPrice: "", taxRate: 0 });

  const fetchProduct = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) { window.location.replace("/admin/login"); return; }
    try {
      const res = await fetch(`/api/admin/products/${params.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setProduct(data.product);
      setPriceForm({
        price: data.product.price,
        compareAtPrice: data.product.compareAtPrice?.toString() || "",
        costPrice: data.product.costPrice?.toString() || "",
        taxRate: data.product.taxRate,
      });
      setLoading(false);
    } catch (err: any) { setError(err.message); setLoading(false); }
  }, [params.id]);

  React.useEffect(() => { fetchProduct(); }, [fetchProduct]);

  const handleAction = async (action: string, body: any = {}) => {
    const token = localStorage.getItem("sp_admin_token");
    await fetch(`/api/admin/products/${params.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...body }),
    });
    fetchProduct();
  };

  const handleSavePricing = async () => {
    await handleAction("update-pricing", {
      price: priceForm.price,
      compareAtPrice: priceForm.compareAtPrice ? parseInt(priceForm.compareAtPrice) : null,
      costPrice: priceForm.costPrice ? parseInt(priceForm.costPrice) : null,
      taxRate: priceForm.taxRate,
    });
    setEditingPrice(false);
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !product) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <AlertCircle className="h-10 w-10 text-red-500" />
      <p className="text-sm text-red-400">{error || "Product not found"}</p>
      <button onClick={() => router.back()} className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm">Go Back</button>
    </div>
  );

  const sections = [
    { key: "details", label: "Details", icon: Package },
    { key: "pricing", label: "Pricing", icon: Tag },
    { key: "inventory", label: "Inventory", icon: ShoppingCart },
    { key: "seo", label: "SEO", icon: Globe },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{product.name}</h1>
          <p className="text-sm text-slate-400">{product.sku && <span className="font-mono">SKU: {product.sku}</span>} • {product.type}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleAction("toggle-active")}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${product.isActive ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}>
            {product.isActive ? <><CheckCircle className="h-4 w-4 inline mr-1" /> Active</> : <><XCircle className="h-4 w-4 inline mr-1" /> Inactive</>}
          </button>
          <button onClick={() => handleAction("toggle-featured")}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${product.isFeatured ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}>
            <Star className="h-4 w-4 inline mr-1" /> {product.isFeatured ? "Featured" : "Feature"}
          </button>
          <button onClick={() => { if (confirm("Delete this product?")) handleAction("delete"); }}
            className="px-3 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
            <Trash2 className="h-4 w-4 inline mr-1" /> Delete
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button key={s.key} onClick={() => setActiveSection(s.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeSection === s.key ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:text-white"
            }`}>
            <s.icon className="h-3.5 w-3.5" /> {s.label}
          </button>
        ))}
      </div>

      {/* Details Section */}
      {activeSection === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Product Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-500">Name</p><p className="text-sm text-white">{product.name}</p></div>
                <div><p className="text-xs text-slate-500">Slug</p><p className="text-sm text-white font-mono">{product.slug}</p></div>
                <div><p className="text-xs text-slate-500">Type</p><p className="text-sm text-white">{product.type}</p></div>
                <div><p className="text-xs text-slate-500">Status</p><p className="text-sm text-white">{product.status}</p></div>
                <div><p className="text-xs text-slate-500">Category</p><p className="text-sm text-white">{product.category?.name ?? "—"}</p></div>
                <div><p className="text-xs text-slate-500">Subcategory</p><p className="text-sm text-white">{product.subcategory?.name ?? "—"}</p></div>
                <div><p className="text-xs text-slate-500">Brand</p><p className="text-sm text-white">{product.brand?.name ?? "—"}</p></div>
                <div><p className="text-xs text-slate-500">Created</p><p className="text-sm text-white">{formatDate(product.createdAt)}</p></div>
              </div>
              {product.description && (
                <div className="mt-4"><p className="text-xs text-slate-500 mb-1">Description</p>
                  <p className="text-sm text-white whitespace-pre-wrap">{product.description}</p></div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
              <h2 className="text-sm font-medium text-slate-400 mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm text-slate-400">Views</span><span className="text-sm text-white font-medium">{product.viewCount}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-slate-400">Sales</span><span className="text-sm text-white font-medium">{product.salesCount}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-slate-400">Rating</span><span className="text-sm text-white font-medium">{product.rating > 0 ? `${product.rating.toFixed(1)} (${product.reviewCount})` : "—"}</span></div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
              <h2 className="text-sm font-medium text-slate-400 mb-3">Quick Price</h2>
              <p className="text-2xl font-bold text-white mb-1">{formatPrice(product.price)}</p>
              {product.compareAtPrice && <p className="text-sm text-slate-500 line-through">{formatPrice(product.compareAtPrice)}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Pricing Section */}
      {activeSection === "pricing" && (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Pricing Management</h2>
            {!editingPrice ? (
              <button onClick={() => setEditingPrice(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-500 text-sm hover:bg-amber-500/20 transition-colors">
                <Edit className="h-4 w-4" /> Edit Pricing
              </button>
            ) : (
              <button onClick={handleSavePricing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 text-green-500 text-sm hover:bg-green-500/20 transition-colors">
                <Save className="h-4 w-4" /> Save
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Sale Price (cents)</label>
              {editingPrice ? (
                <input type="number" value={priceForm.price} onChange={(e) => setPriceForm({ ...priceForm, price: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500" />
              ) : <p className="text-xl font-bold text-white">{formatPrice(product.price)}</p>}
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Compare At Price (cents)</label>
              {editingPrice ? (
                <input type="number" value={priceForm.compareAtPrice} onChange={(e) => setPriceForm({ ...priceForm, compareAtPrice: e.target.value })}
                  placeholder="Optional" className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500" />
              ) : <p className="text-xl font-bold text-white">{product.compareAtPrice ? formatPrice(product.compareAtPrice) : "—"}</p>}
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Cost Price (cents)</label>
              {editingPrice ? (
                <input type="number" value={priceForm.costPrice} onChange={(e) => setPriceForm({ ...priceForm, costPrice: e.target.value })}
                  placeholder="Optional" className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500" />
              ) : <p className="text-xl font-bold text-white">{product.costPrice ? formatPrice(product.costPrice) : "—"}</p>}
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Tax Rate (%)</label>
              {editingPrice ? (
                <input type="number" step="0.1" value={priceForm.taxRate} onChange={(e) => setPriceForm({ ...priceForm, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500" />
              ) : <p className="text-xl font-bold text-white">{product.taxRate}%</p>}
            </div>
          </div>

          {product.costPrice && product.price && (
            <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700">
              <p className="text-xs text-slate-500">Profit Margin</p>
              <p className="text-lg font-bold text-green-400">
                {(((product.price - product.costPrice) / product.price) * 100).toFixed(1)}%
                <span className="text-sm text-slate-400 ml-2">
                  ({formatPrice(product.price - product.costPrice)} per unit)
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Inventory Section */}
      {activeSection === "inventory" && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Inventory Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                <p className="text-xs text-slate-500">Current Stock</p>
                <p className={`text-3xl font-bold ${product.stockQuantity === 0 ? "text-red-400" : product.stockQuantity <= product.lowStockThreshold ? "text-yellow-400" : "text-white"}`}>
                  {product.stockQuantity}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                <p className="text-xs text-slate-500">Low Stock Threshold</p>
                <p className="text-3xl font-bold text-white">{product.lowStockThreshold}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                <p className="text-xs text-slate-500">Tracking</p>
                <p className="text-sm font-medium text-white">{product.trackInventory ? "Enabled" : "Disabled"}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                <p className="text-xs text-slate-500">Backorders</p>
                <p className="text-sm font-medium text-white">{product.allowBackorder ? "Allowed" : "Disabled"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setStockAdjust((s) => s - 1)} className="p-2 rounded-xl bg-slate-700 text-white hover:bg-slate-600"><Minus className="h-4 w-4" /></button>
                <input type="number" value={stockAdjust} onChange={(e) => setStockAdjust(parseInt(e.target.value) || 0)}
                  className="w-20 text-center px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500" />
                <button onClick={() => setStockAdjust((s) => s + 1)} className="p-2 rounded-xl bg-slate-700 text-white hover:bg-slate-600"><Plus className="h-4 w-4" /></button>
              </div>
              <button onClick={() => { handleAction("update-stock", { quantity: stockAdjust }); setStockAdjust(0); }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors">
                Apply Adjustment
              </button>
              {stockAdjust !== 0 && (
                <span className={`text-sm ${stockAdjust > 0 ? "text-green-400" : "text-red-400"}`}>
                  {stockAdjust > 0 ? `+${stockAdjust}` : stockAdjust} units
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEO Section */}
      {activeSection === "seo" && (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">SEO & Metadata</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Meta Title</label>
              <p className="text-sm text-white">{product.metaTitle || "—"}</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Meta Description</label>
              <p className="text-sm text-white">{product.metaDescription || "—"}</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Tags</label>
              <div className="flex flex-wrap gap-2">
                {(() => { try { return JSON.parse(product.tags); } catch { return []; } })().length === 0 ? (
                  <p className="text-sm text-slate-400">No tags</p>
                ) : (() => { try { return JSON.parse(product.tags); } catch { return []; } })().map((t: string) => (
                  <span key={t} className="px-2 py-1 rounded-lg bg-slate-700 text-xs text-slate-300">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
