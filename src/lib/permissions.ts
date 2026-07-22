// =====================================================================
// Plan & permission system — gates premium features by subscription
// =====================================================================

import type { PlanTier } from "@prisma/client";

export interface PlanLimits {
  maxPlatforms: number; // -1 = unlimited
  maxAccountsPerPlatform: number;
  maxScheduledPosts: number; // -1 = unlimited
  maxMediaStorageMB: number;
  features: string[];
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  FREE: {
    maxPlatforms: 1,
    maxAccountsPerPlatform: 1,
    maxScheduledPosts: 50,
    maxMediaStorageMB: 50,
    features: ["basic_dashboard", "community_support"],
  },
  SILVER: {
    maxPlatforms: 2,
    maxAccountsPerPlatform: 10,
    maxScheduledPosts: 200,
    maxMediaStorageMB: 2048,
    features: ["basic_dashboard", "bulk_scheduling", "calendar", "media_library", "email_support"],
  },
  VIP_PRO: {
    maxPlatforms: -1, // unlimited
    maxAccountsPerPlatform: 100,
    maxScheduledPosts: 500,
    maxMediaStorageMB: 20480,
    features: [
      "basic_dashboard",
      "bulk_scheduling",
      "calendar",
      "media_library",
      "ai_features",
      "analytics",
      "priority_queue",
      "advanced_scheduling",
      "team_workspace",
      "api_access",
      "priority_support",
    ],
  },
  ENTERPRISE: {
    maxPlatforms: -1,
    maxAccountsPerPlatform: 1000,
    maxScheduledPosts: 700,
    maxMediaStorageMB: 102400,
    features: [
      "basic_dashboard",
      "bulk_scheduling",
      "calendar",
      "media_library",
      "ai_features",
      "analytics",
      "priority_queue",
      "advanced_scheduling",
      "team_workspace",
      "api_access",
      "priority_support",
      "sso",
      "custom_branding",
      "dedicated_manager",
    ],
  },
};

export const PLANS_CATALOG = [
  {
    tier: "FREE" as PlanTier,
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    tagline: "Get started with the essentials",
    highlight: false,
    cta: "Start Free",
    description: "Perfect for individuals testing the waters of social media automation.",
    features: [
      "1 social platform",
      "1 connected account",
      "50 posts",
      "Basic dashboard",
      "Community support",
    ],
  },
  {
    tier: "SILVER" as PlanTier,
    name: "Silver",
    priceMonthly: 3,
    priceYearly: 30,
    tagline: "For creators growing their audience",
    highlight: true,
    cta: "Choose Silver",
    description: "Scale your content with multi-account management and bulk scheduling.",
    features: [
      "2 social platforms",
      "Up to 10 accounts per platform",
      "200 posts",
      "Bulk scheduling",
      "Calendar view",
      "Media library",
      "Email support",
    ],
  },
  {
    tier: "VIP_PRO" as PlanTier,
    name: "VIP Pro",
    priceMonthly: 10,
    priceYearly: 100,
    tagline: "For agencies and power users",
    highlight: false,
    cta: "Go VIP Pro",
    description: "Unlock the full power of AI, analytics, and team collaboration.",
    features: [
      "Unlimited platforms",
      "Up to 100 accounts per platform",
      "500 posts",
      "AI features (caption, hashtag, emoji)",
      "Advanced analytics",
      "Priority queue",
      "Advanced scheduling",
      "Team workspace",
      "API access",
      "Priority support",
    ],
  },
];

export function getPlanLimits(tier: PlanTier): PlanLimits {
  return PLAN_LIMITS[tier] ?? PLAN_LIMITS.FREE;
}

export function hasFeature(tier: PlanTier, feature: string): boolean {
  const limits = getPlanLimits(tier);
  return limits.features.includes(feature);
}

export function canConnectPlatform(
  tier: PlanTier,
  currentPlatformCount: number
): { allowed: boolean; reason?: string } {
  const limits = getPlanLimits(tier);
  if (limits.maxPlatforms === -1) return { allowed: true };
  if (currentPlatformCount >= limits.maxPlatforms) {
    return {
      allowed: false,
      reason: `Your plan allows ${limits.maxPlatforms} platform(s). Upgrade to connect more.`,
    };
  }
  return { allowed: true };
}

export function canConnectAccount(
  tier: PlanTier,
  platformAccountCount: number
): { allowed: boolean; reason?: string } {
  const limits = getPlanLimits(tier);
  if (limits.maxAccountsPerPlatform === -1) return { allowed: true };
  if (platformAccountCount >= limits.maxAccountsPerPlatform) {
    return {
      allowed: false,
      reason: `Your plan allows ${limits.maxAccountsPerPlatform} account(s) per platform. Upgrade to add more.`,
    };
  }
  return { allowed: true };
}

export function canSchedulePost(
  tier: PlanTier,
  currentPostCount: number
): { allowed: boolean; reason?: string } {
  const limits = getPlanLimits(tier);
  if (limits.maxScheduledPosts === -1) return { allowed: true };
  if (currentPostCount >= limits.maxScheduledPosts) {
    return {
      allowed: false,
      reason: `Your plan allows ${limits.maxScheduledPosts} posts. Upgrade for unlimited.`,
    };
  }
  return { allowed: true };
}

// AI features require VIP_PRO or higher
export function canUseAI(tier: PlanTier): boolean {
  return hasFeature(tier, "ai_features");
}
