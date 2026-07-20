/* ===================================================================
   SocialPilot Extension — Popup Logic (Clean Rewrite)
   =================================================================== */

const API = "https://smtools.online/api";
const PLATFORMS = {
  facebook: { name: "Facebook", color: "#1877F2" },
  instagram: { name: "Instagram", color: "#E4405F" },
  x: { name: "X", color: "#000000" },
  linkedin: { name: "LinkedIn", color: "#0A66C2" },
  pinterest: { name: "Pinterest", color: "#BD081C" },
};

let state = { user: null, posts: [], accounts: [], settings: {} };
let currentPage = "dashboard";

/* =================== INIT =================== */
document.addEventListener("DOMContentLoaded", async () => {
  const stored = await chrome.storage.local.get(["token", "user", "accounts", "posts", "settings"]);
  if (stored.token && stored.user) {
    state.user = stored.user;
    state.accounts = stored.accounts || [];
    state.posts = stored.posts || [];
    state.settings = stored.settings || {};
    showScreen("main");
    renderPage("dashboard");
  } else {
    showScreen("auth");
  }
  bindEvents();
});

/* =================== EVENTS =================== */
function bindEvents() {
  // Auth tabs
  document.querySelectorAll(".tab").forEach(t => {
    t.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
      t.classList.add("active");
      document.getElementById("login-form").classList.toggle("hidden", t.dataset.tab !== "login");
      document.getElementById("register-form").classList.toggle("hidden", t.dataset.tab !== "register");
      clearErrors();
    });
  });

  // Login
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  // Register
  document.getElementById("register-form").addEventListener("submit", handleRegister);

  // Bottom nav
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      renderPage(btn.dataset.page);
    });
  });

  // Open dashboard — admin goes to /admin, user goes to /dashboard
  document.getElementById("btn-open-dash").addEventListener("click", () => {
    const role = state.user?.role;
    const path = (role === "ADMIN" || role === "OWNER") ? "/admin" : "/dashboard";
    chrome.tabs.create({ url: API.replace(/\/api$/, "") + path });
  });
}

/* =================== AUTH =================== */
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value;
  const remember = document.getElementById("login-remember").checked;
  const btn = document.getElementById("login-btn");
  const errEl = document.getElementById("login-error");

  if (!email || !pass) { errEl.textContent = "Fill in all fields"; return; }
  btn.disabled = true; btn.textContent = "Signing in..."; errEl.textContent = "";

  try {
    const res = await fetch(API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass, remember }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    await chrome.storage.local.set({ token: data.token, user: data.user, subscription: data.subscription });
    state.user = data.user;
    await syncData(data.token);
    showScreen("main");
    renderPage("dashboard");
    toast("Welcome back!", "ok");
  } catch (err) {
    errEl.textContent = err.message;
  } finally {
    btn.disabled = false; btn.textContent = "Sign In";
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-pass").value;
  const confirm = document.getElementById("reg-confirm").value;
  const terms = document.getElementById("reg-terms").checked;
  const btn = document.getElementById("reg-btn");
  const errEl = document.getElementById("reg-error");

  if (!name || !email || !pass) { errEl.textContent = "All fields are required"; return; }
  if (pass.length < 6) { errEl.textContent = "Password must be at least 6 characters"; return; }
  if (pass !== confirm) { errEl.textContent = "Passwords do not match"; return; }
  if (!terms) { errEl.textContent = "You must agree to the terms"; return; }

  btn.disabled = true; btn.textContent = "Creating..."; errEl.textContent = "";

  try {
    const res = await fetch(API + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pass, remember: true }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");

    await chrome.storage.local.set({ token: data.token, user: data.user, subscription: data.subscription });
    state.user = data.user;
    await syncData(data.token);
    showScreen("main");
    renderPage("dashboard");
    toast("Account created! Pending admin approval.", "info");
  } catch (err) {
    errEl.textContent = err.message;
  } finally {
    btn.disabled = false; btn.textContent = "Create Account";
  }
}

