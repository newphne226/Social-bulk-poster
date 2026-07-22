"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Search, Trash2, Calendar, FileText, Pencil, Link2, Image, Video, FileText as TextIcon, Film, Layers, Smartphone, X as XIcon, Hash, AtSign, Send, Clock, ChevronDown, Zap, Save } from "lucide-react";
import EditPostModal from "@/components/edit-post-modal";

const API = "/api";

const PLATFORMS: Record<string, { name: string; color: string; icon: string }> = {
  facebook: { name: "Facebook", color: "#1877F2", icon: "f" },
  instagram: { name: "Instagram", color: "#E4405F", icon: "IG" },
  x: { name: "X (Twitter)", color: "#000000", icon: "X" },
  linkedin: { name: "LinkedIn", color: "#0A66C2", icon: "in" },
  pinterest: { name: "Pinterest", color: "#BD081C", icon: "P" },
};

const PLATFORM_POST_TYPES: Record<string, { value: string; label: string; icon: any; description: string }[]> = {
  facebook: [
    { value: "TEXT", label: "Text Post", icon: TextIcon, description: "Simple text status update" },
    { value: "IMAGE", label: "Photo", icon: Image, description: "Share a single photo" },
    { value: "VIDEO", label: "Video", icon: Video, description: "Upload or share a video" },
    { value: "REEL", label: "Reels", icon: Film, description: "Short-form vertical video" },
    { value: "LINK", label: "Content / Link", icon: Link2, description: "Share a link with preview" },
    { value: "CAROUSEL", label: "Carousel", icon: Layers, description: "Multiple photos in one post" },
  ],
  instagram: [
    { value: "IMAGE", label: "Photo", icon: Image, description: "Share a single photo" },
    { value: "REEL", label: "Reels", icon: Film, description: "Short-form vertical video" },
    { value: "VIDEO", label: "Video", icon: Video, description: "Upload a video" },
    { value: "CAROUSEL", label: "Carousel", icon: Layers, description: "Up to 10 photos/videos" },
    { value: "STORY", label: "Story", icon: Smartphone, description: "24-hour disappearing content" },
  ],
  x: [
    { value: "TEXT", label: "Text Tweet", icon: TextIcon, description: "Simple text tweet" },
    { value: "IMAGE", label: "Photo Tweet", icon: Image, description: "Tweet with a photo" },
    { value: "VIDEO", label: "Video Tweet", icon: Video, description: "Tweet with a video" },
    { value: "LINK", label: "Link Tweet", icon: Link2, description: "Tweet with a link card" },
  ],
  linkedin: [
    { value: "TEXT", label: "Text Post", icon: TextIcon, description: "Professional text update" },
    { value: "IMAGE", label: "Photo", icon: Image, description: "Share a photo" },
    { value: "VIDEO", label: "Video", icon: Video, description: "Share a video" },
    { value: "LINK", label: "Article / Link", icon: Link2, description: "Share a link or article" },
    { value: "CAROUSEL", label: "Carousel Document", icon: Layers, description: "Multi-image document" },
  ],
  pinterest: [
    { value: "IMAGE", label: "Pin (Photo)", icon: Image, description: "Create a standard pin" },
    { value: "VIDEO", label: "Video Pin", icon: Video, description: "Create a video pin" },
    { value: "CAROUSEL", label: "Idea Pin", icon: Layers, description: "Multi-page story pin" },
  ],
};

