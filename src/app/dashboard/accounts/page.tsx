"use client";

import { useEffect, useState } from "react";
import { Globe, Plus, Trash2, ExternalLink, CheckCircle } from "lucide-react";

const API = "https://smtools.online/api";
const PLATFORMS: Record<string, { name: string; color: string; icon: string }> = {
  facebook: { name: "Facebook", color: "#1877F2", icon: "f" },
  instagram: { name: "Instagram", color: "#E4405F", icon: "IG" },
  x: { name: "X", color: "#000000", icon: "X" },
  linkedin: { name: "LinkedIn", color: "#0A66C2", icon: "in" },
  pinterest: { name: "Pinterest", color: "#BD081C", icon: "P" },
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newPlat, setNewPlat] = useState("facebook");
  const [newName, setNewName] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const token = localStorage.getItem("sp_token");
    if (!token) return;
    try {
      const res = await fetch(API + "/accounts", { headers: { Authorization: "Bearer " + token } });
      const data = await res.json();
      setAccounts(Array.isArray(data) ? data : data.accounts || []);
    } catch {}
    setLoading(false);
  }

  async function addAccount() {
    if (!newName.trim()) return;
    const token = localStorage.getItem("sp_token");
    await fetch(API + "/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ platform: newPlat, displayName: newName }),
    });
    setShowAdd(false);
    setNewName("");
    await load();
  }

  async function removeAccount(id: string) {
    if (!confirm("Remove this account?")) return;
    const token = localStorage.getItem("sp_token");
    await fetch(API + "/accounts/" + id, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
    await load();
  }

  const connected = accounts.length;
  const maxAccounts = 5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Connected Accounts</h2>
          <p className="text-sm text-slate-500">{connected} of {maxAccounts} accounts connected</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:opacity-90"
        >
          <Plus size={16} /> Connect Account
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-600">Account Usage</span>
          <span className="font-medium text-slate-900">{connected}/{maxAccounts}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-pink-500 rounded-full transition-all"
            style={{ width: `${(connected / maxAccounts) * 100}%` }}
          />
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Connect Social Account</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(PLATFORMS).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setNewPlat(k)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      newPlat === k ? "border-amber-400 bg-amber-50" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-white text-xs font-bold" style={{ background: v.color }}>
                      {v.icon}
                    </div>
                    <div className="text-[10px] text-slate-600">{v.name}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. My Business Page"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">Cancel</button>
              <button
                onClick={addAccount}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:opacity-90"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accounts List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Globe size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No accounts connected yet</p>
          <p className="text-xs text-slate-300 mt-1">Click &quot;Connect Account&quot; to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accounts.map((a) => {
            const plat = PLATFORMS[a.platform] || { name: a.platform, color: "#888", icon: "?" };
            return (
              <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold" style={{ background: plat.color }}>
                    {plat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{a.displayName || plat.name}</div>
                    <div className="text-xs text-slate-500">{plat.name}</div>
                    {a.followerCount > 0 && (
                      <div className="text-xs text-slate-400 mt-0.5">{a.followerCount.toLocaleString()} followers</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <CheckCircle size={14} className="text-green-500" />
                    <button onClick={() => removeAccount(a.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
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