/* =================== DATA SYNC =================== */
async function syncData(token) {
  try {
    const headers = { Authorization: "Bearer " + token };
    const [postsRes, accountsRes, subRes] = await Promise.all([
      fetch(API + "/posts", { headers }).then(r => r.json()).catch(() => []),
      fetch(API + "/accounts", { headers }).then(r => r.json()).catch(() => []),
      fetch(API + "/subscription", { headers }).then(r => r.json()).catch(() => ({})),
    ]);
    state.posts = Array.isArray(postsRes) ? postsRes : (postsRes.posts || []);
    state.accounts = Array.isArray(accountsRes) ? accountsRes : (accountsRes.accounts || []);
    if (subRes.subscription) {
      state.user.plan = subRes.subscription.plan || "FREE";
      state.user.planStatus = subRes.subscription.status || "ACTIVE";
    }
    await chrome.storage.local.set({ posts: state.posts, accounts: state.accounts, user: state.user, lastSyncAt: Date.now() });
  } catch (e) {
    console.warn("Sync failed", e);
  }
}

/* =================== SCREENS =================== */
function showScreen(name) {
  document.getElementById("auth-screen").classList.toggle("active", name === "auth");
  document.getElementById("main-screen").classList.toggle("active", name === "main");
}

/* =================== PAGES =================== */
function renderPage(page) {
  currentPage = page;
  const el = document.getElementById("main-content");
  const renderers = { dashboard: renderDashboard, schedule: renderSchedule, create: renderCreate, queue: renderQueue, settings: renderSettings };
  el.innerHTML = (renderers[page] || renderDashboard)();
  bindPageEvents();
  updateHeader();
}

