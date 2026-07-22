// =====================================================================
// SMTools Chrome Extension — Popup logic (v3 — in-extension signup)
// =====================================================================
// v3 changes from v2:
//   • Sign Up form is now a FULL registration form (name, email, password,
//     confirm password, terms checkbox) — no more redirect to website.
//   • Registration posts to /api/auth/register on the local app and
//     creates a real user in the database with bcrypt-hashed password.
//   • After successful registration, the user is auto-signed-in.
//   • API base URL is loaded from chrome.storage.local (configurable
//     via Options page). Default = https://smtools.online/api
//   • All auth requests go through the background service worker so
//     they survive popup close.
// =====================================================================

import { getApiBase } from "../lib/config.js";

let API_BASE = "https://smtools.online/api";

const PLATFORMS = {
  linkedin: { name: "LinkedIn", color: "#0A66C2", icon: "in" },
  instagram: { name: "Instagram", color: "#E4405F", icon: "IG" },
  x: { name: "X", color: "#000000", icon: "X" },
  pinterest: { name: "Pinterest", color: "#BD081C", icon: "P" },
};

// State
let state = {
  user: null,
  subscription: null,
  accounts: [],
  posts: [],
  notifications: [],
  settings: { darkMode: false, timezone: "Asia/Dhaka" },
};
let currentSection = "dashboard";

// ---------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  // Load the API base URL from storage (options page may override it)
  API_BASE = await getApiBase();
  console.log("[SMTools] API base:", API_BASE);

  applyDarkMode(await getDarkMode());

  // Bug #9 fix: set forgot-password / terms / privacy links to the local app
  const webOrigin = API_BASE.replace(/\/api\/?$/, "");
  const forgotLink = document.getElementById("forgot-link");
  if (forgotLink) forgotLink.href = `${webOrigin}/forgot-password`;
  const termsLink = document.getElementById("terms-link");
  if (termsLink) termsLink.href = `${webOrigin}/terms`;
  const privacyLink = document.getElementById("privacy-link");
  if (privacyLink) privacyLink.href = `${webOrigin}/privacy`;

  // Bind ALL event listeners first (so they exist regardless of state)
  bindAuthEvents();
  bindNavEvents();

  // Check existing token
  const { token } = await chrome.storage.local.get("token");
  if (token) {
    showMain();
    await loadState();
    renderSection("dashboard");
  } else {
    showLogin();
  }
});

// ---------------------------------------------------------------------
// Auth event bindings
// ---------------------------------------------------------------------
function bindAuthEvents() {
  // Sign In form submit
  const loginForm = document.getElementById("login-form");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  // Sign Up form submit
  const signupForm = document.getElementById("signup-form");
  if (signupForm) signupForm.addEventListener("submit", handleSignup);

  // Google OAuth button
  const googleBtn = document.getElementById("google-btn");
  if (googleBtn) googleBtn.addEventListener("click", handleGoogleLogin);

  // Tab switcher (Sign In ↔ Sign Up)
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchAuthTab(tab.dataset.authTab));
  });

  // Inline switch links
  const goToSignup = document.getElementById("go-to-signup");
  if (goToSignup) goToSignup.addEventListener("click", () => switchAuthTab("signup"));
  const goToSignin = document.getElementById("go-to-signin");
  if (goToSignin) goToSignin.addEventListener("click", () => switchAuthTab("signin"));

  // Password visibility toggle (Sign In)
  const togglePw = document.getElementById("toggle-pw");
  if (togglePw) togglePw.addEventListener("click", () => togglePasswordVisibility("password", "toggle-pw"));

  // Password visibility toggle (Sign Up)
  const suTogglePw = document.getElementById("su-toggle-pw");
  if (suTogglePw) suTogglePw.addEventListener("click", () => togglePasswordVisibility("su-password", "su-toggle-pw"));

  // Real-time validation — Sign In
  const emailInput = document.getElementById("email");
  if (emailInput) emailInput.addEventListener("blur", validateEmailField);
  if (emailInput) emailInput.addEventListener("input", clearError("email-error"));
  const pwInput = document.getElementById("password");
  if (pwInput) pwInput.addEventListener("input", clearError("password-error"));

  // Real-time validation — Sign Up
  const suName = document.getElementById("su-name");
  if (suName) suName.addEventListener("input", clearError("su-name-error"));
  const suEmail = document.getElementById("su-email");
  if (suEmail) suEmail.addEventListener("blur", () => validateField("su-email", "su-email-error", "email"));
  if (suEmail) suEmail.addEventListener("input", clearError("su-email-error"));
  const suPassword = document.getElementById("su-password");
  if (suPassword) suPassword.addEventListener("input", () => {
    clearError("su-password-error")();
    // Also re-validate confirm if it has a value
    const confirm = document.getElementById("su-confirm");
    if (confirm && confirm.value) validateField("su-confirm", "su-confirm-error", "confirm");
  });
  const suConfirm = document.getElementById("su-confirm");
  if (suConfirm) suConfirm.addEventListener("input", clearError("su-confirm-error"));
}

