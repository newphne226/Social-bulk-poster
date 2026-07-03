// =====================================================================
// Chrome Extension validation script
// Runs Node-side to catch JSON errors, missing files, and basic bugs
// =====================================================================
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");

const EXT_DIR = __dirname;
let errors = [];
let warnings = [];

function check(name, condition, fix = "") {
  if (condition) {
    console.log(`  ✓ ${name}`);
  } else {
    console.log(`  ✗ ${name}${fix ? " — " + fix : ""}`);
    errors.push(name);
  }
}

console.log("\n=== SocialPilot Chrome Extension — Validation ===\n");

// 1. manifest.json is valid JSON and has required fields
console.log("1. Manifest validation");
const manifestPath = path.join(EXT_DIR, "manifest.json");
let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  check("manifest.json is valid JSON", true);
} catch (e) {
  check("manifest.json is valid JSON", false, e.message);
  process.exit(1);
}

check("manifest_version is 3", manifest.manifest_version === 3);
check("name is present", !!manifest.name);
check("version is present", !!manifest.version);
check("default_locale is set", !!manifest.default_locale);

// 2. _locales subtree exists
console.log("\n2. Locale files");
const localesDir = path.join(EXT_DIR, "_locales");
check("_locales/ directory exists", fs.existsSync(localesDir));
if (fs.existsSync(localesDir)) {
  const defaultLocaleDir = path.join(localesDir, manifest.default_locale);
  check(`_locales/${manifest.default_locale}/ directory exists`, fs.existsSync(defaultLocaleDir));
  const messagesFile = path.join(defaultLocaleDir, "messages.json");
  check(`_locales/${manifest.default_locale}/messages.json exists`, fs.existsSync(messagesFile));
  if (fs.existsSync(messagesFile)) {
    try {
      const msgs = JSON.parse(fs.readFileSync(messagesFile, "utf8"));
      check("messages.json is valid JSON", true);
      // Verify all __MSG_*__ references in manifest have corresponding messages
      const allManifestText = JSON.stringify(manifest);
      const msgRefs = allManifestText.match(/__MSG_(\w+)__/g) || [];
      const seen = new Set();
      msgRefs.forEach((ref) => {
        const key = ref.match(/__MSG_(\w+)__/)[1];
        if (seen.has(key)) return;
        seen.add(key);
        check(`Message "${key}" exists in messages.json`, !!msgs[key]);
      });
    } catch (e) {
      check("messages.json is valid JSON", false, e.message);
    }
  }
}

// 3. All file paths referenced in manifest exist
console.log("\n3. Referenced files exist");
const filesToCheck = [
  manifest.action?.default_popup,
  ...(manifest.action?.default_icon ? Object.values(manifest.action.default_icon) : []),
  manifest.background?.service_worker,
  ...(manifest.content_scripts?.flatMap(cs => [...(cs.js || []), ...(cs.css || [])]) || []),
  manifest.options_page,
  ...(manifest.icons ? Object.values(manifest.icons) : []),
];
filesToCheck.forEach((f) => {
  if (f) check(`${f} exists`, fs.existsSync(path.join(EXT_DIR, f)));
});

// 4. Service worker is syntactically valid (basic check)
console.log("\n4. Service worker");
const swPath = path.join(EXT_DIR, manifest.background?.service_worker || "background/service-worker.js");
if (fs.existsSync(swPath)) {
  const sw = fs.readFileSync(swPath, "utf8");
  check("SW handles AUTH_LOGIN", sw.includes("AUTH_LOGIN"));
  check("SW handles AUTH_LOGOUT", sw.includes("AUTH_LOGOUT"));
  check("SW handles GET_STATE", sw.includes("GET_STATE"));
  check("SW handles QUICK_SCHEDULE_PAGE", sw.includes("QUICK_SCHEDULE_PAGE"));
  check("SW handles OPEN_DASHBOARD", sw.includes("OPEN_DASHBOARD"));
  check("SW returns true from onMessage (keep channel open)", sw.includes("return true;"));
  check("SW feature-detects chrome.action.openPopup", sw.includes("typeof chrome.action?.openPopup"));
  check("SW handles 401 → token refresh", sw.includes("res.status === 401"));
  check("SW sends FORCE_LOGOUT on auth failure", sw.includes("FORCE_LOGOUT"));
}

