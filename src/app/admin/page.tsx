"use client";

import * as React from "react";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  TrendingUp,
  BarChart3,
  Calendar,
  Activity,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

interface Stats {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  failedOrders: number;
  totalSales: number;
  newCustomers: number;
  totalUsers: number;
  activeSubscriptions: number;
  totalAccounts: number;
}

interface DayData {
  date: string;
  amount?: number;
  count?: number;
}

interface RecentUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [charts, setCharts] = React.useState<{
    revenueByDay: DayData[];
    postsByDay: DayData[];
    usersByDay: DayData[];
  } | null>(null);
  const [recentUsers, setRecentUsers] = React.useState<RecentUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) {
      window.location.replace("/admin/login");
      return;
    }

    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed to load");
        return data;
      })
      .then((data) => {
        setStats(data.stats);
        setCharts(data.charts);
        setRecentUsers(data.recentUsers ?? []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("sp_admin_token");
              localStorage.removeItem("sp_admin_user");
              window.location.replace("/admin/login");
            }}
            className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors"
          >
            Re-login
          </button>
        </div>
      </div>
    );
  }

  const mainCards = [
    { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: ShoppingCart, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-500/10" },
    { label: "Today's Orders", value: stats?.todayOrders ?? 0, icon: Calendar, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/10" },
    { label: "Pending Orders", value: stats?.pendingOrders ?? 0, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-500/10" },
    { label: "Completed Orders", value: stats?.completedOrders ?? 0, icon: CheckCircle, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-500/10" },
    { label: "Cancelled Orders", value: stats?.cancelledOrders ?? 0, icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-500/10" },
    { label: "Total Sales", value: `$${((stats?.totalSales ?? 0) / 100).toFixed(2)}`, icon: DollarSign, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-100 dark:bg-pink-500/10" },
    { label: "New Customers", value: stats?.newCustomers ?? 0, icon: Users, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-500/10" },
    { label: "Active Subscriptions", value: stats?.activeSubscriptions ?? 0, icon: TrendingUp, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-500/10" },
  ];

  const revenueTotal = charts?.revenueByDay?.reduce((s, d) => s + (d.amount ?? 0), 0) ?? 0;
  const revenueMax = Math.max(...(charts?.revenueByDay?.map((d) => d.amount ?? 0) ?? [1]), 1);
  const postsMax = Math.max(...(charts?.postsByDay?.map((d) => d.count ?? 0) ?? [1]), 1);
  const usersMax = Math.max(...(charts?.usersByDay?.map((d) => d.count ?? 0) ?? [1]), 1);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainCards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-pink-500" />
              Revenue Overview
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Last 7 days — Total: ${((revenueTotal) / 100).toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            <span>+12%</span>
          </div>
        </div>
        <div className="flex items-end gap-2 h-48">
          {charts?.revenueByDay?.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">${((day.amount ?? 0) / 100).toFixed(0)}</span>
              <div
                className="w-full bg-gradient-to-t from-pink-500 to-pink-400 rounded-t-lg transition-all hover:from-pink-600 hover:to-pink-500"
                style={{ height: `${Math.max(((day.amount ?? 0) / revenueMax) * 160, 4)}px` }}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sales & Users Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-blue-500" />
            Sales &amp; Analytics
          </h2>
          <div className="flex items-end gap-2 h-40">
            {charts?.postsByDay?.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{day.count ?? 0}</span>
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                  style={{ height: `${Math.max(((day.count ?? 0) / postsMax) * 140, 4)}px` }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">Posts per day</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-cyan-500" />
            New Customers
          </h2>
          <div className="flex items-end gap-2 h-40">
            {charts?.usersByDay?.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{day.count ?? 0}</span>
                <div
                  className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg"
                  style={{ height: `${Math.max(((day.count ?? 0) / usersMax) * 140, 4)}px` }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">Users registered per day (last 7 days)</p>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h2>
          <a href="/admin/users" className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors">
            View All
          </a>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {recentUsers.length === 0 ? (
            <p className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">No users yet</p>
          ) : (
            recentUsers.map((user) => (
              <div key={user.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                    {(user.name ?? user.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name ?? "No Name"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    user.role === "ADMIN" ? "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}>
                    {user.role}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    user.status === "ACTIVE" ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                  }`}>
                    {user.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
