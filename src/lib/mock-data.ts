// =====================================================================
// Mock data store — simulates the database layer for the demo SPA
// In production these would be Prisma queries against PostgreSQL
// =====================================================================

import type { PlanTier, PostStatus, PostType } from "@prisma/client";
import { PLATFORM_LIST } from "./platforms";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: "USER" | "ADMIN";
  plan: PlanTier;
  createdAt: string;
}

export interface MockSocialAccount {
  id: string;
  platform: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  followerCount: number;
  isEnabled: boolean;
  isConnected: boolean;
  lastSyncAt: string;
  groupId?: string;
}

export interface MockPost {
  id: string;
  caption: string;
  platform: string;
  accountUsername: string;
  status: PostStatus;
  type: PostType;
  scheduledAt: string | null;
  publishedAt: string | null;
  mediaUrls: string[];
  hashtags: string[];
  failureReason?: string;
  retryCount: number;
}

export interface MockMedia {
  id: string;
  name: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  thumbnailUrl: string;
  size: number;
  tags: string[];
  createdAt: string;
  folder?: string;
}

export interface MockNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

// ----------------------------------------------------------------------
// Seed data
// ----------------------------------------------------------------------

export const CURRENT_USER: MockUser = {
  id: "u_001",
  email: "alex@socialpilot.io",
  name: "Alex Morgan",
  avatarUrl: "https://i.pravatar.cc/150?img=12",
  role: "ADMIN",
  plan: "VIP_PRO",
  createdAt: "2025-09-15T10:00:00Z",
};

