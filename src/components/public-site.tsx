"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Users,
  Zap,
  Shield,
  BarChart3,
  Bot,
  Chrome,
  Check,
  ArrowRight,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Globe,
  Clock,
  Layers,
  Cloud,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PLANS_CATALOG } from "@/lib/permissions";
import { PLATFORM_LIST } from "@/lib/platforms";
import { PlatformIcon } from "@/components/platform-icon";
import { cn } from "@/lib/utils";

type PublicPage =
  | "home"
  | "features"
  | "pricing"
  | "docs"
  | "blog"
  | "contact"
  | "login"
  | "register"
  | "forgot"
  | "privacy"
  | "terms";

interface PublicSiteProps {
  onNavigateToDashboard: () => void;
}

const NAV_ITEMS: { id: PublicPage; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "docs", label: "Documentation" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

export function PublicSite({ onNavigateToDashboard }: PublicSiteProps) {
  const [page, setPage] = React.useState<PublicPage>("home");

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col bg-background">
      <PublicNav page={page} setPage={setPage} onLogin={() => setPage("login")} />
      <div className="flex-1">
        {page === "home" && <HomePage onGetStarted={() => setPage("register")} onPricing={() => setPage("pricing")} onLogin={onNavigateToDashboard} />}
        {page === "features" && <FeaturesPage />}
        {page === "pricing" && <PricingPage onGetStarted={() => setPage("register")} />}
        {page === "docs" && <DocsPage />}
        {page === "blog" && <BlogPage />}
        {page === "contact" && <ContactPage />}
        {page === "login" && <AuthPage mode="login" onAuth={onNavigateToDashboard} onSwitch={() => setPage("register")} onForgot={() => setPage("forgot")} />}
        {page === "register" && <AuthPage mode="register" onAuth={onNavigateToDashboard} onSwitch={() => setPage("login")} onForgot={() => setPage("forgot")} />}
        {page === "forgot" && <AuthPage mode="forgot" onAuth={() => setPage("login")} onSwitch={() => setPage("login")} onForgot={() => setPage("login")} />}
        {page === "privacy" && <LegalPage kind="privacy" />}
        {page === "terms" && <LegalPage kind="terms" />}
      </div>
      <PublicFooter setPage={setPage} />
    </div>
  );
}

// ---------------------------------------------------------------------
// Public navigation
// ---------------------------------------------------------------------

function PublicNav({
  page,
  setPage,
  onLogin,
}: {
  page: PublicPage;
  setPage: (p: PublicPage) => void;
  onLogin: () => void;
}) {
  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-14 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <button onClick={() => setPage("home")} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg tracking-tight">SocialPilot</span>
        </button>
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                page === item.id
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onLogin} className="hidden sm:inline-flex">
            Login
          </Button>
          <Button size="sm" onClick={() => setPage("register")}>
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------

