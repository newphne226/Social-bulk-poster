"use client";

import * as React from "react";
import { Search, Ban, CheckCircle, Shield, UserMinus, AlertCircle, Edit3, X, Save, Clock } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  approvalStatus: string;
  postsCount: number;
  accountsCount: number;
  createdAt: string;
  lastLoginAt: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-500/10 text-green-500",
  SUSPENDED: "bg-yellow-500/10 text-yellow-500",
  BANNED: "bg-red-500/10 text-red-500",
};

const APPROVAL_COLORS: Record<string, string> = {
  APPROVED: "bg-green-500/10 text-green-500",
  PENDING: "bg-amber-500/10 text-amber-500",
  REJECTED: "bg-red-500/10 text-red-500",
};

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [editUser, setEditUser] = React.useState<User | null>(null);
  const [saving, setSaving] = React.useState(false);

  // Edit form state
  const [formStatus, setFormStatus] = React.useState("ACTIVE");
  const [formApproval, setFormApproval] = React.useState("APPROVED");
  const [formRole, setFormRole] = React.useState("USER");

  const fetchUsers = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) { window.location.replace("/admin/login"); return; }

    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  React.useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openEdit = (user: User) => {
    setEditUser(user);
    setFormStatus(user.status);
    setFormApproval(user.approvalStatus);
    setFormRole(user.role);
  };

  const handleSave = async () => {
    if (!editUser) return;
    const token = localStorage.getItem("sp_admin_token");
    if (!token) return;

    setSaving(true);
    try {
      // Status change
      if (formStatus !== editUser.status) {
        const action = formStatus === "ACTIVE" ? "activate" : formStatus === "SUSPENDED" ? "suspend" : "ban";
        await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ userId: editUser.id, action }),
        });
      }

      // Approval change
      if (formApproval !== editUser.approvalStatus) {
        const action = formApproval === "APPROVED" ? "approve" : formApproval === "REJECTED" ? "reject" : "pending";
        await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ userId: editUser.id, action }),
        });
      }

      // Role change
      if (formRole !== editUser.role) {
        await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ userId: editUser.id, action: "setRole", value: formRole }),
        });
      }

      setEditUser(null);
      fetchUsers();
    } catch {
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BANNED">Banned</option>
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
          <button onClick={fetchUsers} className="ml-auto underline hover:text-red-300">Retry</button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Approval</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Posts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center">
                  <div className="h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                          {(user.name ?? user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.name ?? "No Name"}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        user.role === "ADMIN" ? "bg-amber-500/10 text-amber-500" : "bg-slate-700 text-slate-300"
                      }`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[user.status] || ""}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${APPROVAL_COLORS[user.approvalStatus] || ""}`}>
                        {user.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{user.postsCount}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEdit(user)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-xs font-medium transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing {users.length === 0 ? 0 : (page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total} users
        </p>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm disabled:opacity-50">Previous</button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm disabled:opacity-50">Next</button>
        </div>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditUser(null)}>
          <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Edit User</h3>
                <p className="text-sm text-slate-400">{editUser.email}</p>
              </div>
              <button onClick={() => setEditUser(null)} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Account Status */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Account Status</label>
              <div className="grid grid-cols-3 gap-2">
                {["ACTIVE", "SUSPENDED", "BANNED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFormStatus(s)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                      formStatus === s
                        ? s === "ACTIVE" ? "border-green-500 bg-green-500/10 text-green-500"
                        : s === "SUSPENDED" ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                        : "border-red-500 bg-red-500/10 text-red-500"
                        : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Approval Status */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Approval Status</label>
              <div className="grid grid-cols-3 gap-2">
                {["APPROVED", "PENDING", "REJECTED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFormApproval(s)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                      formApproval === s
                        ? s === "APPROVED" ? "border-green-500 bg-green-500/10 text-green-500"
                        : s === "PENDING" ? "border-amber-500 bg-amber-500/10 text-amber-500"
                        : "border-red-500 bg-red-500/10 text-red-500"
                        : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {["USER", "ADMIN"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFormRole(r)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                      formRole === r
                        ? r === "ADMIN" ? "border-amber-500 bg-amber-500/10 text-amber-500"
                        : "border-blue-500 bg-blue-500/10 text-blue-500"
                        : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-slate-800 rounded-xl p-3 text-xs text-slate-400 space-y-1">
              <div>Posts: {editUser.postsCount} | Accounts: {editUser.accountsCount}</div>
              <div>Joined: {new Date(editUser.createdAt).toLocaleDateString()}</div>
              {editUser.lastLoginAt && <div>Last login: {new Date(editUser.lastLoginAt).toLocaleDateString()}</div>}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setEditUser(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
