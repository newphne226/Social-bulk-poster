// =====================================================================
// SocialPilot Chrome Extension — Shared config
// =====================================================================
// The API base URL is configurable so the extension can point at any
// deployment (localhost dev, staging, production). Default = the local
// Next.js app running on port 3000.
//
// Users can change this from the extension's Options page.
// =====================================================================

const DEFAULT_API_BASE = "http://localhost:3000/api";

export async function getApiBase(): Promise<string> {
  const { apiBaseUrl } = await chrome.storage.local.get("apiBaseUrl");
  return apiBaseUrl || DEFAULT_API_BASE;
}

export async function setApiBase(url: string): Promise<void> {
  await chrome.storage.local.set({ apiBaseUrl: url.replace(/\/$/, "") });
}

export const DEFAULT_API = DEFAULT_API_BASE;
