// Mock data store — simulates the database layer for the demo SPA
// This is a temporary shim to keep frontend components working while API integration completes

export interface MockUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  plan: "FREE" | "SILVER" | "VIP_PRO" | "ENTERPRISE";
  role: "USER" | "ADMIN" | "OWNER";
  createdAt: string;
  lastLoginAt: string;
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
}

export interface MockPost {
  id: string;
  caption: string;
  platform: string;
  accountUsername: string;
  accountId: string;
  status: "DRAFT" | "SCHEDULED" | "QUEUED" | "PUBLISHED" | "FAILED" | "PUBLISHING";
  type: "TEXT" | "IMAGE" | "VIDEO" | "CAROUSEL" | "STORY" | "REEL" | "LINK";
  scheduledAt: string | null;
  publishedAt: string | null;
  mediaUrls: string[];
  hashtags: string[];
  retryCount: number;
}

export interface MockMedia {
  id: string;
  name: string;
  type: "IMAGE" | "VIDEO" | "GIF" | "AUDIO" | "DOCUMENT";
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  tags: string[];
  altText: string | null;
  isPublic: boolean;
  createdAt: string;
}

export interface MockNotification {
  id: string;
  type: "POST_PUBLISHED" | "POST_FAILED" | "POST_SCHEDULED" | "ACCOUNT_DISCONNECTED" | "ACCOUNT_EXPIRED" | "SUBSCRIPTION_RENEWED" | "SUBSCRIPTION_CANCELED" | "PAYMENT_FAILED" | "PAYMENT_SUCCEEDED" | "TEAM_INVITE" | "SYSTEM" | "ANNOUNCEMENT";
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface MockAnalytics {
  date: string;
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  impressions: number;
  reach: number;
}

export interface MockInvoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface MockCryptoPayment {
  id: string;
  amount: number;
  amountUsd: number;
  asset: string;
  network: string;
  chainId: number;
  fromAddress: string | null;
  txHash: string | null;
  confirmations: number;
  status: "PENDING" | "CONFIRMING" | "CONFIRMED" | "EXPIRED" | "FAILED";
  plan: string | null;
  cycle: string | null;
  subscriptionId: string | null;
  blockNumber: bigint | null;
  createdAt: string;
  expiresAt: string;
  confirmedAt: string | null;
}

// Export empty arrays and null objects to prevent build errors
// Real data should come from API calls
export const CURRENT_USER: MockUser = {
  id: "",
  email: "",
  name: "",
  avatarUrl: "",
  plan: "FREE",
  role: "USER",
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
};

export const MOCK_ACCOUNTS: MockSocialAccount[] = [];

export const MOCK_POSTS: MockPost[] = [];

export const MOCK_MEDIA: MockMedia[] = [];

export const MOCK_NOTIFICATIONS: MockNotification[] = [];

export const MOCK_ANALYTICS: MockAnalytics[] = [];

export const MOCK_INVOICES: MockInvoice[] = [];

export const MOCK_ADMIN_STATS = {
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