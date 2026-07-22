// =====================================================================
// SMTools Chrome Extension — Background Service Worker (MV3, v4)
// =====================================================================
// v4 changes from v3:
//   • API_BASE reloaded on every message (so options-page changes take
//     effect immediately without reloading the extension).
//   • OPEN_DASHBOARD and QUICK_SCHEDULE_PAGE now open the LOCAL app
//     (derived from API_BASE) instead of smtools.io.
//   • Notification iconUrl uses chrome.runtime.getURL() for absolute path.
//   • Token expiry checked before every API call (not just on 401).
//   • Heartbeat now sends a deviceId so the server can track per-device.
//   • Forgot-password link in popup opens the local app, not smtools.io.
// =====================================================================

import { getApiBase } from "../lib/config.js";

let API_BASE = "https://smtools.online/api";
const SYNC_ALARM = "smtools-sync";
const HEARTBEAT_ALARM = "smtools-heartbeat";
const TOKEN_REFRESH_ALARM = "smtools-token-refresh";

// Helper: always read the freshest API base before using it
async function apiBase() {
  API_BASE = await getApiBase();
  return API_BASE;
}

// Helper: derive the web app origin from API_BASE (strip /api)
async function webAppOrigin() {
  const base = await apiBase();
  return base.replace(/\/api\/?$/, "");
}

// ----- Lifecycle -----
chrome.runtime.onInstalled.addListener(async (details) => {
  API_BASE = await getApiBase();
  console.log("[SMTools] API base:", API_BASE);
  console.log("[SMTools] Installed", details);

  chrome.alarms.create(SYNC_ALARM, { periodInMinutes: 5 });
  chrome.alarms.create(HEARTBEAT_ALARM, { periodInMinutes: 1 });
  chrome.alarms.create(TOKEN_REFRESH_ALARM, { periodInMinutes: 30 });

  // Register context menus for right-click scheduling
  try {
    await chrome.contextMenus.removeAll();
    const mk = (id, msgKey, contexts, fallback) => chrome.contextMenus.create({
      id,
      title: (chrome.i18n?.getMessage?.(msgKey) || fallback),
      contexts,
    });
    mk("smtools-schedule-page", "ctxSchedulePage", ["page"], "Schedule this page with SMTools");
    mk("smtools-schedule-selection", "ctxScheduleSelection", ["selection"], "Schedule selection with SMTools");
    mk("smtools-schedule-image", "ctxScheduleImage", ["image"], "Schedule this image with SMTools");
    mk("smtools-schedule-link", "ctxScheduleLink", ["link"], "Schedule this link with SMTools");
  } catch (e) {
    console.warn("[SMTools] contextMenus error", e);
  }

  // On first install, open the local web app's welcome page
  if (details.reason === "install") {
    const origin = await webAppOrigin();
    await chrome.tabs.create({ url: `${origin}/welcome?from=extension` });
  }
});

chrome.runtime.onStartup.addListener(async () => {
  API_BASE = await getApiBase();
  console.log("[SMTools] Browser started — resuming sync. API base:", API_BASE);
  chrome.alarms.create(SYNC_ALARM, { periodInMinutes: 5 });
  chrome.alarms.create(HEARTBEAT_ALARM, { periodInMinutes: 1 });
  chrome.alarms.create(TOKEN_REFRESH_ALARM, { periodInMinutes: 30 });
});

// ----- Alarms → periodic work -----
chrome.alarms.onAlarm.addListener(async (alarm) => {
  const token = await getToken();
  if (!token) return;

  try {
    switch (alarm.name) {
      case SYNC_ALARM:
        await syncData(token);
        break;
      case HEARTBEAT_ALARM:
        await heartbeat(token);
        break;
      case TOKEN_REFRESH_ALARM:
        // Proactively refresh if token is close to expiry
        await maybeRefreshToken();
        break;
    }
  } catch (e) {
    console.warn(`[SMTools] alarm ${alarm.name} failed`, e);
  }
});

