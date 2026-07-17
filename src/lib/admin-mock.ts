// Admin mock data — server-side copy used by admin API routes.
// This is a temporary shim to keep admin components working while API integration completes.

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

export const ADMIN_USERS: AdminUserRow[] = [];

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

export const ADMIN_COUPONS: AdminCoupon[] = [];

export interface AdminFeatureFlag {
  id: string;
  key: string;
  description: string;
  enabled: boolean;
  rollout: number;
  plans: string[];
  updatedAt: string;
}

export const ADMIN_FEATURE_FLAGS: AdminFeatureFlag[] = [];

export interface AdminLogEntry {
  id: string;
  level: "info" | "warn" | "error" | "debug";
  source: "api" | "worker" | "extension" | "web";
  message: string;
  createdAt: string;
}

export const ADMIN_LOGS: AdminLogEntry[] = [];

export const ADMIN_STATS = {
  totalUsers: 0,
  activeUsers30d: 0,
  payingUsers: 0,
  mrr: 0,
  postsScheduledToday: 0,
  postsPublishedToday: 0,
  failedPosts24h: 0,
  dailyActiveUsers: [],
  revenueByPlan: [],
  postsByPlatform: [],
};