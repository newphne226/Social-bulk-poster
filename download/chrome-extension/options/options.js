// =====================================================================
// SocialPilot Chrome Extension — Options page logic
// =====================================================================

document.addEventListener("DOMContentLoaded", async () => {
  const { user, settings = {} } = await chrome.storage.local.get(["user", "settings"]);

  document.getElementById("user-email").textContent = user?.email || "Not logged in";

  // Load saved toggles
  setToggle("auto-sync", settings.autoSync !== false);
  setToggle("desktop-notif", settings.desktopNotif !== false);
  setToggle("sound-fail", settings.soundOnFail === true);
  setToggle("img-overlay", settings.imgOverlay !== false);
  setToggle("dark-mode", settings.darkMode === true);

  if (settings.syncInterval) document.getElementById("sync-interval").value = settings.syncInterval;
  if (settings.defaultPlatform) document.getElementById("default-platform").value = settings.defaultPlatform;

  // Bind toggle clicks
  ["auto-sync", "desktop-notif", "sound-fail", "img-overlay", "dark-mode"].forEach((id) => {
    document.getElementById(id).addEventListener("click", () => {
      const t = document.getElementById(id);
      t.classList.toggle("on");
      saveSettings();
    });
  });

  document.getElementById("sync-interval").addEventListener("change", saveSettings);
  document.getElementById("default-platform").addEventListener("change", saveSettings);

  document.getElementById("logout").addEventListener("click", async () => {
    if (!confirm("Log out of SocialPilot?")) return;
    await chrome.runtime.sendMessage({ type: "AUTH_LOGOUT" });
    document.getElementById("user-email").textContent = "Not logged in";
  });
});

function setToggle(id, on) {
  document.getElementById(id).classList.toggle("on", on);
}

async function saveSettings() {
  const settings = {
    autoSync: document.getElementById("auto-sync").classList.contains("on"),
    desktopNotif: document.getElementById("desktop-notif").classList.contains("on"),
    soundOnFail: document.getElementById("sound-fail").classList.contains("on"),
    imgOverlay: document.getElementById("img-overlay").classList.contains("on"),
    darkMode: document.getElementById("dark-mode").classList.contains("on"),
    syncInterval: parseInt(document.getElementById("sync-interval").value, 10),
    defaultPlatform: document.getElementById("default-platform").value,
  };
  await chrome.storage.local.set({ settings });
}