// ----- Context menu → open popup prefilled -----
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const payload = {
    source: "context-menu",
    type: info.menuItemId,
    pageUrl: info.pageUrl,
    selectionText: info.selectionText,
    srcUrl: info.srcUrl,
    linkUrl: info.linkUrl,
    tabId: tab?.id,
    createdAt: Date.now(),
  };
  await chrome.storage.local.set({ pendingSchedule: payload });

  if (!await tryOpenPopup()) {
    const origin = await webAppOrigin();
    await chrome.tabs.create({ url: `${origin}/dashboard?quick=1&src=extension` });
  }
});

// ----- Keyboard commands -----
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open-popup") {
    await tryOpenPopup();
  } else if (command === "quick-schedule-from-page") {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;
      if (!tab.url || /^(chrome|edge|about|chrome-extension):/i.test(tab.url)) {
        console.warn("[SMTools] Cannot run on this page:", tab.url);
        return;
      }
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => ({
          title: document.title,
          url: location.href,
          description: document.querySelector('meta[name="description"]')?.content || "",
          image: document.querySelector('meta[property="og:image"]')?.content || "",
        }),
      });
      await chrome.storage.local.set({
        pendingSchedule: { source: "keyboard", type: "quick-page", ...(result?.result || {}), createdAt: Date.now() },
      });
      await tryOpenPopup();
    } catch (e) {
      console.warn("[SMTools] quick-schedule-from-page failed", e);
    }
  }
});

// ----- Helper: try chrome.action.openPopup with feature detection -----
async function tryOpenPopup() {
  try {
    if (typeof chrome.action?.openPopup === "function") {
      await chrome.action.openPopup();
      return true;
    }
  } catch (e) {
    console.warn("[SMTools] openPopup failed", e);
  }
  return false;
}