function detectMediaType(url: string): string | null {
  if (!url) return null;
  const lower = url.toLowerCase();
  if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/.test(lower)) return "IMAGE";
  if (/\.(mp4|mov|avi|mkv|webm|flv|wmv)(\?|$)/.test(lower)) return "VIDEO";
  if (/youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com|tiktok\.com/.test(lower)) return "VIDEO";
  if (/instagram\.com\/p\/|instagram\.com\/reel\//.test(lower)) return "IMAGE";
  if (/facebook\.com.*\/photo|fb\.com.*\/photo/.test(lower)) return "IMAGE";
  if (/facebook\.com.*\/video|fb\.com.*\/video/.test(lower)) return "VIDEO";
  return "LINK";
}

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState("facebook");
  const [postType, setPostType] = useState("TEXT");
  const [accountId, setAccountId] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState("");
  const [mentions, setMentions] = useState<string[]>([]);
  const [newMention, setNewMention] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const token = localStorage.getItem("sp_token");
    if (!token) return;
    const h = { Authorization: "Bearer " + token };
    try {
      const safeFetch = async (url: string) => {
        const res = await fetch(url, { headers: h, cache: "no-store" });
        if (!res.ok) return null;
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      };
      const [pRes, aRes] = await Promise.all([
        safeFetch(API + "/posts"),
        safeFetch(API + "/accounts"),
      ]);
      setPosts(Array.isArray(pRes) ? pRes : pRes?.posts || []);
      setAccounts(Array.isArray(aRes) ? aRes : aRes?.accounts || []);
    } catch {}
    setLoading(false);
  }

  const availableAccounts = useMemo(() => {
    return accounts.filter((a: any) => a.platform === platform);
  }, [accounts, platform]);

  const postTypes = PLATFORM_POST_TYPES[platform] || PLATFORM_POST_TYPES.facebook;

  function handlePlatformChange(newPlatform: string) {
    setPlatform(newPlatform);
    const types = PLATFORM_POST_TYPES[newPlatform] || [];
    const matching = types.find((t) => t.value === postType);
    if (!matching && types.length > 0) {
      setPostType(types[0].value);
    }
    const platAccounts = accounts.filter((a: any) => a.platform === newPlatform);
    if (platAccounts.length > 0 && !platAccounts.find((a: any) => a.id === accountId)) {
      setAccountId(platAccounts[0].id);
    } else if (platAccounts.length === 0) {
      setAccountId("");
    }
  }

  function handleLinkUrlChange(url: string) {
    setLinkUrl(url);
    if (url) {
      const detected = detectMediaType(url);
      if (detected) {
        const types = PLATFORM_POST_TYPES[platform] || [];
        const matching = types.find((t) => t.value === detected);
        if (matching) setPostType(detected);
        if (detected !== "LINK" && url) {
          setMediaUrls((prev) => (prev.includes(url) ? prev : [...prev, url]));
        }
      }
    }
  }

  function addMediaUrl() {
    const url = newMediaUrl.trim();
    if (!url) return;
    if (!mediaUrls.includes(url)) {
      setMediaUrls([...mediaUrls, url]);
    }
    setNewMediaUrl("");
  }

  function removeMediaUrl(url: string) {
    setMediaUrls(mediaUrls.filter((u) => u !== url));
  }

  function addHashtag() {
    const tag = newHashtag.trim().replace(/^#/, "");
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }
    setNewHashtag("");
  }

  function removeHashtag(tag: string) {
    setHashtags(hashtags.filter((t) => t !== tag));
  }

  function addMention() {
    const m = newMention.trim().replace(/^@/, "");
    if (m && !mentions.includes(m)) {
      setMentions([...mentions, m]);
    }
    setNewMention("");
  }

  function removeMention(m: string) {
    setMentions(mentions.filter((x) => x !== m));
  }

  function resetForm() {
    setCaption("");
    setPlatform("facebook");
    setPostType("TEXT");
    setAccountId("");
    setLinkUrl("");
    setMediaUrls([]);
    setNewMediaUrl("");
    setHashtags([]);
    setNewHashtag("");
    setMentions([]);
    setNewMention("");
    setScheduledAt("");
  }

  async function createPost(mode: "draft" | "schedule" | "instant" = "draft") {
    if (!caption.trim() && mediaUrls.length === 0) return;

    const sub = JSON.parse(localStorage.getItem("sp_subscription") || "{}");
    if (sub.plan === "FREE" || !sub.plan) {
      window.location.href = "/dashboard/billing";
      return;
    }

    setCreating(true);
    const token = localStorage.getItem("sp_token");
    try {
      const payload: any = {
        caption: caption.trim(),
        platform,
        type: postType,
        accountId: accountId || undefined,
        mediaUrls,
        hashtags,
        mentions,
        status: mode === "instant" ? "PUBLISHED" : scheduledAt ? "SCHEDULED" : "DRAFT",
        ...(mode === "instant" ? { scheduledAt: new Date().toISOString(), publishedAt: new Date().toISOString() } : {}),
      };
      if (scheduledAt && mode !== "instant") payload.scheduledAt = scheduledAt;

      await fetch(API + "/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(payload),
      });
      setShowCreate(false);
      resetForm();
      await load();
    } catch {}
    setCreating(false);
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    const token = localStorage.getItem("sp_token");
    await fetch(API + "/posts/" + id, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
    await load();
  }

  const filtered = posts.filter((p) => {
    if (filter !== "ALL" && p.status !== filter) return false;
    if (search && !p.caption?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusColors: Record<string, string> = {
    SCHEDULED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    PUBLISHED: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    DRAFT: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    FAILED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    QUEUED: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  };

  const statusTabs = ["ALL", "SCHEDULED", "PUBLISHED", "DRAFT", "FAILED"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Posts</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{posts.length} total posts</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowCreate(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-900/40"
          />
        </div>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 overflow-x-auto">
          {statusTabs.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                filter === s
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create New Post</h3>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <XIcon size={20} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Platform</label>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(PLATFORMS).map(([key, plat]) => (
                  <button
                    key={key}
                    onClick={() => handlePlatformChange(key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                      platform === key
                        ? "border-current text-white shadow-md"
                        : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500"
                    }`}
                    style={platform === key ? { background: plat.color, borderColor: plat.color } : {}}
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={platform !== key ? { background: plat.color, color: "white" } : { background: "rgba(255,255,255,0.3)" }}>
                      {plat.icon}
                    </span>
                    {plat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Post Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {postTypes.map((pt) => {
                  const Icon = pt.icon;
                  return (
                    <button
                      key={pt.value}
                      onClick={() => setPostType(pt.value)}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 text-left transition-all ${
                        postType === pt.value
                          ? "border-amber-400 bg-amber-50 dark:bg-amber-900/30 shadow-sm"
                          : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                      }`}
                    >
                      <Icon size={18} className={postType === pt.value ? "text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-slate-500"} />
                      <div>
                        <div className={`text-sm font-medium ${postType === pt.value ? "text-amber-700 dark:text-amber-300" : "text-slate-700 dark:text-slate-300"}`}>{pt.label}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{pt.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {availableAccounts.length > 0 ? (
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Account</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="">Select account...</option>
                  {availableAccounts.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.displayName || a.username || a.platform}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-700 dark:text-amber-300">
                No {PLATFORMS[platform]?.name} accounts connected.{" "}
                <a href="/dashboard/accounts" className="font-semibold underline">Connect one</a>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                <Link2 size={12} className="inline mr-1" />
                Link / URL (optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/photo-or-video.jpg"
                value={linkUrl}
                onChange={(e) => handleLinkUrlChange(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
              />
              {linkUrl && detectMediaType(linkUrl) && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Detected: <strong>{detectMediaType(linkUrl)}</strong> — post type updated automatically
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Caption / Text</label>
              <textarea
                placeholder="What's on your mind?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm min-h-[100px] focus:outline-none focus:border-amber-400 resize-y"
              />
            </div>

            {(postType === "IMAGE" || postType === "VIDEO" || postType === "CAROUSEL" || postType === "REEL" || postType === "STORY") && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Media URLs</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMediaUrl())}
                    className="flex-1 p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                  />
                  <button onClick={addMediaUrl} className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">
                    Add
                  </button>
                </div>
                {mediaUrls.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {mediaUrls.map((url, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-1.5 text-xs">
                        <span className="flex-1 truncate text-slate-600 dark:text-slate-300">{url}</span>
                        <button onClick={() => removeMediaUrl(url)} className="text-red-400 hover:text-red-600"><XIcon size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                <Hash size={12} className="inline mr-1" />Hashtags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="add hashtag"
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHashtag())}
                  className="flex-1 p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                />
                <button onClick={addHashtag} className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">
                  Add
                </button>
              </div>
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {hashtags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                      #{tag}
                      <button onClick={() => removeHashtag(tag)} className="text-blue-400 hover:text-blue-600"><XIcon size={10} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                <AtSign size={12} className="inline mr-1" />Mentions
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="add mention"
                  value={newMention}
                  onChange={(e) => setNewMention(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMention())}
                  className="flex-1 p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                />
                <button onClick={addMention} className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">
                  Add
                </button>
              </div>
              {mentions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {mentions.map((m) => (
                    <span key={m} className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                      @{m}
                      <button onClick={() => removeMention(m)} className="text-purple-400 hover:text-purple-600"><XIcon size={10} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                <Clock size={12} className="inline mr-1" />Schedule (optional)
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-400"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Optional — for scheduled posts</p>
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-slate-100 dark:border-slate-700">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Cancel
              </button>
              <button
                onClick={() => createPost("draft")}
                disabled={creating || (!caption.trim() && mediaUrls.length === 0)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={14} />
                {creating ? "Saving..." : "Save Draft"}
              </button>
              <button
                onClick={() => createPost("instant")}
                disabled={creating || (!caption.trim() && mediaUrls.length === 0) || !accountId}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                <Zap size={14} />
                {creating ? "Posting..." : "Post Now"}
              </button>
              <button
                onClick={() => createPost("schedule")}
                disabled={creating || (!caption.trim() && mediaUrls.length === 0) || !scheduledAt || !accountId}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                <Send size={14} />
                {creating ? "Scheduling..." : "Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <FileText size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No posts found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const plat = PLATFORMS[p.platform] || { name: p.platform, color: "#888", icon: "?" };
            return (
              <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: plat.color }}
                  >
                    {plat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 dark:text-white line-clamp-2">{p.caption || "No caption"}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[p.status] || ""}`}>
                        {p.status}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{plat.name}</span>
                      {p.type && (
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full">{p.type}</span>
                      )}
                      {p.scheduledAt && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(p.scheduledAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => setEditingPost(p)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors" title="Edit post">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deletePost(p.id)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingPost && (
        <EditPostModal
          post={{
            id: editingPost.id,
            caption: editingPost.caption || "",
            platform: editingPost.platform || "facebook",
            accountId: editingPost.accountId || "",
            accountUsername: editingPost.accountUsername || "",
            status: editingPost.status || "DRAFT",
            type: editingPost.type || "TEXT",
            scheduledAt: editingPost.scheduledAt || null,
            mediaUrls: editingPost.mediaUrls || [],
            hashtags: editingPost.hashtags || [],
            mentions: editingPost.mentions || [],
            tags: editingPost.tags || [],
            retryCount: editingPost.retryCount,
            failureReason: editingPost.failureReason,
          }}
          accounts={accounts}
          onClose={() => setEditingPost(null)}
          onSaved={() => { setEditingPost(null); load(); }}
        />
      )}
    </div>
  );
}
