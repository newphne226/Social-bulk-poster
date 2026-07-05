// =====================================================================
// SocialPilot Chrome Extension — Shared config
// =====================================================================
// The API base URL is configurable so the extension can point at any
// deployment (localhost dev, staging, production). Default = the local
// Next.js app running on port 3000.
//
// Users can change this from the extension's Options page.
//
// IMPORTANT: This is a plain JavaScript file (NOT TypeScript). It is
// loaded directly by Chrome as an ES module — no compiler step. Do NOT
// use TypeScript type annotations here — they will cause a SyntaxError
// and the entire extension will fail to load.
// =====================================================================

const DEFAULT_API_BASE = "http://localhost:3000/api";

export async function getApiBase() {
  const { apiBaseUrl } = await chrome.storage.local.get("apiBaseUrl");
  return apiBaseUrl || DEFAULT_API_BASE;
}

export async function setApiBase(url) {
  await chrome.storage.local.set({ apiBaseUrl: url.replace(/\/$/, "") });
}

export const DEFAULT_API = DEFAULT_API_BASE;