// 5. Popup HTML/JS consistency
console.log("\n5. Popup consistency");
const popupHtml = fs.readFileSync(path.join(EXT_DIR, "popup/popup.html"), "utf8");
const popupJs = fs.readFileSync(path.join(EXT_DIR, "popup/popup.js"), "utf8");

check("popup.html has Sign In tab", popupHtml.includes('data-auth-tab="signin"'));
check("popup.html has Sign Up tab", popupHtml.includes('data-auth-tab="signup"'));
check("popup.html has login form", popupHtml.includes('id="login-form"'));
check("popup.html has Google button", popupHtml.includes('id="google-btn"'));
check("popup.html has Sign Up web button", popupHtml.includes('id="signup-web-btn"'));
check("popup.html has password toggle", popupHtml.includes('id="toggle-pw"'));
check("popup.html has forgot password link", popupHtml.includes("forgot-password"));
check("popup.html has remember me checkbox", popupHtml.includes('id="remember-me"'));
check("popup.html loads popup.js (non-module)", popupHtml.includes('<script src="popup.js"></script>'));

check("popup.js has handleLogin", popupJs.includes("function handleLogin"));
check("popup.js has switchAuthTab", popupJs.includes("function switchAuthTab"));
check("popup.js has validateEmailField", popupJs.includes("function validateEmailField"));
check("popup.js has togglePasswordVisibility", popupJs.includes("function togglePasswordVisibility"));
check("popup.js has sendMessage helper", popupJs.includes("function sendMessage"));
check("popup.js has chrome.runtime.lastError check", popupJs.includes("chrome.runtime.lastError"));
check("popup.js has navigator.onLine check", popupJs.includes("navigator.onLine"));
check("popup.js does NOT do direct fetch for login (routes through SW)", !popupJs.includes("fetch(`${API_BASE}/auth/login`"));

// 6. Content script
console.log("\n6. Content script");
const contentJs = fs.readFileSync(path.join(EXT_DIR, "content/content.js"), "utf8");
check("content.js has double-injection guard", contentJs.includes("__SOCIALPILOT_CONTENT_LOADED__"));
check("content.js handles EXTRACT_PAGE_META", contentJs.includes("EXTRACT_PAGE_META"));
check("content.js handles SHOW_QUICK_BUTTON", contentJs.includes("SHOW_QUICK_BUTTON"));
check("content.js handles unknown messages (no hang)", contentJs.includes("Unknown message type"));
check("content.js does NOT have Ctrl+Shift+S handler (conflicts with manifest)", !contentJs.includes("e.key === \"S\""));

// 7. Manifest command vs content script conflict check
console.log("\n7. Keyboard shortcut conflicts");
const openPopupCmd = manifest.commands?.["open-popup"];
if (openPopupCmd?.suggested_key?.default) {
  const key = openPopupCmd.suggested_key.default;
  check(`Manifest reserves ${key} for open-popup`, true);
  check(`Content script does NOT also listen for ${key}`, !contentJs.includes(key.replace("Ctrl", "ctrlKey").replace("Shift", "shiftKey")),
    "removed conflicting handler");
}

// 8. Permissions coverage
console.log("\n8. Permissions");
const requiredPerms = ["storage", "alarms", "notifications", "contextMenus", "activeTab", "scripting"];
requiredPerms.forEach((p) => {
  check(`Permission "${p}" declared`, (manifest.permissions || []).includes(p));
});
check("host_permissions includes api.socialpilot.io",
  (manifest.host_permissions || []).some(h => h.includes("socialpilot.io")));

// 9. Summary
console.log("\n=== Summary ===");
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);
if (errors.length === 0) {
  console.log("\n✅ All checks passed — extension should load cleanly in Chrome.");
  process.exit(0);
} else {
  console.log("\n❌ Some checks failed:");
  errors.forEach((e) => console.log("   - " + e));
  process.exit(1);
}
