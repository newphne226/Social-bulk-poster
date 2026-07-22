"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar, Trash2, Pause, Play, Pencil } from "lucide-react";
import EditPostModal from "@/components/edit-post-modal";

const API = "/api";
const PLATFORMS: Record<string, { name: string; color: string }> = {
  facebook: { name: "Facebook", color: "#1877F2" },
  instagram: { name: "Instagram", color: "#E4405F" },
  x: { name: "X", color: "#000000" },
  linkedin: { name: "LinkedIn", color: "#0A66C2" },
  pinterest: { name: "Pinterest", color: "#BD081C" },
};

export default function SchedulePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const token = localStorage.getItem("sp_token");
    if (!token) return;
    try {
      const res = await fetch(API + "/posts", { headers: { Authorization: "Bearer " + token }, cache: "no-store" });
      if (!res.ok) { setLoading(false); return; }
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      const all = Array.isArray(data) ? data : data.posts || [];
      setPosts(all.filter((p: any) => p.status === "SCHEDULED" || p.status === "QUEUED").sort((a: any, b: any) => new Date(a.scheduledAt || 0) - new Date(b.scheduledAt || 0)));
    } catch {}
    setLoading(false);
  }

  async function togglePause() {
    const token = localStorage.getItem("sp_token");
    await fetch(API + "/schedule/pause", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ paused: !paused }),
    });
    setPaused(!paused);
  }

  const statusColors: Record<string, string> = {
    SCHEDULED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    QUEUED: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Schedule Queue</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{posts.length} posts in queue</p>
        </div>
        <button
          onClick={togglePause}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            paused
              ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60"
              : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60"
          }`}
        >
          {paused ? <><Play size={16} /> Resume</> : <><Pause size={16} /> Pause</>}
        </button>
      </div>

      {paused && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-300">
          Scheduling is paused. Resume to continue publishing.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <Clock size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No posts in queue</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => {
            const plat = PLATFORMS[p.platform] || { name: p.platform, color: "#888" };
            const time = p.scheduledAt ? new Date(p.scheduledAt) : null;
            return (
              <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: plat.color }}>
                    {p.platform?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 dark:text-white line-clamp-2">{p.caption || "No caption"}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[p.status] || ""}`}>
                        {p.status}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{plat.name}</span>
                    </div>
                  </div>
                  {time && (
                    <div className="text-right shrink-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{time.toLocaleDateString()}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  )}
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => setEditingPost(p)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors" title="Edit">
                      <Pencil size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingPost && (
        <EditPostModal
          post={{
            id: editingPost.id,
            caption: editingPost.caption || "",
            platform: editingPost.platform || "facebook",
            accountId: editingPost.accountId || "",
            status: editingPost.status || "SCHEDULED",
            type: editingPost.type || "TEXT",
            scheduledAt: editingPost.scheduledAt || null,
            mediaUrls: editingPost.mediaUrls || [],
            hashtags: editingPost.hashtags || [],
            mentions: editingPost.mentions || [],
            tags: editingPost.tags || [],
            retryCount: editingPost.retryCount,
            failureReason: editingPost.failureReason,
          }}
          onClose={() => setEditingPost(null)}
          onSaved={() => { setEditingPost(null); load(); }}
        />
      )}
    </div>
  );
}
