"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Globe, Trash2, CheckCircle, ExternalLink, Lock } from "lucide-react";

const API = "https://smtools.online/api";

const PLATFORMS: Record<string, { name: string; color: string; icon: string; available: boolean; description: string }> = {
  linkedin: { name: "LinkedIn", color: "#0A66C2", icon: "in", available: true, description: "Connect LinkedIn to schedule posts and updates" },
  facebook: { name: "Facebook", color: "#1877F2", icon: "f", available: false, description: "Coming soon — Facebook Pages scheduling" },
  instagram: { name: "Instagram", color: "#E4405F", icon: "IG", available: false, description: "Coming soon — Instagram scheduling" },
  x: { name: "X (Twitter)", color: "#000000", icon: "X", available: false, description: "Coming soon — X/Twitter scheduling" },
  pinterest: { name: "Pinterest", color: "#BD081C", icon: "P", available: false, description: "Coming soon — Pinterest scheduling" },
};

export default function AccountsPage() {
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  useEffect(() => {
    load();
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (success) {
      setToast({ msg: `${success.replace("_", " ")} successfully!`, type: "ok" });
      window.history.replaceState({}, "", "/dashboard/accounts");
    }
    if (error) {
      setToast({ msg: `Connection failed: ${error}`, type: "err" });
      window.history.replaceState({}, "", "/dashboard/accounts");
    }
  }, [searchParams]);

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

  function connectPlatform(platform: string) {
    const token = localStorage.getItem("sp_token");
    if (!token) {
      window.location.href = "/signin";
      return;
    }
    setConnecting(true);
    window.location.href = `${API}/accounts/${platform}?token=${token}`;
  }

  async function removeAccount(id: string) {
    if (!confirm("Remove this connected account?")) return;
    const token = localStorage.getItem("sp_token");
    await fetch(API + "/accounts/" + id, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
    await load();
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg cursor-pointer ${
            toast.type === "ok" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
          onClick={() => setToast(null)}
        >
          {toast.msg}
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-slate-900">Connected Accounts</h2>
        <p className="text-sm text-slate-500">Connect your social media accounts to schedule posts</p>
      </div>

      {/* Available Platforms */}
      {Object.entries(PLATFORMS)
        .filter(([, v]) => v.available)
        .map(([k, v]) => {
          const connected = accounts.filter((a) => a.platform === k);
          return (
            <div key={k} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0"
                  style={{ background: v.color }}
                >
                  {v.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-900">{v.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{v.description}</p>

                  {connected.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {connected.map((a) => (
                        <div key={a.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <CheckCircle size={16} className="text-green-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate">{a.displayName}</div>
                            <div className="text-xs text-slate-400">Connected</div>
                          </div>
                          <button
                            onClick={() => removeAccount(a.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => connectPlatform(k)}
                    disabled={connecting}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
                    style={{ background: v.color }}
                  >
                    {connecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Connecting...
                      </>
                    ) : connected.length > 0 ? (
                      <>
                        <ExternalLink size={16} /> Add Another Account
                      </>
                    ) : (
                      <>
                        <ExternalLink size={16} /> Connect with {v.name}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

      {/* Coming Soon Platforms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(PLATFORMS)
          .filter(([, v]) => !v.available)
          .map(([k, v]) => (
            <div key={k} className="bg-white rounded-xl border border-slate-200 p-4 opacity-60">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                  style={{ background: v.color }}
                >
                  {v.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-slate-900">{v.name}</div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase">
                      Coming Soon
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{v.description}</div>
                </div>
                <Lock size={16} className="text-slate-300 shrink-0" />
              </div>
            </div>
          ))}
      </div>

      {!loading && accounts.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Globe size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No accounts connected yet</p>
          <p className="text-xs text-slate-300 mt-1">Click &quot;Connect with LinkedIn&quot; above to get started</p>
        </div>
      )}
    </div>
  );
}
