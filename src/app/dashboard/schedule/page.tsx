"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar, Trash2, Pause, Play } from "lucide-react";

const API = "https://smtools.online/api";
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

  useEffect(() => { load(); }, []);

  async function load() {
    const token = localStorage.getItem("sp_token");
    if (!token) return;
    try {
      const res = await fetch(API + "/posts", { headers: { Authorization: "Bearer " + token } });
      const data = await res.json();
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
    SCHEDULED: "bg-blue-100 text-blue-700",
    QUEUED: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Schedule Queue</h2>
          <p className="text-sm text-slate-500">{posts.length} posts in queue</p>
        </div>
        <button
          onClick={togglePause}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            paused
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-amber-100 text-amber-700 hover:bg-amber-200"
          }`}
        >
          {paused ? <><Play size={16} /> Resume</> : <><Pause size={16} /> Pause</>}
        </button>
      </div>

      {paused && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          Scheduling is paused. Resume to continue publishing.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Clock size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No posts in queue</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => {
            const plat = PLATFORMS[p.platform] || { name: p.platform, color: "#888" };
            const time = p.scheduledAt ? new Date(p.scheduledAt) : null;
            return (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: plat.color }}>
                    {p.platform?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 line-clamp-2">{p.caption || "No caption"}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[p.status] || ""}`}>
                        {p.status}
                      </span>
                      <span className="text-xs text-slate-400">{plat.name}</span>
                    </div>
                  </div>
                  {time && (
                    <div className="text-right shrink-0">
                      <div className="text-sm font-medium text-slate-900">{time.toLocaleDateString()}</div>
                      <div className="text-xs text-slate-500">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
