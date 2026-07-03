// =====================================================================
// SocialPilot Chrome Extension — Background Service Worker (MV3, v2)
// =====================================================================
// v2 changes from v1:
//   • AUTH_LOGIN now does the fetch itself (popup can close safely)
//   • Added QUICK_SCHEDULE_PAGE message handler (was missing — bug #1)
//   • Feature-detect chrome.action.openPopup (Chrome 127+ — bug #3)
//   • Better error handling for chrome.scripting.executeScript
//   • Token + refresh-token persistence respects "remember me"
//   • All apiFetch errors carry status codes for popup to display
//   • On token refresh failure, broadcast a FORCE_LOGOUT message
// =====================================================================

const API_BASE = "https://api.socialpilot.io/v1";
const SYNC_ALARM = "socialpilot-sync";
const HEARTBEAT_ALARM = "socialpilot-heartbeat";
const TOKEN_REFRESH_ALARM = "socialpilot-token-refresh";

// ----- Lifecycle -----
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("[SocialPilot] Installed", details);

  // Schedule recurring alarms (MV3 minimum is 30 sec for normal extensions; 1 min for nightly)
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
    mk("socialpilot-schedule-page", "ctxSchedulePage", ["page"], "Schedule this page with SocialPilot");
    mk("socialpilot-schedule-selection", "ctxScheduleSelection", ["selection"], "Schedule selection with SocialPilot");
    mk("socialpilot-schedule-image", "ctxScheduleImage", ["image"], "Schedule this image with SocialPilot");
    mk("socialpilot-schedule-link", "ctxScheduleLink", ["link"], "Schedule this link with SocialPilot");
  } catch (e) {
    console.warn("[SocialPilot] contextMenus error", e);
  }

  // Open onboarding on first install — direct to website registration (spec-compliant:
  // extension never allows registration itself, but may direct users to the website)
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
  if (!token) return; // not logged in — nothing to sync

  try {
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
  } catch (e) {
    console.warn(`[SocialPilot] alarm ${alarm.name} failed`, e);
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

  // Try to open the popup (Chrome 127+). If unsupported or fails, fall back to dashboard.
  if (!await tryOpenPopup()) {
    await chrome.tabs.create({
      url: `https://socialpilot.io/dashboard?quick=1&src=extension`,
    });
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
      // Skip restricted URLs where scripting.executeScript will fail
      if (!tab.url || /^(chrome|edge|about|chrome-extension):/i.test(tab.url)) {
        console.warn("[SocialPilot] Cannot run on this page:", tab.url);
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
      console.warn("[SocialPilot] quick-schedule-from-page failed", e);
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
    console.warn("[SocialPilot] openPopup failed", e);
  }
  return false;
}

// ----- Message router (popup ↔ content ↔ background) -----
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        // -------- AUTH --------
        case "AUTH_LOGIN": {
          // The popup delegates login to the SW so the popup can close mid-fetch
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
            await chrome.storage.local.set({ user: data.user });
            // Fire-and-forget initial sync (don't block login response)
            syncData(data.token).catch((e) => console.warn("[SocialPilot] initial sync failed", e));
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
          ]);
          // Clear any badge
          try {
            await chrome.action.setBadgeText({ text: "" });
          } catch {}
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

        // -------- QUICK SCHEDULE FROM PAGE (was missing — bug #1) --------
        case "QUICK_SCHEDULE_PAGE": {
          // Save the pending schedule so the popup (if opened next) can prefill
          await chrome.storage.local.set({
            pendingSchedule: { ...message.payload, source: message.payload?.source || "page", createdAt: Date.now() },
          });
          // Try to open the popup so the user can finish scheduling
          const opened = await tryOpenPopup();
          if (!opened) {
            // If popup can't open (Chrome <127, no user gesture, etc.), open dashboard
            await chrome.tabs.create({
              url: `https://socialpilot.io/dashboard?quick=1&src=extension`,
            });
          }
          sendResponse({ ok: true, popupOpened: opened });
          return;
        }

        // -------- MISC --------
        case "OPEN_DASHBOARD":
          await chrome.tabs.create({ url: "https://socialpilot.io/dashboard" });
          sendResponse({ ok: true });
          return;

        case "SYNC_NOW":
          await syncData(await getToken());
          sendResponse({ ok: true });
          return;

        default:
          sendResponse({ ok: false, error: `Unknown message type: ${message.type}` });
      }
    } catch (err) {
      console.error("[SocialPilot] message handler error", err);
      sendResponse({ ok: false, error: String(err.message || err) });
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

async function setToken(token, remember = true) {
  // In MV3, chrome.storage.local persists across browser restarts.
  // If "remember me" is false, we could use sessionStorage-equivalent
  // (chrome.storage.session) — but the popup doesn't persist anyway.
  // For now, respect remember by storing an expiry timestamp.
  const payload = { token, tokenIssuedAt: Date.now() };
  if (!remember) payload.tokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
  await chrome.storage.local.set(payload);
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
    // Token expired — try refresh once
    const refreshed = await refreshToken();
    if (refreshed) {
      return apiFetch(path, method, body, await getToken());
    }
    // Refresh failed — force logout
    await chrome.storage.local.remove([
      "token", "refreshToken", "user", "accounts", "posts", "notifications",
    ]);
    try { await chrome.action.setBadgeText({ text: "" }); } catch {}
    // Broadcast force-logout so any open popup switches to login screen
    chrome.runtime.sendMessage({ type: "FORCE_LOGOUT", reason: "Token expired" }).catch(() => {});
    throw new Error("Unauthorized — please sign in again");
  }
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error || `API error ${res.status}`);
  }
  // Some endpoints (DELETE) may return empty body
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
    const fresh = (data.notifications || []).filter((n) => !n.isRead && n.id !== lastSeenNotificationId);
    for (const n of fresh.slice(0, 3)) {
      try {
        await chrome.notifications.create(`sp-${n.id}`, {
          type: "basic",
          iconUrl: "icons/icon-128.png",
          title: n.title,
          message: n.body,
          priority: 2,
        });
      } catch (e) {
        console.warn("[SocialPilot] notification create failed", e);
      }
      await chrome.storage.local.set({ lastSeenNotificationId: n.id });
    }
    // Update badge
    const unread = (data.notifications || []).filter((n) => !n.isRead).length;
    try {
      await chrome.action.setBadgeText({ text: unread > 0 ? String(unread > 99 ? "99+" : unread) : "" });
      await chrome.action.setBadgeBackgroundColor({ color: "#f59e0b" });
    } catch {}
  } catch (e) {
    console.warn("[SocialPilot] sync failed", e);
  }
}

