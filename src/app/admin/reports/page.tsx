"use client";

import * as React from "react";
import {
  BarChart3, DollarSign, ShoppingCart, Users, TrendingUp, Calendar,
  Download, RefreshCw, AlertCircle, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

const reportTabs = [
  { key: "sales", label: "Sales Report", icon: DollarSign },
  { key: "orders", label: "Order Report", icon: ShoppingCart },
  { key: "customers", label: "Customer Report", icon: Users },
  { key: "revenue", label: "Revenue Report", icon: TrendingUp },
];

const periodTabs = [
  { key: "daily", label: "Today" },
  { key: "weekly", label: "This Week" },
  { key: "monthly", label: "This Month" },
  { key: "yearly", label: "This Year" },
  { key: "custom", label: "Custom Range" },
];

const platformColors: Record<string, string> = {
  facebook: "#1877F2", instagram: "#E4405F", x: "#1DA1F2", linkedin: "#0A66C2", pinterest: "#BD081C",
};

function BarChartSimple({ data, maxValue }: { data: { label: string; value: number; color?: string }[]; maxValue?: number }) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-20 truncate text-right">{d.label}</span>
          <div className="flex-1 h-6 bg-slate-800 rounded-lg overflow-hidden">
            <div className="h-full rounded-lg transition-all duration-500" style={{
              width: `${Math.max((d.value / max) * 100, 2)}%`,
              backgroundColor: d.color || "#f59e0b",
            }} />
          </div>
          <span className="text-xs text-white font-medium w-16 text-right">{d.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color, trend }: {
  label: string; value: string; sub?: string; icon: any; color: string; trend?: "up" | "down";
}) {
  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [activeReport, setActiveReport] = React.useState("sales");
  const [activePeriod, setActivePeriod] = React.useState("monthly");
  const [customFrom, setCustomFrom] = React.useState("");
  const [customTo, setCustomTo] = React.useState("");
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const fetchReport = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) { window.location.replace("/admin/login"); return; }
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ report: activeReport, period: activePeriod });
      if (activePeriod === "custom" && customFrom) params.set("from", customFrom);
      if (activePeriod === "custom" && customTo) params.set("to", customTo);
      const res = await fetch(`/api/admin/reports?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setData(d);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }, [activeReport, activePeriod, customFrom, customTo]);

  React.useEffect(() => { fetchReport(); }, [fetchReport]);

  const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-sm text-slate-400">{data?.from && data?.to ? `${new Date(data.from).toLocaleDateString()} — ${new Date(data.to).toLocaleDateString()}` : ""}</p>
        </div>
        <button onClick={fetchReport} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm hover:bg-slate-800 transition-colors">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Report Tabs */}
      <div className="flex flex-wrap gap-2">
        {reportTabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveReport(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeReport === tab.key
                ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:text-white"
            }`}>
            <tab.icon className="h-3.5 w-3.5" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Period Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {periodTabs.map((p) => (
          <button key={p.key} onClick={() => setActivePeriod(p.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activePeriod === p.key
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:text-white"
            }`}>{p.label}</button>
        ))}
        {activePeriod === "custom" && (
          <div className="flex items-center gap-2 ml-2">
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-white text-xs focus:ring-2 focus:ring-amber-500" />
            <span className="text-slate-500 text-xs">to</span>
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-white text-xs focus:ring-2 focus:ring-amber-500" />
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : !data ? null : (
        <>
          {/* Sales Report */}
          {activeReport === "sales" && data.summary && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Sales" value={fmt(data.summary.totalSales)} icon={DollarSign} color="bg-green-500/10 text-green-500" />
                <StatCard label="Net Revenue" value={fmt(data.summary.netRevenue)} icon={TrendingUp} color="bg-amber-500/10 text-amber-500" />
                <StatCard label="Avg Order Value" value={fmt(data.summary.avgOrderValue)} icon={BarChart3} color="bg-blue-500/10 text-blue-500" />
                <StatCard label="Refunded" value={fmt(data.summary.totalRefunded)} sub={`${data.summary.failedCount} failed`} icon={RefreshCw} color="bg-purple-500/10 text-purple-500" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-4">Transactions by Method</h3>
                  {data.byMethod?.length > 0 ? (
                    <BarChartSimple data={data.byMethod.map((m: any) => ({
                      label: m.method, value: m.amount, color: "#f59e0b",
                    }))} />
                  ) : <p className="text-sm text-slate-500 text-center py-8">No data</p>}
                </div>
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-4">Status Breakdown</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Successful", value: data.summary.successfulCount, color: "bg-green-500" },
                      { label: "Pending", value: data.summary.pendingCount, color: "bg-yellow-500" },
                      { label: "Failed", value: data.summary.failedCount, color: "bg-red-500" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                          <span className="text-sm text-slate-300">{s.label}</span>
                        </div>
                        <span className="text-sm text-white font-medium">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Report */}
          {activeReport === "orders" && data.summary && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Orders" value={data.summary.totalOrders.toLocaleString()} icon={ShoppingCart} color="bg-amber-500/10 text-amber-500" />
                <StatCard label="Published" value={data.summary.published.toLocaleString()} icon={ArrowUpRight} color="bg-green-500/10 text-green-500" />
                <StatCard label="Scheduled" value={data.summary.scheduled.toLocaleString()} icon={Calendar} color="bg-blue-500/10 text-blue-500" />
                <StatCard label="Failed" value={data.summary.failed.toLocaleString()} icon={AlertCircle} color="bg-red-500/10 text-red-500" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-4">By Status</h3>
                  {data.byStatus?.length > 0 ? (
                    <BarChartSimple data={data.byStatus.map((s: any) => ({
                      label: s.status, value: s.count,
                      color: s.status === "PUBLISHED" ? "#22c55e" : s.status === "FAILED" ? "#ef4444" : s.status === "SCHEDULED" ? "#3b82f6" : "#6b7280",
                    }))} />
                  ) : <p className="text-sm text-slate-500 text-center py-8">No data</p>}
                </div>
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-4">By Platform</h3>
                  {data.byPlatform?.length > 0 ? (
                    <BarChartSimple data={data.byPlatform.map((p: any) => ({
                      label: p.platform, value: p.count,
                      color: platformColors[p.platform] || "#6b7280",
                    }))} />
                  ) : <p className="text-sm text-slate-500 text-center py-8">No data</p>}
                </div>
              </div>
            </div>
          )}

          {/* Customer Report */}
          {activeReport === "customers" && data.summary && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard label="New Customers" value={data.summary.newCustomers.toLocaleString()} icon={Users} color="bg-amber-500/10 text-amber-500" />
                <StatCard label="Total Customers" value={data.summary.totalCustomers.toLocaleString()} icon={Users} color="bg-blue-500/10 text-blue-500" />
                <StatCard label="Active Subscriptions" value={data.summary.activeSubscriptions.toLocaleString()} icon={TrendingUp} color="bg-green-500/10 text-green-500" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-4">New Customers by Plan</h3>
                  {data.newByPlan?.length > 0 ? (
                    <BarChartSimple data={data.newByPlan.map((p: any) => ({
                      label: p.plan, value: p.count,
                      color: p.plan === "FREE" ? "#6b7280" : p.plan === "SILVER" ? "#3b82f6" : p.plan === "VIP_PRO" ? "#f59e0b" : "#a855f7",
                    }))} />
                  ) : <p className="text-sm text-slate-500 text-center py-8">No new customers</p>}
                </div>
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-4">New Customers by Status</h3>
                  {data.newByStatus?.length > 0 ? (
                    <BarChartSimple data={data.newByStatus.map((s: any) => ({
                      label: s.status, value: s.count,
                      color: s.status === "ACTIVE" ? "#22c55e" : s.status === "SUSPENDED" ? "#eab308" : "#ef4444",
                    }))} />
                  ) : <p className="text-sm text-slate-500 text-center py-8">No data</p>}
                </div>
              </div>
            </div>
          )}

          {/* Revenue Report */}
          {activeReport === "revenue" && data.summary && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Revenue" value={fmt(data.summary.totalRevenue)} icon={DollarSign} color="bg-green-500/10 text-green-500" />
                <StatCard label="Net Revenue" value={fmt(data.summary.netRevenue)} icon={TrendingUp} color="bg-amber-500/10 text-amber-500" />
                <StatCard label="Refunded" value={fmt(data.summary.totalRefunded)} icon={RefreshCw} color="bg-purple-500/10 text-purple-500" />
                <StatCard label="Transactions" value={data.summary.transactionCount.toLocaleString()} icon={BarChart3} color="bg-blue-500/10 text-blue-500" />
              </div>

              {data.daily?.length > 0 && (
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-4">Daily Revenue</h3>
                  <div className="space-y-2">
                    {data.daily.map((d: any) => (
                      <div key={d.date} className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 w-24 text-right">{new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        <div className="flex-1 flex items-center gap-1 h-6">
                          <div className="h-full bg-green-500 rounded-l-lg transition-all" style={{ width: `${(d.revenue / Math.max(...data.daily.map((x: any) => x.revenue), 1)) * 100}%` }} />
                          {d.refunds > 0 && <div className="h-full bg-purple-500 rounded-r-lg" style={{ width: `${(d.refunds / Math.max(...data.daily.map((x: any) => x.revenue), 1)) * 100}%` }} />}
                        </div>
                        <span className="text-xs text-white font-medium w-20 text-right">{fmt(d.revenue)}</span>
                        {d.refunds > 0 && <span className="text-xs text-purple-400 w-16 text-right">-{fmt(d.refunds)}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!data.daily || data.daily.length === 0) && (
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-12 text-center text-slate-400">
                  No revenue data for this period
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