function HomePage({
  onGetStarted,
  onPricing,
  onLogin,
}: {
  onGetStarted: () => void;
  onPricing: () => void;
  onLogin: () => void;
}) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-pink-500/5 to-purple-500/5" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="container relative mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 border-amber-500/20">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-powered scheduling for 5+ platforms
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
                Schedule. Publish. Analyze.
                <span className="block bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Across every social platform.
                </span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
                Plan posts across Facebook, Instagram, X, LinkedIn, and Pinterest from a single
                dashboard. Manage up to 100 accounts per platform, automate your posting schedule,
                and let AI write captions that actually convert.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={onGetStarted} className="h-12 px-8 text-base">
                  Start Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={onPricing} className="h-12 px-8 text-base">
                  View Pricing
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required · Free plan forever · 2-minute setup
              </p>
            </motion.div>
          </div>

          {/* Platform strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-3"
          >
            {PLATFORM_LIST.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-sm"
              >
                <PlatformIcon platform={p.id} size={20} />
                <span className="text-sm font-medium">{p.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-full border border-dashed bg-background/50 px-4 py-2 text-sm text-muted-foreground">
              <Layers className="h-4 w-4" /> + more coming
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "14,800+", label: "Active users" },
            { value: "2.4M+", label: "Posts published" },
            { value: "5", label: "Platforms supported" },
            { value: "99.9%", label: "Publishing uptime" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold tracking-tight">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Everything you need to scale your social presence
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            From single creators to agencies managing hundreds of accounts — one platform, every tool.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it works</h2>
            <p className="mt-4 text-muted-foreground text-lg">Three steps. Two minutes. Zero headaches.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Connect accounts", desc: "OAuth into each platform and link up to 100 accounts per platform. Group, label, and organize them however you like." },
              { step: "02", title: "Create & schedule", desc: "Draft a post once, customize per platform, and schedule with safe-posting rules: random delays, working hours, and account rotation." },
              { step: "03", title: "Publish & analyze", desc: "Posts publish automatically on time. Track reach, engagement, and follower growth across every account in one analytics view." },
            ].map((s) => (
              <Card key={s.step} className="relative p-6">
                <div className="absolute -top-4 left-6 rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 px-3 py-1 text-white text-sm font-bold">
                  {s.step}
                </div>
                <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-pink-500 to-purple-600 p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to take control of your social media?
            </h2>
            <p className="mt-4 text-white/90 text-lg max-w-2xl mx-auto">
              Join 14,800+ creators, agencies, and brands using SocialPilot to publish smarter.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="secondary" onClick={onGetStarted} className="h-12 px-8 text-base">
                Start Free Forever
              </Button>
              <Button size="lg" variant="outline" onClick={onLogin} className="h-12 px-8 text-base bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                Live Dashboard Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const FEATURES = [
  { icon: Calendar, title: "Smart Scheduler", desc: "Calendar view, list view, recurring schedules, bulk upload via CSV, and a queue that respects your working hours and timezones." },
  { icon: Users, title: "Multi-Account Management", desc: "Up to 100 accounts per platform. Group, search, filter, enable, disable, rename, and reconnect with one click." },
  { icon: Bot, title: "AI Captions & Hashtags", desc: "Generate platform-perfect captions, hashtags, and emoji suggestions. Rewrite, shorten, or expand with one prompt." },
  { icon: Shield, title: "Safe Posting Engine", desc: "Random delays, posting intervals, daily/weekly limits, account rotation, and pause/resume — keep your accounts healthy." },
  { icon: BarChart3, title: "Unified Analytics", desc: "Track reach, engagement, follower growth, and top-performing posts across every account in one dashboard." },
  { icon: Cloud, title: "Media Library", desc: "Cloud-hosted images and videos with folders, tags, search, and bulk access. Reuse assets across posts in seconds." },
  { icon: Chrome, title: "Chrome Extension", desc: "Post or schedule from any webpage. The extension syncs in real time with your dashboard — no context switching." },
  { icon: Zap, title: "Priority Queue", desc: "VIP Pro posts jump to the front of the publishing queue. Time-sensitive announcements publish the moment you need them." },
  { icon: Globe, title: "5 Platforms Today", desc: "Facebook, Instagram, X, LinkedIn, and Pinterest. Our modular architecture means more platforms ship without schema migrations." },
];

function FeatureCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow group">
      <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-amber-500/10 to-pink-500/10 flex items-center justify-center mb-4 group-hover:from-amber-500/20 group-hover:to-pink-500/20 transition-colors">
        <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </Card>
  );
}

// ---------------------------------------------------------------------
// Features page
// ---------------------------------------------------------------------

function FeaturesPage() {
  return (
    <div>
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10">Features</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">A full stack of social media tools</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for creators, agencies, and brands. Every feature is included from day one — upgrade only to scale.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-16 space-y-20">
        {FEATURE_GROUPS.map((group, i) => (
          <div key={group.title} className={cn("grid gap-12 items-center", i % 2 === 0 ? "md:grid-cols-2" : "md:grid-cols-2 md:[direction:rtl]")}>
            <div className="[direction:ltr]">
              <Badge variant="outline" className="mb-3">{group.badge}</Badge>
              <h2 className="text-3xl font-bold tracking-tight">{group.title}</h2>
              <p className="mt-3 text-muted-foreground">{group.desc}</p>
              <ul className="mt-6 space-y-3">
                {group.points.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-6 [direction:ltr]">
              <group.preview />
            </Card>
          </div>
        ))}
      </section>
    </div>
  );
}

const FEATURE_GROUPS = [
  {
    badge: "Scheduler",
    title: "Plan a week of content in minutes",
    desc: "Drag-and-drop calendar, recurring schedules, bulk CSV upload, and an intelligent queue that respects your working hours.",
    points: [
      "Calendar view with drag-to-reschedule",
      "List view with filters by status, account, platform",
      "Recurring schedules with iCal-style rules",
      "Bulk scheduling via CSV upload",
      "Queue management with priority lanes",
      "Pause, resume, retry, duplicate, and edit",
    ],
    preview: () => (
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1 text-[10px] text-muted-foreground">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-center font-medium">{d}</div>
          ))}
        </div>
        {Array.from({ length: 3 }).map((_, r) => (
          <div key={r} className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, c) => {
              const hasPost = Math.random() > 0.5;
              return (
                <div key={c} className="aspect-square rounded-md border bg-card p-1 text-[10px]">
                  <div className="text-muted-foreground">{r * 7 + c + 7}</div>
                  {hasPost && (
                    <div className="mt-0.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    ),
  },
  {
    badge: "AI",
    title: "AI that writes like you (only faster)",
    desc: "Generate captions, hashtags, and emoji suggestions. Rewrite for tone, shorten for X, or expand for LinkedIn — all in one click.",
    points: [
      "AI Caption Generator with tone presets",
      "AI Hashtag Generator optimized per platform",
      "AI Emoji Suggestions based on context",
      "AI Rewrite, Shorten, and Expand tools",
      "Brand voice memory (VIP Pro)",
      "Multi-language generation",
    ],
    preview: () => (
      <div className="space-y-3">
        <div className="rounded-lg border bg-muted/30 p-3 text-sm">
          <div className="text-xs text-muted-foreground mb-1">AI Caption · Engaging tone</div>
          Sunday scaries? Not today. ☀️ Here are 3 ways to start your week with momentum — save this for Monday morning!
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["#MondayMotivation", "#Productivity", "#SundayVibes", "#StartStrong"].map((h) => (
            <span key={h} className="rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 text-[10px] font-medium">{h}</span>
          ))}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-7 text-xs">Rewrite</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs">Shorten</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs">Expand</Button>
        </div>
      </div>
    ),
  },
  {
    badge: "Multi-Account",
    title: "One platform, every account",
    desc: "Connect up to 100 accounts per platform. Group, search, filter, enable, disable, rename, and reconnect in seconds.",
    points: [
      "Up to 100 accounts per platform",
      "Account groups with custom colors",
      "Search and filter by status, platform, group",
      "Enable, disable, rename, reconnect",
      "Last sync timestamp for every account",
      "Token health monitoring with auto-refresh",
    ],
    preview: () => (
      <div className="space-y-2">
        {[
          { p: "facebook", n: "Acme Corp", s: "Connected" },
          { p: "instagram", n: "Acme Lifestyle", s: "Connected" },
          { p: "x", n: "@acme", s: "Connected" },
          { p: "linkedin", n: "Acme Inc.", s: "Expired" },
        ].map((a) => (
          <div key={a.n} className="flex items-center gap-3 rounded-lg border p-2">
            <PlatformIcon platform={a.p} size={28} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{a.n}</div>
              <div className="text-[10px] text-muted-foreground capitalize">{a.p}</div>
            </div>
            <Badge variant={a.s === "Connected" ? "default" : "destructive"} className="text-[10px]">
              {a.s}
            </Badge>
          </div>
        ))}
      </div>
    ),
  },
  {
    badge: "Safe Posting",
    title: "Keep your accounts healthy",
    desc: "Repetitive posting patterns get accounts flagged. SocialPilot adds human-like variation to keep your accounts safe.",
    points: [
      "Random delay between min/max bounds",
      "Posting interval enforcement",
      "Working hours and timezone rules",
      "Daily and weekly posting limits",
      "Random or sequential posting order",
      "Account rotation: round-robin, least-used, or random",
      "Pause and resume entire schedule",
      "Automatic retry of failed posts",
    ],
    preview: () => (
      <div className="space-y-3 text-sm">
        <div>
          <div className="flex justify-between mb-1"><Label className="text-xs">Random delay</Label><span className="text-xs text-muted-foreground">0–60s</span></div>
          <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full w-2/3 bg-amber-500" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Daily limit</Label><div className="text-sm font-medium">50 posts</div></div>
          <div><Label className="text-xs">Weekly limit</Label><div className="text-sm font-medium">300 posts</div></div>
          <div><Label className="text-xs">Working hours</Label><div className="text-sm font-medium">09:00 – 21:00</div></div>
          <div><Label className="text-xs">Timezone</Label><div className="text-sm font-medium">UTC+06 (Dhaka)</div></div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-2">
          <Switch defaultChecked />
          <span className="text-xs">Auto-retry failed posts (max 3)</span>
        </div>
      </div>
    ),
  },
];

// ---------------------------------------------------------------------
// Pricing page
// ---------------------------------------------------------------------

function PricingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const [yearly, setYearly] = React.useState(false);

  return (
    <div>
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <Badge className="mb-4 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Plans that scale with you</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free forever. Upgrade when you need more platforms, accounts, or AI. Cancel anytime.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border bg-background p-1">
            <button
              onClick={() => setYearly(false)}
              className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors", !yearly ? "bg-foreground text-background" : "text-muted-foreground")}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors flex items-center gap-2", yearly ? "bg-foreground text-background" : "text-muted-foreground")}
            >
              Yearly
              <span className="rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-[10px]">Save ~17%</span>
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS_CATALOG.map((plan) => {
            const price = yearly ? plan.priceYearly : plan.priceMonthly;
            const period = yearly ? "/year" : "/month";
            return (
              <Card
                key={plan.tier}
                className={cn(
                  "p-6 relative flex flex-col",
                  plan.highlight && "border-amber-500 shadow-lg shadow-amber-500/10 md:scale-105"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 px-3 py-1 text-white text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground min-h-[2.5rem]">{plan.tagline}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">${price}</span>
                    <span className="text-sm text-muted-foreground">{price > 0 ? period : "forever"}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{plan.description}</p>
                </div>
                <Button
                  className="mt-6 w-full"
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={onGetStarted}
                >
                  {plan.cta}
                </Button>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 max-w-3xl mx-auto rounded-2xl border bg-muted/30 p-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
              <Star className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Need more? Enterprise plans available.</h3>
              <p className="mt-2 text-muted-foreground">
                SSO, custom branding, dedicated account manager, 1000+ accounts per platform, and custom SLAs.
                Reach out and we'll tailor a plan to your team.
              </p>
              <Button variant="outline" className="mt-4">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------
// Docs page (table of contents + sections)
// ---------------------------------------------------------------------

function DocsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        <aside className="md:sticky md:top-32 self-start">
          <div className="text-xs font-semibold uppercase text-muted-foreground mb-3">Documentation</div>
          <nav className="space-y-1 text-sm">
            {DOCS_SECTIONS.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className="block px-3 py-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
                {i + 1}. {s.title}
              </a>
            ))}
          </nav>
        </aside>
        <div className="space-y-12">
          <div>
            <Badge className="mb-3">Documentation</Badge>
            <h1 className="text-3xl font-bold tracking-tight">SocialPilot Documentation</h1>
            <p className="mt-3 text-muted-foreground">
              Everything you need to integrate, schedule, and publish at scale. Includes REST API, webhook reference,
              Chrome Extension guide, and safe-posting best practices.
            </p>
          </div>
          {DOCS_SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="space-y-3 scroll-mt-32">
              <h2 className="text-2xl font-semibold tracking-tight">{s.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
              {s.code && (
                <pre className="rounded-lg border bg-muted/50 p-4 text-xs overflow-x-auto font-mono">{s.code}</pre>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

const DOCS_SECTIONS = [
  {
    id: "quickstart",
    title: "Quickstart",
    body: "Create a free account, connect at least one social platform via OAuth, and schedule your first post in under two minutes. The dashboard will walk you through onboarding, including setting your timezone and working hours.",
  },
  {
    id: "auth",
    title: "Authentication",
    body: "SocialPilot supports email/password login, Google OAuth, and two-factor authentication via TOTP. Sessions are JWT-based with refresh tokens. The Chrome Extension uses the same credentials — registration is never allowed from the extension.",
  },
  {
    id: "api-keys",
    title: "API Keys",
    body: "Generate API keys from Settings → API Keys. Keys are scoped per user and inherit the user's plan limits. Keys can be revoked at any time. All API requests must include the header `Authorization: Bearer <key>`.",
    code: `curl -X POST https://api.socialpilot.io/v1/posts \\
  -H "Authorization: Bearer sk_live_abc123" \\
  -H "Content-Type: application/json" \\
  -d '{"caption":"Hello world","platform":"x","scheduledAt":"2026-07-04T09:00:00Z"}'`,
  },
  {
    id: "extension",
    title: "Chrome Extension",
    body: "Install the extension from the Chrome Web Store. After install, click the toolbar icon and log in with your SocialPilot credentials. The extension syncs schedules, drafts, and notifications in real time via WebSocket. Posting from any webpage is supported — just right-click and choose 'Schedule with SocialPilot'.",
  },
  {
    id: "safe-posting",
    title: "Safe Posting Best Practices",
    body: "To keep accounts healthy: set a random delay between 15–90 seconds, enforce a posting interval of at least 10 minutes, cap daily posts at 30 per account, and use account rotation. Avoid posting identical content across platforms within the same hour.",
  },
  {
    id: "webhooks",
    title: "Webhooks",
    body: "Subscribe to events like post.published, post.failed, account.disconnected, and subscription.renewed. Webhooks are signed with HMAC-SHA256 and include a timestamp to prevent replay attacks.",
    code: `{
  "event": "post.published",
  "timestamp": "2026-07-03T10:00:00Z",
  "data": { "postId": "p_abc123", "platform": "x", "permalink": "https://x.com/acme/status/123" }
}`,
  },
  {
    id: "rate-limits",
    title: "Rate Limits",
    body: "Free plan: 60 API requests per minute. Silver: 120/min. VIP Pro: 300/min. Burst allowance is 1.5x the sustained limit. Webhooks are unlimited.",
  },
];

// ---------------------------------------------------------------------
// Blog page
// ---------------------------------------------------------------------

function BlogPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
      <Badge className="mb-3">Blog</Badge>
      <h1 className="text-4xl font-bold tracking-tight">Insights from the SocialPilot team</h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">Product updates, social media strategy, and behind-the-scenes engineering posts.</p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <Card key={post.title} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-amber-500/20 to-pink-500/20 flex items-center justify-center">
              <post.icon className="h-10 w-10 text-amber-500/50" />
            </div>
            <div className="p-5">
              <Badge variant="outline" className="mb-2 text-[10px]">{post.category}</Badge>
              <h3 className="font-semibold leading-tight">{post.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-6 w-6 rounded-full bg-muted" />
                <span>{post.author}</span>
                <span>·</span>
                <span>{post.date}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const BLOG_POSTS = [
  { title: "Why we built safe-posting into the core of SocialPilot", excerpt: "Repetitive posting patterns get accounts flagged. Here's how our scheduler adds human-like variation.", category: "Engineering", author: "Alex Morgan", date: "Jul 2, 2026", icon: Shield },
  { title: "The 2026 social media automation playbook", excerpt: "A practical framework for batching, scheduling, and analyzing content across 5 platforms without burning out.", category: "Strategy", author: "Priya Patel", date: "Jun 28, 2026", icon: Calendar },
  { title: "How AI captions actually work — and where they don't", excerpt: "A deep dive into the model behind our AI Caption Generator, including the prompts we use and the guardrails we enforce.", category: "AI", author: "Marcus Chen", date: "Jun 21, 2026", icon: Bot },
  { title: "Multi-account management at scale: 100 accounts × 5 platforms", excerpt: "Lessons from building a UX that handles 500+ accounts per user without becoming overwhelming.", category: "Product", author: "Sofia Reyes", date: "Jun 14, 2026", icon: Users },
  { title: "Inside the Chrome Extension: real-time sync architecture", excerpt: "How we use WebSockets, optimistic UI, and offline queues to keep the extension and dashboard in lockstep.", category: "Engineering", author: "Tom Becker", date: "Jun 7, 2026", icon: Chrome },
  { title: "From idea to published in 90 seconds", excerpt: "A walkthrough of the fastest path from idea to scheduled post using the Chrome extension and AI captions.", category: "Tutorial", author: "Lena Müller", date: "May 30, 2026", icon: Zap },
];

// ---------------------------------------------------------------------
// Contact page
// ---------------------------------------------------------------------

function ContactPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 max-w-4xl">
      <Badge className="mb-3">Contact</Badge>
      <h1 className="text-4xl font-bold tracking-tight">Get in touch</h1>
      <p className="mt-3 text-muted-foreground">Questions, partnerships, or feedback — we usually reply within 24 hours.</p>

      <div className="mt-10 grid md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-4">
          <div>
            <Label className="text-xs">Name</Label>
            <Input className="mt-1" placeholder="Jane Doe" />
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input className="mt-1" placeholder="jane@example.com" type="email" />
          </div>
          <div>
            <Label className="text-xs">Subject</Label>
            <Input className="mt-1" placeholder="How can we help?" />
          </div>
          <div>
            <Label className="text-xs">Message</Label>
            <textarea className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px]" placeholder="Tell us more..." />
          </div>
          <Button className="w-full">Send Message</Button>
        </Card>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Support</h3>
            <p className="text-sm text-muted-foreground">Free plan: community forum. Silver: email support. VIP Pro: priority email + chat.</p>
            <p className="mt-2 text-sm font-medium">support@socialpilot.io</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Sales</h3>
            <p className="text-sm text-muted-foreground">For enterprise, custom volumes, or partnerships.</p>
            <p className="mt-2 text-sm font-medium">sales@socialpilot.io</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Office</h3>
            <p className="text-sm text-muted-foreground">123 Market Street, Suite 400<br />San Francisco, CA 94103</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Auth pages (login, register, forgot)
// ---------------------------------------------------------------------

function AuthPage({
  mode,
  onAuth,
  onSwitch,
  onForgot,
}: {
  mode: "login" | "register" | "forgot";
  onAuth: () => void;
  onSwitch: () => void;
  onForgot: () => void;
}) {
  const titles = {
    login: "Welcome back",
    register: "Create your account",
    forgot: "Reset your password",
  };
  const subtitles = {
    login: "Log in to your SocialPilot dashboard.",
    register: "Start scheduling across 5+ platforms in minutes.",
    forgot: "Enter your email and we'll send a reset link.",
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-pink-500 text-white mb-4">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{titles[mode]}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitles[mode]}</p>
      </div>

      <Card className="p-6">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onAuth();
          }}
        >
          {mode === "register" && (
            <div>
              <Label htmlFor="name" className="text-xs">Full name</Label>
              <Input id="name" className="mt-1" placeholder="Jane Doe" required />
            </div>
          )}
          <div>
            <Label htmlFor="email" className="text-xs">Email</Label>
            <Input id="email" type="email" className="mt-1" placeholder="you@example.com" required />
          </div>
          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs">Password</Label>
                {mode === "login" && (
                  <button type="button" onClick={onForgot} className="text-xs text-amber-600 dark:text-amber-400 hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <Input id="password" type="password" className="mt-1" placeholder="••••••••" required />
            </div>
          )}

          {mode === "register" && (
            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="mt-1" required />
              <label htmlFor="terms" className="text-xs text-muted-foreground">
                I agree to the <button type="button" className="underline">Terms</button> and <button type="button" className="underline">Privacy Policy</button>.
              </label>
            </div>
          )}

          <Button type="submit" className="w-full">
            {mode === "login" ? "Log In" : mode === "register" ? "Create Account" : "Send Reset Link"}
          </Button>

          {mode === "login" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
                <div className="relative flex justify-center"><span className="bg-background px-2 text-xs text-muted-foreground">or</span></div>
              </div>
              <Button type="button" variant="outline" className="w-full">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Continue with Google
              </Button>
            </>
          )}
        </form>

        {mode !== "forgot" && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={onSwitch} className="font-medium text-amber-600 dark:text-amber-400 hover:underline">
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </div>
        )}
      </Card>

      {mode === "login" && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Tip: The Chrome Extension uses the same login. Registration is only available on the website.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Legal pages
// ---------------------------------------------------------------------

function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const content = kind === "privacy" ? PRIVACY_CONTENT : TERMS_CONTENT;
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 1, 2026</p>
      <div className="mt-8 space-y-8">
        {content.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-semibold mb-2">{s.heading}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

const PRIVACY_CONTENT = {
  title: "Privacy Policy",
  sections: [
    { heading: "1. Information We Collect", body: "We collect account information (name, email, password hash), social account tokens (encrypted at rest), billing information (processed by Stripe — we never store full card numbers), and usage analytics (post volume, schedule frequency, engagement metrics). All data is stored in encrypted PostgreSQL databases with row-level security." },
    { heading: "2. How We Use Your Information", body: "We use your information to provide the scheduling service, authenticate you, process payments, send service notifications, prevent abuse, and improve our AI features. We do not sell your data to third parties. Aggregated, anonymized analytics may be used for product improvement." },
    { heading: "3. Data Retention", body: "We retain your data for as long as your account is active. After account deletion, we purge personal data within 30 days, except where retention is required by law (e.g., financial records for 7 years). Published posts remain on the platforms where they were published." },
    { heading: "4. Your Rights", body: "You may export your data at any time from Settings → Privacy. You may delete your account at any time, which triggers a 30-day grace period before permanent deletion. You may object to processing, request correction, or restrict processing under GDPR." },
    { heading: "5. Security", body: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Access tokens are encrypted with a separate key. Two-factor authentication is available for all users and required for VIP Pro. We undergo annual SOC 2 Type II audits." },
    { heading: "6. Contact", body: "For privacy questions or requests, contact privacy@socialpilot.io. Our Data Protection Officer can be reached at dpo@socialpilot.io." },
  ],
};

const TERMS_CONTENT = {
  title: "Terms of Service",
  sections: [
    { heading: "1. Acceptance of Terms", body: "By creating an account or using any SocialPilot service, you agree to these Terms. If you do not agree, do not use the service. We may update these Terms with 30 days' notice." },
    { heading: "2. Account Responsibilities", body: "You are responsible for all activity under your account. You must provide accurate information at registration. You may not share accounts across users. Each user must have their own account." },
    { heading: "3. Acceptable Use", body: "You agree not to use SocialPilot to post content that violates platform policies, to spam, to post illegal content, or to abuse rate limits. We may suspend accounts that violate these rules. We do not monitor your posts but will respond to platform reports." },
    { heading: "4. Subscriptions and Billing", body: "Paid plans renew automatically until canceled. You can cancel at any time from Settings → Billing. Refunds are issued at our discretion within 14 days of renewal. Downgrades take effect at the next billing cycle." },
    { heading: "5. Service Availability", body: "We target 99.9% uptime for the publishing API. Scheduled maintenance is announced at least 48 hours in advance. We are not liable for outages caused by upstream platform APIs (Facebook, Instagram, etc.)." },
    { heading: "6. Limitation of Liability", body: "SocialPilot is provided 'as is'. We are not liable for indirect, incidental, or consequential damages, including loss of revenue from failed posts. Total liability is limited to the amount paid in the prior 12 months." },
  ],
};

// ---------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------

function PublicFooter({ setPage }: { setPage: (p: PublicPage) => void }) {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold">SocialPilot</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              The all-in-one platform for scheduling, publishing, and analyzing social media across every platform that matters.
            </p>
            <div className="mt-4 flex gap-2">
              {[Twitter, Instagram, Facebook, Linkedin].map((Icon, i) => (
                <div key={i} className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => setPage("features")} className="hover:text-foreground">Features</button></li>
              <li><button onClick={() => setPage("pricing")} className="hover:text-foreground">Pricing</button></li>
              <li><button onClick={() => setPage("docs")} className="hover:text-foreground">Documentation</button></li>
              <li><button className="hover:text-foreground">Chrome Extension</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => setPage("blog")} className="hover:text-foreground">Blog</button></li>
              <li><button onClick={() => setPage("contact")} className="hover:text-foreground">Contact</button></li>
              <li><button className="hover:text-foreground">Careers</button></li>
              <li><button className="hover:text-foreground">About</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => setPage("privacy")} className="hover:text-foreground">Privacy Policy</button></li>
              <li><button onClick={() => setPage("terms")} className="hover:text-foreground">Terms of Service</button></li>
              <li><button className="hover:text-foreground">Cookie Policy</button></li>
              <li><button className="hover:text-foreground">GDPR</button></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© 2026 SocialPilot, Inc. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Made in San Francisco</span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500" /> All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
