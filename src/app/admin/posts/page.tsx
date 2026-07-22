"use client";

import * as React from "react";
import { Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";

interface Post {
  id: string;
  caption: string;
  platform: string;
  status: string;
  userName: string;
  accountName: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
}

const platformColors: Record<string, string> = {
  facebook: "bg-blue-500/10 text-blue-500",
  instagram: "bg-pink-500/10 text-pink-500",
  x: "bg-gray-500/10 text-gray-300",
  linkedin: "bg-blue-600/10 text-blue-400",
  pinterest: "bg-red-500/10 text-red-500",
};

const statusIcons: Record<string, React.ElementType> = {
  PUBLISHED: CheckCircle,
  SCHEDULED: Clock,
  DRAFT: FileText,
  FAILED: AlertCircle,
};

const statusColors: Record<string, string> = {
  PUBLISHED: "text-green-500",
  SCHEDULED: "text-amber-500",
  DRAFT: "text-gray-400",
  FAILED: "text-red-500",
};

export default function AdminPostsPage() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState("");
  const [platformFilter, setPlatformFilter] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) {
      window.location.replace("/admin/login");
      return;
    }

    setLoading(true);
    setError("");
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (statusFilter) params.set("status", statusFilter);
    if (platformFilter) params.set("platform", platformFilter);

    fetch(`/api/admin/posts?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed to load");
        return data;
      })
      .then((data) => {
        setPosts(data.posts ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load posts");
        setLoading(false);
      });
  }, [page, statusFilter, platformFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All Status</option>
          <option value="PUBLISHED">Published</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="DRAFT">Draft</option>
          <option value="FAILED">Failed</option>
        </select>
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
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Post</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No posts found</td>
                </tr>
              ) : (
                posts.map((post) => {
                  const StatusIcon = statusIcons[post.status] ?? FileText;
                  return (
                    <tr key={post.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white truncate max-w-xs">{post.caption}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${platformColors[post.platform] ?? "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>
                          {post.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${statusColors[post.status] ?? "text-gray-500 dark:text-gray-400"}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{post.userName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{post.accountName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {posts.length === 0 ? 0 : (page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total} posts
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
