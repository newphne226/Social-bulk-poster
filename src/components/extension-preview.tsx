"use client";

// =====================================================================
// Chrome Extension Preview
// Simulates the SocialPilot browser extension popup (380x600) sitting on
// a gradient backdrop. The extension has its OWN local dark-mode state
// (independent of the page theme) so reviewers can demo the in-popup
// dark mode toggle from Settings.
// =====================================================================

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chrome, Sparkles, LayoutDashboard, Zap, Plus, FileText, Image as ImageIcon,
  CalendarClock, Bell, ExternalLink, Settings, LogOut, Mail, Lock, Eye, EyeOff,
  ArrowRight, ChevronRight, Clock, CheckCircle2, AlertTriangle, Hash, Upload,
  Trash2, Edit3, Moon, Sun, Users, TrendingUp, ImagePlus, MousePointerClick,
  Send, Save, Globe, Calendar, Power, RefreshCw, UserPlus, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PlatformIcon } from "@/components/platform-icon";
import { PLATFORM_LIST } from "@/lib/platforms";
import {
  CURRENT_USER, MOCK_POSTS, MOCK_NOTIFICATIONS, MOCK_ACCOUNTS,
  type MockPost,
} from "@/lib/mock-data";

// ---------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------

type ExtensionSection =
  | "dashboard" | "quick-schedule" | "create-post" | "drafts"
  | "media" | "queue" | "notifications" | "open-web" | "settings";

interface RailItem { id: ExtensionSection; label: string; icon: React.ElementType }
interface DraftPost {
  id: string; caption: string; platform: string;
  accountUsername: string; updatedAt: string;
}
interface NotificationItem {
  id: string; type: string; title: string; body: string;
  isRead: boolean; createdAt: string;
}

const RAIL_ITEMS: RailItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "quick-schedule", label: "Quick Schedule", icon: Zap },
  { id: "create-post", label: "Create Post", icon: Plus },
  { id: "drafts", label: "Drafts", icon: FileText },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "queue", label: "Schedule Queue", icon: CalendarClock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "open-web", label: "Open Web Dashboard", icon: ExternalLink },
];

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  SCHEDULED: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  QUEUED: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
  FAILED: "bg-red-500/10 text-red-700 dark:text-red-400",
  DRAFT: "bg-muted text-muted-foreground",
  PAUSED: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

