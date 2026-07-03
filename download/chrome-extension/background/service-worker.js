// =====================================================================
// SocialPilot Chrome Extension — Background Service Worker (MV3)
// =====================================================================
// Responsibilities:
//   1. Manage auth token lifecycle (auto-refresh)
//   2. Poll for new notifications + push Chrome notifications
//   3. Sync scheduled posts + accounts every 5 minutes
//   4. Handle context-menu and keyboard commands
//   5. Receive messages from popup and content scripts
// =====================================================================

const API_BASE = "https://api.socialpilot.io/v1";
const SYNC_ALARM = "socialpilot-sync";
const HEARTBEAT_ALARM = "socialpilot-heartbeat";
const TOKEN_REFRESH_ALARM = "socialpilot-token-refresh";

// ----- Lifecycle -----
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("[SocialPilot] Installed", details);

  // Schedule recurring alarms (MV3 requires alarms API for periodic work)
  chrome.alarms.create(SYNC_ALARM, { periodInMinutes: 5 });
  chrome.alarms.create(HEARTBEAT_ALARM, { periodInMinutes: 1 });
  chrome.alarms.create(TOKEN_REFRESH_ALARM, { periodInMinutes: 30 });

  // Register context menus for right-click scheduling
  try {
    await chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
      id: "socialpilot-schedule-page",
      title: "Schedule this page with SocialPilot",
      contexts: ["page"],
    });
    chrome.contextMenus.create({
      id: "socialpilot-schedule-selection",
      title: "Schedule selection with SocialPilot",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      id: "socialpilot-schedule-image",
      title: "Schedule this image with SocialPilot",
      contexts: ["image"],
    });
    chrome.contextMenus.create({
      id: "socialpilot-schedule-link",
      title: "Schedule this link with SocialPilot",
      contexts: ["link"],
    });
  } catch (e) {
    console.warn("[SocialPilot] contextMenus error", e);
  }

  // Open onboarding on first install
  if (details.reason === "install") {
    await chrome.tabs.create({ url: "https://socialpilot.io/register?from=extension" });
  }
});

chrome.runtime.onStartup.addListener(() => {
  console.log("[SocialPilot] Browser started — resuming sync");
  chrome.alarms.create(SYNC_ALARM, { periodInMinutes: 5 });
  chrome.alarms.create(HEARTBEAT_ALARM, { periodInMinutes: 1 });
  chrome.alarms.create(TOKEN_REFRESH_ALARM, { periodInMinutes: 30 });
});

// ----- Alarms → periodic work -----
chrome.alarms.onAlarm.addListener(async (alarm) => {
  const token = await getToken();
  if (!token) return; // not logged in

  switch (alarm.name) {
    case SYNC_ALARM:
      await syncData(token);
      break;
    case HEARTBEAT_ALARM:
      await heartbeat(token);
      break;
    case TOKEN_REFRESH_ALARM:
      await refreshToken();
      break;
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
  // Open the popup by sending a message; popup must be open to receive it,
  // so we fall back to opening the dashboard
  try {
    await chrome.action.openPopup();
  } catch {
    await chrome.tabs.create({
      url: `https://socialpilot.io/dashboard?quick=1&src=extension`,
    });
  }
});

// ----- Keyboard commands -----
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open-popup") {
    try {
      await chrome.action.openPopup();
    } catch (e) {
      console.warn("[SocialPilot] openPopup failed", e);
    }
  } else if (command === "quick-schedule-from-page") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => ({
          title: document.title,
          url: location.href,
          description: document.querySelector('meta[name="description"]')?.content || "",
          image: document.querySelector('meta[property="og:image"]')?.content || "",
        }),
      });
      await chrome.storage.local.set({
        pendingSchedule: { source: "keyboard", type: "quick-page", ...result, createdAt: Date.now() },
      });
      try { await chrome.action.openPopup(); } catch {}
    }
  }
});

