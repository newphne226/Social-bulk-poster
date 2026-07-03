# SocialPilot Chrome Extension

A Manifest V3 Chrome extension for the SocialPilot SaaS — schedule and publish social media posts across Facebook, Instagram, X (Twitter), LinkedIn, and Pinterest from any webpage.

## Features

- **Login only** — registration is on the website (socialpilot.io)
- **Real-time sync** with the web dashboard (every 5 min + 1-min heartbeat)
- **Dashboard** — today's stats, quick actions, upcoming posts
- **Quick Schedule** — schedule a post in 3 fields
- **Create Post** — full composer with media, multi-account, hashtags
- **Drafts** — list and edit
- **Media Library** — browse your uploaded media
- **Schedule Queue** — see what's coming up
- **Notifications** — in-extension + native Chrome notifications
- **Settings** — dark mode (local to popup), timezone, auto-sync, logout
- **Context menus** — right-click any page / selection / image / link to schedule it
- **Keyboard shortcuts**:
  - `Ctrl+Shift+S` (Mac: `Cmd+Shift+S`) — open popup
  - `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) — quick-schedule current page
- **Content script** — floating "Schedule" button on large images

## Architecture

```
chrome-extension/
├── manifest.json           # MV3 manifest
├── background/
│   └── service-worker.js   # Alarms, auth, sync, message router
├── content/
│   ├── content.js          # Page metadata extraction, floating button
│   └── content.css
├── popup/
│   ├── popup.html          # 380×600 popup UI
│   ├── popup.css           # Light + dark themes
│   └── popup.js            # Section rendering, event handlers
├── options/
│   ├── options.html        # Extension options page
│   └── options.js
└── icons/
    ├── icon.svg
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    └── icon-128.png
```

## Install (developer mode)

1. Download or clone this folder.
2. Open Chrome and navigate to `chrome://extensions`.
3. Toggle **Developer mode** (top right).
4. Click **Load unpacked**.
5. Select the `chrome-extension/` folder.
6. The SocialPilot icon should appear in your toolbar. Pin it for easy access.
7. Click the icon → log in with your SocialPilot account (create one at socialpilot.io first).

## Permissions explained

| Permission | Why |
|---|---|
| `storage` | Persist auth token, user data, settings |
| `alarms` | Schedule periodic sync (5 min) and heartbeat (1 min) |
| `notifications` | Push Chrome notifications for new alerts |
| `contextMenus` | Right-click "Schedule with SocialPilot" |
| `activeTab` | Read the current tab's metadata when scheduling |
| `scripting` | Inject page-extractor script on demand |
| `host_permissions: api.socialpilot.io` | Call the SocialPilot API |

## Security

- The extension **never** accepts registration — only login.
- Auth token is stored in `chrome.storage.local` (not accessible to web pages).
- Refresh tokens are stored as `httpOnly` cookies (set by the web app).
- All API calls go over HTTPS.
- Content Security Policy: `script-src 'self'; object-src 'self'` — no remote code.

## Real-time sync model

```
┌────────────┐    heartbeat (1 min)    ┌──────────────┐
│  Extension │ ─────────────────────▶ │   API server  │
│   popup    │ ◀───────────────────── │ /extension/*  │
└────────────┘   new notifications     └──────────────┘
       ▲
       │ message passing
       ▼
┌────────────┐    sync (5 min)         ┌──────────────┐
│ Background │ ─────────────────────▶ │   API server  │
│   worker   │ ◀───────────────────── │ /extension/*  │
└────────────┘   full state            └──────────────┘
       │
       │ chrome.notifications.create
       ▼
   Native desktop notifications
```

The popup pulls from `chrome.storage.local` (no API calls on every render). The background worker keeps that storage fresh.