function updateHeader() {
  if (!state.user) return;
  const initials = (state.user.name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  document.getElementById("user-avatar").textContent = initials;
  document.getElementById("user-name").textContent = state.user.name || state.user.email;
  const plan = state.user.plan || "FREE";
  const planStatus = state.user.planStatus || "ACTIVE";
  const planNames = { BASIC: "Basic", SILVER: "Silver", PRO: "Pro" };
  if (planStatus === "PENDING_APPROVAL") {
    document.getElementById("user-plan").textContent = (planNames[plan] || plan) + " (Pending)";
  } else {
    document.getElementById("user-plan").textContent = plan === "FREE" ? "Free Plan" : (planNames[plan] || plan) + " Plan";
  }
}

/* -- Dashboard -- */
function renderDashboard() {
  const scheduled = state.posts.filter(p => p.status === "SCHEDULED").length;
  const published = state.posts.filter(p => p.status === "PUBLISHED").length;
  return `
    <div class="card">
      <div style="font-size:16px;font-weight:700;color:var(--text);">Hey ${esc((state.user?.name || "there").split(" ")[0])} 👋</div>
      <div style="font-size:12px;color:var(--text3);margin:4px 0 12px;">You have ${scheduled} posts scheduled</div>
      <div class="stats-row">
        <div class="stat-box"><div class="stat-label">Scheduled</div><div class="stat-value">${scheduled}</div></div>
        <div class="stat-box"><div class="stat-label">Published</div><div class="stat-value">${published}</div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Quick Actions</div>
      <div class="actions-row">
        <button class="action-btn" data-goto="schedule"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Schedule</button>
        <button class="action-btn" data-goto="create"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>Create</button>
        <button class="action-btn" data-goto="queue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>Queue</button>
      </div>
    </div>
    <div class="card-title">Recent Posts</div>
    ${state.posts.slice(0, 5).map(renderPost).join("") || emptyHtml("No posts yet. Create your first post!")}
  `;
}

/* -- Schedule (Quick) -- */
function renderSchedule() {
  if (!state.accounts.length) return emptyHtml("Connect a social account first from the dashboard.");
  return `
    <div class="card-title">Quick Schedule</div>
    <div class="card">
      <label class="form-label">Caption</label>
      <textarea class="form-textarea" id="sch-caption" placeholder="What's on your mind?"></textarea>
      <label class="form-label">Platform</label>
      <div class="chips" id="sch-platforms">
        ${state.accounts.map(a => `<div class="chip" data-acc="${a.id}" data-plat="${a.platform}"><span class="chip-dot" style="background:${PLATFORMS[a.platform]?.color || '#888'}"></span>${esc(a.displayName || a.platform)}</div>`).join("")}
      </div>
      <label class="form-label">Schedule for</label>
      <input type="datetime-local" class="form-input" id="sch-time" />
      <div class="btn-row">
        <button class="btn-primary" id="sch-btn" style="background:linear-gradient(135deg,#f59e0b,#ec4899);border:none;">Schedule</button>
      </div>
    </div>
  `;
}

/* -- Create Post -- */
function renderCreate() {
  if (!state.accounts.length) return emptyHtml("Connect a social account first.");
  return `
    <div class="card-title">Create Post</div>
    <div class="card">
      <label class="form-label">Caption</label>
      <textarea class="form-textarea" id="cr-caption" placeholder="Write your post..."></textarea>
      <label class="form-label">Hashtags</label>
      <input type="text" class="form-input" id="cr-tags" placeholder="#socialmedia #marketing" />
      <label class="form-label">Post to</label>
      <div class="chips" id="cr-platforms">
        ${state.accounts.map(a => `<div class="chip" data-acc="${a.id}" data-plat="${a.platform}"><span class="chip-dot" style="background:${PLATFORMS[a.platform]?.color || '#888'}"></span>${esc(a.displayName || a.platform)}</div>`).join("")}
      </div>
      <div class="btn-row">
        <button class="btn-secondary" id="cr-draft">Save Draft</button>
        <button class="btn-primary" id="cr-post" style="background:linear-gradient(135deg,#f59e0b,#ec4899);border:none;">Post Now</button>
      </div>
    </div>
  `;
}

/* -- Queue -- */
function renderQueue() {
  const queued = state.posts.filter(p => p.status === "SCHEDULED" || p.status === "QUEUED").sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  return `
    <div class="card-title">Schedule Queue (${queued.length})</div>
    ${queued.map(renderPost).join("") || emptyHtml("Queue is empty")}
  `;
}

/* -- Settings -- */
function renderSettings() {
  return `
    <div class="card-title">Settings</div>
    <div class="card">
      <div class="toggle-row">
        <div><div class="toggle-label">Dark Mode</div><div class="toggle-desc">Toggle dark theme</div></div>
        <div class="toggle ${state.settings.darkMode ? 'on' : ''}" id="set-dark"></div>
      </div>
      <div class="toggle-row">
        <div><div class="toggle-label">Auto-sync</div><div class="toggle-desc">Sync posts every 5 min</div></div>
        <div class="toggle ${state.settings.autoSync !== false ? 'on' : ''}" id="set-sync"></div>
      </div>
      <div class="toggle-row">
        <div><div class="toggle-label">Desktop Notifications</div><div class="toggle-desc">Get notified on post status</div></div>
        <div class="toggle ${state.settings.notif !== false ? 'on' : ''}" id="set-notif"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Account</div>
      <div style="font-size:13px;color:var(--text);margin-bottom:4px;">${esc(state.user?.email || "—")}</div>
      <div style="font-size:11px;color:var(--text3);">Plan: ${esc(state.user?.plan || "Free")}</div>
      <button class="btn-secondary" id="set-logout" style="margin-top:10px;color:var(--red);width:100%;">Log Out</button>
    </div>
  `;
}

/* =================== PAGE EVENT BINDINGS =================== */
function bindPageEvents() {
  // Quick action goto
  document.querySelectorAll("[data-goto]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach(x => {
        x.classList.toggle("active", x.dataset.page === btn.dataset.goto);
      });
      renderPage(btn.dataset.goto);
    });
  });

  // Chip toggle
  document.querySelectorAll(".chip[data-acc]").forEach(c => {
    c.addEventListener("click", () => c.classList.toggle("on"));
  });

  // Schedule
  const schBtn = document.getElementById("sch-btn");
  if (schBtn) schBtn.addEventListener("click", handleSchedule);

  // Create
  const crPost = document.getElementById("cr-post");
  if (crPost) crPost.addEventListener("click", () => handleCreatePost("PUBLISHED"));
  const crDraft = document.getElementById("cr-draft");
  if (crDraft) crDraft.addEventListener("click", () => handleCreatePost("DRAFT"));

  // Settings toggles
  ["set-dark", "set-sync", "set-notif"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => {
      el.classList.toggle("on");
      if (id === "set-dark") { state.settings.darkMode = el.classList.contains("on"); applyDark(); }
      if (id === "set-sync") state.settings.autoSync = el.classList.contains("on");
      if (id === "set-notif") state.settings.notif = el.classList.contains("on");
      chrome.storage.local.set({ settings: state.settings });
    });
  });

  // Logout
  const loBtn = document.getElementById("set-logout");
  if (loBtn) loBtn.addEventListener("click", handleLogout);

  applyDark();
}

