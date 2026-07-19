// =====================================================================
// SocialPilot Chrome Extension — Popup logic (v3 — in-extension signup)
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
  facebook: { name: "Facebook", color: "#1877F2", icon: "f" },
  instagram: { name: "Instagram", color: "#E4405F", icon: "IG" },
  x: { name: "X", color: "#000000", icon: "X" },
  linkedin: { name: "LinkedIn", color: "#0A66C2", icon: "in" },
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
  console.log("[SocialPilot] API base:", API_BASE);

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
  if (!confirm("Log out of SocialPilot?")) return;
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
    console.warn("[SocialPilot] GET_STATE failed:", data.error);
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
    quick: renderQuick,
    create: renderCreate,
    drafts: renderDrafts,
    media: renderMedia,
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

function renderQuick() {
  if (!state.accounts.length) {
    return emptyState("Connect a social account first");
  }
  return `
    <div class="section-title">Quick Schedule</div>
    <div class="card">
      <label for="quick-caption">Caption</label>
      <textarea id="quick-caption" placeholder="What's on your mind?"></textarea>
      <label for="quick-account">Account</label>
      <select id="quick-account">
        ${state.accounts.map((a) => `<option value="${a.id}">${escapeHtml(PLATFORMS[a.platform]?.name || a.platform)} · ${escapeHtml(a.displayName)}</option>`).join("")}
      </select>
      <label for="quick-time">Schedule for</label>
      <input type="datetime-local" id="quick-time" />
      <div class="btn-row">
        <button class="btn-secondary" id="quick-schedule-btn" style="background: linear-gradient(135deg, #f59e0b, #ec4899); color: white; border: none;">Schedule</button>
      </div>
    </div>
  `;
}

function renderCreate() {
  if (!state.accounts.length) {
    return emptyState("Connect a social account first");
  }
  return `
    <div class="section-title">Create Post</div>
    <div class="card">
      <label for="create-caption">Caption</label>
      <textarea id="create-caption" placeholder="Write your post..."></textarea>
      <label>Media</label>
      <div style="border: 2px dashed var(--border); padding: 16px; text-align: center; border-radius: 8px; color: var(--text-muted); font-size: 11px; cursor: pointer;" id="create-drop">
        Click or drop files here
      </div>
      <label>Post to</label>
      <div class="platform-chips" id="create-platforms">
        ${state.accounts.map((a) => `
          <div class="platform-chip" data-account="${a.id}">
            <span class="pdot" style="background: ${PLATFORMS[a.platform]?.color || '#888'}"></span>
            ${escapeHtml(a.displayName)}
          </div>
        `).join("")}
      </div>
      <label for="create-hashtags">Hashtags</label>
      <input type="text" id="create-hashtags" placeholder="#socialmedia #marketing" />
      <div class="btn-row">
        <button class="btn-secondary" id="create-draft-btn">Save Draft</button>
        <button class="btn-secondary" id="create-schedule-btn" style="background: linear-gradient(135deg, #f59e0b, #ec4899); color: white; border: none;">Schedule</button>
      </div>
    </div>
  `;
}

function renderDrafts() {
  const drafts = state.posts.filter((p) => p.status === "DRAFT");
  return `
    <div class="section-title">Drafts (${drafts.length})</div>
    ${drafts.map(renderPostItem).join("") || emptyState("No drafts yet")}
  `;
}

function renderMedia() {
  return `
    <div class="section-title">Media Library</div>
    <div class="card">
      <div class="media-grid">
        ${[1, 2, 3, 4, 5, 6].map((i) => `<img src="https://picsum.photos/seed/ext${i}/100/100" alt="" />`).join("")}
      </div>
      <button class="btn-secondary" style="margin-top: 8px; width: 100%;">Upload more</button>
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

  // Quick schedule
  const qsBtn = document.getElementById("quick-schedule-btn");
  if (qsBtn) qsBtn.addEventListener("click", handleQuickSchedule);

  // Create post
  const csBtn = document.getElementById("create-schedule-btn");
  if (csBtn) csBtn.addEventListener("click", () => handleCreatePost(false));
  const cdBtn = document.getElementById("create-draft-btn");
  if (cdBtn) cdBtn.addEventListener("click", () => handleCreatePost(true));
  document.querySelectorAll("#create-platforms .platform-chip").forEach((c) => {
    c.addEventListener("click", () => c.classList.toggle("selected"));
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

async function handleQuickSchedule() {
  const caption = document.getElementById("quick-caption").value.trim();
  const accountId = document.getElementById("quick-account").value;
  const time = document.getElementById("quick-time").value;
  if (!caption) return showToast("Caption required", "error");
  if (!accountId) return showToast("Select an account", "error");
  if (!time) return showToast("Schedule time required", "error");

  const scheduledAt = new Date(time).toISOString();
  if (new Date(scheduledAt) <= new Date()) {
    return showToast("Schedule time must be in the future", "error");
  }

  showLoading(true);
  try {
    const res = await sendMessage({
      type: "SCHEDULE_POST",
      payload: { caption, accountId, scheduledAt },
    });
    if (res?.ok === false) throw new Error(res.error);
    showToast("Post scheduled!", "success");
    await loadState();
    renderSection("dashboard");
  } catch (e) {
    showToast("Failed to schedule: " + (e.message || e), "error");
  } finally {
    showLoading(false);
  }
}

async function handleCreatePost(asDraft = false) {
  const caption = document.getElementById("create-caption").value.trim();
  const hashtags = document.getElementById("create-hashtags").value.trim();
  const selected = Array.from(document.querySelectorAll("#create-platforms .platform-chip.selected"))
    .map((c) => c.dataset.account);
  if (!caption) return showToast("Caption required", "error");
  if (selected.length === 0 && !asDraft) return showToast("Select at least one account", "error");

  showLoading(true);
  try {
    const type = asDraft ? "CREATE_POST" : "SCHEDULE_POST";
    const res = await sendMessage({
      type,
      payload: {
        caption,
        hashtags: hashtags.split(/\s+/).filter(Boolean),
        accountIds: selected,
        status: asDraft ? "DRAFT" : "SCHEDULED",
      },
    });
    if (res?.ok === false) throw new Error(res.error);
    showToast(asDraft ? "Draft saved" : "Post scheduled!", "success");
    renderSection("dashboard");
  } catch (e) {
    showToast("Failed: " + (e.message || e), "error");
  } finally {
    showLoading(false);
  }
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