// ----- Message router (popup ↔ content ↔ background) -----
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    // Always reload API_BASE in case the user changed it in Options
    await apiBase();

    try {
      switch (message.type) {
        // -------- AUTH --------
        case "AUTH_LOGIN": {
          const { email, password, remember } = message;
          if (!email || !password) {
            sendResponse({ ok: false, error: "Email and password required" });
            return;
          }
          try {
            const res = await fetch(`${API_BASE}/auth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password, remember: remember !== false }),
            });
            if (!res.ok) {
              const errBody = await res.json().catch(() => ({}));
              sendResponse({
                ok: false,
                error: errBody?.error || `Login failed (${res.status})`,
                status: res.status,
              });
              return;
            }
            const data = await res.json();
            await setToken(data.token, remember !== false);
            await chrome.storage.local.set({ user: data.user, subscription: data.subscription });
            syncData(data.token).catch((e) => console.warn("[SMTools] initial sync failed", e));
            sendResponse({ ok: true, user: data.user });
          } catch (e) {
            sendResponse({ ok: false, error: String(e.message || e) });
          }
          return;
        }

        case "AUTH_REGISTER": {
          const { name, email, password } = message;
          if (!name || !email || !password) {
            sendResponse({ ok: false, error: "Name, email, and password are required" });
            return;
          }
          try {
            const res = await fetch(`${API_BASE}/auth/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, email, password, remember: true }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
              sendResponse({
                ok: false,
                error: data?.error || `Registration failed (${res.status})`,
                status: res.status,
              });
              return;
            }
            await setToken(data.token, true);
            await chrome.storage.local.set({ user: data.user, subscription: data.subscription });
            syncData(data.token).catch((e) => console.warn("[SMTools] initial sync failed", e));
            sendResponse({ ok: true, user: data.user });
          } catch (e) {
            sendResponse({ ok: false, error: String(e.message || e) });
          }
          return;
        }

        case "AUTH_LOGOUT":
          await chrome.storage.local.remove([
            "token", "refreshToken", "user", "accounts", "posts",
            "notifications", "subscription", "settings", "lastSyncAt",
            "tokenExpiresAt",
          ]);
          try { await chrome.action.setBadgeText({ text: "" }); } catch {}
          sendResponse({ ok: true });
          return;

        case "GET_STATE": {
          const data = await chrome.storage.local.get([
            "token", "user", "subscription", "accounts", "posts",
            "notifications", "settings", "lastSyncAt",
          ]);
          if (!data.token) {
            sendResponse({ ok: false, error: "Not authenticated" });
          } else {
            // Always fetch fresh subscription from API so admin plan changes reflect immediately
            try {
              const token = await getToken();
              if (token) {
                const subRes = await apiFetch("/subscription", "GET", null, token);
                if (subRes?.subscription) {
                  data.subscription = subRes.subscription;
                  await chrome.storage.local.set({ subscription: subRes.subscription });
                }
              }
            } catch (e) {
              console.warn("[SMTools] Fresh subscription fetch failed, using cache:", e);
            }
            sendResponse(data);
          }
          return;
        }

        // -------- POSTS / SCHEDULE --------
        case "CREATE_POST": {
          const r = await apiFetch("/posts", "POST", message.payload, await getToken());
          sendResponse(r);
          return;
        }
        case "SCHEDULE_POST": {
          const r = await apiFetch("/schedule", "POST", message.payload, await getToken());
          sendResponse(r);
          return;
        }
        case "RETRY_POST": {
          const r = await apiFetch(`/posts/${message.postId}/retry`, "POST", {}, await getToken());
          sendResponse(r);
          return;
        }

        // -------- AI --------
        case "AI_CAPTION": {
          const r = await apiFetch("/ai/caption", "POST", message.payload, await getToken());
          sendResponse(r);
          return;
        }
        case "AI_HASHTAGS": {
          const r = await apiFetch("/ai/hashtags", "POST", message.payload, await getToken());
          sendResponse(r);
          return;
        }

        // -------- QUICK SCHEDULE FROM PAGE --------
        case "QUICK_SCHEDULE_PAGE": {
          await chrome.storage.local.set({
            pendingSchedule: { ...message.payload, source: message.payload?.source || "page", createdAt: Date.now() },
          });
          const opened = await tryOpenPopup();
          if (!opened) {
            const origin = await webAppOrigin();
            await chrome.tabs.create({ url: `${origin}/dashboard?quick=1&src=extension` });
          }
          sendResponse({ ok: true, popupOpened: opened });
          return;
        }

        // -------- MISC --------
        case "OPEN_DASHBOARD": {
          const origin = await webAppOrigin();
          await chrome.tabs.create({ url: `${origin}/dashboard` });
          sendResponse({ ok: true });
          return;
        }

        case "SYNC_NOW":
          await syncData(await getToken());
          sendResponse({ ok: true });
          return;

        // -------- OPTIONS PAGE: API URL changed --------
        case "API_URL_CHANGED":
          API_BASE = await getApiBase();
          console.log("[SMTools] API base updated to:", API_BASE);
          sendResponse({ ok: true, apiBase: API_BASE });
          return;

        // -------- ACCOUNTS --------
        case "GET_ACCOUNTS": {
          const r = await apiFetch("/accounts", "GET", null, await getToken());
          sendResponse(r);
          return;
        }
        case "DELETE_ACCOUNT": {
          const r = await apiFetch(`/accounts/${message.accountId}`, "DELETE", null, await getToken());
          sendResponse(r);
          return;
        }

        // -------- POSTS (enhanced) --------
        case "GET_POSTS": {
          const r = await apiFetch("/posts", "GET", null, await getToken());
          sendResponse(r);
          return;
        }
        case "DELETE_POST": {
          const r = await apiFetch(`/posts/${message.postId}`, "DELETE", null, await getToken());
          sendResponse(r);
          return;
        }
        case "UPDATE_POST": {
          const r = await apiFetch(`/posts/${message.postId}`, "PUT", message.payload, await getToken());
          sendResponse(r);
          return;
        }

        // -------- SUBSCRIPTION --------
        case "GET_SUBSCRIPTION": {
          const r = await apiFetch("/subscription", "GET", null, await getToken());
          sendResponse(r);
          return;
        }

        default:
          sendResponse({ ok: false, error: `Unknown message type: ${message.type}` });
      }
    } catch (err) {
      console.error("[SMTools] message handler error", err);
      sendResponse({ ok: false, error: String(err.message || err) });
    }
  })();
  return true;
});

