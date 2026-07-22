// =====================================================================
// SMTools Chrome Extension — Shared config
// =====================================================================
// The API base URL is configurable so the extension can point at any
// deployment (localhost dev, staging, production). Default = the
// production deployment at smtools.online.
//
// Users can change this from the extension's Options page.
// =====================================================================

const DEFAULT_API_BASE = "https://smtools.online/api";

export async function getApiBase() {
  const { apiBaseUrl } = await chrome.storage.local.get("apiBaseUrl");
  return apiBaseUrl || DEFAULT_API_BASE;
}

export async function setApiBase(url) {
  await chrome.storage.local.set({ apiBaseUrl: url.replace(/\/$/, "") });
}

export const DEFAULT_API = DEFAULT_API_BASE;
