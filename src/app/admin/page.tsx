"use client";

import * as React from "react";
import {
  Users,
  FileText,
  DollarSign,
  Activity,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  publishedPosts: number;
  scheduledPosts: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalAccounts: number;
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
  const [recentUsers, setRecentUsers] = React.useState<RecentUser[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) return;

    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats);
        setRecentUsers(data.recentUsers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Users", value: stats?.activeUsers ?? 0, icon: Activity, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Total Posts", value: stats?.totalPosts ?? 0, icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Published", value: stats?.publishedPosts ?? 0, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Scheduled", value: stats?.scheduledPosts ?? 0, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Revenue", value: `$${((stats?.totalRevenue ?? 0) / 100).toFixed(2)}`, icon: DollarSign, color: "text-pink-500", bg: "bg-pink-500/10" },
    { label: "Subscriptions", value: stats?.activeSubscriptions ?? 0, icon: CheckCircle, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { label: "Social Accounts", value: stats?.totalAccounts ?? 0, icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-500" />
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-slate-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Users</h2>
          <a href="/admin/users" className="text-sm text-amber-500 hover:text-amber-400 transition-colors">
            View All
          </a>
        </div>
        <div className="divide-y divide-slate-700">
          {recentUsers.map((user) => (
            <div key={user.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                  {(user.name ?? user.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.name ?? "No Name"}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  user.role === "ADMIN" ? "bg-amber-500/10 text-amber-500" : "bg-slate-700 text-slate-300"
                }`}>
                  {user.role}
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  user.status === "ACTIVE" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                }`}>
                  {user.status}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