// =====================================================================
// Helpers
// =====================================================================

async function getToken() {
  const { token, tokenExpiresAt } = await chrome.storage.local.get(["token", "tokenExpiresAt"]);
  // Bug #10 fix: proactively check expiry
  if (token && tokenExpiresAt && Date.now() > tokenExpiresAt) {
    console.log("[SMTools] Token expired (client-side check) — refreshing...");
    const refreshed = await refreshToken();
    if (!refreshed) {
      await chrome.storage.local.remove("token");
      return null;
    }
    const { token: newToken } = await chrome.storage.local.get("token");
    return newToken;
  }
  return token;
}

async function setToken(token, remember = true) {
  const payload = { token, tokenIssuedAt: Date.now() };
  // Store a client-side expiry so we can proactively refresh.
  // Default: 24h. Remember me: 30 days. We refresh 5 min before expiry.
  const lifetimeMs = remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  payload.tokenExpiresAt = Date.now() + lifetimeMs - 5 * 60 * 1000; // 5 min buffer
  await chrome.storage.local.set(payload);
}

// Proactive refresh — called every 30 min by alarm
async function maybeRefreshToken() {
  const { token, tokenExpiresAt } = await chrome.storage.local.get(["token", "tokenExpiresAt"]);
  if (!token) return false;
  // Refresh if we're within 1 hour of expiry
  if (!tokenExpiresAt || Date.now() > tokenExpiresAt - 60 * 60 * 1000) {
    console.log("[SMTools] Token nearing expiry — refreshing proactively");
    return await refreshToken();
  }
  return false;
}

async function apiFetch(path, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
  } catch (e) {
    throw new Error(`Network error: ${e.message || e}`);
  }

  if (res.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return apiFetch(path, method, body, await getToken());
    }
    await chrome.storage.local.remove([
      "token", "refreshToken", "user", "accounts", "posts", "notifications",
    ]);
    try { await chrome.action.setBadgeText({ text: "" }); } catch {}
    chrome.runtime.sendMessage({ type: "FORCE_LOGOUT", reason: "Token expired" }).catch(() => {});
    throw new Error("Unauthorized — please sign in again");
  }
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error || `API error ${res.status}`);
  }
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : { ok: true };
  } catch {
    return { ok: true, raw: text };
  }
}

// Full sync — pull everything the popup needs
async function syncData(token) {
  if (!token) return;
  try {
    const data = await apiFetch("/extension/sync", "GET", null, token);
    // Always fetch fresh subscription separately to catch admin plan changes
    let subscription = data.subscription;
    try {
      const subRes = await apiFetch("/subscription", "GET", null, token);
      if (subRes?.subscription) subscription = subRes.subscription;
    } catch {}
    await chrome.storage.local.set({
      user: data.user,
      subscription,
      accounts: data.accounts,
      posts: data.posts,
      notifications: data.notifications,
      settings: data.settings,
      lastSyncAt: Date.now(),
    });
    // Push Chrome notifications for unread items
    const { lastSeenNotificationId } = await chrome.storage.local.get("lastSeenNotificationId");
    const fresh = (data.notifications || []).filter((n) => !n.isRead && n.id !== lastSeenNotificationId);
    const iconUrl = chrome.runtime.getURL("icons/icon-128.png");  // Bug #8 fix
    for (const n of fresh.slice(0, 3)) {
      try {
        await chrome.notifications.create(`sp-${n.id}`, {
          type: "basic",
          iconUrl,
          title: n.title,
          message: n.body,
          priority: 2,
        });
      } catch (e) {
        console.warn("[SMTools] notification create failed", e);
      }
      await chrome.storage.local.set({ lastSeenNotificationId: n.id });
    }
    const unread = (data.notifications || []).filter((n) => !n.isRead).length;
    try {
      await chrome.action.setBadgeText({ text: unread > 0 ? String(unread > 99 ? "99+" : unread) : "" });
      await chrome.action.setBadgeBackgroundColor({ color: "#f59e0b" });
    } catch {}
  } catch (e) {
    console.warn("[SMTools] sync failed", e);
  }
}