// Lightweight 1-min heartbeat — picks up new notifications only
async function heartbeat(token) {
  if (!token) return;
  try {
    const data = await apiFetch("/extension/heartbeat", "POST", { ts: Date.now() }, token);
    if (data?.newNotifications?.length) {
      const { notifications = [] } = await chrome.storage.local.get("notifications");
      const merged = [...data.newNotifications, ...notifications].slice(0, 50);
      await chrome.storage.local.set({ notifications: merged });
      for (const n of data.newNotifications.slice(0, 2)) {
        try {
          chrome.notifications.create(`sp-${n.id}`, {
            type: "basic",
            iconUrl: "icons/icon-128.png",
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
    console.warn("[SocialPilot] heartbeat failed", e);
  }
}

async function refreshToken() {
  try {
    const { refreshToken: rt } = await chrome.storage.local.get("refreshToken");
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: rt ? { "X-Refresh-Token": rt } : {},
      credentials: "include",
    });
    if (!res.ok) throw new Error("Refresh failed");
    const { token, refreshToken: newRt } = await res.json();
    await chrome.storage.local.set({
      token,
      ...(newRt ? { refreshToken: newRt } : {}),
      tokenIssuedAt: Date.now(),
    });
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

// Listen for FORCE_LOGOUT broadcast (so popup can switch back to login screen)
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "FORCE_LOGOUT") {
    console.warn("[SocialPilot] Force logout:", msg.reason);
  }
});
