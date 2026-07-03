"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Calendar,
  ListChecks,
  Image,
  Bot,
  CreditCard,
  Settings,
  Bell,
  Shield,
  User,
  KeyRound,
  LogOut,
  Sparkles,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Edit3,
  Copy,
  RefreshCw,
  Power,
  Pause,
  Play,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Upload,
  Folder,
  Hash,
  Smile,
  FileText,
  Wand2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PlatformIcon } from "@/components/platform-icon";
import { PLATFORM_LIST, getPlatformColor } from "@/lib/platforms";
import {
  CURRENT_USER,
  MOCK_ACCOUNTS,
  MOCK_POSTS,
  MOCK_MEDIA,
  MOCK_NOTIFICATIONS,
  MOCK_ANALYTICS,
  MOCK_INVOICES,
  type MockPost,
  type MockSocialAccount,
} from "@/lib/mock-data";

type DashSection =
  | "overview"
  | "analytics"
  | "accounts"
  | "schedules"
  | "queue"
  | "media"
  | "ai"
  | "billing"
  | "subscription"
  | "invoices"
  | "apikeys"
  | "notifications"
  | "security"
  | "profile"
  | "settings";

const NAV: { group: string; items: { id: DashSection; label: string; icon: React.ElementType }[] }[] = [
  {
    group: "Main",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "accounts", label: "Connected Accounts", icon: Users },
      { id: "schedules", label: "Schedules", icon: Calendar },
      { id: "queue", label: "Queue", icon: ListChecks },
      { id: "media", label: "Media", icon: Image },
    ],
  },
  {
    group: "AI",
    items: [{ id: "ai", label: "AI Tools", icon: Bot }],
  },
  {
    group: "Billing",
    items: [
      { id: "billing", label: "Billing", icon: CreditCard },
      { id: "subscription", label: "Subscription", icon: Sparkles },
      { id: "invoices", label: "Invoices", icon: FileText },
    ],
  },
  {
    group: "Account",
    items: [
      { id: "apikeys", label: "API Keys", icon: KeyRound },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "security", label: "Security", icon: Shield },
      { id: "profile", label: "Profile", icon: User },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

export function UserDashboard() {
  const [section, setSection] = React.useState<DashSection>("overview");
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-background">
        <UserSidebar section={section} setSection={setSection} />
      </aside>

      {/* Mobile nav */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setMobileNavOpen(false)}>
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r" onClick={(e) => e.stopPropagation()}>
            <UserSidebar section={section} setSection={(s) => { setSection(s); setMobileNavOpen(false); }} />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        <DashHeader section={section} onOpenNav={() => setMobileNavOpen(true)} />
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                {section === "overview" && <OverviewSection />}
                {section === "analytics" && <AnalyticsSection />}
                {section === "accounts" && <AccountsSection />}
                {section === "schedules" && <SchedulesSection />}
                {section === "queue" && <QueueSection />}
                {section === "media" && <MediaSection />}
                {section === "ai" && <AISection />}
                {section === "billing" && <BillingSection />}
                {section === "subscription" && <SubscriptionSection />}
                {section === "invoices" && <InvoicesSection />}
                {section === "apikeys" && <ApiKeysSection />}
                {section === "notifications" && <NotificationsSection />}
                {section === "security" && <SecuritySection />}
                {section === "profile" && <ProfileSection />}
                {section === "settings" && <SettingsSection />}
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

function UserSidebar({
  section,
  setSection,
}: {
  section: DashSection;
  setSection: (s: DashSection) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={CURRENT_USER.avatarUrl} alt={CURRENT_USER.name} />
            <AvatarFallback>{CURRENT_USER.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{CURRENT_USER.name}</div>
            <div className="text-xs text-muted-foreground truncate">{CURRENT_USER.email}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-amber-500 to-pink-500 text-white text-[10px]">VIP Pro</Badge>
          <span className="text-xs text-muted-foreground">7 accounts</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-3 space-y-5">
          {NAV.map((group) => (
            <div key={group.group}>
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = section === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSection(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-3 border-t">
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  );
}

function DashHeader({ section, onOpenNav }: { section: DashSection; onOpenNav: () => void }) {
  const titles: Record<DashSection, string> = {
    overview: "Overview",
    analytics: "Analytics",
    accounts: "Connected Accounts",
    schedules: "Schedules",
    queue: "Queue",
    media: "Media Library",
    ai: "AI Tools",
    billing: "Billing",
    subscription: "Subscription",
    invoices: "Invoices",
    apikeys: "API Keys",
    notifications: "Notifications",
    security: "Security",
    profile: "Profile",
    settings: "Settings",
  };
  return (
    <header className="sticky top-14 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={onOpenNav}>
            <LayoutDashboard className="h-4 w-4" />
          </Button>
          <h1 className="font-semibold text-lg">{titles[section]}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="hidden sm:inline-flex">
            <Plus className="h-4 w-4 mr-1" /> New Post
          </Button>
          <Button variant="ghost" size="icon" className="relative h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-pink-500" />
          </Button>
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------

function OverviewSection() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Card className="p-6 bg-gradient-to-br from-amber-500/10 via-pink-500/5 to-purple-500/10 border-amber-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Good morning, Alex 👋</h2>
            <p className="mt-1 text-muted-foreground">You have 4 posts scheduled for today and 1 failed post to review.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><RefreshCw className="h-3.5 w-3.5 mr-1" /> Sync now</Button>
            <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1" /> New Post</Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Reach" value="184.2K" delta="+12.4%" icon={Eye} trend="up" />
        <StatCard label="Engagement" value="42.1K" delta="+8.1%" icon={Heart} trend="up" />
        <StatCard label="Posts (30d)" value="287" delta="+15" icon={TrendingUp} trend="up" />
        <StatCard label="Followers" value="113K" delta="+8.4%" icon={Users} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's schedule */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Today's Schedule</h3>
            <Button variant="ghost" size="sm" className="text-xs">View all <ChevronRight className="h-3 w-3" /></Button>
          </div>
          <div className="space-y-3">
            {MOCK_POSTS.filter((p) => p.status === "SCHEDULED" || p.status === "QUEUED").slice(0, 4).map((post) => (
              <PostRow key={post.id} post={post} compact />
            ))}
          </div>
        </Card>

        {/* Quick actions */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Plus, label: "New Post" },
              { icon: Calendar, label: "Schedule" },
              { icon: Image, label: "Upload Media" },
              { icon: Bot, label: "AI Caption" },
              { icon: RefreshCw, label: "Sync Accounts" },
              { icon: Users, label: "Add Account" },
            ].map((a) => (
              <button
                key={a.label}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-card p-4 hover:bg-muted/50 transition-colors"
              >
                <a.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-medium">{a.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent notifications + failed posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Notifications</h3>
          <div className="space-y-2">
            {MOCK_NOTIFICATIONS.slice(0, 4).map((n) => (
              <div key={n.id} className={cn("flex items-start gap-3 rounded-lg p-3", !n.isRead && "bg-amber-500/5")}>
                <div className={cn("mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                  n.type === "POST_FAILED" ? "bg-red-500/10" : n.type === "POST_PUBLISHED" ? "bg-emerald-500/10" : "bg-muted")}>
                  {n.type === "POST_FAILED" ? <AlertTriangle className="h-4 w-4 text-red-500" /> :
                   n.type === "POST_PUBLISHED" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                   <Bell className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{n.body}</div>
                </div>
                {!n.isRead && <div className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-2" />}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Needs Attention</h3>
          <div className="space-y-3">
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="font-medium text-sm">1 failed post</span>
              </div>
              <p className="text-xs text-muted-foreground">LinkedIn post "We're hiring..." — token expired</p>
              <Button size="sm" variant="outline" className="mt-3 h-7 text-xs">Retry now</Button>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Power className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-sm">1 account disconnected</span>
              </div>
              <p className="text-xs text-muted-foreground">Pinterest (@acmepins) needs reconnection</p>
              <Button size="sm" variant="outline" className="mt-3 h-7 text-xs">Reconnect</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, icon: Icon, trend }: { label: string; value: string; delta: string; icon: React.ElementType; trend: "up" | "down" }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
      <div className={cn("mt-1 text-xs flex items-center gap-1", trend === "up" ? "text-emerald-600" : "text-red-600")}>
        <TrendingUp className="h-3 w-3" /> {delta} vs last period
      </div>
    </Card>
  );
}

function PostRow({ post, compact = false }: { post: MockPost; compact?: boolean }) {
  const statusColors: Record<string, string> = {
    PUBLISHED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    SCHEDULED: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    QUEUED: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    FAILED: "bg-red-500/10 text-red-700 dark:text-red-400",
    DRAFT: "bg-muted text-muted-foreground",
    PAUSED: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  };
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-3 hover:shadow-sm transition-shadow">
      <PlatformIcon platform={post.platform} size={32} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{post.accountUsername}</span>
          <Badge variant="outline" className={cn("text-[10px]", statusColors[post.status])}>{post.status}</Badge>
        </div>
        <p className={cn("mt-1 text-sm", compact ? "line-clamp-1" : "line-clamp-2")}>{post.caption}</p>
        <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
          {post.scheduledAt && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(post.scheduledAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </span>
          )}
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Published
            </span>
          )}
          {post.failureReason && (
            <span className="flex items-center gap-1 text-red-500">
              <AlertTriangle className="h-3 w-3" /> {post.failureReason}
            </span>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem><Edit3 className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
          <DropdownMenuItem><Copy className="h-3.5 w-3.5 mr-2" /> Duplicate</DropdownMenuItem>
          <DropdownMenuItem><RefreshCw className="h-3.5 w-3.5 mr-2" /> Retry</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600"><Trash2 className="h-3.5 w-3.5 mr-2" /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ---------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------

function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground">Last 7 days · all accounts</p>
        </div>
        <Select defaultValue="7d">
          <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">24 hours</SelectItem>
            <SelectItem value="7d">7 days</SelectItem>
            <SelectItem value="30d">30 days</SelectItem>
            <SelectItem value="90d">90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Reach" value={String(MOCK_ANALYTICS.totalReach)} delta={`+${MOCK_ANALYTICS.followerGrowth}%`} icon={Eye} trend="up" />
        <StatCard label="Engagement" value={String(MOCK_ANALYTICS.totalEngagement)} delta={`+${MOCK_ANALYTICS.engagementRate}%`} icon={Heart} trend="up" />
        <StatCard label="Posts" value={String(MOCK_ANALYTICS.totalPosts)} delta="+12" icon={TrendingUp} trend="up" />
        <StatCard label="Engagement Rate" value={`${MOCK_ANALYTICS.engagementRate}%`} delta="+0.4%" icon={BarChart3} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-semibold mb-4">Reach & Engagement Trend</h3>
          <div className="h-64 flex items-end gap-2">
            {MOCK_ANALYTICS.engagementTrend.map((d) => {
              const maxReach = Math.max(...MOCK_ANALYTICS.engagementTrend.map((x) => x.reach));
              const maxEng = Math.max(...MOCK_ANALYTICS.engagementTrend.map((x) => x.engagement));
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    <div className="w-3 bg-amber-500 rounded-t" style={{ height: `${(d.reach / maxReach) * 100}%` }} title={`Reach: ${d.reach}`} />
                    <div className="w-3 bg-pink-500 rounded-t" style={{ height: `${(d.engagement / maxEng) * 100}%` }} title={`Engagement: ${d.engagement}`} />
                  </div>
                  <div className="text-[10px] text-muted-foreground">{d.date.split(" ")[1]}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-amber-500" /> Reach</div>
            <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-pink-500" /> Engagement</div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Posts by Status</h3>
          <div className="space-y-3">
            {MOCK_ANALYTICS.postsByStatus.map((s) => {
              const total = MOCK_ANALYTICS.postsByStatus.reduce((a, b) => a + b.value, 0);
              const pct = (s.value / total) * 100;
              return (
                <div key={s.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{s.name}</span>
                    <span className="text-muted-foreground">{s.value} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Top Performing Posts</h3>
        <div className="space-y-3">
          {MOCK_ANALYTICS.topPosts.map((post, i) => (
            <div key={post.id} className="flex items-center gap-4 rounded-lg border p-3">
              <div className="text-2xl font-bold text-muted-foreground w-6">#{i + 1}</div>
              <PlatformIcon platform={post.platform} size={32} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{post.caption}</p>
                <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.reach.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post.engagement}%</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> 142</span>
                  <span className="flex items-center gap-1"><Share2 className="h-3 w-3" /> 38</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-xs"><ExternalLink className="h-3 w-3 mr-1" /> View</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------
// Connected Accounts
// ---------------------------------------------------------------------

function AccountsSection() {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<string>("all");
  const filtered = MOCK_ACCOUNTS.filter((a) => {
    if (filter !== "all" && a.platform !== filter) return false;
    if (search && !a.displayName.toLowerCase().includes(search.toLowerCase()) && !a.username.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Connected Accounts</h2>
          <p className="text-sm text-muted-foreground">{MOCK_ACCOUNTS.length} accounts across 5 platforms · VIP Pro allows up to 100 per platform</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-1" /> Add Account</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All platforms</SelectItem>
            {PLATFORM_LIST.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-9"><Filter className="h-3.5 w-3.5 mr-1" /> More filters</Button>
      </div>

      {/* Platform summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {PLATFORM_LIST.map((p) => {
          const count = MOCK_ACCOUNTS.filter((a) => a.platform === p.id).length;
          return (
            <Card key={p.id} className="p-3 cursor-pointer hover:shadow-sm transition-shadow" >
              <div className="flex items-center gap-2">
                <PlatformIcon platform={p.id} size={28} />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground truncate">{p.name}</div>
                  <div className="font-semibold text-sm">{count} accounts</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Accounts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}

function AccountCard({ account }: { account: MockSocialAccount }) {
  return (
    <Card className="p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 rounded-lg">
          <AvatarImage src={account.avatarUrl} alt={account.displayName} />
          <AvatarFallback><PlatformIcon platform={account.platform} size={48} /></AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">{account.displayName}</h3>
            {!account.isConnected && (
              <Badge variant="destructive" className="text-[10px]">Disconnected</Badge>
            )}
            {account.isEnabled && account.isConnected ? (
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Active</Badge>
            ) : account.isEnabled && !account.isConnected ? (
              <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400">Needs reconnect</Badge>
            ) : (
              <Badge variant="outline" className="text-[10px]">Disabled</Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate">{account.username}</div>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{account.followerCount.toLocaleString()} followers</span>
            <span>·</span>
            <span className="capitalize">{account.platform}</span>
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground">
            Last sync: {new Date(account.lastSyncAt).toLocaleString()}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Edit3 className="h-3.5 w-3.5 mr-2" /> Rename</DropdownMenuItem>
            <DropdownMenuItem><RefreshCw className="h-3.5 w-3.5 mr-2" /> Reconnect</DropdownMenuItem>
            <DropdownMenuItem>
              <Power className="h-3.5 w-3.5 mr-2" /> {account.isEnabled ? "Disable" : "Enable"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600"><Trash2 className="h-3.5 w-3.5 mr-2" /> Remove</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------
// Schedules (Calendar + List)
// ---------------------------------------------------------------------

function SchedulesSection() {
  const [view, setView] = React.useState<"calendar" | "list">("calendar");
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Schedules</h2>
          <p className="text-sm text-muted-foreground">Manage all your scheduled, queued, and published posts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5 mr-1" /> Bulk CSV</Button>
          <Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Post</Button>
        </div>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "list")}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="calendar"><CalendarDays className="h-3.5 w-3.5 mr-1" /> Calendar</TabsTrigger>
            <TabsTrigger value="list"><ListChecks className="h-3.5 w-3.5 mr-1" /> List</TabsTrigger>
          </TabsList>
          {view === "calendar" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[140px] text-center">
                {currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
              </span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date())}>Today</Button>
            </div>
          )}
        </div>

        <TabsContent value="calendar" className="mt-4">
          <CalendarView posts={MOCK_POSTS} month={currentMonth} />
        </TabsContent>
        <TabsContent value="list" className="mt-4">
          <ListView posts={MOCK_POSTS} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CalendarView({ posts, month }: { posts: MockPost[]; month: Date }) {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1);
  const lastDay = new Date(year, m + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const today = new Date();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const postsByDay = new Map<number, MockPost[]>();
  posts.forEach((p) => {
    if (!p.scheduledAt) return;
    const d = new Date(p.scheduledAt);
    if (d.getFullYear() === year && d.getMonth() === m) {
      const arr = postsByDay.get(d.getDate()) ?? [];
      arr.push(p);
      postsByDay.set(d.getDate(), arr);
    }
  });

  return (
    <Card className="p-4">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} className="aspect-square rounded-md bg-muted/20" />;
          const dayPosts = postsByDay.get(day) ?? [];
          const isToday = today.getFullYear() === year && today.getMonth() === m && today.getDate() === day;
          return (
            <div
              key={i}
              className={cn(
                "aspect-square rounded-md border p-1.5 text-xs cursor-pointer hover:border-amber-500 transition-colors overflow-hidden",
                isToday && "bg-amber-500/10 border-amber-500"
              )}
            >
              <div className={cn("font-medium", isToday && "text-amber-700 dark:text-amber-400")}>{day}</div>
              <div className="mt-1 space-y-0.5">
                {dayPosts.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-1 rounded px-1 py-0.5 text-[10px] truncate"
                    style={{ backgroundColor: `${getPlatformColor(p.platform)}15` }}
                  >
                    <PlatformIcon platform={p.platform} size={10} />
                    <span className="truncate">{new Date(p.scheduledAt!).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
                  </div>
                ))}
                {dayPosts.length > 3 && (
                  <div className="text-[10px] text-muted-foreground">+{dayPosts.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ListView({ posts }: { posts: MockPost[] }) {
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const filtered = posts.filter((p) => statusFilter === "all" || p.status === statusFilter);
  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {["all", "SCHEDULED", "QUEUED", "PUBLISHED", "FAILED", "DRAFT", "PAUSED"].map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs capitalize"
            onClick={() => setStatusFilter(s)}
          >
            {s === "all" ? "All" : s.toLowerCase()}
            <span className="ml-1 opacity-60">
              {s === "all" ? posts.length : posts.filter((p) => p.status === s).length}
            </span>
          </Button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Queue
// ---------------------------------------------------------------------

function QueueSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Queue</h2>
          <p className="text-sm text-muted-foreground">Posts waiting to publish · ordered by scheduled time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Pause className="h-3.5 w-3.5 mr-1" /> Pause all</Button>
          <Button variant="outline" size="sm"><Play className="h-3.5 w-3.5 mr-1" /> Resume</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4 lg:col-span-2">
          <h3 className="font-semibold mb-3">Up Next</h3>
          <div className="space-y-2">
            {MOCK_POSTS
              .filter((p) => p.status === "SCHEDULED" || p.status === "QUEUED" || p.status === "PAUSED")
              .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())
              .map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="text-xs font-mono text-muted-foreground w-4">{i + 1}</div>
                  <div className="flex-1"><PostRow post={p} compact /></div>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Queue Stats</h3>
          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">In queue</div>
              <div className="text-2xl font-bold">{MOCK_POSTS.filter((p) => p.status === "SCHEDULED" || p.status === "QUEUED").length}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Paused</div>
              <div className="text-2xl font-bold">{MOCK_POSTS.filter((p) => p.status === "PAUSED").length}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Failed (24h)</div>
              <div className="text-2xl font-bold text-red-600">{MOCK_POSTS.filter((p) => p.status === "FAILED").length}</div>
            </div>
            <Separator />
            <div>
              <div className="text-xs font-medium mb-2">Daily limit</div>
              <Progress value={32} className="h-2" />
              <div className="mt-1 text-[10px] text-muted-foreground">16 / 50 posts today</div>
            </div>
            <div>
              <div className="text-xs font-medium mb-2">Weekly limit</div>
              <Progress value={48} className="h-2" />
              <div className="mt-1 text-[10px] text-muted-foreground">144 / 300 posts this week</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Media Library
// ---------------------------------------------------------------------

function MediaSection() {
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [search, setSearch] = React.useState("");
  const filtered = MOCK_MEDIA.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
          <p className="text-sm text-muted-foreground">Cloud-hosted images and videos · 2.8 GB of 20 GB used</p>
        </div>
        <Button><Upload className="h-4 w-4 mr-1" /> Upload</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search media..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9" />
        </div>
        <Button variant="outline" size="sm"><Folder className="h-3.5 w-3.5 mr-1" /> New folder</Button>
        <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5 mr-1" /> Tags</Button>
        <div className="ml-auto">
          <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "list")}>
            <TabsList className="h-9">
              <TabsTrigger value="grid" className="px-2">Grid</TabsTrigger>
              <TabsTrigger value="list" className="px-2">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Folders */}
      <div className="flex flex-wrap gap-2">
        {["All", "Campaigns", "Products", "Brand", "Videos", "Content"].map((f, i) => (
          <Button key={f} variant={i === 0 ? "default" : "outline"} size="sm" className="h-7 text-xs">
            <Folder className="h-3 w-3 mr-1" /> {f}
          </Button>
        ))}
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((m) => (
            <Card key={m.id} className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
              <div className="aspect-square bg-muted overflow-hidden relative">
                <img src={m.thumbnailUrl} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                {m.type === "VIDEO" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="h-5 w-5 text-black ml-0.5" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-2">
                <div className="text-xs font-medium truncate">{m.name}</div>
                <div className="text-[10px] text-muted-foreground">{(m.size / 1024).toFixed(0)} KB</div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Size</th>
                <th className="text-left p-3 font-medium">Tags</th>
                <th className="text-left p-3 font-medium">Created</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-t hover:bg-muted/30">
                  <td className="p-3 flex items-center gap-2">
                    <img src={m.thumbnailUrl} alt="" className="h-8 w-8 rounded object-cover" />
                    <span className="font-medium">{m.name}</span>
                  </td>
                  <td className="p-3"><Badge variant="outline" className="text-[10px]">{m.type}</Badge></td>
                  <td className="p-3 text-muted-foreground">{(m.size / 1024).toFixed(0)} KB</td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {m.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="p-3"><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// AI Tools
// ---------------------------------------------------------------------

function AISection() {
  const [caption, setCaption] = React.useState("");
  const [generated, setGenerated] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [hashtags, setHashtags] = React.useState<string[]>([]);
  const [tone, setTone] = React.useState("engaging");

  const generate = async () => {
    setLoading(true);
    setGenerated("");
    setTimeout(() => {
      const samples: Record<string, string> = {
        engaging: "🚀 Big news! We just shipped something we've been working on for months. Swipe to see what's new → Trust us, you don't want to miss this one.",
        professional: "We are pleased to announce a major update to our platform. After months of development and customer feedback, we're rolling out new capabilities designed to help teams publish smarter.",
        funny: "Plot twist: scheduling posts doesn't have to feel like herding cats 🐱 We fixed that. You're welcome.",
        inspirational: "Every great brand started with a single post. Today, yours takes another step forward. Keep showing up — your audience is listening.",
      };
      setGenerated(samples[tone] || samples.engaging);
      setHashtags(["#SocialMedia", "#ContentCreation", "#GrowthHacking", "#MarketingTips", "#Productivity", "#DigitalMarketing"]);
      setLoading(false);
      toast.success("AI generated caption and hashtags");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Tools</h2>
          <p className="text-sm text-muted-foreground">Generate captions, hashtags, and emoji suggestions with AI</p>
        </div>
        <Badge className="bg-gradient-to-r from-amber-500 to-pink-500 text-white">VIP Pro</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center">
              <Wand2 className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold">Caption Generator</h3>
          </div>

          <div>
            <Label className="text-xs">Topic or brief</Label>
            <Textarea
              className="mt-1 min-h-[80px]"
              placeholder="e.g., announce our summer sale with up to 40% off"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-xs">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="engaging">Engaging</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="funny">Funny</SelectItem>
                <SelectItem value="inspirational">Inspirational</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={generate} disabled={loading || !caption} className="w-full">
            {loading ? <><RefreshCw className="h-4 w-4 mr-1 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4 mr-1" /> Generate</>}
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Output</h3>
          {generated ? (
            <>
              <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed">
                {generated}
              </div>
              <div>
                <div className="text-xs font-medium mb-2 flex items-center gap-1">
                  <Hash className="h-3 w-3" /> Hashtags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {hashtags.map((h) => (
                    <span key={h} className="rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-1 text-xs font-medium">{h}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium mb-2 flex items-center gap-1">
                  <Smile className="h-3 w-3" /> Emoji suggestions
                </div>
                <div className="text-2xl">🚀 ✨ 🔥 💫 🎯 ⚡</div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1"><RefreshCw className="h-3 w-3 mr-1" /> Rewrite</Button>
                <Button size="sm" variant="outline" className="flex-1"><Wand2 className="h-3 w-3 mr-1" /> Shorten</Button>
                <Button size="sm" variant="outline" className="flex-1"><Wand2 className="h-3 w-3 mr-1" /> Expand</Button>
              </div>
              <Button className="w-full" onClick={() => toast.success("Caption sent to composer")}>
                Use this caption
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bot className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">Generated captions will appear here</p>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Hash, title: "AI Hashtag Generator", desc: "Platform-specific hashtags optimized for reach" },
          { icon: Smile, title: "AI Emoji Suggestion", desc: "Context-aware emoji to boost engagement" },
          { icon: Wand2, title: "AI Rewrite / Shorten / Expand", desc: "Tweak any caption for tone or length" },
        ].map((t) => (
          <Card key={t.title} className="p-4">
            <t.icon className="h-5 w-5 text-amber-600 dark:text-amber-400 mb-2" />
            <h4 className="font-medium text-sm">{t.title}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Billing / Subscription / Invoices
// ---------------------------------------------------------------------

function BillingSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
        <p className="text-sm text-muted-foreground">Manage your payment methods and billing details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">Payment Method</h3>
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="h-10 w-14 rounded bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-bold">VISA</div>
            <div className="flex-1">
              <div className="font-medium text-sm">Visa ending in 4242</div>
              <div className="text-xs text-muted-foreground">Expires 12/2027</div>
            </div>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Default</Badge>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
          <Button variant="outline" size="sm" className="mt-3"><Plus className="h-3.5 w-3.5 mr-1" /> Add payment method</Button>

          <Separator className="my-6" />

          <h3 className="font-semibold mb-4">Billing Address</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><Label className="text-xs">Name</Label><Input className="mt-1 h-9" defaultValue="Alex Morgan" /></div>
            <div><Label className="text-xs">Email</Label><Input className="mt-1 h-9" defaultValue="alex@socialpilot.io" /></div>
            <div className="col-span-2"><Label className="text-xs">Address</Label><Input className="mt-1 h-9" defaultValue="123 Market St" /></div>
            <div><Label className="text-xs">City</Label><Input className="mt-1 h-9" defaultValue="San Francisco" /></div>
            <div><Label className="text-xs">ZIP</Label><Input className="mt-1 h-9" defaultValue="94103" /></div>
          </div>
          <Button className="mt-4">Save changes</Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Current Cycle</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="font-medium">VIP Pro</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Billing</span><span className="font-medium">Monthly</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium">$10.00</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Next charge</span><span className="font-medium">Aug 1, 2026</span></div>
            <Separator />
            <div className="rounded-lg bg-amber-500/10 p-3 text-xs">
              <div className="font-medium text-amber-700 dark:text-amber-400">Coupon applied</div>
              <div className="text-muted-foreground mt-1">SUMMER20 — 20% off for 3 months</div>
            </div>
            <Button variant="outline" size="sm" className="w-full"><Sparkles className="h-3.5 w-3.5 mr-1" /> Redeem coupon</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SubscriptionSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Subscription</h2>
        <p className="text-sm text-muted-foreground">You're on the VIP Pro plan · $10/month</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-amber-500/10 via-pink-500/5 to-purple-500/10 border-amber-500/30">
        <div className="flex items-start justify-between">
          <div>
            <Badge className="bg-gradient-to-r from-amber-500 to-pink-500 text-white">Current plan</Badge>
            <h3 className="mt-2 text-2xl font-bold">VIP Pro</h3>
            <p className="text-sm text-muted-foreground mt-1">Unlimited everything + AI + analytics + teams</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">$10<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
            <div className="text-xs text-muted-foreground">Renews Aug 1, 2026</div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><div className="text-xs text-muted-foreground">Platforms</div><div className="font-semibold">Unlimited</div></div>
          <div><div className="text-xs text-muted-foreground">Accounts/platform</div><div className="font-semibold">100</div></div>
          <div><div className="text-xs text-muted-foreground">Scheduled posts</div><div className="font-semibold">Unlimited</div></div>
          <div><div className="text-xs text-muted-foreground">Media storage</div><div className="font-semibold">20 GB</div></div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="outline" size="sm">Switch to yearly (save 17%)</Button>
          <Button variant="outline" size="sm">Downgrade</Button>
          <Button variant="ghost" size="sm" className="text-red-600">Cancel subscription</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Available plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: "Free", price: "$0", current: false, features: ["1 platform", "1 account", "10 posts"] },
            { name: "Silver", price: "$3", current: false, features: ["2 platforms", "10 accounts/platform", "Unlimited posts"] },
            { name: "VIP Pro", price: "$10", current: true, features: ["Unlimited platforms", "100 accounts/platform", "AI features"] },
          ].map((p) => (
            <div key={p.name} className={cn("rounded-lg border p-4", p.current && "border-amber-500 bg-amber-500/5")}>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{p.name}</h4>
                {p.current && <Badge className="text-[10px]">Current</Badge>}
              </div>
              <div className="text-2xl font-bold mt-2">{p.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
              <ul className="mt-3 space-y-1.5 text-xs">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function InvoicesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
        <p className="text-sm text-muted-foreground">Download past invoices for your records</p>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th className="text-left p-3 font-medium">Invoice</th>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">Plan</th>
              <th className="text-left p-3 font-medium">Amount</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_INVOICES.map((inv) => (
              <tr key={inv.id} className="border-t hover:bg-muted/30">
                <td className="p-3 font-mono text-xs">{inv.id}</td>
                <td className="p-3 text-muted-foreground">{new Date(inv.date).toLocaleDateString()}</td>
                <td className="p-3">{inv.plan}</td>
                <td className="p-3 font-medium">${inv.amount}.00</td>
                <td className="p-3"><Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 capitalize">{inv.status}</Badge></td>
                <td className="p-3"><Button variant="ghost" size="sm" className="h-7 text-xs"><FileText className="h-3 w-3 mr-1" /> PDF</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------
// API Keys
// ---------------------------------------------------------------------

function ApiKeysSection() {
  const [keys, setKeys] = React.useState([
    { id: "k1", name: "Production API", prefix: "sk_live_ab12", created: "2026-05-12", lastUsed: "2026-07-03T01:00:00Z" },
    { id: "k2", name: "Zapier Integration", prefix: "sk_live_cd34", created: "2026-03-22", lastUsed: "2026-07-02T18:00:00Z" },
  ]);
  const [showNew, setShowNew] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">API Keys</h2>
          <p className="text-sm text-muted-foreground">Use these to integrate SocialPilot with your own apps · VIP Pro only</p>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus className="h-4 w-4 mr-1" /> New Key</Button>
      </div>

      {showNew && (
        <Card className="p-4 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label className="text-xs">Key name</Label>
              <Input className="mt-1 h-9" placeholder="e.g., Production API" />
            </div>
            <Button onClick={() => { setShowNew(false); toast.success("API key created — copy it now, it won't be shown again"); }}>Create</Button>
            <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Key</th>
              <th className="text-left p-3 font-medium">Created</th>
              <th className="text-left p-3 font-medium">Last used</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id} className="border-t hover:bg-muted/30">
                <td className="p-3 font-medium">{k.name}</td>
                <td className="p-3 font-mono text-xs">{k.prefix}••••••••</td>
                <td className="p-3 text-muted-foreground text-xs">{new Date(k.created).toLocaleDateString()}</td>
                <td className="p-3 text-muted-foreground text-xs">{new Date(k.lastUsed).toLocaleDateString()}</td>
                <td className="p-3">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600" onClick={() => { setKeys(keys.filter((x) => x.id !== k.id)); toast.success("Key revoked"); }}>
                    Revoke
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-4">
        <h4 className="font-semibold text-sm mb-2">Quick start</h4>
        <pre className="rounded-md border bg-muted/50 p-3 text-xs overflow-x-auto font-mono">{`curl -X POST https://api.socialpilot.io/v1/posts \\
  -H "Authorization: Bearer sk_live_•••" \\
  -H "Content-Type: application/json" \\
  -d '{"caption":"Hello world","platform":"x","scheduledAt":"2026-07-04T09:00:00Z"}'`}</pre>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------

function NotificationsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-sm text-muted-foreground">Recent activity across your accounts</p>
      </div>

      <div className="space-y-2">
        {MOCK_NOTIFICATIONS.map((n) => (
          <Card key={n.id} className={cn("p-4", !n.isRead && "border-amber-500/40 bg-amber-500/5")}>
            <div className="flex items-start gap-3">
              <div className={cn("mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                n.type === "POST_FAILED" ? "bg-red-500/10" :
                n.type === "POST_PUBLISHED" ? "bg-emerald-500/10" :
                n.type === "ACCOUNT_DISCONNECTED" ? "bg-amber-500/10" : "bg-muted")}>
                {n.type === "POST_FAILED" ? <AlertTriangle className="h-4 w-4 text-red-500" /> :
                 n.type === "POST_PUBLISHED" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                 n.type === "ACCOUNT_DISCONNECTED" ? <Power className="h-4 w-4 text-amber-500" /> :
                 <Bell className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm">{n.title}</div>
                  {!n.isRead && <div className="h-2 w-2 rounded-full bg-amber-500" />}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">{n.body}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              {!n.isRead && <Button variant="ghost" size="sm" className="h-7 text-xs">Mark read</Button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Security
// ---------------------------------------------------------------------

function SecuritySection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Security</h2>
        <p className="text-sm text-muted-foreground">Protect your account with 2FA, sessions, and device management</p>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground mt-1">Add an extra layer of security with TOTP</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Enabled</Badge>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Active Sessions</h3>
          <div className="space-y-3">
            {[
              { device: "Chrome on macOS", ip: "203.0.113.42", location: "San Francisco, US", current: true, lastActive: "Now" },
              { device: "iPhone SocialPilot App", ip: "203.0.113.50", location: "San Francisco, US", current: false, lastActive: "2 hours ago" },
              { device: "Chrome Extension", ip: "203.0.113.42", location: "San Francisco, US", current: false, lastActive: "5 minutes ago" },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{s.device}</span>
                    {s.current && <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Current</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.ip} · {s.location}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Last active: {s.lastActive}</div>
                </div>
                {!s.current && <Button variant="ghost" size="sm" className="text-red-600 h-7 text-xs">Revoke</Button>}
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4 text-red-600">Revoke all other sessions</Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Devices</h3>
          <div className="space-y-3">
            {[
              { name: "MacBook Pro", type: "desktop", trusted: true },
              { name: "iPhone 15 Pro", type: "mobile", trusted: true },
              { name: "Chrome Extension", type: "extension", trusted: true },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                  {d.type === "desktop" ? <LayoutDashboard className="h-4 w-4" /> : d.type === "mobile" ? <User className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{d.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{d.type}</div>
                </div>
                {d.trusted && <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Trusted</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-xl">
          <div><Label className="text-xs">Current</Label><Input type="password" className="mt-1 h-9" /></div>
          <div><Label className="text-xs">New</Label><Input type="password" className="mt-1 h-9" /></div>
          <div><Label className="text-xs">Confirm</Label><Input type="password" className="mt-1 h-9" /></div>
        </div>
        <Button className="mt-4" size="sm">Update password</Button>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------

function ProfileSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your personal information</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={CURRENT_USER.avatarUrl} alt={CURRENT_USER.name} />
            <AvatarFallback>{CURRENT_USER.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5 mr-1" /> Upload new</Button>
            <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label className="text-xs">Full name</Label><Input className="mt-1" defaultValue={CURRENT_USER.name} /></div>
          <div><Label className="text-xs">Email</Label><Input className="mt-1" defaultValue={CURRENT_USER.email} /></div>
          <div><Label className="text-xs">Username</Label><Input className="mt-1" defaultValue="alexmorgan" /></div>
          <div><Label className="text-xs">Timezone</Label>
            <Select defaultValue="Asia/Dhaka">
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Dhaka">Asia/Dhaka (UTC+6)</SelectItem>
                <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2"><Label className="text-xs">Bio</Label><Textarea className="mt-1 min-h-[80px]" defaultValue="Marketing lead at Acme. Coffee-driven. Scheduling the future of social." /></div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button>Save changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------
// Settings (Safe posting + UI)
// ---------------------------------------------------------------------

function SettingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">Configure safe posting rules and application preferences</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <h3 className="font-semibold">Safe Posting Rules</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Protect your accounts from being flagged for repetitive posting patterns</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Random delay — minimum (seconds)</Label>
            <Input type="number" className="mt-1 h-9" defaultValue={0} />
          </div>
          <div>
            <Label className="text-xs">Random delay — maximum (seconds)</Label>
            <Input type="number" className="mt-1 h-9" defaultValue={60} />
          </div>
          <div>
            <Label className="text-xs">Posting interval (minutes)</Label>
            <Input type="number" className="mt-1 h-9" defaultValue={15} />
          </div>
          <div>
            <Label className="text-xs">Timezone</Label>
            <Select defaultValue="Asia/Dhaka">
              <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Dhaka">Asia/Dhaka (UTC+6)</SelectItem>
                <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Working hours — start</Label>
            <Input type="time" className="mt-1 h-9" defaultValue="09:00" />
          </div>
          <div>
            <Label className="text-xs">Working hours — end</Label>
            <Input type="time" className="mt-1 h-9" defaultValue="21:00" />
          </div>
          <div>
            <Label className="text-xs">Posting order</Label>
            <Select defaultValue="sequential">
              <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sequential">Sequential</SelectItem>
                <SelectItem value="random">Random</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Account rotation</Label>
            <Select defaultValue="round_robin">
              <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="round_robin">Round robin</SelectItem>
                <SelectItem value="least_used">Least used</SelectItem>
                <SelectItem value="random">Random</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Daily posting limit</Label>
            <Input type="number" className="mt-1 h-9" defaultValue={50} />
          </div>
          <div>
            <Label className="text-xs">Weekly posting limit</Label>
            <Input type="number" className="mt-1 h-9" defaultValue={300} />
          </div>
          <div>
            <Label className="text-xs">Max retries (failed posts)</Label>
            <Input type="number" className="mt-1 h-9" defaultValue={3} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch defaultChecked id="auto-retry" />
            <Label htmlFor="auto-retry" className="text-sm">Auto-retry failed posts</Label>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button>Save settings</Button>
          <Button variant="outline" onClick={() => toast.success("Schedule paused")}><Pause className="h-3.5 w-3.5 mr-1" /> Pause schedule</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Appearance & Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div><div className="text-sm font-medium">Email notifications</div><div className="text-xs text-muted-foreground">Post published, failed, account disconnected</div></div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><div className="text-sm font-medium">Push notifications</div><div className="text-xs text-muted-foreground">Real-time alerts in your browser</div></div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><div className="text-sm font-medium">Share anonymous analytics</div><div className="text-xs text-muted-foreground">Help us improve the product</div></div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  );
}
