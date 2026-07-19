"use client";

import * as React from "react";
import {
  Search, Plus, Edit, Trash2, Tag, AlertCircle, CheckCircle, XCircle,
  Copy, Percent, DollarSign, Calendar, Users, BarChart3, Eye, EyeOff,
  RefreshCw,
} from "lucide-react";

interface Coupon {
  id: string; code: string; name: string | null; description: string | null; type: string;
  percentOff: number | null; amountOff: number | null; currency: string;
  duration: string; durationInMonths: number | null; maxRedemptions: number | null;
  timesRedeemed: number; minPurchase: number | null; maxDiscount: number | null;
  validFrom: string | null; validUntil: string | null; isActive: boolean; isPublic: boolean;
  plan: { name: string } | null; _count: { usages: number }; createdAt: string;
}

interface Stats {
  totalCoupons: number; activeCoupons: number; totalRedemptions: number; totalDiscount: number;
}

const typeTabs = [
  { key: "", label: "All Coupons" },
  { key: "PROMO_CODE", label: "Promo Codes" },
  { key: "CAMPAIGN", label: "Campaigns" },
  { key: "AUTOMATIC", label: "Automatic" },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [activeType, setActiveType] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [editCoupon, setEditCoupon] = React.useState<Coupon | null>(null);
  const [form, setForm] = React.useState({
    code: "", name: "", description: "", type: "PROMO_CODE", percentOff: "", amountOff: "",
    duration: "ONCE", maxRedemptions: "", minPurchase: "", maxDiscount: "",
    validFrom: "", validUntil: "", isPublic: false,
  });
  const [copied, setCopied] = React.useState<string | null>(null);

  const fetchCoupons = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) { window.location.replace("/admin/login"); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (activeType) params.set("type", activeType);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/coupons?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCoupons(data.coupons ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setStats(data.stats ?? null);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }, [page, activeType, search]);

  React.useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const handleSave = async () => {
    const token = localStorage.getItem("sp_admin_token");
    const method = editCoupon ? "PATCH" : "POST";
    const url = editCoupon ? `/api/admin/coupons/${editCoupon.id}` : "/api/admin/coupons";
    const body: any = { ...form };
    if (body.percentOff) body.percentOff = parseInt(body.percentOff); else body.percentOff = null;
    if (body.amountOff) body.amountOff = parseInt(body.amountOff) * 100; else body.amountOff = null;
    if (body.maxRedemptions) body.maxRedemptions = parseInt(body.maxRedemptions); else body.maxRedemptions = null;
    if (body.minPurchase) body.minPurchase = parseInt(body.minPurchase) * 100; else body.minPurchase = null;
    if (body.maxDiscount) body.maxDiscount = parseInt(body.maxDiscount) * 100; else body.maxDiscount = null;

    const res = await fetch(url, {
      method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error); return; }
    setShowForm(false); setEditCoupon(null);
    setForm({ code: "", name: "", description: "", type: "PROMO_CODE", percentOff: "", amountOff: "", duration: "ONCE", maxRedemptions: "", minPurchase: "", maxDiscount: "", validFrom: "", validUntil: "", isPublic: false });
    fetchCoupons();
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    const token = localStorage.getItem("sp_admin_token");
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchCoupons();
  };

  const handleToggle = async (id: string) => {
    const token = localStorage.getItem("sp_admin_token");
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle-active" }),
    });
    fetchCoupons();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const fmt = (cents: number | null) => cents != null ? `$${(cents / 100).toFixed(2)}` : "—";
  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  const isExpired = (c: Coupon) => c.validUntil && new Date(c.validUntil) < new Date();
  const isMaxed = (c: Coupon) => c.maxRedemptions != null && c.timesRedeemed >= c.maxRedemptions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Coupons & Discounts</h1>
          <p className="text-sm text-slate-400">{total} total coupons</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditCoupon(null); setForm({ code: "", name: "", description: "", type: "PROMO_CODE", percentOff: "", amountOff: "", duration: "ONCE", maxRedemptions: "", minPurchase: "", maxDiscount: "", validFrom: "", validUntil: "", isPublic: false }); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors">
          <Plus className="h-4 w-4" /> Create Coupon
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Tag className="h-5 w-5 text-amber-500" /></div>
              <div><p className="text-xs text-slate-500">Total Coupons</p><p className="text-lg font-bold text-white">{stats.totalCoupons}</p></div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-500" /></div>
              <div><p className="text-xs text-slate-500">Active</p><p className="text-lg font-bold text-white">{stats.activeCoupons}</p></div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Users className="h-5 w-5 text-blue-500" /></div>
              <div><p className="text-xs text-slate-500">Total Redemptions</p><p className="text-lg font-bold text-white">{stats.totalRedemptions}</p></div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-purple-500" /></div>
              <div><p className="text-xs text-slate-500">Total Discount Given</p><p className="text-lg font-bold text-white">{fmt(stats.totalDiscount)}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {typeTabs.map((tab) => (
          <button key={tab.key} onClick={() => { setActiveType(tab.key); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeType === tab.key
                ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:text-white"
            }`}>{tab.label}</button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search coupons..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
      </div>

      {error && <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error}</div>}

      {/* Coupon Form */}
      {showForm && (
        <div className="bg-slate-800/50 rounded-2xl border border-amber-500/30 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editCoupon ? "Edit Coupon" : "New Coupon"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Code *</label>
              <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. SAVE20" className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Summer Sale" className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500">
                <option value="PROMO_CODE">Promo Code</option>
                <option value="CAMPAIGN">Campaign</option>
                <option value="AUTOMATIC">Automatic</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Discount (%)</label>
              <input type="number" min="1" max="100" value={form.percentOff} onChange={(e) => setForm({ ...form, percentOff: e.target.value, amountOff: "" })}
                placeholder="e.g. 20" className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Discount ($)</label>
              <input type="number" min="0" step="0.01" value={form.amountOff} onChange={(e) => setForm({ ...form, amountOff: e.target.value, percentOff: "" })}
                placeholder="e.g. 10.00" className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Duration</label>
              <select value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500">
                <option value="ONCE">Once</option>
                <option value="REPEATING">Repeating</option>
                <option value="FOREVER">Forever</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Max Redemptions</label>
              <input type="number" min="1" value={form.maxRedemptions} onChange={(e) => setForm({ ...form, maxRedemptions: e.target.value })}
                placeholder="Unlimited" className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Min Purchase ($)</label>
              <input type="number" min="0" step="0.01" value={form.minPurchase} onChange={(e) => setForm({ ...form, minPurchase: e.target.value })}
                placeholder="No minimum" className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Max Discount ($)</label>
              <input type="number" min="0" step="0.01" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                placeholder="No cap" className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Valid From</label>
              <input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Valid Until</label>
              <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="isPublic" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500" />
              <label htmlFor="isPublic" className="text-sm text-slate-300">Show on website</label>
            </div>
          </div>
          <div className="sm:col-span-2 lg:col-span-3 mt-4">
            <label className="text-xs text-slate-500 block mb-1">Description</label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional description" className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} disabled={!form.code.trim() || (!form.percentOff && !form.amountOff)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors">Save</button>
            <button onClick={() => { setShowForm(false); setEditCoupon(null); }}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm hover:bg-slate-800 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Coupons List */}
      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No coupons found</div>
      ) : (
        <div className="space-y-3">
          {coupons.map((c) => {
            const expired = isExpired(c);
            const maxed = isMaxed(c);
            const disabled = expired || maxed || !c.isActive;
            return (
              <div key={c.id} className={`bg-slate-800/50 rounded-2xl border p-5 transition-colors ${disabled ? "border-slate-800 opacity-60" : "border-slate-700 hover:border-slate-600"}`}>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    {c.percentOff ? <Percent className="h-6 w-6 text-white" /> : <DollarSign className="h-6 w-6 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <button onClick={() => copyCode(c.code)} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 transition-colors">
                        <span className="font-mono text-sm font-bold text-white">{c.code}</span>
                        {copied === c.code ? <CheckCircle className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                      </button>
                      {c.name && <span className="text-sm text-slate-300">{c.name}</span>}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        c.type === "PROMO_CODE" ? "bg-blue-500/10 text-blue-400" :
                        c.type === "CAMPAIGN" ? "bg-purple-500/10 text-purple-400" :
                        "bg-green-500/10 text-green-400"
                      }`}>{c.type.replace("_", " ")}</span>
                      {c.isPublic && <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400">Public</span>}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-lg font-bold text-white">
                        {c.percentOff ? `${c.percentOff}% OFF` : c.amountOff ? `${fmt(c.amountOff)} OFF` : ""}
                      </span>
                      {c.plan && <span className="text-slate-400">Plan: {c.plan.name}</span>}
                      {c.minPurchase && <span className="text-slate-400">Min: {fmt(c.minPurchase)}</span>}
                      {c.maxDiscount && <span className="text-slate-400">Max: {fmt(c.maxDiscount)}</span>}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>{c.timesRedeemed} uses{c.maxRedemptions ? ` / ${c.maxRedemptions} max` : ""}</span>
                      {c.validFrom && <span>From: {formatDate(c.validFrom)}</span>}
                      {c.validUntil && <span>Until: {formatDate(c.validUntil)}</span>}
                      {expired && <span className="text-red-400">Expired</span>}
                      {maxed && <span className="text-yellow-400">Maxed out</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggle(c.id)}
                      className={`p-2 rounded-lg transition-colors ${c.isActive ? "text-green-400 hover:bg-green-500/10" : "text-slate-500 hover:bg-slate-700"}`}
                      title={c.isActive ? "Deactivate" : "Activate"}>
                      {c.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button onClick={() => {
                      setEditCoupon(c);
                      setForm({
                        code: c.code, name: c.name || "", description: c.description || "", type: c.type,
                        percentOff: c.percentOff?.toString() || "", amountOff: c.amountOff ? (c.amountOff / 100).toString() : "",
                        duration: c.duration, maxRedemptions: c.maxRedemptions?.toString() || "",
                        minPurchase: c.minPurchase ? (c.minPurchase / 100).toString() : "",
                        maxDiscount: c.maxDiscount ? (c.maxDiscount / 100).toString() : "",
                        validFrom: c.validFrom ? c.validFrom.split("T")[0] : "",
                        validUntil: c.validUntil ? c.validUntil.split("T")[0] : "",
                        isPublic: c.isPublic,
                      });
                      setShowForm(true);
                    }}
                      className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id, c.code)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">Showing {coupons.length === 0 ? 0 : (page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</p>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm disabled:opacity-50">Previous</button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