export const MOCK_ACCOUNTS: MockSocialAccount[] = [
  { id: "a1", platform: "facebook", displayName: "Acme Corp", username: "@acmecorp", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=acme", followerCount: 12450, isEnabled: true, isConnected: true, lastSyncAt: "2026-07-03T01:42:00Z" },
  { id: "a2", platform: "facebook", displayName: "Acme Careers", username: "@acmecareers", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=careers", followerCount: 3280, isEnabled: true, isConnected: true, lastSyncAt: "2026-07-03T01:40:00Z" },
  { id: "a3", platform: "instagram", displayName: "Acme Lifestyle", username: "@acme.lifestyle", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=lifestyle", followerCount: 28900, isEnabled: true, isConnected: true, lastSyncAt: "2026-07-03T01:38:00Z" },
  { id: "a4", platform: "instagram", displayName: "Acme Food", username: "@acme.food", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=food", followerCount: 5621, isEnabled: false, isConnected: true, lastSyncAt: "2026-07-02T22:10:00Z" },
  { id: "a5", platform: "x", displayName: "Acme", username: "@acme", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=acmex", followerCount: 45120, isEnabled: true, isConnected: true, lastSyncAt: "2026-07-03T01:35:00Z" },
  { id: "a6", platform: "linkedin", displayName: "Acme Inc.", username: "acme-inc", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=acmelink", followerCount: 18900, isEnabled: true, isConnected: true, lastSyncAt: "2026-07-03T01:30:00Z" },
  { id: "a7", platform: "pinterest", displayName: "Acme Pins", username: "@acmepins", avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=pins", followerCount: 2140, isEnabled: true, isConnected: false, lastSyncAt: "2026-07-01T18:00:00Z" },
];

const now = new Date();
const iso = (offsetMinutes: number) =>
  new Date(now.getTime() + offsetMinutes * 60000).toISOString();

export const MOCK_POSTS: MockPost[] = [
  { id: "p1", caption: "🚀 Big announcement! Our summer sale starts this Friday. Save up to 40% across all categories. Don't miss out! #SummerSale", platform: "facebook", accountUsername: "@acmecorp", status: "SCHEDULED", type: "IMAGE", scheduledAt: iso(45), publishedAt: null, mediaUrls: ["https://picsum.photos/seed/p1/800/600"], hashtags: ["SummerSale", "Deals"], retryCount: 0 },
  { id: "p2", caption: "Behind the scenes of our new product photoshoot 📸 #BTS", platform: "instagram", accountUsername: "@acme.lifestyle", status: "PUBLISHED", type: "IMAGE", scheduledAt: iso(-120), publishedAt: iso(-118), mediaUrls: ["https://picsum.photos/seed/p2/800/800"], hashtags: ["BTS", "Photoshoot"], retryCount: 0 },
  { id: "p3", caption: "5 productivity tips every founder should know 🧵", platform: "x", accountUsername: "@acme", status: "PUBLISHED", type: "TEXT", scheduledAt: iso(-240), publishedAt: iso(-239), mediaUrls: [], hashtags: ["productivity", "founders"], retryCount: 0 },
  { id: "p4", caption: "We're hiring a Senior Product Designer! Join our remote-first team.", platform: "linkedin", accountUsername: "acme-inc", status: "FAILED", type: "IMAGE", scheduledAt: iso(-360), publishedAt: null, mediaUrls: ["https://picsum.photos/seed/p4/1200/630"], hashtags: ["hiring", "design"], failureReason: "Token expired. Please reconnect the account.", retryCount: 2 },
  { id: "p5", caption: "New blog post: The Future of Social Media Automation in 2026", platform: "facebook", accountUsername: "@acmecorp", status: "DRAFT", type: "LINK", scheduledAt: null, publishedAt: null, mediaUrls: [], hashtags: ["blog", "automation"], retryCount: 0 },
  { id: "p6", caption: "Weekend vibes ☀️ Tag someone who needs this view!", platform: "instagram", accountUsername: "@acme.lifestyle", status: "QUEUED", type: "IMAGE", scheduledAt: iso(180), publishedAt: null, mediaUrls: ["https://picsum.photos/seed/p6/800/800"], hashtags: ["weekend", "vibes"], retryCount: 0 },
  { id: "p7", caption: "Pin of the week: 10 minimalist workspace ideas", platform: "pinterest", accountUsername: "@acmepins", status: "SCHEDULED", type: "IMAGE", scheduledAt: iso(720), publishedAt: null, mediaUrls: ["https://picsum.photos/seed/p7/800/1200"], hashtags: ["minimalist", "workspace"], retryCount: 0 },
  { id: "p8", caption: "Customer spotlight: See how Acme transformed their workflow", platform: "linkedin", accountUsername: "acme-inc", status: "SCHEDULED", type: "IMAGE", scheduledAt: iso(1440), publishedAt: null, mediaUrls: ["https://picsum.photos/seed/p8/1200/630"], hashtags: ["customer", "spotlight"], retryCount: 0 },
  { id: "p9", caption: "Quick poll: Coffee or tea to start your day? ☕ vs 🍵", platform: "x", accountUsername: "@acme", status: "PUBLISHED", type: "TEXT", scheduledAt: iso(-720), publishedAt: iso(-719), mediaUrls: [], hashtags: ["poll"], retryCount: 0 },
  { id: "p10", caption: "Flash sale! 24 hours only 🔥", platform: "facebook", accountUsername: "@acmecareers", status: "PAUSED", type: "IMAGE", scheduledAt: iso(60), publishedAt: null, mediaUrls: ["https://picsum.photos/seed/p10/800/600"], hashtags: ["flashsale"], retryCount: 0 },
];

export const MOCK_MEDIA: MockMedia[] = [
  { id: "m1", name: "summer-banner.jpg", type: "IMAGE", url: "https://picsum.photos/seed/m1/800/600", thumbnailUrl: "https://picsum.photos/seed/m1/200/150", size: 245000, tags: ["summer", "banner", "campaign"], createdAt: iso(-4320), folder: "Campaigns" },
  { id: "m2", name: "product-shot.png", type: "IMAGE", url: "https://picsum.photos/seed/m2/800/800", thumbnailUrl: "https://picsum.photos/seed/m2/200/200", size: 512000, tags: ["product", "catalog"], createdAt: iso(-8640), folder: "Products" },
  { id: "m3", name: "promo-video.mp4", type: "VIDEO", url: "https://picsum.photos/seed/m3/1280/720", thumbnailUrl: "https://picsum.photos/seed/m3/200/120", size: 8400000, tags: ["promo", "video"], createdAt: iso(-1440), folder: "Videos" },
  { id: "m4", name: "team-photo.jpg", type: "IMAGE", url: "https://picsum.photos/seed/m4/800/600", thumbnailUrl: "https://picsum.photos/seed/m4/200/150", size: 380000, tags: ["team", "culture"], createdAt: iso(-7200), folder: "Brand" },
  { id: "m5", name: "infographic.png", type: "IMAGE", url: "https://picsum.photos/seed/m5/800/1000", thumbnailUrl: "https://picsum.photos/seed/m5/200/250", size: 920000, tags: ["infographic", "stats"], createdAt: iso(-2880), folder: "Content" },
  { id: "m6", name: "tutorial.mp4", type: "VIDEO", url: "https://picsum.photos/seed/m6/1280/720", thumbnailUrl: "https://picsum.photos/seed/m6/200/120", size: 12300000, tags: ["tutorial", "video"], createdAt: iso(-10080), folder: "Videos" },
  { id: "m7", name: "quote-card.jpg", type: "IMAGE", url: "https://picsum.photos/seed/m7/800/800", thumbnailUrl: "https://picsum.photos/seed/m7/200/200", size: 180000, tags: ["quote", "social"], createdAt: iso(-5760), folder: "Content" },
  { id: "m8", name: "logo-dark.png", type: "IMAGE", url: "https://picsum.photos/seed/m8/600/200", thumbnailUrl: "https://picsum.photos/seed/m8/200/67", size: 95000, tags: ["logo", "brand"], createdAt: iso(-21600), folder: "Brand" },
];

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  { id: "n1", type: "POST_FAILED", title: "Post failed to publish", body: "Your LinkedIn post 'We're hiring...' failed: Token expired.", isRead: false, createdAt: iso(-180) },
  { id: "n2", type: "POST_PUBLISHED", title: "Post published", body: "Your X post '5 productivity tips...' is now live.", isRead: false, createdAt: iso(-240) },
  { id: "n3", type: "ACCOUNT_DISCONNECTED", title: "Account disconnected", body: "Pinterest account '@acmepins' needs reconnection.", isRead: false, createdAt: iso(-360) },
  { id: "n4", type: "SUBSCRIPTION_RENEWED", title: "Subscription renewed", body: "Your VIP Pro subscription was renewed for $10.00.", isRead: true, createdAt: iso(-4320) },
  { id: "n5", type: "POST_SCHEDULED", title: "Post scheduled", body: "Your Facebook post is scheduled for 2:45 PM.", isRead: true, createdAt: iso(-30) },
];

// Admin stats
export const MOCK_ADMIN_STATS = {
  totalUsers: 14823,
  activeUsers30d: 8912,
  payingUsers: 2147,
  mrr: 18420, // dollars
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
  recentUsers: [
    { id: "u1", name: "Sofia Reyes", email: "sofia@example.com", plan: "VIP_PRO", status: "ACTIVE", joinedAt: "2026-07-02" },
    { id: "u2", name: "Marcus Chen", email: "marcus@example.com", plan: "SILVER", status: "ACTIVE", joinedAt: "2026-07-02" },
    { id: "u3", name: "Priya Patel", email: "priya@example.com", plan: "FREE", status: "ACTIVE", joinedAt: "2026-07-01" },
    { id: "u4", name: "Tom Becker", email: "tom@example.com", plan: "SILVER", status: "SUSPENDED", joinedAt: "2026-06-28" },
    { id: "u5", name: "Lena Müller", email: "lena@example.com", plan: "VIP_PRO", status: "ACTIVE", joinedAt: "2026-06-25" },
  ],
};

// Analytics overview for the user dashboard
export const MOCK_ANALYTICS = {
  totalReach: 184230,
  totalEngagement: 42180,
  totalPosts: 287,
  followerGrowth: 8.4,
  engagementRate: 6.2,
  postsByStatus: [
    { name: "Published", value: 218, color: "#10b981" },
    { name: "Scheduled", value: 42, color: "#3b82f6" },
    { name: "Draft", value: 18, color: "#94a3b8" },
    { name: "Failed", value: 9, color: "#ef4444" },
  ],
  engagementTrend: [
    { date: "Jun 27", reach: 12400, engagement: 3100 },
    { date: "Jun 28", reach: 15200, engagement: 3800 },
    { date: "Jun 29", reach: 14100, engagement: 3500 },
    { date: "Jun 30", reach: 18700, engagement: 4900 },
    { date: "Jul 1", reach: 21300, engagement: 5400 },
    { date: "Jul 2", reach: 24800, engagement: 6200 },
    { date: "Jul 3", reach: 28200, engagement: 7100 },
  ],
  topPosts: [
    { id: "tp1", caption: "Behind the scenes of our new product photoshoot", platform: "instagram", reach: 28400, engagement: 12.4 },
    { id: "tp2", caption: "5 productivity tips every founder should know", platform: "x", reach: 22100, engagement: 8.9 },
    { id: "tp3", caption: "We're hiring a Senior Product Designer!", platform: "linkedin", reach: 18900, engagement: 6.2 },
  ],
};

export const MOCK_INVOICES = [
  { id: "INV-2026-0089", date: "2026-07-01", amount: 10, status: "paid", plan: "VIP Pro — Monthly" },
  { id: "INV-2026-0061", date: "2026-06-01", amount: 10, status: "paid", plan: "VIP Pro — Monthly" },
  { id: "INV-2026-0033", date: "2026-05-01", amount: 10, status: "paid", plan: "VIP Pro — Monthly" },
  { id: "INV-2026-0008", date: "2026-04-01", amount: 3, status: "paid", plan: "Silver — Monthly" },
];

export const MOCK_TICKETS = [
  { id: "T-1001", subject: "Pinterest connection keeps dropping", user: "priya@example.com", priority: "HIGH", status: "OPEN", createdAt: "2026-07-02" },
  { id: "T-1000", subject: "Question about bulk CSV upload", user: "marcus@example.com", priority: "NORMAL", status: "PENDING", createdAt: "2026-07-01" },
  { id: "T-0999", subject: "Feature request: TikTok support", user: "sofia@example.com", priority: "LOW", status: "OPEN", createdAt: "2026-06-30" },
  { id: "T-0998", subject: "Invoice download not working", user: "tom@example.com", priority: "NORMAL", status: "RESOLVED", createdAt: "2026-06-29" },
];

export const PLATFORMS_SUMMARY = PLATFORM_LIST.map((p) => ({
  id: p.id,
  name: p.name,
  color: p.color,
  icon: p.icon,
  accountCount: MOCK_ACCOUNTS.filter((a) => a.platform === p.id).length,
}));
