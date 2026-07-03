// =====================================================================
// SocialPilot Chrome Extension — Popup logic
// =====================================================================
// Renders the popup UI, sends messages to the background service worker,
// and persists UI preferences (like dark mode) to chrome.storage.local.
// =====================================================================

const API_BASE = "https://api.socialpilot.io/v1";

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
  applyDarkMode(await getDarkMode());

  // Check if logged in
  const { token } = await chrome.storage.local.get("token");
  if (token) {
    showMain();
    await loadState();
    renderSection("dashboard");
  } else {
    showLogin();
  }

  bindEvents();
});

function bindEvents() {
  // Login form
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document.getElementById("google-btn").addEventListener("click", handleGoogleLogin);

  // Nav rail
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.dataset.section;
      renderSection(section);
    });
  });

  // Open dashboard
  document.getElementById("open-dashboard").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "OPEN_DASHBOARD" });
  });

  // Logout
  document.getElementById("logout-btn").addEventListener("click", handleLogout);
}

// ---------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------
async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById("login-btn");
  btn.disabled = true;
  btn.textContent = "Logging in...";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();

    // Persist token + notify background to start sync
    await chrome.storage.local.set({ token: data.token, user: data.user });
    await chrome.runtime.sendMessage({ type: "AUTH_LOGIN", token: data.token });

    showMain();
    await loadState();
    renderSection("dashboard");
    showToast("Welcome back!");
  } catch (err) {
    showToast("Login failed. Check your credentials.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Log In";
  }
}

async function handleGoogleLogin() {
  // Opens the web OAuth flow in a new tab; the web app posts the token back via chrome.runtime
  await chrome.tabs.create({
    url: "https://socialpilot.io/login?from=extension&provider=google",
  });
}

async function handleLogout() {
  await chrome.runtime.sendMessage({ type: "AUTH_LOGOUT" });
  showLogin();
}