const INITIAL_DRAFTS: DraftPost[] = [
  ...MOCK_POSTS.filter((p) => p.status === "DRAFT"),
  {
    id: "d_extra_1",
    caption: "Friday motivation: ship something today 🚀 #buildinpublic",
    platform: "x", accountUsername: "@acme",
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "d_extra_2",
    caption: "Recipe reel: 30-second weeknight pasta 🍝",
    platform: "instagram", accountUsername: "@acme.food",
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function formatCountdown(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  if (mins < 60) return diff > 0 ? `in ${mins}m` : `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return diff > 0 ? `in ${hours}h` : `${hours}h ago`;
  const days = Math.round(hours / 24);
  return diff > 0 ? `in ${days}d` : `${days}d ago`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function relativeTime(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

// =====================================================================
// Main exported component — page background + popup container
// =====================================================================

export function ExtensionPreview() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-gradient-to-br from-amber-50 via-rose-50 to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Decorative blurred blobs (amber/pink/emerald — no indigo/blue) */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-400/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-pink-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 py-10 md:py-16">
        {/* Heading / context */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
            <Chrome className="h-3.5 w-3.5" />
            Browser Extension · Popup Preview
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
            Chrome Extension Preview
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400 md:text-base">
            This is a faithful mockup of the SocialPilot browser extension popup that
            appears when a user clicks the toolbar icon. Click around to explore every
            screen — log in, schedule a post, browse drafts, toggle the in-extension dark
            mode, and more.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-zinc-900/5 px-3 py-1.5 text-xs text-zinc-600 dark:bg-zinc-100/10 dark:text-zinc-400">
            <MousePointerClick className="h-3.5 w-3.5" />
            Tip: click the left rail icons to switch screens
          </div>
        </div>

        <ExtensionPopup />

        <p className="mt-8 max-w-xl text-center text-xs text-zinc-500 dark:text-zinc-500">
          Real Chrome extension popups are 380×600 with a fixed toolbar-style header and
          a thin icon rail. This preview reproduces that exact layout — the dark mode
          toggle inside Settings controls the popup theme only, not the page.
        </p>
      </div>
    </div>
  );
}

// =====================================================================
// Popup container — owns all extension-local state
// =====================================================================

function ExtensionPopup() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [section, setSection] = React.useState<ExtensionSection>("dashboard");
  const [drafts, setDrafts] = React.useState<DraftPost[]>(INITIAL_DRAFTS);
  const [notifications, setNotifications] =
    React.useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = React.useCallback(() => {
    setLoggedIn(false);
    setSection("dashboard");
    toast.info("Signed out of the extension");
  }, []);

  const handleLogin = React.useCallback(() => {
    setLoggedIn(true);
    setSection("dashboard");
    toast.success("Welcome back, Alex!");
  }, []);

  const handleDeleteDraft = React.useCallback((id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    toast.success("Draft deleted");
  }, []);

  const handleMarkAllRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  }, []);

  return (
    <div
      className={cn(
        "relative flex h-[600px] w-[380px] overflow-hidden rounded-2xl border border-zinc-200/80 bg-white text-zinc-900 shadow-2xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100",
        darkMode && "dark",
      )}
    >
      <ExtensionRail
        section={section}
        onSectionChange={setSection}
        unreadCount={unreadCount}
        onLogout={handleLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <ExtensionHeader loggedIn={loggedIn} />

        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={loggedIn ? `authed-${section}` : "login"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="h-full"
            >
              {!loggedIn ? (
                <LoginSection onLogin={handleLogin} />
              ) : (
                <ScrollArea className="h-full">
                  <div className="p-3">
                    {section === "dashboard" && (
                      <DashboardSection onNavigate={setSection} />
                    )}
                    {section === "quick-schedule" && <QuickScheduleSection />}
                    {section === "create-post" && <CreatePostSection />}
                    {section === "drafts" && (
                      <DraftsSection drafts={drafts} onDelete={handleDeleteDraft} />
                    )}
                    {section === "media" && <MediaSection />}
                    {section === "queue" && <QueueSection />}
                    {section === "notifications" && (
                      <NotificationsSection
                        notifications={notifications}
                        onMarkAllRead={handleMarkAllRead}
                      />
                    )}
                    {section === "open-web" && <OpenWebSection />}
                    {section === "settings" && (
                      <SettingsSection
                        darkMode={darkMode}
                        onDarkModeChange={setDarkMode}
                        onLogout={handleLogout}
                      />
                    )}
                  </div>
                </ScrollArea>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Left icon rail (40px wide, icon-only)
// =====================================================================

interface ExtensionRailProps {
  section: ExtensionSection;
  onSectionChange: (s: ExtensionSection) => void;
  unreadCount: number;
  onLogout: () => void;
}

function ExtensionRail({ section, onSectionChange, unreadCount, onLogout }: ExtensionRailProps) {
  return (
    <nav className="flex w-10 shrink-0 flex-col items-center border-r border-zinc-200 bg-zinc-50 py-2 dark:border-zinc-800 dark:bg-zinc-900/60">
      <div
        className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 text-white shadow-sm"
        title="SocialPilot"
      >
        <Sparkles className="h-3.5 w-3.5" />
      </div>

      <div className="flex flex-1 flex-col items-center gap-1">
        {RAIL_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = section === item.id;
          const showBadge = item.id === "notifications" && unreadCount > 0;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              title={item.label}
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                isActive
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  : "text-zinc-500 hover:bg-zinc-200/70 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {showBadge && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-pink-500 px-1 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <Separator className="my-1 w-6 bg-zinc-200 dark:bg-zinc-700" />

      <RailIconButton label="Settings" active={section === "settings"} onClick={() => onSectionChange("settings")}>
        <Settings className="h-4 w-4" />
      </RailIconButton>
      <RailIconButton label="Logout" onClick={onLogout}>
        <LogOut className="h-4 w-4" />
      </RailIconButton>
    </nav>
  );
}

function RailIconButton({
  label, active, onClick, children,
}: {
  label: string; active?: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={cn(
        "mt-1 flex h-8 w-8 items-center justify-center rounded-md transition-colors",
        active
          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
          : "text-zinc-500 hover:bg-zinc-200/70 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
      )}
    >
      {children}
    </button>
  );
}

// =====================================================================
// Header — logo + user avatar
// =====================================================================

function ExtensionHeader({ loggedIn }: { loggedIn: boolean }) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-amber-500 to-pink-500 text-white">
          <Sparkles className="h-3 w-3" />
        </div>
        <span className="text-sm font-semibold tracking-tight">SocialPilot</span>
      </div>
      {loggedIn ? (
        <Avatar className="h-7 w-7">
          <AvatarImage src={CURRENT_USER.avatarUrl} alt={CURRENT_USER.name} />
          <AvatarFallback className="text-xs">{CURRENT_USER.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ) : (
        <span className="text-[11px] text-zinc-400">v2.4.0</span>
      )}
    </header>
  );
}

// =====================================================================
// Section: Login
// =====================================================================

function LoginSection({ onLogin }: { onLogin: () => void }) {
  const [authTab, setAuthTab] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("alex@socialpilot.io");
  const [password, setPassword] = React.useState("••••••••••");
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [error, setError] = React.useState("");

  // Sign Up form state
  const [suName, setSuName] = React.useState("");
  const [suEmail, setSuEmail] = React.useState("");
  const [suPassword, setSuPassword] = React.useState("");
  const [suConfirm, setSuConfirm] = React.useState("");
  const [suTerms, setSuTerms] = React.useState(false);
  const [suError, setSuError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic email validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
      toast.success("Welcome back!");
    }, 550);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSuError("");

    if (suName.trim().length < 2) {
      setSuError("Name must be at least 2 characters");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(suEmail)) {
      setSuError("Please enter a valid email address");
      return;
    }
    if (suPassword.length < 6) {
      setSuError("Password must be at least 6 characters");
      return;
    }
    if (suPassword !== suConfirm) {
      setSuError("Passwords do not match");
      return;
    }
    if (!suTerms) {
      setSuError("You must agree to the Terms to continue");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
      toast.success(`Welcome, ${suName.split(" ")[0]}! Your account is ready.`);
    }, 800);
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-3 p-5">
        {/* Brand header */}
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-pink-500 text-white shadow-md">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-base font-semibold">SocialPilot</h2>
          <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            Schedule across 5 platforms in seconds
          </p>
        </div>

        {/* Sign In / Sign Up tab switcher */}
        <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => { setAuthTab("signin"); setError(""); setSuError(""); }}
            className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors ${
              authTab === "signin"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthTab("signup"); setError(""); setSuError(""); }}
            className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors ${
              authTab === "signup"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            Sign Up
          </button>
        </div>

        {authTab === "signin" ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="space-y-1">
                <Label htmlFor="ext-email" className="text-[11px]">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                  <Input
                    id="ext-email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 pl-8 text-xs"
                    placeholder="you@company.com" required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="ext-pw" className="text-[11px]">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                  <Input
                    id="ext-pw" type={showPw ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-9 pl-8 pr-8 text-xs" placeholder="••••••••" required
                  />
                  <button
                    type="button" onClick={() => setShowPw((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer text-zinc-500 dark:text-zinc-400">
                  <input
                    type="checkbox" checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-3 w-3 cursor-pointer"
                  />
                  Remember me
                </label>
                <a
                  href="https://socialpilot.io/forgot-password"
                  target="_blank" rel="noreferrer"
                  className="text-zinc-500 hover:text-amber-600 hover:underline dark:text-zinc-400 dark:hover:text-amber-400"
                >
                  Forgot password?
                </a>
              </div>

              {error && (
                <div className="rounded-md bg-red-500/10 px-2.5 py-1.5 text-[10px] text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <Button
                type="submit" disabled={loading}
                className="h-9 w-full bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:from-amber-600 hover:to-pink-600"
              >
                {loading ? "Signing in…" : "Sign In"}
                {!loading && <ArrowRight className="h-3.5 w-3.5" />}
              </Button>
            </form>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-[10px] uppercase tracking-wider text-zinc-400">or</span>
              <Separator className="flex-1" />
            </div>

            <Button
              type="button" variant="outline"
              className="h-9 w-full bg-transparent text-xs"
              onClick={() => toast.info("Google OAuth would launch here")}
            >
              <GoogleG />
              Continue with Google
            </Button>

            <p className="text-center text-[11px] text-zinc-500 dark:text-zinc-400">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthTab("signup")}
                className="font-medium text-amber-600 hover:underline dark:text-amber-400"
              >
                Sign Up
              </button>
            </p>
          </>
        ) : (
          /* Sign Up panel — full registration form, creates account in the database */
          <form onSubmit={handleSignup} className="space-y-2.5">
            <div className="text-center mb-1">
              <h3 className="text-sm font-semibold">Create your account</h3>
              <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                Your account is created in our database — no redirect needed.
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="su-name" className="text-[11px]">Full name</Label>
              <div className="relative">
                <UserPlus className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="su-name" type="text" value={suName}
                  onChange={(e) => setSuName(e.target.value)}
                  className="h-9 pl-8 text-xs"
                  placeholder="Jane Doe" required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="su-email" className="text-[11px]">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="su-email" type="email" value={suEmail}
                  onChange={(e) => setSuEmail(e.target.value)}
                  className="h-9 pl-8 text-xs"
                  placeholder="you@example.com" required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="su-pw" className="text-[11px]">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="su-pw" type={showPw ? "text" : "password"} value={suPassword}
                  onChange={(e) => setSuPassword(e.target.value)}
                  className="h-9 pl-8 pr-8 text-xs"
                  placeholder="At least 6 characters" required
                />
                <button
                  type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="su-confirm" className="text-[11px]">Confirm password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="su-confirm" type={showPw ? "text" : "password"} value={suConfirm}
                  onChange={(e) => setSuConfirm(e.target.value)}
                  className="h-9 pl-8 text-xs"
                  placeholder="Re-enter your password" required
                />
              </div>
            </div>

            <label className="flex items-start gap-1.5 cursor-pointer text-[10px] text-zinc-500 dark:text-zinc-400">
              <input
                type="checkbox" checked={suTerms}
                onChange={(e) => setSuTerms(e.target.checked)}
                className="h-3 w-3 cursor-pointer mt-0.5"
              />
              <span>
                I agree to the{" "}
                <a href="https://socialpilot.io/terms" target="_blank" rel="noreferrer" className="text-amber-600 hover:underline dark:text-amber-400">Terms</a>
                {" "}and{" "}
                <a href="https://socialpilot.io/privacy" target="_blank" rel="noreferrer" className="text-amber-600 hover:underline dark:text-amber-400">Privacy Policy</a>
              </span>
            </label>

            {suError && (
              <div className="rounded-md bg-red-500/10 px-2.5 py-1.5 text-[10px] text-red-600 dark:text-red-400">
                {suError}
              </div>
            )}

            <Button
              type="submit" disabled={loading}
              className="h-9 w-full bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:from-amber-600 hover:to-pink-600"
            >
              {loading ? "Creating account…" : "Create Account"}
              {!loading && <ArrowRight className="h-3.5 w-3.5" />}
            </Button>

            <p className="text-center text-[11px] text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthTab("signin")}
                className="font-medium text-amber-600 hover:underline dark:text-amber-400"
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
          🔒 Your account is created securely in our database. We never share your data.
        </p>
      </div>
    </ScrollArea>
  );
}

function GoogleG() {
  // Multicolor inline "G" — recognizable without bundling an icon library
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

// =====================================================================
// Section: Dashboard
// =====================================================================

function DashboardSection({ onNavigate }: { onNavigate: (s: ExtensionSection) => void }) {
  const todaysPosts = MOCK_POSTS.filter((p) => p.status === "SCHEDULED" || p.status === "QUEUED");
  const totalFollowers = MOCK_ACCOUNTS.filter((a) => a.isConnected).reduce((s, a) => s + a.followerCount, 0);

  const quickActions: { label: string; icon: React.ElementType; target: ExtensionSection; color: string }[] = [
    { label: "Quick Schedule", icon: Zap, target: "quick-schedule", color: "text-amber-600 dark:text-amber-400" },
    { label: "Create Post", icon: Plus, target: "create-post", color: "text-pink-600 dark:text-pink-400" },
    { label: "Drafts", icon: FileText, target: "drafts", color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Media", icon: ImageIcon, target: "media", color: "text-amber-600 dark:text-amber-400" },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-pink-500/5 to-emerald-500/10 p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={CURRENT_USER.avatarUrl} alt={CURRENT_USER.name} />
            <AvatarFallback>{CURRENT_USER.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Good morning,</p>
            <p className="truncate text-sm font-semibold">{CURRENT_USER.name}</p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-zinc-600 dark:text-zinc-300">
          You have{" "}
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            {todaysPosts.length} posts
          </span>{" "}
          scheduled for today.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatChip
          icon={Users} label="Followers"
          value={totalFollowers >= 1000 ? `${(totalFollowers / 1000).toFixed(1)}K` : `${totalFollowers}`}
          delta="+8.4%" accent="emerald"
        />
        <StatChip
          icon={TrendingUp} label="Posts today"
          value={`${todaysPosts.length}`} delta="+2" accent="amber"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Today&apos;s Queue
          </h3>
          <button
            onClick={() => onNavigate("queue")}
            className="inline-flex items-center gap-0.5 text-[11px] font-medium text-amber-600 hover:underline dark:text-amber-400"
          >
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-1.5">
          {todaysPosts.slice(0, 3).map((post) => (
            <MiniPostRow key={post.id} post={post} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((a) => (
            <button
              key={a.label} onClick={() => onNavigate(a.target)}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-left transition-colors hover:border-amber-500/40 hover:bg-amber-500/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-amber-500/10"
            >
              <a.icon className={cn("h-4 w-4 shrink-0", a.color)} />
              <span className="text-[11px] font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatChip({
  icon: Icon, label, value, delta, accent,
}: {
  icon: React.ElementType; label: string; value: string; delta: string;
  accent: "amber" | "pink" | "emerald";
}) {
  const accentMap = {
    amber: "text-amber-600 dark:text-amber-400",
    pink: "text-pink-600 dark:text-pink-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
  };
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-2.5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</span>
        <Icon className="h-3.5 w-3.5 text-zinc-400" />
      </div>
      <div className="mt-1 text-lg font-bold leading-none">{value}</div>
      <div className={cn("mt-1 text-[10px] font-medium", accentMap[accent])}>{delta} vs last week</div>
    </div>
  );
}

function MiniPostRow({ post }: { post: MockPost }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
      <PlatformIcon platform={post.platform} size={24} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-medium leading-tight">{post.caption}</p>
        <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400">
          <Clock className="h-2.5 w-2.5" />
          {post.scheduledAt && formatCountdown(post.scheduledAt)}
        </div>
      </div>
      <Badge variant="outline" className={cn("px-1.5 py-0 text-[9px]", STATUS_COLORS[post.status])}>
        {post.status}
      </Badge>
    </div>
  );
}

// =====================================================================
// Section: Quick Schedule (minimal)
// =====================================================================

function QuickScheduleSection() {
  const [caption, setCaption] = React.useState("");
  const [accountId, setAccountId] = React.useState(MOCK_ACCOUNTS[0]?.id ?? "");
  const [datetime, setDatetime] = React.useState("");
  const [scheduled, setScheduled] = React.useState(false);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !datetime) {
      toast.error("Caption and time are required");
      return;
    }
    setScheduled(true);
    toast.success("Post scheduled!");
    setTimeout(() => setScheduled(false), 2200);
    setCaption("");
    setDatetime("");
  };

  return (
    <div className="space-y-3">
      <SectionTitle icon={Zap} title="Quick Schedule" subtitle="Fast one-off scheduling" />

      {scheduled ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Scheduled!</p>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
            Your post is queued and will publish at the chosen time.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSchedule} className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Caption</Label>
            <Textarea
              value={caption} onChange={(e) => setCaption(e.target.value)}
              placeholder="What do you want to share?"
              className="min-h-[80px] resize-none text-xs" maxLength={500}
            />
            <div className="text-right text-[10px] text-zinc-400">{caption.length}/500</div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Account</Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger className="h-9 w-full text-xs">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_ACCOUNTS.filter((a) => a.isConnected).map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={a.platform} size={16} />
                      <span className="text-xs">{a.displayName}</span>
                      <span className="text-[10px] text-zinc-400">{a.username}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Date &amp; time</Label>
            <Input
              type="datetime-local" value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <Button
            type="submit"
            className="h-9 w-full bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:from-amber-600 hover:to-pink-600"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            Schedule
          </Button>
        </form>
      )}
    </div>
  );
}

// =====================================================================
// Section: Create Post (full composer)
// =====================================================================

function CreatePostSection() {
  const [caption, setCaption] = React.useState("");
  const [selectedAccounts, setSelectedAccounts] = React.useState<string[]>([]);
  const [hashtags, setHashtags] = React.useState("");
  const [mediaAdded, setMediaAdded] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);

  const toggleAccount = (id: string) =>
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setMediaAdded(true);
    toast.success("Media added to post");
  };

  const validate = () => {
    if (!caption.trim()) { toast.error("Add a caption first"); return false; }
    if (selectedAccounts.length === 0) { toast.error("Pick at least one account"); return false; }
    return true;
  };

  const reset = () => {
    setCaption(""); setSelectedAccounts([]); setHashtags(""); setMediaAdded(false);
  };

  const handlePublishNow = () => {
    if (!validate()) return;
    toast.success(`Published now across ${selectedAccounts.length} account(s)!`);
    reset();
  };
  const handleSchedule = () => {
    if (!validate()) return;
    toast.success("Post scheduled!");
  };
  const handleSaveDraft = () => {
    if (!caption.trim()) { toast.error("Nothing to save"); return; }
    toast.success("Saved to drafts");
    reset();
  };

  return (
    <div className="space-y-3">
      <SectionTitle icon={Plus} title="Create Post" subtitle="Compose once, post everywhere" />

      <div className="space-y-1.5">
        <Label className="text-xs">Caption</Label>
        <Textarea
          value={caption} onChange={(e) => setCaption(e.target.value)}
          placeholder="Write your caption…"
          className="min-h-[90px] resize-none text-xs" maxLength={2200}
        />
        <div className="flex items-center justify-between text-[10px] text-zinc-400">
          <span>{caption.length}/2200</span>
          <button className="inline-flex items-center gap-0.5 text-amber-600 hover:underline dark:text-amber-400">
            <Sparkles className="h-2.5 w-2.5" /> AI assist
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Media</Label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => { setMediaAdded(true); toast.info("Browse media dialog would open"); }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-4 text-center transition-colors",
            dragOver
              ? "border-amber-500 bg-amber-500/5"
              : "border-zinc-300 hover:border-amber-500/50 hover:bg-amber-500/5 dark:border-zinc-700",
          )}
        >
          {mediaAdded ? (
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>1 media attached — click to replace</span>
            </div>
          ) : (
            <>
              <Upload className="h-4 w-4 text-zinc-400" />
              <p className="text-[11px] font-medium">Drag &amp; drop or click to upload</p>
              <p className="text-[10px] text-zinc-400">JPG, PNG, MP4 · up to 50MB</p>
            </>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">
          Accounts <span className="text-zinc-400">({selectedAccounts.length} selected)</span>
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {MOCK_ACCOUNTS.filter((a) => a.isConnected).map((a) => {
            const active = selectedAccounts.includes(a.id);
            return (
              <button
                key={a.id} onClick={() => toggleAccount(a.id)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium transition-colors",
                  active
                    ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    : "border-zinc-200 text-zinc-600 hover:border-amber-500/40 dark:border-zinc-700 dark:text-zinc-400",
                )}
              >
                <PlatformIcon platform={a.platform} size={14} />
                {a.username}
                {active && <CheckCircle2 className="h-2.5 w-2.5" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Hashtags</Label>
        <div className="relative">
          <Hash className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <Input
            value={hashtags} onChange={(e) => setHashtags(e.target.value)}
            placeholder="marketing, growth, saas"
            className="h-9 pl-8 text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 pt-1">
        <Button type="button" variant="outline" size="sm" className="h-8 text-[11px]" onClick={handleSaveDraft}>
          <Save className="h-3 w-3" /> Draft
        </Button>
        <Button type="button" variant="outline" size="sm" className="h-8 text-[11px]" onClick={handleSchedule}>
          <CalendarClock className="h-3 w-3" /> Schedule
        </Button>
        <Button
          type="button" size="sm"
          className="h-8 bg-gradient-to-r from-amber-500 to-pink-500 text-[11px] text-white hover:from-amber-600 hover:to-pink-600"
          onClick={handlePublishNow}
        >
          <Send className="h-3 w-3" /> Publish
        </Button>
      </div>
    </div>
  );
}

// =====================================================================
// Section: Drafts
// =====================================================================

function DraftsSection({ drafts, onDelete }: { drafts: DraftPost[]; onDelete: (id: string) => void }) {
  if (drafts.length === 0) {
    return (
      <div className="space-y-3">
        <SectionTitle icon={FileText} title="Drafts" subtitle="Work in progress" />
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <FileText className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
          <p className="text-xs text-zinc-500">No drafts yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <SectionTitle icon={FileText} title="Drafts" subtitle={`${drafts.length} saved`} />
      <div className="space-y-1.5">
        {drafts.map((d) => (
          <div
            key={d.id}
            className="group flex items-start gap-2 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <PlatformIcon platform={d.platform} size={24} />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[11px] font-medium leading-snug">{d.caption}</p>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-400">
                <span>{d.accountUsername}</span>
                <span>·</span>
                <span>edited {relativeTime(d.updatedAt)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 opacity-70 group-hover:opacity-100">
              <button
                onClick={() => toast.info("Opening draft editor…")}
                className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400"
                title="Edit"
              >
                <Edit3 className="h-3 w-3" />
              </button>
              <button
                onClick={() => onDelete(d.id)}
                className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 hover:bg-red-500/10 hover:text-red-600"
                title="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// Section: Media Upload
// =====================================================================

function MediaSection() {
  const thumbnails = [
    { id: "t1", url: "https://picsum.photos/seed/m1/200/200", type: "IMAGE" as const },
    { id: "t2", url: "https://picsum.photos/seed/m2/200/200", type: "IMAGE" as const },
    { id: "t3", url: "https://picsum.photos/seed/m3/200/200", type: "VIDEO" as const },
    { id: "t4", url: "https://picsum.photos/seed/m4/200/200", type: "IMAGE" as const },
    { id: "t5", url: "https://picsum.photos/seed/m5/200/200", type: "IMAGE" as const },
    { id: "t6", url: "https://picsum.photos/seed/m6/200/200", type: "VIDEO" as const },
  ];

  return (
    <div className="space-y-3">
      <SectionTitle icon={ImageIcon} title="Media Library" subtitle="Recent uploads" />

      <button
        onClick={() => toast.info("Upload dialog would open")}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-white py-3 text-xs font-medium text-zinc-600 transition-colors hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
      >
        <ImagePlus className="h-3.5 w-3.5" />
        Upload new media
      </button>

      <div className="grid grid-cols-3 gap-1.5">
        {thumbnails.map((t) => (
          <div
            key={t.id}
            className="group relative aspect-square overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800"
          >
            <img
              src={t.url} alt="" loading="lazy"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            {t.type === "VIDEO" && (
              <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 py-0.5 text-[8px] font-medium text-white">
                MP4
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-[10px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center justify-between">
          <span>Storage used</span>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">1.2 GB / 5 GB</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-amber-500 to-pink-500" />
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Section: Schedule Queue
// =====================================================================

function QueueSection() {
  const upcoming = MOCK_POSTS.filter(
    (p) => p.status === "SCHEDULED" || p.status === "QUEUED" || p.status === "PAUSED",
  ).sort(
    (a, b) =>
      new Date(a.scheduledAt || 0).getTime() - new Date(b.scheduledAt || 0).getTime(),
  );

  return (
    <div className="space-y-3">
      <SectionTitle icon={CalendarClock} title="Schedule Queue" subtitle={`${upcoming.length} upcoming`} />

      <div className="space-y-1.5">
        {upcoming.map((post) => (
          <div key={post.id} className="rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <PlatformIcon platform={post.platform} size={22} />
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{post.accountUsername}</span>
              <Badge variant="outline" className={cn("ml-auto px-1.5 py-0 text-[9px]", STATUS_COLORS[post.status])}>
                {post.status}
              </Badge>
            </div>
            <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-snug">{post.caption}</p>
            <div className="mt-1.5 flex items-center justify-between">
              <div className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                <Clock className="h-2.5 w-2.5" />
                <span className="font-medium">{post.scheduledAt && formatCountdown(post.scheduledAt)}</span>
                <span className="text-zinc-400">· {post.scheduledAt && formatTime(post.scheduledAt)}</span>
              </div>
              {post.status === "PAUSED" ? (
                <button
                  onClick={() => toast.success("Post resumed")}
                  className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                >
                  <Power className="h-2.5 w-2.5" /> Resume
                </button>
              ) : (
                <button
                  onClick={() => toast.info("Post paused")}
                  className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  <Power className="h-2.5 w-2.5" /> Pause
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// Section: Notifications
// =====================================================================

function NotificationsSection({
  notifications, onMarkAllRead,
}: {
  notifications: NotificationItem[]; onMarkAllRead: () => void;
}) {
  const unread = notifications.filter((n) => !n.isRead).length;

  const iconForType = (type: string) => {
    if (type === "POST_FAILED") return { Icon: AlertTriangle, color: "text-red-500 bg-red-500/10" };
    if (type === "POST_PUBLISHED") return { Icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" };
    if (type === "ACCOUNT_DISCONNECTED") return { Icon: Power, color: "text-amber-500 bg-amber-500/10" };
    if (type === "SUBSCRIPTION_RENEWED") return { Icon: Sparkles, color: "text-pink-500 bg-pink-500/10" };
    return { Icon: Bell, color: "text-zinc-500 bg-muted" };
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <SectionTitle icon={Bell} title="Notifications" subtitle={unread > 0 ? `${unread} unread` : "All caught up"} />
        {unread > 0 && (
          <button
            onClick={onMarkAllRead}
            className="rounded-md px-2 py-1 text-[10px] font-medium text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {notifications.map((n) => {
          const { Icon, color } = iconForType(n.type);
          return (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-2 rounded-lg border p-2 transition-colors",
                n.isRead
                  ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                  : "border-amber-500/30 bg-amber-500/5",
              )}
            >
              <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", color)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[11px] font-semibold">{n.title}</p>
                  {!n.isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" />}
                </div>
                <p className="mt-0.5 line-clamp-2 text-[10px] text-zinc-500 dark:text-zinc-400">{n.body}</p>
                <p className="mt-1 text-[9px] text-zinc-400">{relativeTime(n.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =====================================================================
// Section: Open Web Dashboard
// =====================================================================

function OpenWebSection() {
  return (
    <div className="space-y-3">
      <SectionTitle icon={ExternalLink} title="Open Web Dashboard" subtitle="Need more space?" />

      <div className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-gradient-to-br from-amber-500/5 via-pink-500/5 to-emerald-500/5 p-5 text-center dark:border-zinc-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-pink-500 text-white shadow-md">
          <Globe className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold">Full Web Dashboard</p>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            Access analytics, bulk scheduling, AI tools, billing, and team management from
            the full web app.
          </p>
        </div>
        <Button
          onClick={() => toast.success("Opening socialpilot.io in a new tab…")}
          className="h-9 w-full bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:from-amber-600 hover:to-pink-600"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open full dashboard
        </Button>
        <a
          href="https://socialpilot.io" target="_blank" rel="noreferrer"
          className="text-[10px] text-zinc-400 hover:text-amber-600 hover:underline dark:hover:text-amber-400"
        >
          socialpilot.io →
        </a>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          What you get on the web
        </p>
        <ul className="space-y-1.5 text-[11px] text-zinc-600 dark:text-zinc-300">
          {[
            "Bulk CSV upload (up to 500 posts)",
            "Advanced analytics & reports",
            "Team collaboration & approval flows",
            "AI caption & hashtag suggestions",
            "Billing & invoice management",
          ].map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// =====================================================================
// Section: Settings
// =====================================================================

function SettingsSection({
  darkMode, onDarkModeChange, onLogout,
}: {
  darkMode: boolean; onDarkModeChange: (v: boolean) => void; onLogout: () => void;
}) {
  const [timezone, setTimezone] = React.useState("America/New_York");
  const [workingHours, setWorkingHours] = React.useState(true);
  const [workingStart, setWorkingStart] = React.useState("09:00");
  const [workingEnd, setWorkingEnd] = React.useState("18:00");
  const [autoSync, setAutoSync] = React.useState(true);

  const timezones = [
    "America/New_York", "America/Los_Angeles", "America/Chicago",
    "Europe/London", "Europe/Berlin", "Asia/Tokyo", "Asia/Kolkata", "Australia/Sydney",
  ];

  return (
    <div className="space-y-3">
      <SectionTitle icon={Settings} title="Settings" subtitle="Extension preferences" />

      <SettingsGroup title="Appearance">
        <SettingRow icon={darkMode ? Moon : Sun} label="Dark mode" desc="Popup-only theme">
          <Switch
            checked={darkMode} onCheckedChange={onDarkModeChange}
            className="data-[state=checked]:bg-amber-500"
          />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup title="Localization">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-[11px] font-medium">Timezone</span>
          </div>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="h-7 w-[160px] text-[10px]" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz} value={tz} className="text-[11px]">{tz}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SettingsGroup>

      <SettingsGroup title="Scheduling">
        <SettingRow icon={Calendar} label="Working hours only" desc="Limit scheduling to your hours">
          <Switch
            checked={workingHours}
            onCheckedChange={(v) => {
              setWorkingHours(v);
              toast.info(v ? "Working hours enabled" : "Working hours disabled");
            }}
            className="data-[state=checked]:bg-amber-500"
          />
        </SettingRow>
        {workingHours && (
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[10px] text-zinc-500">Active window</span>
            <div className="flex items-center gap-1">
              <Input
                type="time" value={workingStart}
                onChange={(e) => setWorkingStart(e.target.value)}
                className="h-7 w-[70px] text-[10px]"
              />
              <span className="text-[10px] text-zinc-400">to</span>
              <Input
                type="time" value={workingEnd}
                onChange={(e) => setWorkingEnd(e.target.value)}
                className="h-7 w-[70px] text-[10px]"
              />
            </div>
          </div>
        )}
        <SettingRow icon={RefreshCw} label="Auto-sync accounts" desc="Every 15 minutes">
          <Switch
            checked={autoSync} onCheckedChange={setAutoSync}
            className="data-[state=checked]:bg-amber-500"
          />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup title="Account">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={CURRENT_USER.avatarUrl} alt={CURRENT_USER.name} />
            <AvatarFallback className="text-[10px]">{CURRENT_USER.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium">{CURRENT_USER.name}</p>
            <p className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">{CURRENT_USER.email}</p>
          </div>
          <Badge className="bg-gradient-to-r from-amber-500 to-pink-500 text-[9px] text-white">
            VIP Pro
          </Badge>
        </div>
      </SettingsGroup>

      <Button
        variant="outline" onClick={onLogout}
        className="h-9 w-full text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400"
      >
        <LogOut className="h-3.5 w-3.5" />
        Logout
      </Button>

      <p className="text-center text-[9px] text-zinc-400">SocialPilot Extension v2.4.0</p>
    </div>
  );
}

// ---------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-2.5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-zinc-400">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function SettingRow({
  icon: Icon, label, desc, children,
}: {
  icon: React.ElementType; label: string; desc: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-zinc-400" />
        <div>
          <p className="text-[11px] font-medium leading-tight">{label}</p>
          <p className="text-[9px] text-zinc-400">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SectionTitle({
  icon: Icon, title, subtitle,
}: {
  icon: React.ElementType; title: string; subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <h2 className="text-sm font-semibold leading-tight">{title}</h2>
        {subtitle && <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
      </div>
    </div>
  );
}
