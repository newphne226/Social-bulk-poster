"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Hash,
  Type,
  FileText,
  Tag,
  AtSign,
} from "lucide-react";

interface PostData {
  id: string;
  caption: string;
  platform: string;
  accountId: string;
  accountUsername?: string;
  status: string;
  type: string;
  scheduledAt: string | null;
  mediaUrls: string[];
  hashtags: string[];
  mentions: string[];
  tags: string[];
  retryCount?: number;
  failureReason?: string;
}

interface EditPostModalProps {
  post: PostData;
  onClose: () => void;
  onSaved: () => void;
  accounts?: any[];
}

const API_BASE = "/api";

const PLATFORMS: Record<string, { color: string; label: string }> = {
  facebook: { color: "#1877F2", label: "Facebook" },
  instagram: { color: "#E4405F", label: "Instagram" },
  x: { color: "#000000", label: "X (Twitter)" },
  linkedin: { color: "#0A66C2", label: "LinkedIn" },
  pinterest: { color: "#BD081C", label: "Pinterest" },
};

const POST_TYPES = ["TEXT", "IMAGE", "VIDEO", "LINK", "CAROUSEL"];
const STATUSES = ["DRAFT", "SCHEDULED", "QUEUED", "CANCELED"];

export default function EditPostModal({
  post,
  onClose,
  onSaved,
  accounts = [],
}: EditPostModalProps) {
  const [caption, setCaption] = useState(post.caption || "");
  const [platform, setPlatform] = useState(post.platform || "facebook");
  const [postType, setPostType] = useState(post.type || "TEXT");
  const [status, setStatus] = useState(post.status || "DRAFT");
  const [accountId, setAccountId] = useState(post.accountId || "");
  const [scheduledAt, setScheduledAt] = useState(
    post.scheduledAt ? post.scheduledAt.slice(0, 16) : ""
  );
  const [hashtags, setHashtags] = useState<string[]>(post.hashtags || []);
  const [mentions, setMentions] = useState<string[]>(post.mentions || []);
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [mediaUrls, setMediaUrls] = useState<string[]>(post.mediaUrls || []);
  const [hashtagInput, setHashtagInput] = useState("");
  const [mentionInput, setMentionInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [mediaInput, setMediaInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hashtagRef = useRef<HTMLInputElement>(null);
  const mentionRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const MAX_CAPTION = platform === "x" ? 280 : 2200;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleChipInput = (
    e: React.KeyboardEvent<HTMLInputElement>,
    list: string[],
    setList: (val: string[]) => void,
    setInput: (val: string) => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = (e.target as HTMLInputElement).value.trim();
      if (val && !list.includes(val)) {
        setList([...list, val]);
      }
      setInput("");
    }
  };

  const removeChip = (
    list: string[],
    setList: (val: string[]) => void,
    idx: number
  ) => {
    setList(list.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("sp_token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setSaving(false);
        return;
      }

      const payload = {
        caption,
        platform,
        type: postType,
        status,
        accountId,
        scheduledAt: scheduledAt || null,
        mediaUrls,
        hashtags,
        mentions,
        tags,
      };

      const res = await fetch(`${API_BASE}/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Failed to update post (${res.status})`);
      }

      onSaved();
    } catch (err: any) {
      setError(err.message || "Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-gradient-to-br from-white to-amber-50 shadow-2xl border border-amber-100 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-pink-50">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md"
            style={{ backgroundColor: PLATFORMS[platform]?.color || "#666" }}
          >
            {platform.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-800 truncate">
              Edit Post
            </h2>
            <p className="text-xs text-gray-500 truncate">
              {PLATFORMS[platform]?.label || platform} &middot; {postType}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Failure Reason */}
          {post.failureReason && (
            <div className="px-4 py-3 rounded-xl bg-orange-50 border border-orange-200 text-sm">
              <span className="font-semibold text-orange-700">
                Failure Reason:
              </span>{" "}
              <span className="text-orange-600">{post.failureReason}</span>
              {post.retryCount != null && (
                <span className="ml-2 text-orange-500">
                  (Retry #{post.retryCount})
                </span>
              )}
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={15} className="text-amber-500" />
              Caption / Content
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your post content..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 resize-none transition-all"
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-xs ${
                  caption.length > MAX_CAPTION
                    ? "text-red-500 font-bold"
                    : caption.length > MAX_CAPTION * 0.9
                    ? "text-amber-500"
                    : "text-gray-400"
                }`}
              >
                {caption.length}/{MAX_CAPTION}
              </span>
            </div>
          </div>

          {/* Platform & Post Type row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Hash size={15} className="text-pink-500" />
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all"
              >
                {Object.entries(PLATFORMS).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Type size={15} className="text-amber-500" />
                Post Type
              </label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all"
              >
                {POST_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Schedule row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Tag size={15} className="text-pink-500" />
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={15} className="text-amber-500" />
                Schedule Time
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all"
              />
            </div>
          </div>

          {/* Account Selector */}
          {accounts.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <AtSign size={15} className="text-pink-500" />
                Account
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all"
              >
                <option value="">Select account...</option>
                {accounts.map((acc: any) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.username || acc.name || acc.id}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Hashtags */}
          <ChipSection
            icon={<Hash size={15} className="text-amber-500" />}
            label="Hashtags"
            chips={hashtags}
            input={hashtagInput}
            ref={hashtagRef}
            placeholder="Add hashtag, press Enter..."
            onInput={setHashtagInput}
            onKeyDown={(e) =>
              handleChipInput(e, hashtags, setHashtags, setHashtagInput)
            }
            onRemove={(i) => removeChip(hashtags, setHashtags, i)}
            chipPrefix="#"
            chipColor="bg-amber-100 text-amber-700"
          />

          {/* Mentions */}
          <ChipSection
            icon={<AtSign size={15} className="text-pink-500" />}
            label="Mentions"
            chips={mentions}
            input={mentionInput}
            ref={mentionRef}
            placeholder="Add mention, press Enter..."
            onInput={setMentionInput}
            onKeyDown={(e) =>
              handleChipInput(e, mentions, setMentions, setMentionInput)
            }
            onRemove={(i) => removeChip(mentions, setMentions, i)}
            chipPrefix="@"
            chipColor="bg-pink-100 text-pink-700"
          />

          {/* Tags */}
          <ChipSection
            icon={<Tag size={15} className="text-amber-500" />}
            label="Tags"
            chips={tags}
            input={tagInput}
            ref={tagRef}
            placeholder="Add tag, press Enter..."
            onInput={setTagInput}
            onKeyDown={(e) =>
              handleChipInput(e, tags, setTags, setTagInput)
            }
            onRemove={(i) => removeChip(tags, setTags, i)}
            chipPrefix=""
            chipColor="bg-purple-100 text-purple-700"
          />

          {/* Media URLs */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={15} className="text-pink-500" />
              Media URLs
            </label>
            <div className="flex gap-2">
              <input
                ref={mediaRef}
                type="url"
                value={mediaInput}
                onChange={(e) => setMediaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = mediaInput.trim();
                    if (val && !mediaUrls.includes(val)) {
                      setMediaUrls([...mediaUrls, val]);
                    }
                    setMediaInput("");
                  }
                }}
                placeholder="Paste URL, press Enter..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  const val = mediaInput.trim();
                  if (val && !mediaUrls.includes(val)) {
                    setMediaUrls([...mediaUrls, val]);
                  }
                  setMediaInput("");
                }}
                className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            {mediaUrls.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {mediaUrls.map((url, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-600"
                  >
                    <span className="flex-1 truncate">{url}</span>
                    <button
                      type="button"
                      onClick={() => setMediaUrls(mediaUrls.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-amber-100 bg-gradient-to-r from-amber-50/50 to-pink-50/50">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Chip Section Sub-component ─── */

interface ChipSectionProps {
  icon: React.ReactNode;
  label: string;
  chips: string[];
  input: string;
  placeholder: string;
  onInput: (val: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  chipPrefix: string;
  chipColor: string;
}

const ChipSection = React.forwardRef<HTMLInputElement, ChipSectionProps>(
  (
    {
      icon,
      label,
      chips,
      input,
      placeholder,
      onInput,
      onKeyDown,
      onRemove,
      chipPrefix,
      chipColor,
    },
    ref
  ) => {
    return (
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          {icon}
          {label}
        </label>
        <div className="flex gap-2">
          <input
            ref={ref}
            type="text"
            value={input}
            onChange={(e) => onInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="flex-1 px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all"
          />
          <button
            type="button"
            onClick={() => {
              const val = input.trim();
              if (val && !chips.includes(val)) {
                onKeyDown({
                  key: "Enter",
                  preventDefault: () => {},
                  target: { value: val },
                } as any);
              }
            }}
            className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {chips.map((chip, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${chipColor}`}
              >
                {chipPrefix}
                {chip}
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ChipSection.displayName = "ChipSection";
