// =====================================================================
// SocialPilot Chrome Extension — Content Script (v2 — bug-fixed)
// =====================================================================
// v2 changes from v1:
//   • Removed Ctrl+Shift+S handler — it conflicted with the manifest's
//     "open-popup" command and never fired (Chrome captures it first).
//     The manifest command is the only keyboard shortcut now.
//   • onMessage now always returns true for async handlers and always
//     calls sendResponse (even for unknown message types) so the popup
//     never hangs waiting for a response.
//   • Guard against running on restricted pages (chrome://, etc.)
//   • Guard against SPA route changes re-injecting the script
// =====================================================================

(function () {
  // Skip on restricted pages — content scripts can't run here anyway, but
  // some old Chrome versions still inject them.
  if (/^(chrome|edge|about|chrome-extension|devtools|view-source):/i.test(location.href)) {
    return;
  }
  // Guard against double-injection
  if (window.__SOCIALPILOT_CONTENT_LOADED__) return;
  window.__SOCIALPILOT_CONTENT_LOADED__ = true;

  // ----- Page metadata extractor -----
  function getPageMeta() {
    const og = (sel) => document.querySelector(sel)?.content || "";
    return {
      title: document.title || "",
      url: location.href,
      description: og('meta[name="description"]') || og('meta[property="og:description"]'),
      image: og('meta[property="og:image"]'),
      siteName: og('meta[property="og:site_name"]'),
      author: og('meta[name="author"]'),
      selectedText: window.getSelection()?.toString().trim() || "",
    };
  }

  // ----- Receive messages from background / popup -----
  // CRITICAL: in MV3, onMessage listener must return `true` to keep the
  // message channel open for async sendResponse, OR call sendResponse
  // synchronously and return undefined.
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    try {
      if (msg?.type === "EXTRACT_PAGE_META") {
        sendResponse({ ok: true, meta: getPageMeta() });
        return false; // synchronous response — channel closes immediately
      }
      if (msg?.type === "SHOW_QUICK_BUTTON") {
        showFloatingButton(msg.payload);
        sendResponse({ ok: true });
        return false;
      }
      if (msg?.type === "PING") {
        sendResponse({ ok: true, url: location.href });
        return false;
      }
      // Unknown message — respond so caller doesn't hang
      sendResponse({ ok: false, error: `Unknown message type: ${msg?.type}` });
      return false;
    } catch (e) {
      sendResponse({ ok: false, error: String(e) });
      return false;
    }
  });

  // ----- Floating "Schedule with SocialPilot" button -----
  let floatingBtn = null;

  function showFloatingButton(payload) {
    if (floatingBtn) floatingBtn.remove();

    floatingBtn = document.createElement("div");
    floatingBtn.id = "socialpilot-quick-btn";
    floatingBtn.innerHTML = `
      <div class="sp-icon">SP</div>
      <span>Schedule</span>
    `;
    floatingBtn.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
      display: flex; align-items: center; gap: 6px;
      padding: 8px 14px;
      background: linear-gradient(135deg, #f59e0b, #ec4899);
      color: white; font-family: -apple-system, sans-serif; font-size: 13px; font-weight: 600;
      border-radius: 24px; cursor: pointer;
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
      transition: transform 0.15s;
    `;

    const iconEl = floatingBtn.querySelector(".sp-icon");
    iconEl.style.cssText = `
      width: 18px; height: 18px;
      background: rgba(255, 255, 255, 0.25); border-radius: 4px;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 800;
    `;

    floatingBtn.addEventListener("mouseenter", () => (floatingBtn.style.transform = "translateY(-2px)"));
    floatingBtn.addEventListener("mouseleave", () => (floatingBtn.style.transform = "translateY(0)"));
    floatingBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const meta = getPageMeta();
      // Send to background — message handler will save & open popup
      try {
        chrome.runtime.sendMessage({
          type: "QUICK_SCHEDULE_PAGE",
          payload: { ...meta, ...(payload || {}) },
        });
      } catch (err) {
        console.warn("[SocialPilot] sendMessage failed", err);
      }
      floatingBtn.remove();
      floatingBtn = null;
    });

    document.body.appendChild(floatingBtn);

    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (floatingBtn) {
        floatingBtn.remove();
        floatingBtn = null;
      }
    }, 10000);
  }

  // ----- Hover-overlay on images: "Schedule this image" -----
  let currentOverlay = null;

  document.addEventListener(
    "mouseover",
    (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement) || img.width < 200 || img.height < 200) return;
      // Don't show on our own UI
      if (img.closest("[id^='socialpilot-']")) return;

      if (currentOverlay) currentOverlay.remove();
      const rect = img.getBoundingClientRect();
      currentOverlay = document.createElement("div");
      currentOverlay.id = "socialpilot-img-overlay";
      currentOverlay.innerHTML = "📅 Schedule with SocialPilot";
      currentOverlay.style.cssText = `
        position: fixed;
        top: ${rect.top + 8}px; left: ${rect.left + 8}px;
        z-index: 2147483646;
        padding: 6px 10px;
        background: rgba(15, 23, 42, 0.9); color: white;
        font-family: -apple-system, sans-serif; font-size: 11px; font-weight: 500;
        border-radius: 6px; cursor: pointer;
        backdrop-filter: blur(8px);
      `;
      currentOverlay.addEventListener("click", (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        try {
          chrome.runtime.sendMessage({
            type: "QUICK_SCHEDULE_PAGE",
            payload: { ...getPageMeta(), image: img.src, source: "image-hover" },
          });
        } catch (err) {
          console.warn("[SocialPilot] sendMessage failed", err);
        }
        currentOverlay.remove();
        currentOverlay = null;
      });
      document.body.appendChild(currentOverlay);
    },
    { passive: true }
  );

  document.addEventListener(
    "mouseout",
    (e) => {
      if (e.target instanceof HTMLImageElement && currentOverlay) {
        setTimeout(() => {
          if (currentOverlay && !currentOverlay.matches(":hover")) {
            currentOverlay.remove();
            currentOverlay = null;
          }
        }, 200);
      }
    },
    { passive: true }
  );

  // NOTE: We do NOT listen for Ctrl+Shift+S here. That shortcut is
  // claimed by the manifest's "open-popup" command, which Chrome handles
  // at the browser level — content scripts never see it. Adding a handler
  // here was dead code in v1.

  console.log("[SocialPilot] content script loaded on", location.href);
})();