// Lightweight 1-min heartbeat — picks up new notifications only
async function heartbeat(token) {
  if (!token) return;
  try {
    // Bug #6 fix: send a deviceId so the server can track per-device
    const { user } = await chrome.storage.local.get("user");
    const deviceId = `ext_${user?.id || "unknown"}`;
    const data = await apiFetch("/extension/heartbeat", "POST", { ts: Date.now(), deviceId }, token);
    if (data?.newNotifications?.length) {
      const { notifications = [] } = await chrome.storage.local.get("notifications");
      const merged = [...data.newNotifications, ...notifications].slice(0, 50);
      await chrome.storage.local.set({ notifications: merged });
      const iconUrl = chrome.runtime.getURL("icons/icon-128.png");
      for (const n of data.newNotifications.slice(0, 2)) {
        try {
          chrome.notifications.create(`sp-${n.id}`, {
            type: "basic",
            iconUrl,
            title: n.title,
            message: n.body,
            priority: 2,
          });
        } catch {}
      }
      const unread = merged.filter((n) => !n.isRead).length;
      try {
        await chrome.action.setBadgeText({ text: unread > 0 ? String(unread > 99 ? "99+" : unread) : "" });
      } catch {}
    }
  } catch (e) {
    console.warn("[SMTools] heartbeat failed", e);
  }
}

async function refreshToken() {
  try {
    const { token: currentToken } = await chrome.storage.local.get("token");
    if (!currentToken) return false;

    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Refresh failed");
    const { token } = await res.json();
    await chrome.storage.local.set({
      token,
      tokenIssuedAt: Date.now(),
    });
    return true;
  } catch (e) {
    console.warn("[SMTools] token refresh failed — user must re-login", e);
    await chrome.storage.local.remove("token");
    return false;
  }
}

// Listen for clicks on Chrome notifications
chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.notifications.clear(notificationId);
  // Bug #7 fix: open local app, not smtools.io
  (async () => {
    const origin = await webAppOrigin();
    chrome.tabs.create({ url: `${origin}/dashboard?from=notification` });
  })();
});

// Detect Facebook/Google login completion from tab URL changes
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!changeInfo.url) return;
  const url = changeInfo.url;

  // Facebook login completion
  if (url.includes("/auth/facebook-complete")) {
    try {
      const urlObj = new URL(url);
      const token = urlObj.searchParams.get("token");
      const error = urlObj.searchParams.get("error");

      if (error) {
        console.warn("[SMTools] Facebook login error:", error);
        return;
      }

      if (token && token.startsWith("sp_")) {
        console.log("[SMTools] Facebook login detected — storing token");
        await setToken(token, true);

        // Fetch full user data from API
        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { "Authorization": `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            await chrome.storage.local.set({ user: data.user, subscription: data.subscription });
          }
        } catch (e) {
          console.warn("[SMTools] Failed to fetch user data after Facebook login:", e);
        }

        // Close the tab
        try { await chrome.tabs.remove(tabId); } catch {}

        // Sync data
        syncData(token).catch((e) => console.warn("[SMTools] post-facebook sync failed", e));
      }
    } catch (e) {
      console.warn("[SMTools] Failed to parse Facebook login URL:", e);
    }
  }

  // Google login completion
  if (url.includes("/auth/google-complete")) {
    try {
      const urlObj = new URL(url);
      const token = urlObj.searchParams.get("token");
      if (token && token.startsWith("sp_")) {
        console.log("[SMTools] Google login detected — storing token");
        await setToken(token, true);
        try { await chrome.tabs.remove(tabId); } catch {}
        syncData(token).catch((e) => console.warn("[SMTools] post-google sync failed", e));
      }
    } catch {}
  }
});

// Listen for FORCE_LOGOUT broadcast
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "FORCE_LOGOUT") {
    console.warn("[SMTools] Force logout:", msg.reason);
  }
});