/* =================== HANDLERS =================== */
function hasActivePlan() {
  const plan = state.user?.plan || "FREE";
  return plan !== "FREE";
}

function openBilling() {
  const path = (state.user?.role === "ADMIN" || state.user?.role === "OWNER") ? "/admin" : "/dashboard";
  chrome.tabs.create({ url: API.replace(/\/api$/, "") + path + "/billing" });
}

async function handleSchedule() {
  if (!hasActivePlan()) {
    toast("Subscribe to a plan to schedule posts", "err");
    openBilling();
    return;
  }
  const caption = document.getElementById("sch-caption")?.value.trim();
  const time = document.getElementById("sch-time")?.value;
  const selected = document.querySelectorAll("#sch-platforms .chip.on");
  if (!caption) return toast("Caption is required", "err");
  if (!time) return toast("Schedule time is required", "err");
  if (!selected.length) return toast("Select at least one platform", "err");

  const scheduledAt = new Date(time).toISOString();
  if (new Date(scheduledAt) <= new Date()) return toast("Time must be in the future", "err");

  const btn = document.getElementById("sch-btn");
  btn.disabled = true; btn.textContent = "Scheduling...";

  try {
    const token = (await chrome.storage.local.get("token")).token;
    for (const chip of selected) {
      await fetch(API + "/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ caption, platform: chip.dataset.plat, accountId: chip.dataset.acc, scheduledAt, status: "SCHEDULED" }),
      });
    }
    await syncData(token);
    toast("Post scheduled!", "ok");
    renderPage("dashboard");
  } catch (e) {
    toast("Schedule failed: " + e.message, "err");
  } finally {
    btn.disabled = false; btn.textContent = "Schedule";
  }
}

async function handleCreatePost(status) {
  if (!hasActivePlan()) {
    toast("Subscribe to a plan to create posts", "err");
    openBilling();
    return;
  }
  const caption = document.getElementById("cr-caption")?.value.trim();
  const tags = document.getElementById("cr-tags")?.value.trim();
  const selected = document.querySelectorAll("#cr-platforms .chip.on");
  if (!caption) return toast("Caption is required", "err");
  if (!selected.length) return toast("Select at least one platform", "err");

  const fullCaption = tags ? caption + "\n\n" + tags : caption;

  try {
    const token = (await chrome.storage.local.get("token")).token;
    for (const chip of selected) {
      await fetch(API + "/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ caption: fullCaption, platform: chip.dataset.plat, accountId: chip.dataset.acc, status }),
      });
    }
    await syncData(token);
    toast(status === "DRAFT" ? "Draft saved!" : "Post published!", "ok");
    renderPage("dashboard");
  } catch (e) {
    toast("Failed: " + e.message, "err");
  }
}

async function handleLogout() {
  if (!confirm("Log out of SocialPilot?")) return;
  await chrome.storage.local.remove(["token", "user", "accounts", "posts", "settings", "subscription"]);
  state = { user: null, posts: [], accounts: [], settings: {} };
  showScreen("auth");
}

/* =================== HELPERS =================== */
function renderPost(p) {
  const plat = PLATFORMS[p.platform] || { color: "#888" };
  const statusClass = { SCHEDULED: "badge-scheduled", PUBLISHED: "badge-published", DRAFT: "badge-draft", FAILED: "badge-failed" };
  return `
    <div class="post-item">
      <div class="post-dot" style="background:${plat.color}">${(p.platform || "?")[0].toUpperCase()}</div>
      <div class="post-body">
        <div class="post-text">${esc(p.caption || "")}</div>
        <div class="post-meta">
          <span class="badge-status ${statusClass[p.status] || ''}">${p.status || "—"}</span>
          <span>${p.platform || "—"}</span>
          ${p.scheduledAt ? "<span>" + new Date(p.scheduledAt).toLocaleString() + "</span>" : ""}
        </div>
      </div>
    </div>
  `;
}

function emptyHtml(msg) {
  return `<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg><p>${msg}</p></div>`;
}

function esc(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

function toast(msg, type) {
  const box = document.getElementById("toast-box");
  const el = document.createElement("div");
  el.className = "toast toast-" + (type || "info");
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function clearErrors() {
  document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
}

function applyDark() {
  document.body.classList.toggle("dark", !!state.settings.darkMode);
}
