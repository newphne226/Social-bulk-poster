// =====================================================================
// Admin mock data — server-side copy used by admin API routes.
// (Cannot import @/lib/mock-data because it pulls in client-side deps.)
// =====================================================================

export const ADMIN_STATS = {
  totalUsers: 14823,
  activeUsers30d: 8912,
  payingUsers: 2147,
  mrr: 18420,
  postsScheduledToday: 38201,
  postsPublishedToday: 28455,
  failedPosts24h: 412,
  dailyActiveUsers: [
    { date: "Jul 27", value: 7421 },
    { date: "Jul 28", value: 7892 },
    { date: "Jul 29", value: 8102 },
    { date: "Jul 30", value: 8456 },
    { date: "Jul 31", value: 8234 },
    { date: "Aug 1", value: 8612 },
    { date: "Aug 2", value: 8912 },
  ],
  revenueByPlan: [
    { name: "Free", value: 0, color: "#94a3b8" },
    { name: "Silver", value: 5240, color: "#cbd5e1" },
    { name: "VIP Pro", value: 13180, color: "#f59e0b" },
  ],
  postsByPlatform: [
    { platform: "Facebook", count: 14210, color: "#1877F2" },
    { platform: "Instagram", count: 11840, color: "#E4405F" },
    { platform: "X", count: 7621, color: "#000000" },
    { platform: "LinkedIn", count: 5210, color: "#0A66C2" },
    { platform: "Pinterest", count: 2120, color: "#BD081C" },
  ],
};

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "ACTIVE" | "SUSPENDED" | "BANNED" | "DELETED";
  joinedAt: string;
  posts: number;
  role: "USER" | "ADMIN";
}

export const ADMIN_USERS: AdminUserRow[] = [
  { id: "u1", name: "Sofia Reyes", email: "sofia@example.com", plan: "VIP_PRO", status: "ACTIVE", joinedAt: "2026-07-02", posts: 412, role: "USER" },
  { id: "u2", name: "Marcus Chen", email: "marcus@example.com", plan: "SILVER", status: "ACTIVE", joinedAt: "2026-07-02", posts: 187, role: "USER" },
  { id: "u3", name: "Priya Patel", email: "priya@example.com", plan: "FREE", status: "ACTIVE", joinedAt: "2026-07-01", posts: 12, role: "USER" },
  { id: "u4", name: "Tom Becker", email: "tom@example.com", plan: "SILVER", status: "SUSPENDED", joinedAt: "2026-06-28", posts: 54, role: "USER" },
  { id: "u5", name: "Lena Müller", email: "lena@example.com", plan: "VIP_PRO", status: "ACTIVE", joinedAt: "2026-06-25", posts: 932, role: "USER" },
  { id: "u_001", name: "Alex Morgan", email: "alex@socialpilot.io", plan: "VIP_PRO", status: "ACTIVE", joinedAt: "2025-09-15", posts: 1245, role: "ADMIN" },
];

export interface AdminCoupon {
  id: string;
  code: string;
  percentOff: number | null;
  duration: "ONCE" | "REPEATING" | "FOREVER";
  active: boolean;
  redeemed: number;
  maxRedemptions: number | null;
  expiresAt: string | null;
}

export const ADMIN_COUPONS: AdminCoupon[] = [
  { id: "c1", code: "LAUNCH50", percentOff: 50, duration: "ONCE", active: true, redeemed: 1240, maxRedemptions: 5000, expiresAt: "2026-12-31" },
  { id: "c2", code: "SUMMER20", percentOff: 20, duration: "REPEATING", active: true, redeemed: 312, maxRedemptions: null, expiresAt: null },
  { id: "c3", code: "VIPONLY", percentOff: 100, duration: "ONCE", active: false, redeemed: 45, maxRedemptions: 100, expiresAt: "2026-08-15" },
];

export interface AdminFeatureFlag {
  id: string;
  key: string;
  description: string;
  enabled: boolean;
  rollout: number;
  plans: string[];
  updatedAt: string;
}

export const ADMIN_FEATURE_FLAGS: AdminFeatureFlag[] = [
  { id: "f1", key: "ai_caption_v2", description: "Next-gen caption generator", enabled: true, rollout: 100, plans: ["VIP_PRO", "ENTERPRISE"], updatedAt: "2026-07-01T10:00:00Z" },
  { id: "f2", key: "bulk_csv_upload", description: "CSV bulk scheduling", enabled: true, rollout: 100, plans: ["SILVER", "VIP_PRO", "ENTERPRISE"], updatedAt: "2026-06-20T12:00:00Z" },
  { id: "f3", key: "tiktok_beta", description: "TikTok beta integration", enabled: false, rollout: 25, plans: ["VIP_PRO", "ENTERPRISE"], updatedAt: "2026-07-03T09:30:00Z" },
  { id: "f4", key: "team_workspaces", description: "Team collaboration", enabled: true, rollout: 100, plans: ["VIP_PRO", "ENTERPRISE"], updatedAt: "2026-05-15T14:00:00Z" },
];

export interface AdminLogEntry {
  id: string;
  level: "info" | "warn" | "error" | "debug";
  source: "api" | "worker" | "extension" | "web";
  message: string;
  createdAt: string;
}

export const ADMIN_LOGS: AdminLogEntry[] = [
  { id: "l1", level: "info", source: "api", message: "POST /api/posts — created post p1", createdAt: "2026-07-03T09:42:00Z" },
  { id: "l2", level: "warn", source: "worker", message: "Pinterest token expiring soon for account a7", createdAt: "2026-07-03T09:30:00Z" },
  { id: "l3", level: "error", source: "worker", message: "Failed to publish post p4 — token expired", createdAt: "2026-07-03T08:15:00Z" },
  { id: "l4", level: "info", source: "extension", message: "Extension heartbeat received from device d3", createdAt: "2026-07-03T08:00:00Z" },
  { id: "l5", level: "debug", source: "api", message: "GET /api/schedule — returned 8 jobs", createdAt: "2026-07-03T07:45:00Z" },
  { id: "l6", level: "error", source: "api", message: "Stripe webhook signature failed (event evt_001)", createdAt: "2026-07-03T07:20:00Z" },
  { id: "l7", level: "info", source: "web", message: "User u5 upgraded to VIP_PRO", createdAt: "2026-07-02T22:10:00Z" },
];
