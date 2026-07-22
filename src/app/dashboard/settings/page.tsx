"use client";

import { useEffect, useState } from "react";
import { User, Shield, Bell, Trash2, Save } from "lucide-react";

const API = "/api";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("sp_user");
    if (u) {
      try {
        const parsed = JSON.parse(u);
        setUser(parsed);
        setName(parsed.name || "");
        setEmail(parsed.email || "");
      } catch {}
    }
  }, []);

  async function saveProfile() {
    setSaving(true);
    setMsg("");
    const token = localStorage.getItem("sp_token");
    try {
      await fetch(API + "/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ name, timezone }),
      });
      const updated = { ...user, name, timezone };
      localStorage.setItem("sp_user", JSON.stringify(updated));
      setUser(updated);
      setMsg("Profile updated!");
    } catch {
      setMsg("Failed to update profile");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account settings</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-slate-600 dark:text-slate-400" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Profile</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-900/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-sm"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-400"
            >
              <option value="Asia/Dhaka">Asia/Dhaka (UTC+6)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (UTC-8)</option>
            </select>
          </div>
          {msg && <p className={`text-sm ${msg.includes("Failed") ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>{msg}</p>}
          <button
            onClick={saveProfile}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-slate-600 dark:text-slate-400" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Security</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">Password</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Last changed: Unknown</div>
            </div>
            <button className="px-3 py-1.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg font-medium">
              Change
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">Two-Factor Auth</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Add an extra layer of security</div>
            </div>
            <button className="px-3 py-1.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg font-medium">
              Enable
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900/40 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 size={18} className="text-red-500 dark:text-red-400" />
          <h3 className="text-base font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
