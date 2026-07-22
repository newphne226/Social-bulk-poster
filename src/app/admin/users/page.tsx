"use client";

import * as React from "react";
import { Search, AlertCircle, Edit3, X, Save, Crown, Check } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  approvalStatus: string;
  plan: string;
  postsCount: number;
  accountsCount: number;
  createdAt: string;
  lastLoginAt: string | null;
}

interface SubRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  cycle: string;
  amountUsd: number;
  status: string;
  paymentStatus: string;
  paymentConfirmed: boolean;
  adminNote: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400",
  SUSPENDED: "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  BANNED: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400",
};

const APPROVAL_COLORS: Record<string, string> = {
  APPROVED: "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400",
  PENDING: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
  REJECTED: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400",
};

const PLAN_COLORS: Record<string, string> = {
  PRO: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
  SILVER: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400",
  BASIC: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
  FREE: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
};

const REQ_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
  APPROVED: "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400",
  REJECTED: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400",
};

const PAY_STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400",
  PENDING: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
  CONFIRMING: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
  EXPIRED: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400",
  FAILED: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400",
  UNKNOWN: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
};

export default function AdminUsersPage() {
  const [tab, setTab] = React.useState<"users" | "subscriptions">("users");
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

  const [subRequests, setSubRequests] = React.useState<SubRequest[]>([]);
  const [subTotal, setSubTotal] = React.useState(0);
  const [subPage, setSubPage] = React.useState(1);
  const [subTotalPages, setSubTotalPages] = React.useState(1);
  const [subStatusFilter, setSubStatusFilter] = React.useState("PENDING");
  const [subLoading, setSubLoading] = React.useState(true);
  const [subError, setSubError] = React.useState("");
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const [formStatus, setFormStatus] = React.useState("ACTIVE");
  const [formApproval, setFormApproval] = React.useState("APPROVED");
  const [formRole, setFormRole] = React.useState("USER");
  const [formPlan, setFormPlan] = React.useState("FREE");

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

  const fetchSubRequests = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) return;

    setSubLoading(true);
    setSubError("");
    try {
      const params = new URLSearchParams({ page: String(subPage), limit: "20" });
      if (subStatusFilter) params.set("status", subStatusFilter);

      const res = await fetch(`/api/admin/subscription-requests?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setSubRequests(data.requests ?? []);
      setSubTotal(data.total ?? 0);
      setSubTotalPages(data.totalPages ?? 1);
    } catch (err: any) {
      setSubError(err.message || "Failed to load requests");
    } finally {
      setSubLoading(false);
    }
  }, [subPage, subStatusFilter]);

  React.useEffect(() => {
    if (tab === "users") fetchUsers();
    else fetchSubRequests();
  }, [tab, fetchUsers, fetchSubRequests]);

  const handleSubAction = async (requestId: string, action: "approve" | "reject") => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) return;

    setProcessingId(requestId);
    try {
      const res = await fetch("/api/admin/subscription-requests", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchSubRequests();
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to process");
    } finally {
      setProcessingId(null);
    }
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setFormStatus(user.status);
    setFormApproval(user.approvalStatus);
    setFormRole(user.role);
    setFormPlan(user.plan || "FREE");
  };

  const handleSave = async () => {
    if (!editUser) return;
    const token = localStorage.getItem("sp_admin_token");
    if (!token) return;

    setSaving(true);
    try {
      if (formStatus !== editUser.status) {
        const action = formStatus === "ACTIVE" ? "activate" : formStatus === "SUSPENDED" ? "suspend" : "ban";
        const r = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ userId: editUser.id, action }),
        });
        if (!r.ok) { const d = await r.json().catch(() => ({})); throw new Error(d.error || "Failed to update status"); }
      }

      if (formApproval !== editUser.approvalStatus) {
        const action = formApproval === "APPROVED" ? "approve" : formApproval === "REJECTED" ? "reject" : "pending";
        const r = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ userId: editUser.id, action }),
        });
        if (!r.ok) { const d = await r.json().catch(() => ({})); throw new Error(d.error || "Failed to update approval"); }
      }

      if (formRole !== editUser.role) {
        const r = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ userId: editUser.id, action: "setRole", value: formRole }),
        });
        if (!r.ok) { const d = await r.json().catch(() => ({})); throw new Error(d.error || "Failed to update role"); }
      }

      if (formPlan !== (editUser.plan || "FREE")) {
        const r = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ userId: editUser.id, action: "setPlan", value: formPlan }),
        });
        if (!r.ok) { const d = await r.json().catch(() => ({})); throw new Error(d.error || "Failed to update plan"); }
      }

      setEditUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const pendingCount = subRequests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-0">
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            tab === "users"
              ? "border-amber-500 text-amber-700 dark:text-amber-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Users ({total})
        </button>
        <button
          onClick={() => setTab("subscriptions")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            tab === "subscriptions"
              ? "border-amber-500 text-amber-700 dark:text-amber-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Crown className="h-4 w-4" />
          Subscription Requests
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* ─── USERS TAB ─── */}
      {tab === "users" && (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="BANNED">Banned</option>
            </select>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
              <button onClick={fetchUsers} className="ml-auto underline font-medium hover:text-red-800 dark:hover:text-red-300">Retry</button>
            </div>
          )}

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Approval</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Posts</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Joined</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {loading ? (
                    <tr><td colSpan={8} className="px-6 py-12 text-center">
                      <div className="h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No users found</td></tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                              {(user.name ?? user.email).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name ?? "No Name"}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                            user.role === "ADMIN" ? "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }`}>{user.role}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${STATUS_COLORS[user.status] || ""}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${APPROVAL_COLORS[user.approvalStatus] || ""}`}>
                            {user.approvalStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${PLAN_COLORS[user.plan] || PLAN_COLORS.FREE}`}>
                            {user.plan || "FREE"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">{user.postsCount}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openEdit(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/20 text-xs font-semibold transition-colors"
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

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {users.length === 0 ? 0 : (page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total} users
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Previous</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Next</button>
            </div>
          </div>
        </>
      )}

      {/* ─── SUBSCRIPTION REQUESTS TAB ─── */}
      {tab === "subscriptions" && (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={subStatusFilter}
              onChange={(e) => { setSubStatusFilter(e.target.value); setSubPage(1); }}
              className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {subError && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {subError}
              <button onClick={fetchSubRequests} className="ml-auto underline font-medium hover:text-red-800 dark:hover:text-red-300">Retry</button>
            </div>
          )}

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Request</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {subLoading ? (
                    <tr><td colSpan={7} className="px-6 py-12 text-center">
                      <div className="h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </td></tr>
                  ) : subRequests.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No subscription requests</td></tr>
                  ) : (
                    subRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{req.userName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{req.userEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${PLAN_COLORS[req.plan] || PLAN_COLORS.FREE}`}>
                            {req.plan} ({req.cycle})
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">${req.amountUsd}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${PAY_STATUS_COLORS[req.paymentStatus] || PAY_STATUS_COLORS.UNKNOWN}`}>
                            {req.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${REQ_STATUS_COLORS[req.status] || ""}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          {req.status === "PENDING" ? (
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleSubAction(req.id, "reject")}
                                disabled={processingId === req.id}
                                className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 text-xs font-semibold transition-colors disabled:opacity-50"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleSubAction(req.id, "approve")}
                                disabled={processingId === req.id}
                                className="px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/20 text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1"
                              >
                                {processingId === req.id ? (
                                  <div className="h-3 w-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                                Approve
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {req.reviewedAt && `Reviewed ${new Date(req.reviewedAt).toLocaleDateString()}`}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {subRequests.length === 0 ? 0 : (subPage - 1) * 20 + 1}–{Math.min(subPage * 20, subTotal)} of {subTotal} requests
            </p>
            <div className="flex gap-2">
              <button onClick={() => setSubPage((p) => Math.max(1, p - 1))} disabled={subPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Previous</button>
              <button onClick={() => setSubPage((p) => Math.min(subTotalPages, p + 1))} disabled={subPage === subTotalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Next</button>
            </div>
          </div>
        </>
      )}

      {/* ─── EDIT USER MODAL ─── */}
      {editUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditUser(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md p-6 space-y-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit User</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{editUser.email}</p>
              </div>
              <button onClick={() => setEditUser(null)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Account Status</label>
              <div className="grid grid-cols-3 gap-2">
                {["ACTIVE", "SUSPENDED", "BANNED"].map((s) => (
                  <button key={s} onClick={() => setFormStatus(s)}
                    className={`px-3 py-2.5 rounded-lg text-xs font-bold border-2 transition-all ${
                      formStatus === s
                        ? s === "ACTIVE" ? "border-green-500 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400"
                        : s === "SUSPENDED" ? "border-yellow-500 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                        : "border-red-500 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}>{s}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Approval Status</label>
              <div className="grid grid-cols-3 gap-2">
                {["APPROVED", "PENDING", "REJECTED"].map((s) => (
                  <button key={s} onClick={() => setFormApproval(s)}
                    className={`px-3 py-2.5 rounded-lg text-xs font-bold border-2 transition-all ${
                      formApproval === s
                        ? s === "APPROVED" ? "border-green-500 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400"
                        : s === "PENDING" ? "border-amber-500 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "border-red-500 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}>{s}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {["USER", "ADMIN"].map((r) => (
                  <button key={r} onClick={() => setFormRole(r)}
                    className={`px-3 py-2.5 rounded-lg text-xs font-bold border-2 transition-all ${
                      formRole === r
                        ? r === "ADMIN" ? "border-amber-500 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "border-blue-500 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}>{r}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Membership Plan</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "FREE", label: "Free" },
                  { id: "BASIC", label: "Basic ($3)" },
                  { id: "SILVER", label: "Silver ($5)" },
                  { id: "PRO", label: "Pro ($10)" },
                ].map((p) => (
                  <button key={p.id} onClick={() => setFormPlan(p.id)}
                    className={`px-3 py-2.5 rounded-lg text-xs font-bold border-2 transition-all ${
                      formPlan === p.id
                        ? p.id === "PRO" ? "border-amber-500 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : p.id === "SILVER" ? "border-purple-500 bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400"
                        : p.id === "BASIC" ? "border-blue-500 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                        : "border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}>{p.label}</button>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div>Posts: {editUser.postsCount} | Accounts: {editUser.accountsCount}</div>
              <div>Joined: {new Date(editUser.createdAt).toLocaleDateString()}</div>
              {editUser.lastLoginAt && <div>Last login: {new Date(editUser.lastLoginAt).toLocaleDateString()}</div>}
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setEditUser(null)}
                className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-opacity">
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
