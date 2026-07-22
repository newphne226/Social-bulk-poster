"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search, Plus, Eye, Edit, Trash2, Package, Tag, AlertCircle,
  Boxes, DollarSign, BarChart3, Star, Filter,
} from "lucide-react";

interface Product {
  id: string; name: string; slug: string; sku: string | null; type: string; status: string;
  price: number; compareAtPrice: number | null; stockQuantity: number; trackInventory: boolean;
  salesCount: number; viewCount: number; rating: number; reviewCount: number;
  isActive: boolean; isFeatured: boolean; imageUrl: string | null;
  category: { id: string; name: string } | null;
  brand: { id: string; name: string } | null;
  createdAt: string;
}

const typeTabs = [
  { key: "", label: "All Products" },
  { key: "PHYSICAL", label: "Physical" },
  { key: "DIGITAL", label: "Digital" },
  { key: "SERVICE", label: "Services" },
  { key: "SUBSCRIPTION", label: "Subscriptions" },
  { key: "BUNDLE", label: "Bundles" },
];

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [activeType, setActiveType] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const fetchProducts = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) { window.location.replace("/admin/login"); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (activeType) params.set("type", activeType);
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/products?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProducts(data.products ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }, [page, activeType, statusFilter, search]);

  React.useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This can be undone later.`)) return;
    const token = localStorage.getItem("sp_admin_token");
    await fetch(`/api/admin/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchProducts();
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Products & Services</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{total} total products</p>
        </div>
        <button onClick={() => router.push("/admin/products/new")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {typeTabs.map((tab) => (
          <button key={tab.key} onClick={() => { setActiveType(tab.key); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeType === tab.key
                ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:text-gray-900 dark:hover:text-white"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -trangray-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
          <button onClick={fetchProducts} className="ml-auto underline hover:text-red-300">Retry</button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
              onClick={() => router.push(`/admin/products/${p.id}`)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-1">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${
                    p.type === "PHYSICAL" ? "bg-blue-500/10 text-blue-400" :
                    p.type === "DIGITAL" ? "bg-purple-500/10 text-purple-400" :
                    p.type === "SERVICE" ? "bg-green-500/10 text-green-400" :
                    p.type === "SUBSCRIPTION" ? "bg-amber-500/10 text-amber-400" :
                    "bg-pink-500/10 text-pink-400"
                  }`}>{p.type}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${
                    p.status === "ACTIVE" ? "bg-green-500/10 text-green-400" :
                    p.status === "DRAFT" ? "bg-gray-200/50 dark:bg-gray-600/50 text-gray-600 dark:text-gray-300" :
                    p.status === "ARCHIVED" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>{p.status}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id, p.name); }}
                  className="p-1 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  {p.imageUrl ? <img src={p.imageUrl} alt="" className="h-12 w-12 rounded-xl object-cover" /> :
                    <Package className="h-6 w-6 text-gray-500 dark:text-gray-400" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.name}</p>
                  {p.sku && <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{p.sku}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(p.price)}</p>
                  {p.compareAtPrice && <p className="text-xs text-gray-500 dark:text-gray-400 line-through">{formatPrice(p.compareAtPrice)}</p>}
                </div>
                {p.trackInventory && (
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    p.stockQuantity === 0 ? "bg-red-500/10 text-red-400" :
                    p.stockQuantity <= 5 ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-green-500/10 text-green-400"
                  }`}>{p.stockQuantity} in stock</span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-3">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" /> {p.rating > 0 ? p.rating.toFixed(1) : "—"}
                  <span>({p.reviewCount})</span>
                </div>
                <span>{p.salesCount} sales</span>
                {p.category && <span className="truncate ml-2">{p.category.name}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Showing {products.length === 0 ? 0 : (page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</p>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm disabled:opacity-50">Previous</button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
