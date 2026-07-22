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
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const API = "/api";

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
  const [subStatus, setSubStatus] = useState("ACTIVE");
  const [subExpiry, setSubExpiry] = useState<string | null>(null);
  const [trialExpired, setTrialExpired] = useState(false);
  const [remainingDays, setRemainingDays] = useState(0);
  const [renewing, setRenewing] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    const token = localStorage.getItem("sp_token");
    if (!token) return;
    const headers = { Authorization: "Bearer " + token };
    try {
      const safeFetch = async (url: string) => {
        const res = await fetch(url, { headers, cache: "no-store" });
        if (!res.ok) return null;
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      };
      const [postsRes, accRes, subRes] = await Promise.all([
        safeFetch(API + "/posts"),
        safeFetch(API + "/accounts"),
        safeFetch(API + "/subscription"),
      ]);
      const posts = Array.isArray(postsRes) ? postsRes : postsRes?.posts || [];
      const accounts = Array.isArray(accRes) ? accRes : accRes?.accounts || [];
      setStats({
        posts: posts.length,
        scheduled: posts.filter((p: any) => p.status === "SCHEDULED").length,
        published: posts.filter((p: any) => p.status === "PUBLISHED").length,
        accounts: accounts.length,
      });
      setRecentPosts(posts.slice(0, 5));

      if (subRes?.subscription) {
        setSubPlan(subRes.subscription.plan || "FREE");
        setSubStatus(subRes.subscription.status || "ACTIVE");
        setSubExpiry(subRes.subscription.currentPeriodEnd || null);
        setTrialExpired(subRes.subscription.trialExpired || false);
        setRemainingDays(subRes.subscription.remainingTrialDays || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleRenew() {
    setRenewing(true);
    try {
      const token = localStorage.getItem("sp_token");
      await fetch(API + "/subscription", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ action: "renew" }),
      });
      const subRes = await (async () => {
        const r = await fetch(API + "/subscription", {
          headers: { Authorization: "Bearer " + token },
        });
        if (!r.ok) return {};
        const t = await r.text();
        return t ? JSON.parse(t) : {};
      })();
      if (subRes.subscription) {
        setSubPlan(subRes.subscription.plan || "FREE");
        setSubStatus(subRes.subscription.status || "ACTIVE");
        setSubExpiry(subRes.subscription.currentPeriodEnd || null);
        setTrialExpired(subRes.subscription.trialExpired || false);
        setRemainingDays(subRes.subscription.remainingTrialDays || 0);
      }
    } catch (e) {
      console.error(e);
    }
    setRenewing(false);
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
      {subStatus === "PENDING_APPROVAL" ? (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock size={20} />
                <span className="text-sm font-medium opacity-90">Subscription Pending Approval</span>
              </div>
              <p className="text-sm opacity-80">Your {subPlan} plan is awaiting admin approval. You&apos;ll get access once approved.</p>
            </div>
            <Link
              href="/dashboard/billing"
              className="px-5 py-2.5 bg-white text-amber-600 rounded-lg text-sm font-semibold hover:bg-amber-50 transition-colors"
            >
              View Status
            </Link>
          </div>
        </div>
      ) : trialExpired ? (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={20} />
                <span className="text-sm font-medium opacity-90">Trial Expired</span>
              </div>
              <p className="text-sm opacity-80">Your 14-day free trial has ended. Renew to continue using SMTools or upgrade to a paid plan.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRenew}
                disabled={renewing}
                className="px-5 py-2.5 bg-white text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {renewing ? "Renewing..." : "Renew Free Trial"}
              </button>
              <Link
                href="/dashboard/billing"
                className="px-5 py-2.5 bg-white/20 text-white rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors"
              >
                Upgrade Plan
              </Link>
            </div>
          </div>
        </div>
      ) : subPlan === "FREE" ? (
        <div className="bg-gradient-to-r from-amber-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap size={20} />
                <span className="text-sm font-medium opacity-90">Free Plan</span>
                {remainingDays > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {remainingDays} days left
                  </span>
                )}
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
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${c.color} flex items-center justify-center`}>
                <c.icon size={20} className="text-white" />
              </div>
              <ArrowUpRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-amber-500 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{c.value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{c.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/dashboard/posts"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <FileText size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">Create Post</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Schedule across platforms</div>
            </div>
          </Link>
          <Link
            href="/dashboard/accounts"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Globe size={18} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">Connect Account</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Add social platforms</div>
            </div>
          </Link>
          <Link
            href="/dashboard/schedule"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">View Schedule</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Manage your queue</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Posts</h2>
          <Link href="/dashboard/posts" className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium">
            View All
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500">
            <FileText size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No posts yet. Create your first post!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPosts.map((p: any) => {
              const statusColors: Record<string, string> = {
                SCHEDULED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
                PUBLISHED: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
                DRAFT: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
                FAILED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
              };
              return (
                <div key={p.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(p.platform || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 dark:text-white truncate">{p.caption || "No caption"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${statusColors[p.status] || ""}`}>
                        {p.status}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{p.platform}</span>
                      {p.scheduledAt && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
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
