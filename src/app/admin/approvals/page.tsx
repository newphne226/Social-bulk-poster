"use client";

import * as React from "react";
import {
  Search, CheckCircle, XCircle, AlertCircle, Clock, Users, UserCheck,
  UserX, Eye, Mail, Calendar,
} from "lucide-react";

interface ApprovalUser {
  id: string; name: string | null; email: string; avatarUrl: string | null;
  approvalStatus: string; approvedAt: string | null; rejectedAt: string | null;
  rejectedReason: string | null; createdAt: string; lastLoginAt: string | null;
  plan: string; postsCount: number; accountsCount: number;
}

const tabs = [
  { key: "pending", label: "Pending Approval", icon: Clock },
  { key: "approved", label: "Approved", icon: CheckCircle },
  { key: "rejected", label: "Rejected", icon: XCircle },
  { key: "", label: "All Users", icon: Users },
];

export default function ApprovalsPage() {
  const [users, setUsers] = React.useState<ApprovalUser[]>([]);
  const [stats, setStats] = React.useState({ pendingCount: 0, approvedCount: 0, rejectedCount: 0 });
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState("pending");
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [rejectModal, setRejectModal] = React.useState<ApprovalUser | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");

  const fetchUsers = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) { window.location.replace("/admin/login"); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (activeTab) params.set("tab", activeTab);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/approvals?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setStats(data.stats ?? { pendingCount: 0, approvedCount: 0, rejectedCount: 0 });
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }, [page, activeTab, search]);

  React.useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    const token = localStorage.getItem("sp_admin_token");
    await fetch(`/api/admin/approvals/${userId}`, {
      method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    });
    setActionLoading(null);
    fetchUsers();
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal.id);
    const token = localStorage.getItem("sp_admin_token");
    await fetch(`/api/admin/approvals/${rejectModal.id}`, {
      method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", reason: rejectReason }),
    });
    setActionLoading(null);
    setRejectModal(null);
    setRejectReason("");
    fetchUsers();
  };

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Approvals</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Review and approve new user registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center"><Clock className="h-5 w-5 text-yellow-500" /></div>
            <div><p className="text-xs text-gray-500 dark:text-gray-400">Pending</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingCount}</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-500" /></div>
            <div><p className="text-xs text-gray-500 dark:text-gray-400">Approved</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approvedCount}</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center"><XCircle className="h-5 w-5 text-red-500" /></div>
            <div><p className="text-xs text-gray-500 dark:text-gray-400">Rejected</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejectedCount}</p></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setPage(1); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:text-gray-900 dark:hover:text-white"
            }`}>
            <tab.icon className="h-3.5 w-3.5" /> {tab.label}
            {tab.key === "pending" && stats.pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-yellow-500 text-[10px] font-bold text-black">{stats.pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -trangray-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
      </div>

      {error && <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error}</div>}

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {activeTab === "pending" ? "No users pending approval" : "No users found"}
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className={`bg-white dark:bg-gray-900 rounded-2xl border p-5 transition-colors ${
              u.approvalStatus === "PENDING" ? "border-yellow-500/30" : "border-gray-200 dark:border-gray-800"
            }`}>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {(u.name ?? u.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{u.name ?? "No Name"}</p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      u.approvalStatus === "PENDING" ? "bg-yellow-500/10 text-yellow-400" :
                      u.approvalStatus === "APPROVED" ? "bg-green-500/10 text-green-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>{u.approvalStatus}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300">{u.plan}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{u.email}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Registered: {formatDate(u.createdAt)}</span>
                    <span>Last Login: {formatDate(u.lastLoginAt)}</span>
                    <span>{u.postsCount} posts</span>
                    <span>{u.accountsCount} accounts</span>
                  </div>
                  {u.rejectedReason && (
                    <p className="mt-2 text-xs text-red-400">Reason: {u.rejectedReason}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {u.approvalStatus === "PENDING" && (
                    <>
                      <button onClick={() => handleApprove(u.id)} disabled={actionLoading === u.id}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 text-green-500 text-xs font-medium hover:bg-green-500/20 disabled:opacity-50 transition-colors">
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button onClick={() => { setRejectModal(u); setRejectReason(""); }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-medium hover:bg-red-500/20 transition-colors">
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </>
                  )}
                  {u.approvalStatus === "APPROVED" && (
                    <button onClick={() => { setRejectModal(u); setRejectReason(""); }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-medium hover:bg-red-500/20 transition-colors">
                      <XCircle className="h-3.5 w-3.5" /> Revoke
                    </button>
                  )}
                  {u.approvalStatus === "REJECTED" && (
                    <button onClick={() => handleApprove(u.id)} disabled={actionLoading === u.id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 text-green-500 text-xs font-medium hover:bg-green-500/20 disabled:opacity-50 transition-colors">
                      <CheckCircle className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Showing {users.length === 0 ? 0 : (page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</p>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm disabled:opacity-50">Previous</button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm disabled:opacity-50">Next</button>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setRejectModal(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {rejectModal.approvalStatus === "PENDING" ? "Reject User" : "Revoke Approval"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {rejectModal.name ?? rejectModal.email}
            </p>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Reason (optional)</label>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3}
                placeholder="Reason for rejection..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 resize-none" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleReject} disabled={actionLoading === rejectModal.id}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors">
                {actionLoading === rejectModal.id ? "Processing..." : "Confirm Reject"}
              </button>
              <button onClick={() => setRejectModal(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
