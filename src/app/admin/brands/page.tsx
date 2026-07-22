"use client";

import * as React from "react";
import {
  Search, Plus, Edit, Trash2, AlertCircle, Globe,
} from "lucide-react";

interface Brand {
  id: string; name: string; slug: string; description: string | null;
  logoUrl: string | null; website: string | null; isActive: boolean;
  _count: { products: number };
}

export default function BrandsPage() {
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [editBrand, setEditBrand] = React.useState<Brand | null>(null);
  const [form, setForm] = React.useState({ name: "", description: "", website: "", logoUrl: "" });

  const fetchBrands = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) { window.location.replace("/admin/login"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/brands", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBrands(data.brands ?? []);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { fetchBrands(); }, [fetchBrands]);

  const handleSave = async () => {
    const token = localStorage.getItem("sp_admin_token");
    const method = editBrand ? "PATCH" : "POST";
    const url = editBrand ? `/api/admin/brands/${editBrand.id}` : "/api/admin/brands";
    await fetch(url, {
      method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false); setEditBrand(null); setForm({ name: "", description: "", website: "", logoUrl: "" });
    fetchBrands();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete brand "${name}"?`)) return;
    const token = localStorage.getItem("sp_admin_token");
    const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) { alert(data.error); return; }
    fetchBrands();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Brands</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{brands.length} brands</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditBrand(null); setForm({ name: "", description: "", website: "", logoUrl: "" }); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors">
          <Plus className="h-4 w-4" /> Add Brand
        </button>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error}</div>}

      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-amber-500/30 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{editBrand ? "Edit Brand" : "New Brand"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Website</label>
              <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://..." className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 block mb-1">Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 block mb-1">Logo URL</label>
              <input type="url" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                placeholder="https://..." className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} disabled={!form.name.trim()}
              className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors">Save</button>
            <button onClick={() => { setShowForm(false); setEditBrand(null); }}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : brands.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">No brands yet. Create one to get started.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((b) => (
            <div key={b.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  {b.logoUrl ? <img src={b.logoUrl} alt="" className="h-14 w-14 rounded-xl object-cover" /> :
                    <Globe className="h-7 w-7 text-gray-500 dark:text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{b.name}</p>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${b.isActive ? "bg-green-500/10 text-green-400" : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}>
                      {b.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{b._count.products} products</p>
                  {b.website && <p className="text-xs text-blue-400 mt-1 truncate">{b.website}</p>}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { setEditBrand(b); setForm({ name: b.name, description: b.description || "", website: b.website || "", logoUrl: b.logoUrl || "" }); setShowForm(true); }}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Edit className="h-3.5 w-3.5 inline mr-1" /> Edit
                </button>
                <button onClick={() => handleDelete(b.id, b.name)}
                  className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