// ---------------------------------------------------------------------
// State
// ---------------------------------------------------------------------
async function loadState() {
  const data = await chrome.runtime.sendMessage({ type: "GET_STATE" });
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
  document.getElementById("user-avatar").src = state.user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${state.user.email}`;
  document.getElementById("user-name").textContent = state.user.name || state.user.email;
  document.getElementById("user-plan").textContent = state.subscription?.plan || "Free";
}

function updateNotifBadge() {
  const unread = state.notifications.filter((n) => !n.isRead).length;
  const badge = document.getElementById("notif-badge");
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
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.section === section));
  const content = document.getElementById("content");

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
      <div class="greeting">Hey ${state.user?.name?.split(" ")[0] || "there"} 👋</div>
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
  return `
    <div class="section-title">Quick Schedule</div>
    <div class="card">
      <label for="quick-caption">Caption</label>
      <textarea id="quick-caption" placeholder="What's on your mind?"></textarea>
      <label for="quick-account">Account</label>
      <select id="quick-account">
        ${state.accounts.map((a) => `<option value="${a.id}">${PLATFORMS[a.platform]?.name || a.platform} · ${a.displayName}</option>`).join("")}
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
            ${a.displayName}
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
  // Mock — extension pulls thumbnails from /media API in production
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
          <div style="font-size: 12px; font-weight: 600;">${n.title}</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${n.body}</div>
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
        <div class="toggle ${state.settings.darkMode ? "on" : ""}" id="dark-toggle"></div>
      </div>
      <div class="toggle-row">
        <div>
          <div style="font-size: 12px; font-weight: 600;">Timezone</div>
          <div style="font-size: 10px; color: var(--text-muted);">For scheduling display</div>
        </div>
      </div>
      <select id="tz-select">
        <option ${state.settings.timezone === "Asia/Dhaka" ? "selected" : ""}>Asia/Dhaka</option>
        <option ${state.settings.timezone === "America/New_York" ? "selected" : ""}>America/New_York</option>
        <option ${state.settings.timezone === "Europe/London" ? "selected" : ""}>Europe/London</option>
        <option ${state.settings.timezone === "Asia/Tokyo" ? "selected" : ""}>Asia/Tokyo</option>
      </select>
      <div class="toggle-row">
        <div>
          <div style="font-size: 12px; font-weight: 600;">Auto-sync</div>
          <div style="font-size: 10px; color: var(--text-muted);">Sync every 5 minutes</div>
        </div>
        <div class="toggle on" id="sync-toggle"></div>
      </div>
    </div>
    <div class="card">
      <div style="font-size: 11px; color: var(--text-muted);">Account</div>
      <div style="font-size: 13px; font-weight: 600; margin-top: 4px;">${state.user?.email || "—"}</div>
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
        <div class="post-meta">${p.accountUsername || ""} <span class="status-badge status-${p.status}">${p.status}</span></div>
        <div class="post-caption">${escapeHtml(p.caption)}</div>
        ${p.scheduledAt ? `<div class="post-time">⏰ ${new Date(p.scheduledAt).toLocaleString()}</div>` : ""}
      </div>
    </div>
  `;
}

function emptyState(msg) {
  return `<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg><div>${msg}</div></div>`;
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
  if (csBtn) csBtn.addEventListener("click", handleCreatePost);
  const cdBtn = document.getElementById("create-draft-btn");
  if (cdBtn) cdBtn.addEventListener("click", () => handleCreatePost(true));
  document.querySelectorAll("#create-platforms .platform-chip").forEach((c) => {
    c.addEventListener("click", () => c.classList.toggle("selected"));
  });

  // Settings
  const dt = document.getElementById("dark-toggle");
  if (dt) dt.addEventListener("click", handleDarkToggle);
  const st = document.getElementById("sync-toggle");
  if (st) st.addEventListener("click", () => st.classList.toggle("on"));
  const tz = document.getElementById("tz-select");
  if (tz) tz.addEventListener("change", async (e) => {
    state.settings.timezone = e.target.value;
    await chrome.storage.local.set({ settings: state.settings });
    showToast("Timezone updated");
  });
  const lo = document.getElementById("logout-full-btn");
  if (lo) lo.addEventListener("click", handleLogout);
}

async function handleQuickSchedule() {
  const caption = document.getElementById("quick-caption").value.trim();
  const accountId = document.getElementById("quick-account").value;
  const time = document.getElementById("quick-time").value;
  if (!caption) return showToast("Caption required");
  if (!time) return showToast("Schedule time required");

  showLoading(true);
  try {
    await chrome.runtime.sendMessage({
      type: "SCHEDULE_POST",
      payload: { caption, accountId, scheduledAt: new Date(time).toISOString() },
    });
    showToast("Post scheduled!");
    await loadState();
    renderSection("dashboard");
  } catch (e) {
    showToast("Failed to schedule");
  } finally {
    showLoading(false);
  }
}

async function handleCreatePost(asDraft = false) {
  const caption = document.getElementById("create-caption").value.trim();
  const hashtags = document.getElementById("create-hashtags").value.trim();
  const selected = Array.from(document.querySelectorAll("#create-platforms .platform-chip.selected"))
    .map((c) => c.dataset.account);
  if (!caption) return showToast("Caption required");
  if (selected.length === 0 && !asDraft) return showToast("Select at least one account");

  showLoading(true);
  try {
    const type = asDraft ? "CREATE_POST" : "SCHEDULE_POST";
    await chrome.runtime.sendMessage({
      type,
      payload: { caption, hashtags: hashtags.split(/\s+/).filter(Boolean), accountIds: selected, status: asDraft ? "DRAFT" : "SCHEDULED" },
    });
    showToast(asDraft ? "Draft saved" : "Post scheduled!");
    renderSection("dashboard");
  } catch (e) {
    showToast("Failed");
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

function showToast(msg) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}

function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
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
