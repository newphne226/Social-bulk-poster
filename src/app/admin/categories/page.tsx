"use client";

import * as React from "react";
import {
  Search, Plus, Edit, Trash2, FolderTree, AlertCircle, ChevronDown, ChevronRight,
} from "lucide-react";

interface Subcategory {
  id: string; name: string; slug: string; sortOrder: number; isActive: boolean;
  _count: { products: number };
}

interface Category {
  id: string; name: string; slug: string; description: string | null; sortOrder: number; isActive: boolean;
  subcategories: Subcategory[];
  _count: { products: number; subcategories: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [editCat, setEditCat] = React.useState<Category | null>(null);
  const [form, setForm] = React.useState({ name: "", description: "" });
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [subForm, setSubForm] = React.useState({ categoryId: "", name: "" });
  const [showSubForm, setShowSubForm] = React.useState(false);

  const fetchCategories = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) { window.location.replace("/admin/login"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCategories(data.categories ?? []);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleSaveCategory = async () => {
    const token = localStorage.getItem("sp_admin_token");
    const method = editCat ? "PATCH" : "POST";
    const url = editCat ? `/api/admin/categories/${editCat.id}` : "/api/admin/categories";
    await fetch(url, {
      method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false); setEditCat(null); setForm({ name: "", description: "" });
    fetchCategories();
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    const token = localStorage.getItem("sp_admin_token");
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) { alert(data.error); return; }
    fetchCategories();
  };

  const handleSaveSubcategory = async () => {
    const token = localStorage.getItem("sp_admin_token");
    await fetch("/api/admin/subcategories", {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(subForm),
    });
    setShowSubForm(false); setSubForm({ categoryId: "", name: "" });
    fetchCategories();
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm("Delete this subcategory?")) return;
    const token = localStorage.getItem("sp_admin_token");
    await fetch(`/api/admin/subcategories/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Categories & Subcategories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{categories.length} categories</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowSubForm(true); setShowForm(false); setEditCat(null); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Plus className="h-4 w-4" /> Add Subcategory
          </button>
          <button onClick={() => { setShowForm(true); setShowSubForm(false); setEditCat(null); setForm({ name: "", description: "" }); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors">
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error}</div>}

      {/* Add/Edit Category Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-amber-500/30 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{editCat ? "Edit Category" : "New Category"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSaveCategory} disabled={!form.name.trim()}
              className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors">Save</button>
            <button onClick={() => { setShowForm(false); setEditCat(null); }}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Add Subcategory Form */}
      {showSubForm && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-amber-500/30 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">New Subcategory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Category *</label>
              <select value={subForm.categoryId} onChange={(e) => setSubForm({ ...subForm, categoryId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Name *</label>
              <input type="text" value={subForm.name} onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSaveSubcategory} disabled={!subForm.name.trim() || !subForm.categoryId}
              className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors">Save</button>
            <button onClick={() => setShowSubForm(false)}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">No categories yet. Create one to get started.</div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setExpandedId(expandedId === cat.id ? null : cat.id)}>
                <button className="text-gray-500 dark:text-gray-400">
                  {expandedId === cat.id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </button>
                <FolderTree className="h-5 w-5 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{cat.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{cat._count.products} products • {cat._count.subcategories} subcategories</p>
                </div>
                <span className={`px-2 py-0.5 rounded-lg text-xs ${cat.isActive ? "bg-green-500/10 text-green-400" : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}>
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
                <button onClick={(e) => { e.stopPropagation(); setEditCat(cat); setForm({ name: cat.name, description: cat.description || "" }); setShowForm(true); }}
                  className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-amber-400 hover:bg-amber-500/10"><Edit className="h-4 w-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id, cat.name); }}
                  className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>
              </div>
              {expandedId === cat.id && cat.subcategories.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-800 px-12 py-3 space-y-2">
                  {cat.subcategories.map((sub) => (
                    <div key={sub.id} className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                      <span className="text-sm text-gray-900 dark:text-white flex-1">{sub.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{sub._count.products} products</span>
                      <button onClick={() => handleDeleteSubcategory(sub.id)}
                        className="p-1 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
