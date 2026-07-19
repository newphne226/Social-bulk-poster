// =====================================================================
// SocialPilot Chrome Extension — Options page logic (v3)
// =====================================================================
// v3 changes:
//   • API base URL config — point the extension at any deployment
//   • Guard against missing elements
//   • Sync interval validation (min 1, max 60)
//   • Logout button shows confirmation feedback
// =====================================================================

document.addEventListener("DOMContentLoaded", async () => {
  const { user, settings = {}, apiBaseUrl } = await chrome.storage.local.get([
    "user", "settings", "apiBaseUrl",
  ]);

  const emailEl = document.getElementById("user-email");
  if (emailEl) emailEl.textContent = user?.email || "Not logged in";

  // ----- API base URL -----
  const apiUrlInput = document.getElementById("api-base-url");
  const apiUrlStatus = document.getElementById("api-url-status");
  if (apiUrlInput) {
    apiUrlInput.value = apiBaseUrl || "https://smtools.online/api";
  }
  const saveApiUrl = document.getElementById("save-api-url");
  if (saveApiUrl) {
    saveApiUrl.addEventListener("click", async () => {
      const url = apiUrlInput.value.trim().replace(/\/$/, "");
      if (!url) {
        if (apiUrlStatus) apiUrlStatus.textContent = "URL cannot be empty";
        return;
      }
      try {
        new URL(url);
      } catch {
        if (apiUrlStatus) apiUrlStatus.textContent = "Invalid URL";
        return;
      }
      await chrome.storage.local.set({ apiBaseUrl: url });
      // Bug #4 fix: notify the background SW so it picks up the new URL immediately
      try {
        await chrome.runtime.sendMessage({ type: "API_URL_CHANGED" });
      } catch {}
      if (apiUrlStatus) apiUrlStatus.textContent = "✓ Saved — the extension will use this URL immediately";
      showStatus("API URL saved");
    });
  }
  const resetApiUrl = document.getElementById("reset-api-url");
  if (resetApiUrl) {
    resetApiUrl.addEventListener("click", async () => {
      await chrome.storage.local.remove("apiBaseUrl");
      if (apiUrlInput) apiUrlInput.value = "https://smtools.online/api";
      if (apiUrlStatus) apiUrlStatus.textContent = "✓ Reset to default";
      showStatus("API URL reset to default");
    });
  }

  // Load saved toggles
  setToggle("auto-sync", settings.autoSync !== false);
  setToggle("desktop-notif", settings.desktopNotif !== false);
  setToggle("sound-fail", settings.soundOnFail === true);
  setToggle("img-overlay", settings.imgOverlay !== false);
  setToggle("dark-mode", settings.darkMode === true);

  const syncIntervalEl = document.getElementById("sync-interval");
  if (syncIntervalEl && settings.syncInterval) syncIntervalEl.value = settings.syncInterval;
  const platformEl = document.getElementById("default-platform");
  if (platformEl && settings.defaultPlatform) platformEl.value = settings.defaultPlatform;

  // Bind toggle clicks
  ["auto-sync", "desktop-notif", "sound-fail", "img-overlay", "dark-mode"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", () => {
      el.classList.toggle("on");
      el.setAttribute("aria-checked", el.classList.contains("on"));
      saveSettings();
    });
  });

  if (syncIntervalEl) {
    syncIntervalEl.addEventListener("change", () => {
      const v = parseInt(syncIntervalEl.value, 10);
      if (isNaN(v) || v < 1) syncIntervalEl.value = 1;
      if (v > 60) syncIntervalEl.value = 60;
      saveSettings();
    });
  }
  if (platformEl) platformEl.addEventListener("change", saveSettings);

  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      if (!confirm("Log out of SocialPilot?")) return;
      logoutBtn.disabled = true;
      logoutBtn.textContent = "Logging out...";
      try {
        await chrome.runtime.sendMessage({ type: "AUTH_LOGOUT" });
        if (emailEl) emailEl.textContent = "Not logged in";
        showStatus("Logged out successfully");
      } catch (e) {
        showStatus("Logout failed: " + e.message, true);
      } finally {
        logoutBtn.disabled = false;
        logoutBtn.textContent = "Log out";
      }
    });
  }
});

function setToggle(id, on) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("on", on);
  el.setAttribute("aria-checked", on);
}

async function saveSettings() {
  const settings = {
    autoSync: document.getElementById("auto-sync")?.classList.contains("on") ?? true,
    desktopNotif: document.getElementById("desktop-notif")?.classList.contains("on") ?? true,
    soundOnFail: document.getElementById("sound-fail")?.classList.contains("on") ?? false,
    imgOverlay: document.getElementById("img-overlay")?.classList.contains("on") ?? true,
    darkMode: document.getElementById("dark-mode")?.classList.contains("on") ?? false,
    syncInterval: parseInt(document.getElementById("sync-interval")?.value || "5", 10),
    defaultPlatform: document.getElementById("default-platform")?.value || "",
  };
  await chrome.storage.local.set({ settings });

  // Ask the background SW to recreate alarms with the new interval
  try {
    await chrome.runtime.sendMessage({ type: "SETTINGS_CHANGED" });
  } catch {}

  showStatus("Settings saved");
}

function showStatus(msg, isError = false) {
  let status = document.getElementById("status-msg");
  if (!status) {
    status = document.createElement("div");
    status.id = "status-msg";
    status.style.cssText = "position:fixed;bottom:16px;left:50%;transform:translateX(-50%);padding:8px 16px;border-radius:6px;font-size:12px;font-weight:500;color:white;background:#10b981;z-index:1000;transition:opacity 0.3s;";
    document.body.appendChild(status);
  }
  status.style.background = isError ? "#ef4444" : "#10b981";
  status.textContent = msg;
  status.style.opacity = "1";
  setTimeout(() => { status.style.opacity = "0"; }, 2000);
}