// ----- Message router (popup ↔ content ↔ background) -----
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        case "AUTH_LOGIN":
          await setToken(message.token);
          await syncData(message.token);
          sendResponse({ ok: true });
          break;
        case "AUTH_LOGOUT":
          await chrome.storage.local.remove(["token", "user", "accounts", "posts", "notifications"]);
          sendResponse({ ok: true });
          break;
        case "GET_STATE":
          sendResponse(await getState());
          break;
        case "CREATE_POST":
          sendResponse(await apiFetch("/posts", "POST", message.payload, await getToken()));
          break;
        case "SCHEDULE_POST":
          sendResponse(await apiFetch("/schedule", "POST", message.payload, await getToken()));
          break;
        case "RETRY_POST":
          sendResponse(await apiFetch(`/posts/${message.postId}/retry`, "POST", {}, await getToken()));
          break;
        case "AI_CAPTION":
          sendResponse(await apiFetch("/ai/caption", "POST", message.payload, await getToken()));
          break;
        case "AI_HASHTAGS":
          sendResponse(await apiFetch("/ai/hashtags", "POST", message.payload, await getToken()));
          break;
        case "OPEN_DASHBOARD":
          await chrome.tabs.create({ url: "https://socialpilot.io/dashboard" });
          sendResponse({ ok: true });
          break;
        default:
          sendResponse({ ok: false, error: "Unknown message type" });
      }
    } catch (err) {
      sendResponse({ ok: false, error: String(err) });
    }
  })();
  return true; // keep channel open for async sendResponse
});

// =====================================================================
// Helpers
// =====================================================================

async function getToken() {
  const { token } = await chrome.storage.local.get("token");
  return token;
}

async function setToken(token) {
  await chrome.storage.local.set({ token, tokenIssuedAt: Date.now() });
}

async function getState() {
  return await chrome.storage.local.get([
    "token",
    "user",
    "subscription",
    "accounts",
    "posts",
    "notifications",
    "settings",
    "lastSyncAt",
  ]);
}

async function apiFetch(path, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  if (res.status === 401) {
    // Token expired — try refresh once
    const refreshed = await refreshToken();
    if (refreshed) return apiFetch(path, method, body, await getToken());
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// Full sync — pull everything the popup needs
async function syncData(token) {
  try {
    const data = await apiFetch("/extension/sync", "GET", null, token);
    await chrome.storage.local.set({
      user: data.user,
      subscription: data.subscription,
      accounts: data.accounts,
      posts: data.posts,
      notifications: data.notifications,
      settings: data.settings,
      lastSyncAt: Date.now(),
    });
    // Push Chrome notifications for unread items
    const { lastSeenNotificationId } = await chrome.storage.local.get("lastSeenNotificationId");
    const fresh = data.notifications.filter((n) => !n.isRead && n.id !== lastSeenNotificationId);
    for (const n of fresh.slice(0, 3)) {
      await chrome.notifications.create(`sp-${n.id}`, {
        type: "basic",
        iconUrl: "icons/icon-128.png",
        title: n.title,
        message: n.body,
        priority: 2,
      });
      await chrome.storage.local.set({ lastSeenNotificationId: n.id });
    }
    // Update badge
    const unread = data.notifications.filter((n) => !n.isRead).length;
    await chrome.action.setBadgeText({ text: unread > 0 ? String(unread) : "" });
    await chrome.action.setBadgeBackgroundColor({ color: "#f59e0b" });
  } catch (e) {
    console.warn("[SocialPilot] sync failed", e);
  }
}

// Lightweight 1-min heartbeat — picks up new notifications only
async function heartbeat(token) {
  try {
    const data = await apiFetch("/extension/heartbeat", "POST", { ts: Date.now() }, token);
    if (data.newNotifications?.length) {
      const { notifications = [] } = await chrome.storage.local.get("notifications");
      const merged = [...data.newNotifications, ...notifications].slice(0, 50);
      await chrome.storage.local.set({ notifications: merged });
      for (const n of data.newNotifications.slice(0, 2)) {
        chrome.notifications.create(`sp-${n.id}`, {
          type: "basic",
          iconUrl: "icons/icon-128.png",
          title: n.title,
          message: n.body,
          priority: 2,
        });
      }
      const unread = merged.filter((n) => !n.isRead).length;
      await chrome.action.setBadgeText({ text: unread > 0 ? String(unread) : "" });
    }
  } catch (e) {
    console.warn("[SocialPilot] heartbeat failed", e);
  }
}

async function refreshToken() {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include", // sends httpOnly refresh-token cookie
    });
    if (!res.ok) throw new Error("Refresh failed");
    const { token } = await res.json();
    await setToken(token);
    return true;
  } catch (e) {
    console.warn("[SocialPilot] token refresh failed — user must re-login", e);
    await chrome.storage.local.remove("token");
    return false;
  }
}

// Listen for clicks on Chrome notifications
chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.notifications.clear(notificationId);
  chrome.tabs.create({ url: "https://socialpilot.io/dashboard?from=notification" });
});
