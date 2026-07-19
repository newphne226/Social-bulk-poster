"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  XCircle,
  RotateCcw,
  Send,
  Loader2,
  Hash,
  Calendar,
  User,
  Globe,
  Link2,
  Tag,
} from "lucide-react";

interface OrderDetail {
  id: string;
  caption: string;
  mediaUrls: string[];
  hashtags: string[];
  mentions: string[];
  platform: string;
  status: string;
  type: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  failedAt: string | null;
  failureReason: string | null;
  platformPostId: string | null;
  permalink: string | null;
  retryCount: number;
  maxRetries: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string | null; email: string; avatarUrl: string | null };
  account: { displayName: string; platform: string; username: string | null; avatarUrl: string | null };
  jobs: {
    id: string; jobType: string; status: string;
    scheduledFor: string; startedAt: string | null; completedAt: string | null;
    failedAt: string | null; errorMessage: string | null; attempts: number;
  }[];
  schedule: { timezone: string; randomDelayMin: number; randomDelayMax: number } | null;
}

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  DRAFT: { color: "text-slate-400", bg: "bg-slate-500/10", icon: FileText },
  SCHEDULED: { color: "text-amber-500", bg: "bg-amber-500/10", icon: Clock },
  QUEUED: { color: "text-blue-500", bg: "bg-blue-500/10", icon: Send },
  PUBLISHING: { color: "text-purple-500", bg: "bg-purple-500/10", icon: Loader2 },
  PUBLISHED: { color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle },
  CANCELED: { color: "text-red-500", bg: "bg-red-500/10", icon: XCircle },
  FAILED: { color: "text-red-400", bg: "bg-red-500/10", icon: AlertCircle },
  PAUSED: { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = React.useState<OrderDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) { window.location.replace("/admin/login"); return; }

    fetch(`/api/admin/orders/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed to load");
        return data;
      })
      .then((data) => { setOrder(data.order); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm text-red-400">{error || "Order not found"}</p>
        <button onClick={() => router.back()} className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm hover:bg-slate-700">
          Go Back
        </button>
      </div>
    );
  }

  const sc = statusConfig[order.status] ?? statusConfig.DRAFT;
  const StatusIcon = sc.icon;

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Order #{order.id.slice(-8)}</h1>
          <p className="text-sm text-slate-400">Created {formatDate(order.createdAt)}</p>
        </div>
        <span className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium ${sc.bg} ${sc.color}`}>
          <StatusIcon className="h-4 w-4" />
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Caption */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
            <h2 className="text-sm font-medium text-slate-400 mb-3">Caption</h2>
            <p className="text-white whitespace-pre-wrap">{order.caption}</p>
          </div>

          {/* Hashtags & Mentions */}
          {(order.hashtags.length > 0 || order.mentions.length > 0) && (
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
              {order.hashtags.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-sm font-medium text-slate-400 mb-2">Hashtags</h2>
                  <div className="flex flex-wrap gap-2">
                    {order.hashtags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              {order.mentions.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-slate-400 mb-2">Mentions</h2>
                  <div className="flex flex-wrap gap-2">
                    {order.mentions.map((m, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs">@{m}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Media */}
          {order.mediaUrls.length > 0 && (
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
              <h2 className="text-sm font-medium text-slate-400 mb-3">Media ({order.mediaUrls.length})</h2>
              <div className="grid grid-cols-2 gap-3">
                {order.mediaUrls.map((url, i) => (
                  <div key={i} className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Job History */}
          {order.jobs.length > 0 && (
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
              <h2 className="text-sm font-medium text-slate-400 mb-4">Job History</h2>
              <div className="space-y-3">
                {order.jobs.map((job) => (
                  <div key={job.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <div className={`p-1.5 rounded-lg ${job.status === "COMPLETED" ? "bg-green-500/10" : job.status === "FAILED" ? "bg-red-500/10" : "bg-amber-500/10"}`}>
                      {job.status === "COMPLETED" ? <CheckCircle className="h-4 w-4 text-green-500" /> :
                       job.status === "FAILED" ? <AlertCircle className="h-4 w-4 text-red-500" /> :
                       <Clock className="h-4 w-4 text-amber-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{job.jobType} — {job.status}</p>
                      <p className="text-xs text-slate-500">Attempts: {job.attempts} | {formatDate(job.startedAt)}</p>
                    </div>
                    {job.errorMessage && (
                      <p className="text-xs text-red-400 max-w-xs truncate">{job.errorMessage}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-400">Order Details</h2>

            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Platform</p>
                <p className="text-sm text-white capitalize">{order.platform}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Type</p>
                <p className="text-sm text-white">{order.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">User</p>
                <p className="text-sm text-white">{order.user.name ?? order.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Account</p>
                <p className="text-sm text-white">{order.account.displayName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Scheduled</p>
                <p className="text-sm text-white">{formatDate(order.scheduledAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Published</p>
                <p className="text-sm text-white">{formatDate(order.publishedAt)}</p>
              </div>
            </div>

            {order.permalink && (
              <div className="flex items-center gap-3">
                <Link2 className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Permalink</p>
                  <a href={order.permalink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline truncate block max-w-[200px]">
                    {order.permalink}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Retries</p>
                <p className="text-sm text-white">{order.retryCount} / {order.maxRetries}</p>
              </div>
            </div>
          </div>

          {/* Schedule Info */}
          {order.schedule && (
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 space-y-4">
              <h2 className="text-sm font-medium text-slate-400">Schedule Settings</h2>
              <div>
                <p className="text-xs text-slate-500">Timezone</p>
                <p className="text-sm text-white">{order.schedule.timezone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Random Delay</p>
                <p className="text-sm text-white">{order.schedule.randomDelayMin}–{order.schedule.randomDelayMax}s</p>
              </div>
            </div>
          )}

          {/* Failure Reason */}
          {order.failureReason && (
            <div className="bg-red-900/20 rounded-2xl border border-red-800 p-6">
              <h2 className="text-sm font-medium text-red-400 mb-2">Failure Reason</h2>
              <p className="text-sm text-red-300">{order.failureReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
