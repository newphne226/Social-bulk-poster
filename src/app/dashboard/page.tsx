"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Globe,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Crown,
  Zap,
} from "lucide-react";
import Link from "next/link";

const API = "https://smtools.online/api";

const PLAN_NAMES: Record<string, string> = {
  BASIC: "Basic",
  SILVER: "Silver",
  PRO: "Pro",
};

const PLAN_COLORS: Record<string, string> = {
  BASIC: "from-blue-500 to-cyan-500",
  SILVER: "from-purple-500 to-pink-500",
  PRO: "from-amber-500 to-orange-500",
};

export default function DashboardOverview() {
  const [stats, setStats] = useState({ posts: 0, scheduled: 0, published: 0, accounts: 0 });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subPlan, setSubPlan] = useState("FREE");
  const [subExpiry, setSubExpiry] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const token = localStorage.getItem("sp_token");
    if (!token) return;
    const headers = { Authorization: "Bearer " + token };
    try {
      const [postsRes, accRes, subRes] = await Promise.all([
        fetch(API + "/posts", { headers }).then((r) => r.json()).catch(() => []),
        fetch(API + "/accounts", { headers }).then((r) => r.json()).catch(() => []),
        fetch(API + "/subscription", { headers }).then((r) => r.json()).catch(() => ({})),
      ]);
      const posts = Array.isArray(postsRes) ? postsRes : postsRes.posts || [];
      const accounts = Array.isArray(accRes) ? accRes : accRes.accounts || [];
      setStats({
        posts: posts.length,
        scheduled: posts.filter((p: any) => p.status === "SCHEDULED").length,
        published: posts.filter((p: any) => p.status === "PUBLISHED").length,
        accounts: accounts.length,
      });
      setRecentPosts(posts.slice(0, 5));

      if (subRes.subscription) {
        setSubPlan(subRes.subscription.plan || "FREE");
        setSubExpiry(subRes.subscription.currentPeriodEnd || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  const cards = [
    { label: "Total Posts", value: stats.posts, icon: FileText, color: "bg-blue-500", href: "/dashboard/posts" },
    { label: "Scheduled", value: stats.scheduled, icon: Clock, color: "bg-amber-500", href: "/dashboard/schedule" },
    { label: "Published", value: stats.published, icon: TrendingUp, color: "bg-green-500", href: "/dashboard/posts" },
    { label: "Accounts", value: stats.accounts, icon: Globe, color: "bg-purple-500", href: "/dashboard/accounts" },
  ];

  return (
    <div className="space-y-6">
      {/* Subscription Banner */}
      {subPlan === "FREE" ? (
        <div className="bg-gradient-to-r from-amber-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap size={20} />
                <span className="text-sm font-medium opacity-90">Free Plan</span>
              </div>
              <p className="text-sm opacity-80">Subscribe to unlock posting, reels, and more features.</p>
            </div>
            <Link
              href="/dashboard/billing"
              className="px-5 py-2.5 bg-white text-amber-600 rounded-lg text-sm font-semibold hover:bg-amber-50 transition-colors"
            >
              View Plans
            </Link>
          </div>
        </div>
      ) : (
        <div className={`bg-gradient-to-r ${PLAN_COLORS[subPlan] || "from-slate-500 to-slate-600"} rounded-xl p-6 text-white`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown size={20} />
                <span className="text-sm font-medium opacity-90">{PLAN_NAMES[subPlan] || subPlan} Plan</span>
              </div>
              <p className="text-sm opacity-80">
                {subExpiry ? `Active until ${new Date(subExpiry).toLocaleDateString()}` : "Your subscription is active"}
              </p>
            </div>
            <Link
              href="/dashboard/billing"
              className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              Manage
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${c.color} flex items-center justify-center`}>
                <c.icon size={20} className="text-white" />
              </div>
              <ArrowUpRight size={16} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{c.value}</div>
            <div className="text-sm text-slate-500">{c.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/dashboard/posts"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <FileText size={18} className="text-amber-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">Create Post</div>
              <div className="text-xs text-slate-500">Schedule across platforms</div>
            </div>
          </Link>
          <Link
            href="/dashboard/accounts"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Globe size={18} className="text-purple-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">Connect Account</div>
              <div className="text-xs text-slate-500">Add social platforms</div>
            </div>
          </Link>
          <Link
            href="/dashboard/schedule"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar size={18} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">View Schedule</div>
              <div className="text-xs text-slate-500">Manage your queue</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">Recent Posts</h2>
          <Link href="/dashboard/posts" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
            View All
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <FileText size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No posts yet. Create your first post!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPosts.map((p: any) => {
              const statusColors: Record<string, string> = {
                SCHEDULED: "bg-blue-100 text-blue-700",
                PUBLISHED: "bg-green-100 text-green-700",
                DRAFT: "bg-slate-100 text-slate-600",
                FAILED: "bg-red-100 text-red-700",
              };
              return (
                <div key={p.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(p.platform || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 truncate">{p.caption || "No caption"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${statusColors[p.status] || ""}`}>
                        {p.status}
                      </span>
                      <span className="text-xs text-slate-400">{p.platform}</span>
                      {p.scheduledAt && (
                        <span className="text-xs text-slate-400">
                          {new Date(p.scheduledAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