function bindNavEvents() {
  // Nav rail
  document.querySelectorAll(".nav-btn[data-section]").forEach((btn) => {
    btn.addEventListener("click", () => renderSection(btn.dataset.section));
  });

  // Open dashboard
  const openDash = document.getElementById("open-dashboard");
  if (openDash) openDash.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "OPEN_DASHBOARD" });
  });

  // Header logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
}

// ---------------------------------------------------------------------
// Auth tab switching
// ---------------------------------------------------------------------
function switchAuthTab(which) {
  const tabs = document.querySelectorAll(".auth-tab");
  const panels = document.querySelectorAll(".auth-panel");
  tabs.forEach((t) => {
    const active = t.dataset.authTab === which;
    t.classList.toggle("active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });
  panels.forEach((p) => {
    p.classList.toggle("hidden", p.id !== `${which}-panel`);
  });
}

// ---------------------------------------------------------------------
// Password visibility — generic (works for both Sign In and Sign Up forms)
// ---------------------------------------------------------------------
function togglePasswordVisibility(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input || !btn) return;
  if (input.type === "password") {
    input.type = "text";
    btn.setAttribute("aria-label", "Hide password");
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  } else {
    input.type = "password";
    btn.setAttribute("aria-label", "Show password");
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  }
}

// ---------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------
function clearError(id) {
  return () => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  };
}

function validateEmailField() {
  return validateField("email", "email-error", "email");
}

function validatePasswordField() {
  return validateField("password", "password-error", "password");
}

// Generic field validator
function validateField(inputId, errorId, kind) {
  const input = document.getElementById(inputId);
  const errEl = document.getElementById(errorId);
  if (!input || !errEl) return false;

  const value = input.value.trim();

  if (kind === "email") {
    if (!value) {
      errEl.textContent = "Email is required";
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) {
      errEl.textContent = "Enter a valid email address";
      return false;
    }
    errEl.textContent = "";
    return true;
  }

  if (kind === "password") {
    if (!value) {
      errEl.textContent = "Password is required";
      return false;
    }
    if (value.length < 6) {
      errEl.textContent = "Password must be at least 6 characters";
      return false;
    }
    errEl.textContent = "";
    return true;
  }

  if (kind === "name") {
    if (!value) {
      errEl.textContent = "Name is required";
      return false;
    }
    if (value.length < 2) {
      errEl.textContent = "Name must be at least 2 characters";
      return false;
    }
    errEl.textContent = "";
    return true;
  }

  if (kind === "confirm") {
    const original = document.getElementById("su-password")?.value || document.getElementById("password")?.value || "";
    if (!value) {
      errEl.textContent = "Please confirm your password";
      return false;
    }
    // Bug #15 fix: if the original password field is empty, we can't validate
    // match — flag this explicitly so the user knows to fill both fields.
    if (!original) {
      errEl.textContent = "Please enter your password first";
      return false;
    }
    if (value !== original) {
      errEl.textContent = "Passwords do not match";
      return false;
    }
    errEl.textContent = "";
    return true;
  }

  return true;
}

// ---------------------------------------------------------------------
// Sign In handler — routes through background SW
// ---------------------------------------------------------------------
async function handleLogin(e) {
  e.preventDefault();

  // Validate
  const emailOk = validateEmailField();
  const pwOk = validatePasswordField();
  if (!emailOk || !pwOk) return;

  // Check online status
  if (!navigator.onLine) {
    showToast("You're offline. Check your connection.", "error");
    return;
  }

  const btn = document.getElementById("login-btn");
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember-me").checked;

  btn.disabled = true;
  btn.textContent = "Signing in...";

  try {
    // Send to background SW so login survives popup close
    const response = await sendMessage({
      type: "AUTH_LOGIN",
      email,
      password,
      remember,
    });

    if (response?.ok === false) {
      throw new Error(response.error || "Login failed");
    }

    showMain();
    await loadState();
    renderSection("dashboard");
    showToast("Welcome back!", "success");
  } catch (err) {
    const msg = String(err.message || err);
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
      showToast("Can't reach server. Check your internet.", "error");
    } else if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
      showToast("Invalid email or password.", "error");
      document.getElementById("password-error").textContent = "Check your credentials";
    } else {
      showToast(msg || "Login failed.", "error");
    }
  } finally {
    btn.disabled = false;
    btn.textContent = "Sign In";
  }
}

