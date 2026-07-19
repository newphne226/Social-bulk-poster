"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, Trash2, RefreshCw, Calendar, FileText } from "lucide-react";

const API = "https://smtools.online/api";
const PLATFORMS: Record<string, { name: string; color: string }> = {
  facebook: { name: "Facebook", color: "#1877F2" },
  instagram: { name: "Instagram", color: "#E4405F" },
  x: { name: "X", color: "#000000" },
  linkedin: { name: "LinkedIn", color: "#0A66C2" },
  pinterest: { name: "Pinterest", color: "#BD081C" },
};

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ caption: "", platform: "facebook", accountId: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const token = localStorage.getItem("sp_token");
    if (!token) return;
    const h = { Authorization: "Bearer " + token };
    try {
      const [pRes, aRes] = await Promise.all([
        fetch(API + "/posts", { headers: h }).then(r => r.json()).catch(() => []),
        fetch(API + "/accounts", { headers: h }).then(r => r.json()).catch(() => []),
      ]);
      setPosts(Array.isArray(pRes) ? pRes : pRes.posts || []);
      setAccounts(Array.isArray(aRes) ? aRes : aRes.accounts || []);
    } catch {}
    setLoading(false);
  }

  async function createPost() {
    if (!form.caption.trim()) return;

    // Check subscription
    const sub = JSON.parse(localStorage.getItem("sp_subscription") || "{}");
    if (sub.plan === "FREE" || !sub.plan) {
      window.location.href = "/dashboard/billing";
      return;
    }

    setCreating(true);
    const token = localStorage.getItem("sp_token");
    try {
      await fetch(API + "/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ ...form, status: "SCHEDULED" }),
      });
      setShowCreate(false);
      setForm({ caption: "", platform: "facebook", accountId: "" });
      await load();
    } catch {}
    setCreating(false);
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    const token = localStorage.getItem("sp_token");
    await fetch(API + "/posts/" + id, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
    await load();
  }

  const filtered = posts.filter((p) => {
    if (filter !== "ALL" && p.status !== filter) return false;
    if (search && !p.caption?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusColors: Record<string, string> = {
    SCHEDULED: "bg-blue-100 text-blue-700",
    PUBLISHED: "bg-green-100 text-green-700",
    DRAFT: "bg-slate-100 text-slate-600",
    FAILED: "bg-red-100 text-red-700",
    QUEUED: "bg-amber-100 text-amber-700",
  };

  const statusTabs = ["ALL", "SCHEDULED", "PUBLISHED", "DRAFT", "FAILED"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Posts</h2>
          <p className="text-sm text-slate-500">{posts.length} total posts</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {statusTabs.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Create New Post</h3>
            <textarea
              placeholder="What's on your mind?"
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              className="w-full p-3 rounded-lg border border-slate-200 text-sm min-h-[100px] focus:outline-none focus:border-amber-400 resize-y"
            />
            <select
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-sm"
            >
              {Object.entries(PLATFORMS).map(([k, v]) => (
                <option key={k} value={k}>{v.name}</option>
              ))}
            </select>
            {accounts.length > 0 && (
              <select
                value={form.accountId}
                onChange={(e) => setForm({ ...form, accountId: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-sm"
              >
                <option value="">Select account (optional)</option>
                {accounts.map((a: any) => (
                  <option key={a.id} value={a.id}>{a.displayName || a.platform}</option>
                ))}
              </select>
            )}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">Cancel</button>
              <button
                onClick={createPost}
                disabled={creating}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Schedule Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <FileText size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No posts found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const plat = PLATFORMS[p.platform] || { name: p.platform, color: "#888" };
            return (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: plat.color }}
                  >
                    {p.platform?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 line-clamp-2">{p.caption || "No caption"}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[p.status] || ""}`}>
                        {p.status}
                      </span>
                      <span className="text-xs text-slate-400">{plat.name}</span>
                      {p.scheduledAt && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(p.scheduledAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => deletePost(p.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
