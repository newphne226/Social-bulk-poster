"use client";

import * as React from "react";
import { Search, Ban, CheckCircle, Shield, UserMinus, AlertCircle } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  plan: string;
  postsCount: number;
  accountsCount: number;
  createdAt: string;
  lastLoginAt: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const fetchUsers = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) {
      window.location.replace("/admin/login");
      return;
    }

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

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAction = async (userId: string, action: string) => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) return;

    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, action }),
    });
    fetchUsers();
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

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Posts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">No users found</td>
                </tr>
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
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        user.status === "ACTIVE" ? "bg-green-500/10 text-green-500" :
                        user.status === "SUSPENDED" ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-red-500/10 text-red-500"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{user.plan}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{user.postsCount}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === "ACTIVE" ? (
                          <button
                            onClick={() => handleAction(user.id, "suspend")}
                            className="p-1.5 rounded-lg text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                            title="Suspend"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(user.id, "activate")}
                            className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors"
                            title="Activate"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {user.role === "USER" ? (
                          <button
                            onClick={() => handleAction(user.id, "promote")}
                            className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors"
                            title="Promote to Admin"
                          >
                            <Shield className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(user.id, "demote")}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-500/10 transition-colors"
                            title="Demote to User"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleAction(user.id, "ban")}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Ban"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing {users.length === 0 ? 0 : (page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total} users
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