async function handleGoogleLogin() {
  // Opens the web OAuth flow in a new tab; the web app posts the token back via chrome.runtime
  await chrome.tabs.create({
    url: `${API_BASE.replace(/\/api$/, "")}/login?from=extension&provider=google`,
  });
  showToast("Complete Google sign-in in the new tab", "info");
}

// ---------------------------------------------------------------------
// Sign Up handler — creates a real user in the database via /api/auth/register
// ---------------------------------------------------------------------
async function handleSignup(e) {
  e.preventDefault();

  // Validate all fields
  const nameOk = validateField("su-name", "su-name-error", "name");
  const emailOk = validateField("su-email", "su-email-error", "email");
  const pwOk = validateField("su-password", "su-password-error", "password");
  const confirmOk = validateField("su-confirm", "su-confirm-error", "confirm");

  const termsCheck = document.getElementById("su-terms");
  const termsError = document.getElementById("su-terms-error");
  if (!termsCheck?.checked) {
    if (termsError) termsError.textContent = "You must agree to the Terms to continue";
    return;
  }
  if (termsError) termsError.textContent = "";

  if (!nameOk || !emailOk || !pwOk || !confirmOk) return;

  // Online check
  if (!navigator.onLine) {
    showToast("You're offline. Check your connection.", "error");
    return;
  }

  const btn = document.getElementById("signup-btn");
  const name = document.getElementById("su-name").value.trim();
  const email = document.getElementById("su-email").value.trim();
  const password = document.getElementById("su-password").value;

  btn.disabled = true;
  btn.textContent = "Creating account...";

  try {
    // Send registration to background SW (survives popup close)
    const response = await sendMessage({
      type: "AUTH_REGISTER",
      name,
      email,
      password,
    });

    if (response?.ok === false) {
      throw new Error(response.error || "Registration failed");
    }

    // Registration succeeded — the SW already stored the token + started sync.
    // Now switch to the main app.
    showMain();
    await loadState();
    renderSection("dashboard");
    showToast(`Welcome, ${name.split(" ")[0]}! Your account is ready.`, "success");
  } catch (err) {
    const msg = String(err.message || err);
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
      showToast("Can't reach server. Is the app running?", "error");
    } else if (msg.includes("409") || msg.toLowerCase().includes("already exists")) {
      document.getElementById("su-email-error").textContent = "An account with this email already exists";
      showToast("Email already registered. Try signing in.", "error");
    } else {
      showToast(msg || "Registration failed.", "error");
    }
  } finally {
    btn.disabled = false;
    btn.textContent = "Create Account";
  }
}

async function handleLogout() {
  if (!confirm("Log out of SMTools?")) return;
  await sendMessage({ type: "AUTH_LOGOUT" });
  showLogin();
  showToast("Signed out", "info");
}

// ---------------------------------------------------------------------
// Message helper — wraps chrome.runtime.sendMessage with timeout
// ---------------------------------------------------------------------
function sendMessage(message, timeoutMs = 15000) {
  return new Promise((resolve) => {
    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve({ ok: false, error: "Timeout — background worker may be inactive" });
      }
    }, timeoutMs);

    try {
      chrome.runtime.sendMessage(message, (response) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        // chrome.runtime.lastError is set if the SW is dead or no handler
        if (chrome.runtime.lastError) {
          resolve({ ok: false, error: chrome.runtime.lastError.message });
          return;
        }
        resolve(response ?? { ok: false, error: "No response from background" });
      });
    } catch (e) {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve({ ok: false, error: String(e) });
      }
    }
  });
}

// ---------------------------------------------------------------------
// State
// ---------------------------------------------------------------------
async function loadState() {
  const data = await sendMessage({ type: "GET_STATE" });
  if (data?.ok === false) {
    console.warn("[SMTools] GET_STATE failed:", data.error);
    // If unauthorized, log out
    if (data.error?.includes("Unauthorized")) {
      handleLogout();
    }
    return;
  }
  if (data) {
    state.user = data.user;
    state.subscription = data.subscription;
    state.accounts = data.accounts || [];
    state.posts = data.posts || [];
    state.notifications = data.notifications || [];
    state.settings = { ...state.settings, ...(data.settings || {}) };
  }
  updateUserHeader();
  updateNotifBadge();
}

