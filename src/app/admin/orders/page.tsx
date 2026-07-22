"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  XCircle,
  RotateCcw,
  Send,
  Loader2,
  ChevronDown,
  Package,
} from "lucide-react";

interface Order {
  id: string;
  caption: string;
  platform: string;
  status: string;
  type: string;
  userName: string;
  accountName: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  failedAt: string | null;
  failureReason: string | null;
  retryCount: number;
  createdAt: string;
}

const statusTabs = [
  { key: "", label: "All Orders", icon: Package },
  { key: "DRAFT", label: "New Orders", icon: FileText },
  { key: "SCHEDULED", label: "Pending Orders", icon: Clock },
  { key: "QUEUED", label: "Confirmed Orders", icon: CheckCircle },
  { key: "PUBLISHING", label: "Processing Orders", icon: Loader2 },
  { key: "PUBLISHED", label: "Completed Orders", icon: CheckCircle },
  { key: "CANCELED", label: "Cancelled Orders", icon: XCircle },
  { key: "FAILED", label: "Failed Orders", icon: AlertCircle },
  { key: "PAUSED", label: "Paused Orders", icon: Clock },
];

const platformColors: Record<string, string> = {
  facebook: "bg-blue-500/10 text-blue-500",
  instagram: "bg-pink-500/10 text-pink-500",
  x: "bg-gray-500/10 text-gray-300",
  linkedin: "bg-blue-600/10 text-blue-400",
  pinterest: "bg-red-500/10 text-red-500",
};

const statusConfig: Record<string, { color: string; bg: string }> = {
  DRAFT: { color: "text-gray-400", bg: "bg-gray-500/10" },
  SCHEDULED: { color: "text-amber-500", bg: "bg-amber-500/10" },
  QUEUED: { color: "text-blue-500", bg: "bg-blue-500/10" },
  PUBLISHING: { color: "text-purple-500", bg: "bg-purple-500/10" },
  PUBLISHED: { color: "text-green-500", bg: "bg-green-500/10" },
  CANCELED: { color: "text-red-500", bg: "bg-red-500/10" },
  FAILED: { color: "text-red-400", bg: "bg-red-500/10" },
  PAUSED: { color: "text-yellow-500", bg: "bg-yellow-500/10" },
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [platformFilter, setPlatformFilter] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const fetchOrders = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) { window.location.replace("/admin/login"); return; }

    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (activeTab) params.set("status", activeTab);
      if (platformFilter) params.set("platform", platformFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setOrders(data.orders ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, activeTab, platformFilter, search]);

  React.useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                  : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Platform Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -trangray-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={platformFilter}
          onChange={(e) => { setPlatformFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All Platforms</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="x">X (Twitter)</option>
          <option value="linkedin">LinkedIn</option>
          <option value="pinterest">Pinterest</option>
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
          <button onClick={fetchOrders} className="ml-auto underline hover:text-red-300">Retry</button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No orders found</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const sc = statusConfig[order.status] ?? statusConfig.DRAFT;
                  return (
                    <tr key={order.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">#{order.id.slice(-8)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white truncate max-w-xs">{order.caption || "No caption"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${platformColors[order.platform] ?? "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>
                          {order.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${sc.bg} ${sc.color}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{order.userName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{order.accountName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/admin/orders/${order.id}`); }}
                            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {orders.length === 0 ? 0 : (page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total} orders
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
