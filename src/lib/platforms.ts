// =====================================================================
// Platform definitions — modular & extensible
// To add a new platform: add an entry here, no schema changes needed
// =====================================================================

export type PlatformId =
  | "facebook"
  | "instagram"
  | "x"
  | "linkedin"
  | "pinterest"
  | (string & {}); // extensible

export interface PlatformDefinition {
  id: PlatformId;
  name: string;
  color: string; // brand color hex
  icon: string; // emoji or short label for fallback
  authUrl?: string;
  scopes: string[];
  features: {
    text: boolean;
    image: boolean;
    video: boolean;
    carousel: boolean;
    story: boolean;
    reel: boolean;
    link: boolean;
    scheduling: boolean;
    analytics: boolean;
  };
  limits: {
    captionLength: number;
    maxImages: number;
    maxVideoLengthSec: number;
    maxHashtags: number;
  };
  docs?: string;
}

export const PLATFORMS: Record<PlatformId, PlatformDefinition> = {
  facebook: {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    icon: "f",
    scopes: ["pages_manage_posts", "pages_read_engagement", "publish_video"],
    features: { text: true, image: true, video: true, carousel: true, story: true, reel: false, link: true, scheduling: true, analytics: true },
    limits: { captionLength: 63206, maxImages: 10, maxVideoLengthSec: 240, maxHashtags: 100 },
    docs: "https://developers.facebook.com/docs/pages-api",
  },
  instagram: {
    id: "instagram",
    name: "Instagram",
    color: "#E4405F",
    icon: "IG",
    scopes: ["instagram_content_publish", "instagram_basic", "instagram_manage_insights"],
    features: { text: true, image: true, video: true, carousel: true, story: true, reel: true, link: false, scheduling: true, analytics: true },
    limits: { captionLength: 2200, maxImages: 10, maxVideoLengthSec: 90, maxHashtags: 30 },
    docs: "https://developers.facebook.com/docs/instagram-api",
  },
  x: {
    id: "x",
    name: "X (Twitter)",
    color: "#000000",
    icon: "X",
    scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
    features: { text: true, image: true, video: true, carousel: false, story: false, reel: false, link: true, scheduling: true, analytics: true },
    limits: { captionLength: 280, maxImages: 4, maxVideoLengthSec: 140, maxHashtags: 100 },
    docs: "https://developer.twitter.com/en/docs",
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    color: "#0A66C2",
    icon: "in",
    scopes: ["w_member_social", "r_organization_social", "rw_organization_admin"],
    features: { text: true, image: true, video: true, carousel: false, story: false, reel: false, link: true, scheduling: true, analytics: true },
    limits: { captionLength: 3000, maxImages: 9, maxVideoLengthSec: 600, maxHashtags: 30 },
    docs: "https://learn.microsoft.com/linkedin/marketing",
  },
  pinterest: {
    id: "pinterest",
    name: "Pinterest",
    color: "#BD081C",
    icon: "P",
    scopes: ["boards:read", "pins:read", "pins:write"],
    features: { text: false, image: true, video: true, carousel: false, story: false, reel: false, link: true, scheduling: true, analytics: true },
    limits: { captionLength: 500, maxImages: 1, maxVideoLengthSec: 300, maxHashtags: 20 },
    docs: "https://developers.pinterest.com/docs/api/v5/",
  },
};

export const PLATFORM_LIST = Object.values(PLATFORMS);

export function getPlatform(id: string): PlatformDefinition | undefined {
  return PLATFORMS[id as PlatformId];
}

export function getPlatformColor(id: string): string {
  return PLATFORMS[id as PlatformId]?.color ?? "#64748B";
}