function updateUserHeader() {
  if (!state.user) return;
  const avatar = document.getElementById("user-avatar");
  const name = document.getElementById("user-name");
  const plan = document.getElementById("user-plan");
  if (avatar) avatar.src = state.user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${state.user.email}`;
  if (name) name.textContent = state.user.name || state.user.email;
  if (plan) plan.textContent = state.subscription?.plan || "Free";
}

function updateNotifBadge() {
  const unread = state.notifications.filter((n) => !n.isRead).length;
  const badge = document.getElementById("notif-badge");
  if (!badge) return;
  if (unread > 0) {
    badge.textContent = unread > 9 ? "9+" : unread;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

// ---------------------------------------------------------------------
// Section rendering
// ---------------------------------------------------------------------
function renderSection(section) {
  currentSection = section;
  document.querySelectorAll(".nav-btn[data-section]").forEach((b) =>
    b.classList.toggle("active", b.dataset.section === section)
  );
  const content = document.getElementById("content");
  if (!content) return;

  const renderers = {
    dashboard: renderDashboard,
    accounts: renderAccounts,
    posts: renderPosts,
    create: renderCreate,
    queue: renderQueue,
    notifications: renderNotifications,
    settings: renderSettings,
  };

  content.innerHTML = (renderers[section] || renderDashboard)();
  attachSectionHandlers();
}

function renderDashboard() {
  const scheduledToday = state.posts.filter((p) => p.status === "SCHEDULED").length;
  const publishedToday = state.posts.filter((p) => p.status === "PUBLISHED").length;
  const totalFollowers = state.accounts.reduce((sum, a) => sum + (a.followerCount || 0), 0);

  return `
    <div class="card">
      <div class="greeting">Hey ${escapeHtml(state.user?.name?.split(" ")[0] || "there")} 👋</div>
      <div class="greeting-sub">You have ${scheduledToday} posts scheduled today</div>
      <div class="stats-grid">
        <div class="stat"><div class="stat-label">Followers</div><div class="stat-value">${formatNum(totalFollowers)}</div></div>
        <div class="stat"><div class="stat-label">Posts today</div><div class="stat-value">${publishedToday}</div></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">Quick Actions</div>
      <div class="quick-actions">
        <button class="quick-action" data-action="quick">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Quick
        </button>
        <button class="quick-action" data-action="create">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create
        </button>
        <button class="quick-action" data-action="ai">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          AI
        </button>
      </div>
    </div>
    <div class="section-title">Coming up next</div>
    ${state.posts.filter((p) => p.status === "SCHEDULED").slice(0, 3).map(renderPostItem).join("") || emptyState("No posts scheduled")}
  `;
}

function renderAccounts() {
  const webOrigin = API_BASE.replace(/\/api\/?$/, "");
  return `
    <div class="section-title">Connected Accounts (${state.accounts.length})</div>
    ${state.accounts.length === 0 ? emptyState("No accounts connected") : state.accounts.map((a) => {
      const plat = PLATFORMS[a.platform] || { name: a.platform, color: "#888", icon: "?" };
      return `
        <div class="post-item" style="align-items: center;">
          <div class="post-icon" style="background: ${plat.color}">${plat.icon}</div>
          <div class="post-content" style="flex: 1;">
            <div class="post-meta">${escapeHtml(a.displayName || a.username || a.platform)}</div>
            <div class="post-caption" style="font-size: 11px; color: var(--text-muted);">
              ${plat.name} · ${a.followerCount ? formatNum(a.followerCount) + " followers" : "Connected"}
            </div>
          </div>
          <button class="btn-icon-danger" data-disconnect="${a.id}" title="Disconnect">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      `;
    }).join("")}
    <div class="card" style="margin-top: 8px;">
      <div class="section-title" style="margin-bottom: 8px;">Connect New Account</div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        <button class="btn-connect" data-connect="linkedin" style="background: #0A66C2; color: white;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          LinkedIn
        </button>
      </div>
    </div>
  `;
}

function renderPosts() {
  const statusTabs = ["ALL", "SCHEDULED", "PUBLISHED", "DRAFT", "FAILED"];
  const activeFilter = state._postsFilter || "ALL";
  const filtered = state.posts.filter((p) => {
    if (activeFilter !== "ALL" && p.status !== activeFilter) return false;
    return true;
  });

  return `
    <div class="section-title">My Posts (${state.posts.length})</div>
    <div class="status-tabs">
      ${statusTabs.map((s) => `<button class="status-tab ${activeFilter === s ? "active" : ""}" data-filter="${s}">${s}</button>`).join("")}
    </div>
    ${filtered.length === 0 ? emptyState("No posts found") : filtered.slice(0, 30).map((p) => {
      const plat = PLATFORMS[p.platform] || { color: "#888", icon: "?" };
      return `
        <div class="post-item">
          <div class="post-icon" style="background: ${plat.color}">${plat.icon}</div>
          <div class="post-content">
            <div class="post-meta">${escapeHtml(p.accountUsername || "")} <span class="status-badge status-${p.status}">${p.status}</span></div>
            <div class="post-caption">${escapeHtml(p.caption || "No caption")}</div>
            ${p.type && p.type !== "TEXT" ? `<span class="type-badge">${p.type}</span>` : ""}
            ${p.scheduledAt ? `<div class="post-time">⏰ ${new Date(p.scheduledAt).toLocaleString()}</div>` : ""}
          </div>
          <div class="post-actions">
            <button class="btn-icon" data-edit-post="${p.id}" title="Edit">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-icon-danger" data-delete-post="${p.id}" title="Delete">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join("")}
  `;
}

const PLATFORM_POST_TYPES = {
  instagram: [
    { value: "IMAGE", label: "Photo" },
    { value: "REEL", label: "Reels" },
    { value: "VIDEO", label: "Video" },
    { value: "CAROUSEL", label: "Carousel" },
    { value: "STORY", label: "Story" },
  ],
  x: [
    { value: "TEXT", label: "Text" },
    { value: "IMAGE", label: "Photo" },
    { value: "VIDEO", label: "Video" },
    { value: "LINK", label: "Link" },
  ],
  linkedin: [
    { value: "TEXT", label: "Text" },
    { value: "IMAGE", label: "Photo" },
    { value: "VIDEO", label: "Video" },
    { value: "LINK", label: "Article/Link" },
    { value: "CAROUSEL", label: "Carousel" },
  ],
  pinterest: [
    { value: "IMAGE", label: "Pin" },
    { value: "VIDEO", label: "Video Pin" },
    { value: "CAROUSEL", label: "Idea Pin" },
  ],
};

let _createState = { platform: "linkedin", postType: "TEXT", accountId: "", linkUrl: "", hashtags: [], mentions: [], mediaUrls: [] };

function renderCreate() {
  if (!state.accounts.length) {
    return emptyState("Connect a social account first");
  }
  const cs = _createState;
  const platAccounts = state.accounts.filter((a) => a.platform === cs.platform);
  const postTypes = PLATFORM_POST_TYPES[cs.platform] || PLATFORM_POST_TYPES.facebook;

  return `
    <div class="section-title">Create Post</div>
    <div class="card">
      <label>Platform</label>
      <div class="platform-selector">
        ${Object.entries(PLATFORMS).map(([k, v]) => `
          <button class="plat-btn ${cs.platform === k ? "active" : ""}" data-set-platform="${k}" style="${cs.platform === k ? `background: ${v.color}; color: white; border-color: ${v.color};` : ""}">${v.icon} ${v.name}</button>
        `).join("")}
      </div>

      <label>Post Type</label>
      <div class="type-selector">
        ${postTypes.map((pt) => `
          <button class="type-btn ${cs.postType === pt.value ? "active" : ""}" data-set-type="${pt.value}">${pt.label}</button>
        `).join("")}
      </div>

      <label>Account</label>
      <select id="create-account">
        <option value="">Select account...</option>
        ${platAccounts.map((a) => `<option value="${a.id}" ${cs.accountId === a.id ? "selected" : ""}>${escapeHtml(a.displayName || a.username || a.platform)}</option>`).join("")}
      </select>
      ${platAccounts.length === 0 ? `<div style="font-size: 11px; color: #f59e0b; margin-top: 4px;">No ${PLATFORMS[cs.platform]?.name} accounts. <a href="#" data-open-section="accounts" style="color: #f59e0b;">Connect one</a></div>` : ""}

      <label>Link / URL (optional)</label>
      <input type="url" id="create-link" placeholder="https://example.com/image.jpg" value="${escapeHtml(cs.linkUrl)}" />

      <label>Caption</label>
      <textarea id="create-caption" placeholder="What's on your mind?"></textarea>

      ${(cs.postType === "IMAGE" || cs.postType === "VIDEO" || cs.postType === "CAROUSEL" || cs.postType === "REEL" || cs.postType === "STORY") ? `
        <label>Media URLs</label>
        <div style="display: flex; gap: 4px;">
          <input type="url" id="create-media-url" placeholder="https://example.com/image.jpg" style="flex: 1;" />
          <button class="btn-secondary" id="add-media-btn" style="padding: 6px 10px;">Add</button>
        </div>
        <div class="tag-list" id="media-tags">
          ${cs.mediaUrls.map((u, i) => `<span class="tag tag-blue">${escapeHtml(u.substring(0, 30))}... <button data-remove-media="${i}">×</button></span>`).join("")}
        </div>
      ` : ""}

      <label>Hashtags</label>
      <input type="text" id="create-hashtags" placeholder="#socialmedia #marketing" />

      <label>Mentions</label>
      <input type="text" id="create-mentions" placeholder="@username" />

      <label>Schedule (optional)</label>
      <input type="datetime-local" id="create-schedule-time" />
      <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Optional — for scheduled posts</div>

      <div class="btn-row" style="gap: 6px;">
        <button class="btn-secondary" id="create-draft-btn">Save Draft</button>
        <button class="btn-primary" id="create-instant-btn" style="background: linear-gradient(135deg, #22c55e, #059669); color: white; border: none;">Post Now</button>
        <button class="btn-primary" id="create-schedule-btn" style="background: linear-gradient(135deg, #f59e0b, #ec4899); color: white; border: none;">Schedule</button>
      </div>
    </div>
  `;
}

function renderQueue() {
  const queued = state.posts
    .filter((p) => p.status === "SCHEDULED" || p.status === "QUEUED")
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  return `
    <div class="section-title">Schedule Queue (${queued.length})</div>
    ${queued.map(renderPostItem).join("") || emptyState("Queue is empty")}
  `;
}

function renderNotifications() {
  return `
    <div class="section-title">Notifications</div>
    ${state.notifications.map((n) => `
      <div class="notif-item ${!n.isRead ? "unread" : ""}">
        <div class="notif-icon ${n.type === "POST_FAILED" ? "failed" : n.type === "POST_PUBLISHED" ? "success" : "info"}">
          ${n.type === "POST_FAILED" ? "!" : n.type === "POST_PUBLISHED" ? "✓" : "i"}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 12px; font-weight: 600;">${escapeHtml(n.title)}</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${escapeHtml(n.body)}</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 3px;">${timeAgo(n.createdAt)}</div>
        </div>
      </div>
    `).join("") || emptyState("No notifications")}
  `;
}

function renderSettings() {
  return `
    <div class="section-title">Settings</div>
    <div class="card">
      <div class="toggle-row">
        <div>
          <div style="font-size: 12px; font-weight: 600;">Dark Mode</div>
          <div style="font-size: 10px; color: var(--text-muted);">Toggle dark theme for the popup</div>
        </div>
        <div class="toggle ${state.settings.darkMode ? "on" : ""}" id="dark-toggle" role="switch" aria-checked="${state.settings.darkMode}"></div>
      </div>
      <div class="toggle-row">
        <div>
          <div style="font-size: 12px; font-weight: 600;">Timezone</div>
          <div style="font-size: 10px; color: var(--text-muted);">For scheduling display</div>
        </div>
      </div>
      <select id="tz-select">
        <option value="Asia/Dhaka" ${state.settings.timezone === "Asia/Dhaka" ? "selected" : ""}>Asia/Dhaka (UTC+6)</option>
        <option value="America/New_York" ${state.settings.timezone === "America/New_York" ? "selected" : ""}>America/New_York (UTC-5)</option>
        <option value="Europe/London" ${state.settings.timezone === "Europe/London" ? "selected" : ""}>Europe/London (UTC+0)</option>
        <option value="Asia/Tokyo" ${state.settings.timezone === "Asia/Tokyo" ? "selected" : ""}>Asia/Tokyo (UTC+9)</option>
      </select>
      <div class="toggle-row">
        <div>
          <div style="font-size: 12px; font-weight: 600;">Auto-sync</div>
          <div style="font-size: 10px; color: var(--text-muted);">Sync every 5 minutes</div>
        </div>
        <div class="toggle on" id="sync-toggle" role="switch" aria-checked="true"></div>
      </div>
    </div>
    <div class="card">
      <div style="font-size: 11px; color: var(--text-muted);">Account</div>
      <div style="font-size: 13px; font-weight: 600; margin-top: 4px;">${escapeHtml(state.user?.email || "—")}</div>
      <button class="btn-secondary" id="logout-full-btn" style="margin-top: 10px; width: 100%; color: var(--danger);">Log out</button>
    </div>
  `;
}

function renderPostItem(p) {
  const plat = PLATFORMS[p.platform] || { color: "#888", icon: "?" };
  return `
    <div class="post-item">
      <div class="post-icon" style="background: ${plat.color}">${plat.icon}</div>
      <div class="post-content">
        <div class="post-meta">${escapeHtml(p.accountUsername || "")} <span class="status-badge status-${p.status}">${p.status}</span></div>
        <div class="post-caption">${escapeHtml(p.caption)}</div>
        ${p.scheduledAt ? `<div class="post-time">⏰ ${new Date(p.scheduledAt).toLocaleString()}</div>` : ""}
      </div>
    </div>
  `;
}

function emptyState(msg) {
  return `<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg><div>${escapeHtml(msg)}</div></div>`;
}

// ---------------------------------------------------------------------
// Section handlers
// ---------------------------------------------------------------------
function attachSectionHandlers() {
  // Dashboard quick actions
  document.querySelectorAll(".quick-action").forEach((b) => {
    b.addEventListener("click", () => renderSection(b.dataset.action));
  });

  // Create post - platform selector
  document.querySelectorAll("[data-set-platform]").forEach((b) => {
    b.addEventListener("click", () => {
      _createState.platform = b.dataset.setPlatform;
      const types = PLATFORM_POST_TYPES[_createState.platform] || PLATFORM_POST_TYPES.facebook;
      if (!types.find((t) => t.value === _createState.postType)) {
        _createState.postType = types[0]?.value || "TEXT";
      }
      _createState.accountId = "";
      renderSection("create");
    });
  });

  // Create post - type selector
  document.querySelectorAll("[data-set-type]").forEach((b) => {
    b.addEventListener("click", () => {
      _createState.postType = b.dataset.setType;
      renderSection("create");
    });
  });

  // Create post - link URL auto-detect
  const linkInput = document.getElementById("create-link");
  if (linkInput) linkInput.addEventListener("input", (e) => {
    _createState.linkUrl = e.target.value;
  });

  // Create post - add media
  const addMediaBtn = document.getElementById("add-media-btn");
  if (addMediaBtn) addMediaBtn.addEventListener("click", () => {
    const input = document.getElementById("create-media-url");
    if (input?.value?.trim()) {
      _createState.mediaUrls.push(input.value.trim());
      renderSection("create");
    }
  });

  // Create post - remove media
  document.querySelectorAll("[data-remove-media]").forEach((b) => {
    b.addEventListener("click", () => {
      _createState.mediaUrls.splice(parseInt(b.dataset.removeMedia), 1);
      renderSection("create");
    });
  });

  // Create post - open section links
  document.querySelectorAll("[data-open-section]").forEach((b) => {
    b.addEventListener("click", (e) => {
      e.preventDefault();
      renderSection(b.dataset.openSection);
    });
  });

  // Create post - schedule
  const csBtn = document.getElementById("create-schedule-btn");
  if (csBtn) csBtn.addEventListener("click", () => handleCreatePost("schedule"));
  const cdBtn = document.getElementById("create-draft-btn");
  if (cdBtn) cdBtn.addEventListener("click", () => handleCreatePost("draft"));
  const ciBtn = document.getElementById("create-instant-btn");
  if (ciBtn) ciBtn.addEventListener("click", () => handleCreatePost("instant"));

  // Posts - filter tabs
  document.querySelectorAll(".status-tab").forEach((b) => {
    b.addEventListener("click", () => {
      state._postsFilter = b.dataset.filter;
      renderSection("posts");
    });
  });

  // Posts - edit
  document.querySelectorAll("[data-edit-post]").forEach((b) => {
    b.addEventListener("click", () => handleEditPost(b.dataset.editPost));
  });

  // Posts - delete
  document.querySelectorAll("[data-delete-post]").forEach((b) => {
    b.addEventListener("click", () => handleDeletePost(b.dataset.deletePost));
  });

  // Accounts - disconnect
  document.querySelectorAll("[data-disconnect]").forEach((b) => {
    b.addEventListener("click", () => handleDisconnectAccount(b.dataset.disconnect));
  });

  // Accounts - connect
  document.querySelectorAll("[data-connect]").forEach((b) => {
    b.addEventListener("click", () => handleConnectAccount(b.dataset.connect));
  });

  // Settings
  const dt = document.getElementById("dark-toggle");
  if (dt) dt.addEventListener("click", handleDarkToggle);
  const st = document.getElementById("sync-toggle");
  if (st) st.addEventListener("click", () => {
    st.classList.toggle("on");
    st.setAttribute("aria-checked", st.classList.contains("on"));
  });
  const tz = document.getElementById("tz-select");
  if (tz) tz.addEventListener("change", async (e) => {
    state.settings.timezone = e.target.value;
    await chrome.storage.local.set({ settings: state.settings });
    showToast("Timezone updated", "success");
  });
  const lo = document.getElementById("logout-full-btn");
  if (lo) lo.addEventListener("click", handleLogout);
}

async function handleCreatePost(mode = "draft") {
  const caption = document.getElementById("create-caption")?.value?.trim() || "";
  const hashtagsRaw = document.getElementById("create-hashtags")?.value?.trim() || "";
  const mentionsRaw = document.getElementById("create-mentions")?.value?.trim() || "";
  const scheduleTime = document.getElementById("create-schedule-time")?.value || "";
  const accountId = document.getElementById("create-account")?.value || _createState.accountId;

  if (!caption && _createState.mediaUrls.length === 0) return showToast("Caption or media required", "error");
  if (mode !== "draft" && !accountId) return showToast("Select an account", "error");

  const hashtags = hashtagsRaw.split(/\s+/).filter(Boolean).map((h) => h.replace(/^#/, ""));
  const mentions = mentionsRaw.split(/\s+/).filter(Boolean).map((m) => m.replace(/^@/, ""));

  const now = new Date().toISOString();
  let status;
  if (mode === "instant") status = "PUBLISHED";
  else if (mode === "schedule" && scheduleTime) status = "SCHEDULED";
  else status = "DRAFT";

  showLoading(true);
  try {
    const payload = {
      caption,
      platform: _createState.platform,
      type: _createState.postType,
      accountId: accountId || undefined,
      mediaUrls: _createState.mediaUrls,
      hashtags,
      mentions,
      status,
    };
    if (mode === "instant") {
      payload.scheduledAt = now;
      payload.publishedAt = now;
    } else if (scheduleTime) {
      payload.scheduledAt = new Date(scheduleTime).toISOString();
    }

    const res = await sendMessage({ type: "CREATE_POST", payload });
    if (res?.ok === false) throw new Error(res.error);
    showToast(mode === "instant" ? "Posted instantly!" : mode === "schedule" ? "Post scheduled!" : "Draft saved!", "success");
    _createState = { platform: "linkedin", postType: "TEXT", accountId: "", linkUrl: "", hashtags: [], mentions: [], mediaUrls: [] };
    await loadState();
    renderSection("posts");
  } catch (e) {
    showToast("Failed: " + (e.message || e), "error");
  } finally {
    showLoading(false);
  }
}

async function handleEditPost(postId) {
  const post = state.posts.find((p) => p.id === postId);
  if (!post) return;
  const newCaption = prompt("Edit caption:", post.caption || "");
  if (newCaption === null) return;
  showLoading(true);
  try {
    const res = await sendMessage({ type: "UPDATE_POST", postId, payload: { caption: newCaption } });
    if (res?.ok === false) throw new Error(res.error);
    showToast("Post updated!", "success");
    await loadState();
    renderSection("posts");
  } catch (e) {
    showToast("Failed: " + (e.message || e), "error");
  } finally {
    showLoading(false);
  }
}

async function handleDeletePost(postId) {
  if (!confirm("Delete this post?")) return;
  showLoading(true);
  try {
    const res = await sendMessage({ type: "DELETE_POST", postId });
    if (res?.ok === false) throw new Error(res.error);
    showToast("Post deleted", "success");
    await loadState();
    renderSection("posts");
  } catch (e) {
    showToast("Failed: " + (e.message || e), "error");
  } finally {
    showLoading(false);
  }
}

async function handleDisconnectAccount(accountId) {
  if (!confirm("Disconnect this account?")) return;
  showLoading(true);
  try {
    const res = await sendMessage({ type: "DELETE_ACCOUNT", accountId });
    if (res?.ok === false) throw new Error(res.error);
    showToast("Account disconnected", "success");
    await loadState();
    renderSection("accounts");
  } catch (e) {
    showToast("Failed: " + (e.message || e), "error");
  } finally {
    showLoading(false);
  }
}

async function handleConnectAccount(platform) {
  const { token } = await chrome.storage.local.get("token");
  if (!token) {
    showToast("Please sign in first", "error");
    return;
  }
  const webOrigin = API_BASE.replace(/\/api\/?$/, "");
  const url = `${webOrigin}/api/accounts/${platform}?token=${encodeURIComponent(token)}`;
  chrome.tabs.create({ url });
  showToast(`Opening ${PLATFORMS[platform]?.name || platform} connect...`, "info");
}

async function handleDarkToggle() {
  state.settings.darkMode = !state.settings.darkMode;
  await chrome.storage.local.set({ settings: state.settings });
  applyDarkMode(state.settings.darkMode);
  renderSection("settings");
}

// ---------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------
async function getDarkMode() {
  const { settings } = await chrome.storage.local.get("settings");
  return settings?.darkMode || false;
}

function applyDarkMode(on) {
  document.body.classList.toggle("dark", on);
}

function showLogin() {
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("main-screen").classList.add("hidden");
}

function showMain() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("main-screen").classList.remove("hidden");
}

function showLoading(on) {
  document.getElementById("loading").classList.toggle("hidden", !on);
}

function showToast(msg, kind = "info") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const t = document.createElement("div");
  t.className = "toast toast-" + kind;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return "in the future";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s || "";
  return div.innerHTML;
}
