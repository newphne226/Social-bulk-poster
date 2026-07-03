// =====================================================================
// SocialPilot Chrome Extension — Content Script
// =====================================================================
// Runs on every page. Responsibilities:
//   1. Listen for the "schedule this page" trigger (from context menu or keyboard)
//   2. Extract page metadata (title, description, image, selected text)
//   3. Show an inline floating "Quick schedule" button on hover over images
//   4. Relay extracted data to the background script
// =====================================================================

(function () {
  // ----- Page metadata extractor (used by background.executeScript too) -----
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
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "EXTRACT_PAGE_META") {
      sendResponse(getPageMeta());
      return;
    }
    if (msg.type === "SHOW_QUICK_BUTTON") {
      showFloatingButton(msg.payload);
      sendResponse({ ok: true });
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
    floatingBtn.addEventListener("click", () => {
      const meta = getPageMeta();
      chrome.runtime.sendMessage({
        type: "QUICK_SCHEDULE_PAGE",
        payload: { ...meta, ...payload },
      });
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
      if (img.closest("#socialpilot-*")) return;

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
        chrome.runtime.sendMessage({
          type: "QUICK_SCHEDULE_PAGE",
          payload: { ...getPageMeta(), image: img.src, source: "image-hover" },
        });
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

  // Listen for keyboard shortcut Ctrl+Shift+S to show floating button
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "S") {
      e.preventDefault();
      showFloatingButton({ source: "keyboard" });
    }
  });

  console.log("[SocialPilot] content script loaded on", location.href);
})();
