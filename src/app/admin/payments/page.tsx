"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search, Eye, AlertCircle, CreditCard, Banknote, Clock,
  CheckCircle, XCircle, RotateCcw, DollarSign, TrendingUp, Wallet,
} from "lucide-react";

interface PaymentStats {
  totalRevenue: number; totalRefunded: number; totalTransactions: number;
  pendingCount: number; pendingAmount: number;
  succeededCount: number; succeededAmount: number;
  failedCount: number; refundedCount: number;
}

interface Payment {
  id: string; amount: number; currency: string; status: string; method: string;
  failureReason: string | null; refundAmount: number; refundReason: string | null;
  refundedAt: string | null; createdAt: string;
  user: { id: string; name: string | null; email: string; avatarUrl: string | null };
  subscription: { plan: { name: string } } | null;
}

const statusTabs = [
  { key: "", label: "All Payments", icon: CreditCard },
  { key: "pending", label: "Pending", icon: Clock },
  { key: "successful", label: "Successful", icon: CheckCircle },
  { key: "failed", label: "Failed", icon: XCircle },
  { key: "refunded", label: "Refunded", icon: RotateCcw },
];

const methodLabels: Record<string, string> = {
  CARD: "Credit Card", CRYPTO: "Crypto", PAYPAL: "PayPal", BANK_TRANSFER: "Bank Transfer",
};

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [stats, setStats] = React.useState<PaymentStats | null>(null);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [methodFilter, setMethodFilter] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const fetchPayments = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) { window.location.replace("/admin/login"); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (activeTab) params.set("tab", activeTab);
      if (methodFilter) params.set("method", methodFilter);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/payments?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setPayments(data.payments ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setStats(data.stats ?? null);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }, [page, activeTab, methodFilter, search]);

  React.useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const formatAmount = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "PENDING": return "bg-yellow-500/10 text-yellow-400";
      case "SUCCEEDED": return "bg-green-500/10 text-green-400";
      case "FAILED": return "bg-red-500/10 text-red-400";
      case "REFUNDED": return "bg-purple-500/10 text-purple-400";
      case "PARTIALLY_REFUNDED": return "bg-blue-500/10 text-blue-400";
      default: return "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Payment Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{total} total transactions</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-green-500" /></div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatAmount(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><RotateCcw className="h-5 w-5 text-purple-500" /></div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Refunded</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatAmount(stats.totalRefunded)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center"><Clock className="h-5 w-5 text-yellow-500" /></div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.pendingCount} <span className="text-sm text-gray-500 dark:text-gray-400">({formatAmount(stats.pendingAmount)})</span></p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center"><XCircle className="h-5 w-5 text-red-500" /></div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Failed</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.failedCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setPage(1); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:text-gray-900 dark:hover:text-white"
            }`}>
            <tab.icon className="h-3.5 w-3.5" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -trangray-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, or transaction ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <select value={methodFilter} onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
          <option value="">All Methods</option>
          <option value="CARD">Credit Card</option>
          <option value="CRYPTO">Crypto</option>
          <option value="PAYPAL">PayPal</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
          <button onClick={fetchPayments} className="ml-auto underline hover:text-red-300">Retry</button>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center"><div className="h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No payments found</td></tr>
              ) : payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => router.push(`/admin/payments/${p.id}`)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {(p.user.name ?? p.user.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.user.name ?? "No Name"}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formatAmount(p.amount)}</p>
                    {p.refundAmount > 0 && <p className="text-xs text-purple-400">-{formatAmount(p.refundAmount)} refunded</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {methodLabels[p.method] ?? p.method}
                    </span>
                  </td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColor(p.status)}`}>{p.status.replace("_", " ")}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.subscription?.plan?.name ?? "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(p.createdAt)}</td>
                  <td className="px-6 py-4">
                    <button onClick={(e) => { e.stopPropagation(); router.push(`/admin/payments/${p.id}`); }}
                      className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors" title="View Details">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Showing {payments.length === 0 ? 0 : (page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</p>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm disabled:opacity-50">Previous</button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
