"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  CreditCard,
  Ticket,
  Flag,
  Bot,
  FileText,
  Megaphone,
  Settings,
  Bell,
  DollarSign,
  Activity,
  Calendar,
  TrendingUp,
  TrendingDown,
  Search,
  Plus,
  MoreHorizontal,
  Trash2,
  Edit3,
  Ban,
  UserX,
  KeyRound,
  UserCheck,
  Eye,
  Pause,
  Play,
  CheckCircle2,
  Clock,
  RefreshCw,
  Copy,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Gift,
  Info,
  AlertCircle,
  AlertTriangle,
  Cpu,
  Thermometer,
  Save,
  Send,
  Globe,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Server,
  Download,
  MessageSquare,
  Percent,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PlatformIcon } from "@/components/platform-icon";
import { PLATFORM_LIST, getPlatformColor } from "@/lib/platforms";
import { MOCK_ADMIN_STATS } from "@/lib/mock-data";

// ---------------------------------------------------------------------
// Types & navigation
// ---------------------------------------------------------------------

type AdminSection =
  | "stats"
  | "users"
  | "plans"
  | "subscriptions"
  | "payments"
  | "coupons"
  | "tickets"
  | "reports"
  | "announcements"
  | "platforms"
  | "features"
  | "ai"
  | "logs"
  | "revenue"
  | "dau"
  | "posts";

const NAV: {
  group: string;
  items: { id: AdminSection; label: string; icon: React.ElementType }[];
}[] = [
  {
    group: "Overview",
    items: [
      { id: "stats", label: "Dashboard", icon: LayoutDashboard },
      { id: "revenue", label: "Revenue Analytics", icon: DollarSign },
      { id: "dau", label: "DAU / MAU", icon: Activity },
      { id: "posts", label: "Posts Statistics", icon: BarChart3 },
    ],
  },
  {
    group: "Users & Billing",
    items: [
      { id: "users", label: "Users", icon: Users },
      { id: "plans", label: "Plans", icon: Sparkles },
      { id: "subscriptions", label: "Subscriptions", icon: RefreshCw },
      { id: "payments", label: "Payments", icon: CreditCard },
      { id: "coupons", label: "Coupons", icon: Gift },
    ],
  },
  {
    group: "Moderation",
    items: [
      { id: "tickets", label: "Support Tickets", icon: Ticket },
      { id: "reports", label: "Reports", icon: Flag },
      { id: "announcements", label: "Announcements", icon: Megaphone },
    ],
  },
  {
    group: "System",
    items: [
      { id: "platforms", label: "Platforms", icon: Globe },
      { id: "features", label: "Feature Flags", icon: Flag },
      { id: "ai", label: "AI Settings", icon: Bot },
      { id: "logs", label: "System Logs", icon: FileText },
    ],
  },
];

const SECTION_TITLES: Record<AdminSection, string> = {
  stats: "Admin Dashboard",
  users: "Manage Users",
  plans: "Manage Plans",
  subscriptions: "Manage Subscriptions",
  payments: "Manage Payments",
  coupons: "Manage Coupons",
  tickets: "Support Tickets",
  reports: "Manage Reports",
  announcements: "Announcements",
  platforms: "Platform Settings",
  features: "Feature Flags",
  ai: "AI Settings",
  logs: "System Logs",
  revenue: "Revenue Analytics",
  dau: "Daily / Monthly Active Users",
  posts: "Scheduled Posts Statistics",
};

// ---------------------------------------------------------------------
// Inline mock data
// ---------------------------------------------------------------------

type PlanTier = "FREE" | "SILVER" | "VIP_PRO" | "ENTERPRISE";
type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: PlanTier;
  status: UserStatus;
  joinedAt: string;
  mrr: number;
  lastSeen: string;
}

const MOCK_USERS: AdminUser[] = [
  { id: "u_001", name: "Sofia Reyes", email: "sofia@example.com", plan: "VIP_PRO", status: "ACTIVE", joinedAt: "2026-07-02", mrr: 10, lastSeen: "2 min ago" },
  { id: "u_002", name: "Marcus Chen", email: "marcus@example.com", plan: "SILVER", status: "ACTIVE", joinedAt: "2026-07-02", mrr: 3, lastSeen: "12 min ago" },
  { id: "u_003", name: "Priya Patel", email: "priya@example.com", plan: "FREE", status: "ACTIVE", joinedAt: "2026-07-01", mrr: 0, lastSeen: "1 hour ago" },
  { id: "u_004", name: "Tom Becker", email: "tom@example.com", plan: "SILVER", status: "SUSPENDED", joinedAt: "2026-05-28", mrr: 0, lastSeen: "3 days ago" },
  { id: "u_005", name: "Lena Müller", email: "lena@example.com", plan: "VIP_PRO", status: "ACTIVE", joinedAt: "2025-06-25", mrr: 10, lastSeen: "5 min ago" },
  { id: "u_006", name: "Diego Santos", email: "diego@example.com", plan: "ENTERPRISE", status: "ACTIVE", joinedAt: "2026-06-20", mrr: 99, lastSeen: "just now" },
  { id: "u_007", name: "Aisha Khan", email: "aisha@example.com", plan: "SILVER", status: "BANNED", joinedAt: "2026-05-15", mrr: 0, lastSeen: "2 weeks ago" },
  { id: "u_008", name: "Yuki Tanaka", email: "yuki@example.com", plan: "FREE", status: "ACTIVE", joinedAt: "2026-06-10", mrr: 0, lastSeen: "8 min ago" },
  { id: "u_009", name: "Robert Lee", email: "robert@example.com", plan: "VIP_PRO", status: "ACTIVE", joinedAt: "2026-06-08", mrr: 10, lastSeen: "20 min ago" },
  { id: "u_010", name: "Emma Wilson", email: "emma@example.com", plan: "SILVER", status: "ACTIVE", joinedAt: "2026-06-05", mrr: 3, lastSeen: "1 hour ago" },
];

interface AdminPlan {
  id: PlanTier;
  name: string;
  price: number;
  tagline: string;
  subscribers: number;
  mrr: number;
  features: string[];
  limits: { accounts: string; postsPerMonth: string };
  highlighted?: boolean;
}

const MOCK_PLANS: AdminPlan[] = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    tagline: "Get started with the basics",
    subscribers: 12676,
    mrr: 0,
    features: ["1 social account", "Basic analytics", "Manual scheduling", "Community support"],
    limits: { accounts: "1 account", postsPerMonth: "30 posts / mo" },
  },
  {
    id: "SILVER",
    name: "Silver",
    price: 3,
    tagline: "For solo creators and freelancers",
    subscribers: 1482,
    mrr: 4446,
    features: ["5 social accounts", "Advanced analytics", "Bulk CSV upload", "Email support"],
    limits: { accounts: "5 accounts", postsPerMonth: "300 posts / mo" },
  },
  {
    id: "VIP_PRO",
    name: "VIP Pro",
    price: 10,
    tagline: "For agencies and power users",
    subscribers: 642,
    mrr: 6420,
    features: ["100 accounts per platform", "AI captions", "Priority support", "Team members (5)", "Analytics export"],
    limits: { accounts: "100 / platform", postsPerMonth: "Unlimited" },
    highlighted: true,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: 99,
    tagline: "Custom for large organizations",
    subscribers: 23,
    mrr: 2277,
    features: ["Unlimited accounts", "White-label dashboard", "SSO / SAML", "Dedicated CSM", "Custom integrations", "99.9% SLA"],
    limits: { accounts: "Unlimited", postsPerMonth: "Unlimited" },
  },
];

interface AdminSubscription {
  id: string;
  user: string;
  plan: PlanTier;
  startedAt: string;
  renewsAt: string;
  amount: number;
  status: "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED";
}

const MOCK_SUBSCRIPTIONS: AdminSubscription[] = [
  { id: "sub_8821", user: "Sofia Reyes", plan: "VIP_PRO", startedAt: "2026-07-02", renewsAt: "2026-08-02", amount: 10, status: "ACTIVE" },
  { id: "sub_8820", user: "Marcus Chen", plan: "SILVER", startedAt: "2026-07-02", renewsAt: "2026-08-02", amount: 3, status: "ACTIVE" },
  { id: "sub_8819", user: "Diego Santos", plan: "ENTERPRISE", startedAt: "2026-06-20", renewsAt: "2026-07-20", amount: 99, status: "ACTIVE" },
  { id: "sub_8818", user: "Lena Müller", plan: "VIP_PRO", startedAt: "2025-06-25", renewsAt: "2026-07-25", amount: 10, status: "ACTIVE" },
  { id: "sub_8817", user: "Robert Lee", plan: "VIP_PRO", startedAt: "2026-06-08", renewsAt: "2026-07-08", amount: 10, status: "ACTIVE" },
  { id: "sub_8816", user: "Emma Wilson", plan: "SILVER", startedAt: "2026-06-05", renewsAt: "2026-07-05", amount: 3, status: "TRIALING" },
  { id: "sub_8815", user: "Tom Becker", plan: "SILVER", startedAt: "2026-05-28", renewsAt: "2026-06-28", amount: 3, status: "PAST_DUE" },
  { id: "sub_8814", user: "Aisha Khan", plan: "SILVER", startedAt: "2026-05-15", renewsAt: "2026-06-15", amount: 3, status: "CANCELED" },
];

interface AdminPayment {
  id: string;
  user: string;
  amount: number;
  plan: string;
  method: string;
  date: string;
  status: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
}

const MOCK_PAYMENTS: AdminPayment[] = [
  { id: "INV-2026-0089", user: "Sofia Reyes", amount: 10, plan: "VIP Pro", method: "Visa •• 4242", date: "2026-07-02", status: "PAID" },
  { id: "INV-2026-0088", user: "Diego Santos", amount: 99, plan: "Enterprise", method: "Wire transfer", date: "2026-07-01", status: "PAID" },
  { id: "INV-2026-0087", user: "Tom Becker", amount: 3, plan: "Silver", method: "Mastercard •• 5555", date: "2026-06-28", status: "FAILED" },
  { id: "INV-2026-0086", user: "Lena Müller", amount: 10, plan: "VIP Pro", method: "Visa •• 4242", date: "2026-06-25", status: "PAID" },
  { id: "INV-2026-0085", user: "Robert Lee", amount: 10, plan: "VIP Pro", method: "Amex •• 3782", date: "2026-06-08", status: "PAID" },
  { id: "INV-2026-0084", user: "Marcus Chen", amount: 3, plan: "Silver", method: "Visa •• 1881", date: "2026-07-02", status: "PENDING" },
  { id: "INV-2026-0083", user: "Emma Wilson", amount: 3, plan: "Silver", method: "Visa •• 0911", date: "2026-06-05", status: "PAID" },
  { id: "INV-2026-0082", user: "Diego Santos", amount: 99, plan: "Enterprise", method: "Wire transfer", date: "2026-06-20", status: "REFUNDED" },
  { id: "INV-2026-0081", user: "Yuki Tanaka", amount: 0, plan: "Free", method: "—", date: "2026-06-10", status: "PAID" },
  { id: "INV-2026-0080", user: "Priya Patel", amount: 0, plan: "Free", method: "—", date: "2026-07-01", status: "PAID" },
];

interface AdminCoupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  used: number;
  limit: number | null;
  expiresAt: string | null;
  status: "ACTIVE" | "EXPIRED" | "PAUSED";
}

const MOCK_COUPONS: AdminCoupon[] = [
  { id: "c1", code: "SUMMER25", type: "PERCENTAGE", value: 25, used: 142, limit: 500, expiresAt: "2026-08-31", status: "ACTIVE" },
  { id: "c2", code: "WELCOME10", type: "PERCENTAGE", value: 10, used: 1240, limit: null, expiresAt: null, status: "ACTIVE" },
  { id: "c3", code: "VIP50", type: "PERCENTAGE", value: 50, used: 18, limit: 100, expiresAt: "2026-12-31", status: "ACTIVE" },
  { id: "c4", code: "FLASH5", type: "FIXED", value: 5, used: 320, limit: 1000, expiresAt: "2026-07-15", status: "ACTIVE" },
  { id: "c5", code: "OLD2024", type: "PERCENTAGE", value: 30, used: 980, limit: 1000, expiresAt: "2025-12-31", status: "EXPIRED" },
  { id: "c6", code: "BULK3M", type: "FIXED", value: 9, used: 45, limit: 200, expiresAt: "2026-09-30", status: "PAUSED" },
];

interface AdminTicket {
  id: string;
  subject: string;
  user: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  status: "OPEN" | "PENDING" | "RESOLVED";
  createdAt: string;
}

const MOCK_TICKETS: AdminTicket[] = [
  { id: "T-1001", subject: "Pinterest connection keeps dropping", user: "priya@example.com", priority: "HIGH", status: "OPEN", createdAt: "2026-07-02" },
  { id: "T-1000", subject: "Question about bulk CSV upload", user: "marcus@example.com", priority: "NORMAL", status: "PENDING", createdAt: "2026-07-01" },
  { id: "T-0999", subject: "Feature request: TikTok support", user: "sofia@example.com", priority: "LOW", status: "OPEN", createdAt: "2026-06-30" },
  { id: "T-0998", subject: "Invoice download not working", user: "tom@example.com", priority: "NORMAL", status: "RESOLVED", createdAt: "2026-06-29" },
  { id: "T-0997", subject: "Cannot delete media folder", user: "yuki@example.com", priority: "NORMAL", status: "OPEN", createdAt: "2026-06-28" },
  { id: "T-0996", subject: "Billing charge discrepancy", user: "robert@example.com", priority: "URGENT", status: "OPEN", createdAt: "2026-06-27" },
  { id: "T-0995", subject: "AI caption keeps timing out", user: "emma@example.com", priority: "NORMAL", status: "RESOLVED", createdAt: "2026-06-26" },
];

interface AdminReport {
  id: string;
  type: "USER" | "POST" | "COMMENT";
  target: string;
  reason: string;
  reporter: string;
  status: "OPEN" | "REVIEWING" | "RESOLVED" | "DISMISSED";
  createdAt: string;
}

const MOCK_REPORTS: AdminReport[] = [
  { id: "R-201", type: "USER", target: "@spam_bot_42", reason: "Spam account posting duplicate content", reporter: "marcus@example.com", status: "OPEN", createdAt: "2026-07-02" },
  { id: "R-200", type: "POST", target: "@acme.lifestyle / p2", reason: "Offensive language in post caption", reporter: "sofia@example.com", status: "OPEN", createdAt: "2026-07-01" },
  { id: "R-199", type: "COMMENT", target: "@diego_inc / c-88", reason: "Harassment in comment thread", reporter: "priya@example.com", status: "REVIEWING", createdAt: "2026-06-30" },
  { id: "R-198", type: "USER", target: "@fake_acme", reason: "Impersonation of brand", reporter: "tom@example.com", status: "RESOLVED", createdAt: "2026-06-29" },
  { id: "R-197", type: "POST", target: "@acme.food / p12", reason: "Copyrighted image used without permission", reporter: "robert@example.com", status: "DISMISSED", createdAt: "2026-06-28" },
];

interface AdminAnnouncement {
  id: string;
  title: string;
  sentAt: string;
  status: "SENT" | "DRAFT" | "SCHEDULED";
  recipients: number;
  openRate: number;
}

const MOCK_ANNOUNCEMENTS: AdminAnnouncement[] = [
  { id: "A-12", title: "New: Pinterest video scheduling now supported", sentAt: "2026-07-01", status: "SENT", recipients: 14200, openRate: 38.4 },
  { id: "A-11", title: "Scheduled maintenance: July 5, 2–4 AM UTC", sentAt: "2026-06-28", status: "SENT", recipients: 14823, openRate: 52.1 },
  { id: "A-10", title: "Introducing AI Caption v2 with tone control", sentAt: "2026-06-20", status: "SENT", recipients: 14800, openRate: 61.7 },
  { id: "A-09", title: "Help us improve — take our 5-minute survey", sentAt: "2026-06-15", status: "DRAFT", recipients: 0, openRate: 0 },
];

interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rollout: number;
}

const INITIAL_FEATURE_FLAGS: FeatureFlag[] = [
  { key: "new_dashboard_v2", name: "New Dashboard v2", description: "Redesigned dashboard with customizable widgets", enabled: true, rollout: 100 },
  { key: "ai_caption_v2", name: "AI Caption v2", description: "Improved AI caption generation with tone control", enabled: true, rollout: 75 },
  { key: "bulk_csv_upload", name: "Bulk CSV Upload", description: "Upload and schedule posts via CSV", enabled: true, rollout: 100 },
  { key: "video_scheduling", name: "Video Scheduling (Beta)", description: "Schedule and auto-publish video posts", enabled: true, rollout: 50 },
  { key: "analytics_export", name: "Analytics Export", description: "Export analytics reports to CSV and PDF", enabled: true, rollout: 100 },
  { key: "team_workspaces", name: "Team Workspaces", description: "Multi-user workspaces with role permissions", enabled: false, rollout: 0 },
  { key: "tiktok_integration", name: "TikTok Integration", description: "Publish to TikTok (coming soon)", enabled: false, rollout: 0 },
  { key: "dark_mode_default", name: "Dark Mode Default", description: "Default new users to dark mode", enabled: true, rollout: 25 },
];

interface SystemLog {
  id: string;
  time: string;
  level: "info" | "warn" | "error";
  source: string;
  message: string;
}

const MOCK_LOGS: SystemLog[] = [
  { id: "l1", time: "14:23:01", level: "info", source: "auth", message: "User u_001 logged in (plan=VIP_PRO)" },
  { id: "l2", time: "14:21:55", level: "warn", source: "scheduler", message: "Rate limit reached for Pinterest account a7 — backing off 60s" },
  { id: "l3", time: "14:18:42", level: "error", source: "payment", message: "Stripe charge failed for INV-2026-0087 (Tom Becker): card_declined" },
  { id: "l4", time: "14:15:30", level: "info", source: "scheduler", message: "Published post p2 to instagram (@acme.lifestyle)" },
  { id: "l5", time: "14:12:18", level: "warn", source: "ai", message: "AI caption request took 8.4s (threshold 5s)" },
  { id: "l6", time: "14:08:55", level: "error", source: "api", message: "GET /api/accounts returned 500 (3 occurrences in 60s)" },
  { id: "l7", time: "14:05:00", level: "info", source: "system", message: "Background job: daily active user count updated (8912)" },
  { id: "l8", time: "14:02:14", level: "info", source: "scheduler", message: "Post p1 queued for facebook (@acmecorp)" },
  { id: "l9", time: "13:58:42", level: "error", source: "scheduler", message: "Post p4 failed: linkedin token expired — needs reconnect" },
  { id: "l10", time: "13:55:30", level: "info", source: "auth", message: "User u_003 upgraded plan: FREE → SILVER" },
  { id: "l11", time: "13:48:11", level: "warn", source: "media", message: "Upload size approaching storage limit (87% of 500GB)" },
  { id: "l12", time: "13:42:08", level: "info", source: "webhook", message: "Stripe webhook received: invoice.payment_succeeded" },
];

const MRR_TREND = [
  { month: "Jan", value: 14200 },
  { month: "Feb", value: 15100 },
  { month: "Mar", value: 16300 },
  { month: "Apr", value: 16800 },
  { month: "May", value: 17200 },
  { month: "Jun", value: 17900 },
  { month: "Jul", value: 18420 },
];

const MAU_TREND = [
  { month: "Jan", value: 42100 },
  { month: "Feb", value: 48300 },
  { month: "Mar", value: 53200 },
  { month: "Apr", value: 58100 },
  { month: "May", value: 62400 },
  { month: "Jun", value: 67800 },
  { month: "Jul", value: 71200 },
];

const POSTS_BY_STATUS = [
  { name: "Published", value: 218, color: "#10b981" },
  { name: "Scheduled", value: 42, color: "#f59e0b" },
  { name: "Queued", value: 12, color: "#ec4899" },
  { name: "Draft", value: 18, color: "#94a3b8" },
  { name: "Failed", value: 9, color: "#ef4444" },
  { name: "Paused", value: 5, color: "#a855f7" },
];

// ---------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------

export function AdminDashboard() {
  const [section, setSection] = React.useState<AdminSection>("stats");
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] bg-muted/20">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-background">
        <AdminSidebar section={section} setSection={setSection} />
      </aside>

      {/* Sidebar (mobile) */}
      {mobileNavOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileNavOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b">
              <span className="font-semibold text-sm">Navigation</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileNavOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <AdminSidebar
              section={section}
              setSection={(s) => {
                setSection(s);
                setMobileNavOpen(false);
              }}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">
        <AdminHeader
          section={section}
          onOpenNav={() => setMobileNavOpen(true)}
        />
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
                {section === "stats" && <StatsSection />}
                {section === "users" && <UsersSection />}
                {section === "plans" && <PlansSection />}
                {section === "subscriptions" && <SubscriptionsSection />}
                {section === "payments" && <PaymentsSection />}
                {section === "coupons" && <CouponsSection />}
                {section === "tickets" && <TicketsSection />}
                {section === "reports" && <ReportsSection />}
                {section === "announcements" && <AnnouncementsSection />}
                {section === "platforms" && <PlatformsSection />}
                {section === "features" && <FeaturesSection />}
                {section === "ai" && <AISection />}
                {section === "logs" && <LogsSection />}
                {section === "revenue" && <RevenueSection />}
                {section === "dau" && <DauMauSection />}
                {section === "posts" && <PostsStatsSection />}
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------

function AdminSidebar({
  section,
  setSection,
}: {
  section: AdminSection;
  setSection: (s: AdminSection) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-white font-bold">
            S
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm leading-tight">SocialPilot</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Admin Console</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-amber-500 to-pink-500 text-white text-[10px]">
            <ShieldAlert className="h-3 w-3 mr-1" /> Super Admin
          </Badge>
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
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-3 border-t">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="Alex Morgan" />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium truncate">Alex Morgan</div>
            <div className="text-[10px] text-muted-foreground truncate">alex@socialpilot.io</div>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------

function AdminHeader({
  section,
  onOpenNav,
}: {
  section: AdminSection;
  onOpenNav: () => void;
}) {
  return (
    <header className="sticky top-14 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={onOpenNav}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="font-semibold text-lg">{SECTION_TITLES[section]}</h1>
          <Badge variant="outline" className="hidden sm:inline-flex text-[10px] text-emerald-600 border-emerald-500/30 bg-emerald-500/5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1" /> All systems operational
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search users, payments, tickets…" className="pl-8 h-9 w-64" />
          </div>
          <Button variant="ghost" size="icon" className="relative h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-pink-500" />
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:opacity-90">
            <Zap className="h-3.5 w-3.5 mr-1" /> Quick action
          </Button>
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------

function SectionHeading({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

function AdminStatCard({
  label,
  value,
  delta,
  trend,
  icon: Icon,
  accent = "amber",
  spark,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: React.ElementType;
  accent?: "amber" | "pink" | "emerald" | "slate";
  spark?: number[];
}) {
  const accentMap = {
    amber: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    pink: "text-pink-600 dark:text-pink-400 bg-pink-500/10",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    slate: "text-slate-600 dark:text-slate-300 bg-slate-500/10",
  };
  const barColor = {
    amber: "bg-amber-500",
    pink: "bg-pink-500",
    emerald: "bg-emerald-500",
    slate: "bg-slate-500",
  };
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className={cn("h-7 w-7 rounded-md flex items-center justify-center", accentMap[accent])}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
      <div className="mt-2 flex items-center justify-between">
        <div
          className={cn(
            "text-xs flex items-center gap-1",
            trend === "up" ? "text-emerald-600" : "text-red-600"
          )}
        >
          {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {delta}
        </div>
        {spark && (
          <div className="flex items-end gap-0.5 h-6">
            {spark.map((v, i) => {
              const max = Math.max(...spark);
              return (
                <div
                  key={i}
                  className={cn("w-1 rounded-sm", barColor[accent])}
                  style={{ height: `${(v / max) * 100}%`, opacity: 0.4 + (i / spark.length) * 0.6 }}
                />
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

function BarChart({
  data,
  height = 200,
  format = (n: number) => n.toLocaleString(),
  color = "#f59e0b",
}: {
  data: { label: string; value: number }[];
  height?: number;
  format?: (n: number) => string;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5 h-full">
          <div className="text-[10px] text-muted-foreground">{format(d.value)}</div>
          <div className="w-full flex-1 flex items-end">
            <div
              className="w-full rounded-t-md transition-all hover:opacity-80"
              style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color }}
              title={`${d.label}: ${format(d.value)}`}
            />
          </div>
          <div className="text-[10px] text-muted-foreground">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function ProgressBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total === 0 ? 0 : (value / total) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground tabular-nums">
          {value.toLocaleString()} ({pct.toFixed(1)}%)
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

const PLAN_LABEL: Record<PlanTier, string> = {
  FREE: "Free",
  SILVER: "Silver",
  VIP_PRO: "VIP Pro",
  ENTERPRISE: "Enterprise",
};

function PlanBadge({ plan }: { plan: PlanTier }) {
  const map: Record<PlanTier, string> = {
    FREE: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
    SILVER: "bg-slate-400/10 text-slate-700 dark:text-slate-200",
    VIP_PRO: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    ENTERPRISE: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
  };
  return <Badge variant="outline" className={cn("text-[10px]", map[plan])}>{PLAN_LABEL[plan]}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    TRIALING: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    PAST_DUE: "bg-red-500/10 text-red-700 dark:text-red-400",
    CANCELED: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
    SUSPENDED: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    BANNED: "bg-red-500/10 text-red-700 dark:text-red-400",
    PAID: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    FAILED: "bg-red-500/10 text-red-700 dark:text-red-400",
    REFUNDED: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
    OPEN: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    REVIEWING: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
    RESOLVED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    DISMISSED: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
    SENT: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    DRAFT: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
    SCHEDULED: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    EXPIRED: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
    PAUSED: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  };
  return (
    <Badge variant="outline" className={cn("text-[10px] capitalize", map[status] ?? "bg-muted text-muted-foreground")}>
      {status.replace("_", " ").toLowerCase()}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: AdminTicket["priority"] }) {
  const map: Record<AdminTicket["priority"], string> = {
    LOW: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
    NORMAL: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    HIGH: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    URGENT: "bg-red-500/10 text-red-700 dark:text-red-400",
  };
  return (
    <Badge variant="outline" className={cn("text-[10px]", map[priority])}>
      {priority}
    </Badge>
  );
}

// ---------------------------------------------------------------------
// 1. Dashboard Statistics
// ---------------------------------------------------------------------

function StatsSection() {
  const s = MOCK_ADMIN_STATS;
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-amber-500/10 via-pink-500/5 to-emerald-500/10 border-amber-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back, Alex 👋</h2>
            <p className="mt-1 text-muted-foreground">
              {s.postsPublishedToday.toLocaleString()} posts published today across {s.totalUsers.toLocaleString()} users.
              {s.failedPosts24h > 0 && (
                <span className="text-red-600 font-medium"> {s.failedPosts24h} failures need attention.</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Syncing platform stats…")}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
            </Button>
            <Button size="sm" onClick={() => toast.success("Daily report exported")} className="bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:opacity-90">
              <Download className="h-3.5 w-3.5 mr-1" /> Export report
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Total Users" value={s.totalUsers.toLocaleString()} delta="+8.4% MoM" trend="up" icon={Users} accent="amber" spark={[8102, 8234, 8456, 8612, 8912, 9240, 9580]} />
        <AdminStatCard label="MRR" value={`$${s.mrr.toLocaleString()}`} delta="+3.0% MoM" trend="up" icon={DollarSign} accent="emerald" spark={[17200, 17500, 17900, 18100, 18280, 18390, 18420]} />
        <AdminStatCard label="Paying Users" value={s.payingUsers.toLocaleString()} delta="+12.1%" trend="up" icon={UserCheck} accent="pink" spark={[1980, 2010, 2050, 2080, 2105, 2128, 2147]} />
        <AdminStatCard label="Posts Scheduled Today" value={s.postsScheduledToday.toLocaleString()} delta="+5.2%" trend="up" icon={Calendar} accent="slate" spark={[32100, 33400, 34100, 35800, 36500, 37200, 38201]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Daily Active Users</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/5">
              <TrendingUp className="h-3 w-3 mr-1" /> +20.1%
            </Badge>
          </div>
          <BarChart
            data={s.dailyActiveUsers.map((d) => ({ label: d.date, value: d.value }))}
            color="#f59e0b"
          />
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Quick Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">Published today</span>
              </div>
              <span className="text-sm font-semibold tabular-nums">{s.postsPublishedToday.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Failed (24h)</span>
              </div>
              <span className="text-sm font-semibold tabular-nums text-red-600">{s.failedPosts24h.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-500" />
                <span className="text-sm">Scheduled today</span>
              </div>
              <span className="text-sm font-semibold tabular-nums">{s.postsScheduledToday.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-pink-500" />
                <span className="text-sm">Active (30d)</span>
              </div>
              <span className="text-sm font-semibold tabular-nums">{s.activeUsers30d.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">API uptime</span>
              </div>
              <span className="text-sm font-semibold tabular-nums text-emerald-600">99.98%</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Signups</h3>
          <Button variant="ghost" size="sm" className="text-xs">
            View all users <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-2">
          {s.recentUsers.map((u) => (
            <div key={u.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{u.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{u.name}</div>
                <div className="text-xs text-muted-foreground truncate">{u.email}</div>
              </div>
              <PlanBadge plan={u.plan as PlanTier} />
              <StatusBadge status={u.status} />
              <span className="hidden sm:inline text-xs text-muted-foreground tabular-nums w-24 text-right">{u.joinedAt}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------
// 2. Manage Users
// ---------------------------------------------------------------------

function UsersSection() {
  const [search, setSearch] = React.useState("");
  const [planFilter, setPlanFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filtered = MOCK_USERS.filter((u) => {
    if (planFilter !== "all" && u.plan !== planFilter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    if (
      search &&
      !u.name.toLowerCase().includes(search.toLowerCase()) &&
      !u.email.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Manage Users"
        description={`${MOCK_USERS.length} of ${MOCK_ADMIN_STATS.totalUsers.toLocaleString()} users · ${MOCK_USERS.filter((u) => u.status === "ACTIVE").length} active`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.info("Exporting users to CSV…")}>
              <Download className="h-3.5 w-3.5 mr-1" /> Export
            </Button>
            <Button size="sm" onClick={() => toast.success("Invite sent")}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Invite user
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Plan" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All plans</SelectItem>
            <SelectItem value="FREE">Free</SelectItem>
            <SelectItem value="SILVER">Silver</SelectItem>
            <SelectItem value="VIP_PRO">VIP Pro</SelectItem>
            <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="BANNED">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">MRR</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead className="hidden lg:table-cell">Last seen</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{u.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{u.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell><PlanBadge plan={u.plan} /></TableCell>
                <TableCell><StatusBadge status={u.status} /></TableCell>
                <TableCell className="hidden md:table-cell tabular-nums">${u.mrr}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{u.joinedAt}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">{u.lastSeen}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => toast.info(`Now impersonating ${u.name}`)}>
                        <Eye className="h-3.5 w-3.5 mr-2" /> Impersonate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.success(`Password reset email sent to ${u.email}`)}>
                        <KeyRound className="h-3.5 w-3.5 mr-2" /> Reset password
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info(`${u.name} ${u.status === "SUSPENDED" ? "reactivated" : "suspended"}`)}>
                        <Ban className="h-3.5 w-3.5 mr-2" /> {u.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-amber-600" onClick={() => toast.warning(`${u.name} has been banned`)}>
                        <UserX className="h-3.5 w-3.5 mr-2" /> Ban user
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => toast.error(`${u.name} deleted (demo)`)}>
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No users match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------
// 3. Manage Plans
// ---------------------------------------------------------------------

function PlansSection() {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Manage Plans"
        description="Configure pricing, features, and limits for each subscription tier."
        actions={
          <Button size="sm" onClick={() => toast.success("New plan created (demo)")}>
            <Plus className="h-3.5 w-3.5 mr-1" /> New plan
          </Button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {MOCK_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "p-5 flex flex-col",
              plan.highlighted && "border-amber-500/40 ring-1 ring-amber-500/20"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              {plan.highlighted && (
                <Badge className="bg-gradient-to-r from-amber-500 to-pink-500 text-white text-[10px]">
                  <Sparkles className="h-3 w-3 mr-1" /> Popular
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-3">{plan.tagline}</p>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-bold tracking-tight">${plan.price}</span>
              <span className="text-xs text-muted-foreground">/ month</span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
              <div>
                <div className="text-muted-foreground">Subscribers</div>
                <div className="font-semibold text-sm">{plan.subscribers.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">MRR</div>
                <div className="font-semibold text-sm">${plan.mrr.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Accounts</div>
                <div className="font-semibold text-sm">{plan.limits.accounts}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Posts</div>
                <div className="font-semibold text-sm">{plan.limits.postsPerMonth}</div>
              </div>
            </div>
            <Separator className="mb-3" />
            <div className="flex-1 space-y-1.5 mb-4">
              {plan.features.map((f) => (
                <div key={f} className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.info(`Editing ${plan.name} plan`)}>
                <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toast.info("Pricing history opened")}>
                <BarChart3 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 4. Manage Subscriptions
// ---------------------------------------------------------------------

function SubscriptionsSection() {
  const totalMrr = MOCK_SUBSCRIPTIONS.reduce((a, b) => a + (b.status === "ACTIVE" || b.status === "TRIALING" ? b.amount : 0), 0);
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Manage Subscriptions"
        description="All recurring subscriptions across the platform."
        actions={<Button variant="outline" size="sm" onClick={() => toast.info("Exporting subscriptions…")}><Download className="h-3.5 w-3.5 mr-1" /> Export</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Active subs" value={String(MOCK_SUBSCRIPTIONS.filter((s) => s.status === "ACTIVE").length)} delta="+3" trend="up" icon={RefreshCw} accent="emerald" />
        <AdminStatCard label="Trialing" value={String(MOCK_SUBSCRIPTIONS.filter((s) => s.status === "TRIALING").length)} delta="+1" trend="up" icon={Clock} accent="amber" />
        <AdminStatCard label="Past due" value={String(MOCK_SUBSCRIPTIONS.filter((s) => s.status === "PAST_DUE").length)} delta="+1" trend="down" icon={AlertTriangle} accent="pink" />
        <AdminStatCard label="Page MRR" value={`$${totalMrr}`} delta="+12%" trend="up" icon={DollarSign} accent="slate" />
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sub ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="hidden md:table-cell">Started</TableHead>
              <TableHead className="hidden md:table-cell">Renews</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_SUBSCRIPTIONS.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-mono text-xs">{sub.id}</TableCell>
                <TableCell className="font-medium">{sub.user}</TableCell>
                <TableCell><PlanBadge plan={sub.plan} /></TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{sub.startedAt}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{sub.renewsAt}</TableCell>
                <TableCell className="tabular-nums">${sub.amount}</TableCell>
                <TableCell><StatusBadge status={sub.status} /></TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => toast.info(`Viewing ${sub.id}`)}><Eye className="h-3.5 w-3.5 mr-2" /> View details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.success("Invoice sent")}><FileText className="h-3.5 w-3.5 mr-2" /> Send invoice</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info("Subscription paused")}><Pause className="h-3.5 w-3.5 mr-2" /> Pause</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => toast.error("Subscription canceled (demo)")}>
                        <UserX className="h-3.5 w-3.5 mr-2" /> Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------
// 5. Manage Payments
// ---------------------------------------------------------------------

function PaymentsSection() {
  const total = MOCK_PAYMENTS.reduce((a, b) => a + b.amount, 0);
  const paid = MOCK_PAYMENTS.filter((p) => p.status === "PAID").reduce((a, b) => a + b.amount, 0);
  const failed = MOCK_PAYMENTS.filter((p) => p.status === "FAILED").length;
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Manage Payments"
        description="Recent payment transactions across all customers."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.info("Filtering payments…")}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Sync Stripe
            </Button>
            <Button size="sm" onClick={() => toast.success("Export ready")}><Download className="h-3.5 w-3.5 mr-1" /> Export</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Total volume" value={`$${total}`} delta="+18%" trend="up" icon={DollarSign} accent="emerald" />
        <AdminStatCard label="Collected" value={`$${paid}`} delta="+15%" trend="up" icon={CheckCircle2} accent="amber" />
        <AdminStatCard label="Failed" value={String(failed)} delta="-2" trend="up" icon={AlertTriangle} accent="pink" />
        <AdminStatCard label="Avg. ticket" value={`$${(total / MOCK_PAYMENTS.length).toFixed(2)}`} delta="+0.4" trend="up" icon={CreditCard} accent="slate" />
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Plan</TableHead>
              <TableHead className="hidden lg:table-cell">Method</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PAYMENTS.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.id}</TableCell>
                <TableCell className="font-medium">{p.user}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{p.plan}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">{p.method}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{p.date}</TableCell>
                <TableCell className="tabular-nums font-medium">${p.amount.toFixed(2)}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------
// 6. Manage Coupons
// ---------------------------------------------------------------------

function CouponsSection() {
  const [coupons, setCoupons] = React.useState(MOCK_COUPONS);
  const [createOpen, setCreateOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Manage Coupons"
        description="Create and track promotional discount codes."
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Create coupon
          </Button>
        }
      />

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead className="hidden md:table-cell">Usage</TableHead>
              <TableHead className="hidden lg:table-cell">Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((c) => {
              const usagePct = c.limit ? (c.used / c.limit) * 100 : 0;
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1 text-xs font-mono font-semibold">{c.code}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          navigator.clipboard?.writeText(c.code);
                          toast.success(`Copied "${c.code}"`);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {c.type === "PERCENTAGE" ? `${c.value}%` : `$${c.value}`}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="min-w-[120px]">
                      <div className="text-xs mb-1 tabular-nums">
                        {c.used.toLocaleString()}{c.limit ? ` / ${c.limit.toLocaleString()}` : " / ∞"}
                      </div>
                      {c.limit && (
                        <Progress value={usagePct} className="h-1.5" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">{c.expiresAt ?? "—"}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => toast.info(`Editing ${c.code}`)}>
                          <Edit3 className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setCoupons((prev) => prev.map((x) => x.id === c.id ? { ...x, status: x.status === "PAUSED" ? "ACTIVE" : "PAUSED" } : x));
                          toast.success(`${c.code} ${c.status === "PAUSED" ? "resumed" : "paused"}`);
                        }}>
                          {c.status === "PAUSED" ? <><Play className="h-3.5 w-3.5 mr-2" /> Resume</> : <><Pause className="h-3.5 w-3.5 mr-2" /> Pause</>}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                          setCoupons((prev) => prev.filter((x) => x.id !== c.id));
                          toast.error(`${c.code} deleted`);
                        }}>
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {createOpen && (
        <CreateCouponDialog
          onClose={() => setCreateOpen(false)}
          onCreate={(c) => {
            setCoupons((prev) => [{ ...c, id: `c${Date.now()}` }, ...prev]);
            toast.success(`Coupon ${c.code} created`);
            setCreateOpen(false);
          }}
        />
      )}
    </div>
  );
}

function CreateCouponDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (c: Omit<AdminCoupon, "id" | "used" | "status">) => void;
}) {
  const [code, setCode] = React.useState("");
  const [type, setType] = React.useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [value, setValue] = React.useState("10");
  const [limit, setLimit] = React.useState("100");
  const [expiresAt, setExpiresAt] = React.useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <Card className="p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Create Coupon</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Coupon code</Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SUMMER25"
              className="mt-1 font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "PERCENTAGE" | "FIXED")}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED">Fixed amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Value ({type === "PERCENTAGE" ? "%" : "$"})</Label>
              <Input value={value} onChange={(e) => setValue(e.target.value)} type="number" className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Usage limit (blank = unlimited)</Label>
              <Input value={limit} onChange={(e) => setLimit(e.target.value)} type="number" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Expires at</Label>
              <Input value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} type="date" className="mt-1" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!code}
            onClick={() =>
              onCreate({
                code,
                type,
                value: Number(value),
                limit: limit ? Number(limit) : null,
                expiresAt: expiresAt || null,
              })
            }
            className="bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:opacity-90"
          >
            <Save className="h-3.5 w-3.5 mr-1" /> Create coupon
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------
// 7. Manage Tickets
// ---------------------------------------------------------------------

function TicketsSection() {
  const [filter, setFilter] = React.useState<string>("all");
  const filtered = MOCK_TICKETS.filter((t) => filter === "all" || t.status === filter);
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Support Tickets"
        description={`${MOCK_TICKETS.filter((t) => t.status === "OPEN").length} open · ${MOCK_TICKETS.filter((t) => t.status === "PENDING").length} pending`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Open" value={String(MOCK_TICKETS.filter((t) => t.status === "OPEN").length)} delta="+1" trend="down" icon={Ticket} accent="amber" />
        <AdminStatCard label="Pending" value={String(MOCK_TICKETS.filter((t) => t.status === "PENDING").length)} delta="0" trend="up" icon={Clock} accent="slate" />
        <AdminStatCard label="Resolved (7d)" value="14" delta="+3" trend="up" icon={CheckCircle2} accent="emerald" />
        <AdminStatCard label="Avg. response" value="2.4h" delta="-0.6h" trend="up" icon={Zap} accent="pink" />
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="OPEN">Open</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="RESOLVED">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="hidden md:table-cell">Reporter</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs">{t.id}</TableCell>
                <TableCell className="font-medium max-w-xs truncate">{t.subject}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{t.user}</TableCell>
                <TableCell><PriorityBadge priority={t.priority} /></TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{t.createdAt}</TableCell>
                <TableCell><StatusBadge status={t.status} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Opening ${t.id}`)}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success(`${t.id} resolved`)}>
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------
// 8. Manage Reports
// ---------------------------------------------------------------------

function ReportsSection() {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Manage Reports"
        description="User-submitted reports of content or accounts violating policy."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Open reports" value={String(MOCK_REPORTS.filter((r) => r.status === "OPEN").length)} delta="+2" trend="down" icon={Flag} accent="pink" />
        <AdminStatCard label="Reviewing" value={String(MOCK_REPORTS.filter((r) => r.status === "REVIEWING").length)} delta="+1" trend="up" icon={Eye} accent="amber" />
        <AdminStatCard label="Resolved (7d)" value="8" delta="+2" trend="up" icon={CheckCircle2} accent="emerald" />
        <AdminStatCard label="Avg. time" value="3.1h" delta="-0.4h" trend="up" icon={Clock} accent="slate" />
      </div>

      <div className="space-y-3">
        {MOCK_REPORTS.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex flex-col md:flex-row md:items-start gap-3">
              <div className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                r.status === "OPEN" ? "bg-pink-500/10 text-pink-600" :
                r.status === "REVIEWING" ? "bg-amber-500/10 text-amber-600" :
                r.status === "RESOLVED" ? "bg-emerald-500/10 text-emerald-600" :
                "bg-muted text-muted-foreground"
              )}>
                <Flag className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <Badge variant="outline" className="text-[10px]">{r.type}</Badge>
                  <StatusBadge status={r.status} />
                </div>
                <div className="font-medium text-sm">{r.target}</div>
                <p className="text-sm text-muted-foreground mt-0.5">{r.reason}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>Reported by {r.reporter}</span>
                  <span>·</span>
                  <span>{r.createdAt}</span>
                </div>
              </div>
              <div className="flex md:flex-col gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => toast.info(`Reviewing ${r.id}`)}>
                  <Eye className="h-3.5 w-3.5 mr-1" /> Review
                </Button>
                <Button size="sm" variant="outline" className="text-amber-600" onClick={() => toast.warning(`Action taken on ${r.target}`)}>
                  <Ban className="h-3.5 w-3.5 mr-1" /> Action
                </Button>
                <Button size="sm" variant="ghost" className="text-red-600" onClick={() => toast.error(`${r.id} dismissed`)}>
                  <X className="h-3.5 w-3.5 mr-1" /> Dismiss
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 9. Manage Announcements
// ---------------------------------------------------------------------

function AnnouncementsSection() {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [audience, setAudience] = React.useState("ALL");

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Announcements"
        description="Broadcast product updates, maintenance windows, and news to your users."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-semibold mb-4">Past announcements</h3>
          <div className="space-y-3">
            {MOCK_ANNOUNCEMENTS.map((a) => (
              <div key={a.id} className="rounded-lg border p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="font-medium text-sm">{a.title}</span>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Send className="h-3 w-3" /> {a.sentAt}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {a.recipients.toLocaleString()} recipients</span>
                  {a.openRate > 0 && (
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {a.openRate}% open rate</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Create announcement</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheduled maintenance on July 5"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Body</Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your announcement…"
                rows={5}
                className="mt-1 resize-none"
              />
            </div>
            <div>
              <Label className="text-xs">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All users</SelectItem>
                  <SelectItem value="PAYING">Paying users only</SelectItem>
                  <SelectItem value="FREE">Free users only</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { setTitle(""); setBody(""); toast.info("Saved as draft"); }}>
                Save draft
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:opacity-90"
                disabled={!title}
                onClick={() => {
                  toast.success(`Announcement sent to ${audience.toLowerCase()} users`);
                  setTitle("");
                  setBody("");
                }}
              >
                <Send className="h-3.5 w-3.5 mr-1" /> Send now
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 10. Manage Platform Settings
// ---------------------------------------------------------------------

function PlatformsSection() {
  const [enabled, setEnabled] = React.useState<Record<string, boolean>>(
    Object.fromEntries(PLATFORM_LIST.map((p) => [p.id, true]))
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Platform Settings"
        description="Enable or disable social platforms available to users for connecting accounts."
        actions={
          <Button size="sm" onClick={() => toast.success("Platform settings saved")}>
            <Save className="h-3.5 w-3.5 mr-1" /> Save changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLATFORM_LIST.map((p) => {
          const isEnabled = enabled[p.id];
          return (
            <Card key={p.id} className={cn("p-5", !isEnabled && "opacity-60")}>
              <div className="flex items-start gap-4">
                <PlatformIcon platform={p.id} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{p.name}</h3>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(v) => {
                        setEnabled((prev) => ({ ...prev, [p.id]: v }));
                        toast.info(`${p.name} ${v ? "enabled" : "disabled"}`);
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Brand color <code className="font-mono">{p.color}</code> · {p.scopes.length} OAuth scopes
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {Object.entries(p.features).filter(([, v]) => v).slice(0, 6).map(([k]) => (
                      <Badge key={k} variant="outline" className="text-[10px] capitalize">{k}</Badge>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md bg-muted/50 px-2 py-1.5">
                      <div className="text-muted-foreground">Caption limit</div>
                      <div className="font-medium">{p.limits.captionLength.toLocaleString()} chars</div>
                    </div>
                    <div className="rounded-md bg-muted/50 px-2 py-1.5">
                      <div className="text-muted-foreground">Max images</div>
                      <div className="font-medium">{p.limits.maxImages}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 11. Manage Feature Flags
// ---------------------------------------------------------------------

function FeaturesSection() {
  const [flags, setFlags] = React.useState<FeatureFlag[]>(INITIAL_FEATURE_FLAGS);

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Feature Flags"
        description="Toggle features and control gradual rollout percentages."
        actions={
          <Button size="sm" onClick={() => toast.success("Flags saved")}>
            <Save className="h-3.5 w-3.5 mr-1" /> Save
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {flags.map((f) => (
          <Card key={f.key} className="p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{f.name}</h3>
                  <code className="text-[10px] text-muted-foreground font-mono">{f.key}</code>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
              </div>
              <Switch
                checked={f.enabled}
                onCheckedChange={(v) => {
                  setFlags((prev) => prev.map((x) => x.key === f.key ? { ...x, enabled: v } : x));
                  toast.info(`${f.name} ${v ? "enabled" : "disabled"}`);
                }}
              />
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs flex items-center gap-1.5">
                <Percent className="h-3 w-3" /> Rollout percentage
              </Label>
              <span className={cn(
                "text-sm font-bold tabular-nums",
                f.rollout === 100 ? "text-emerald-600" : f.rollout === 0 ? "text-muted-foreground" : "text-amber-600"
              )}>
                {f.rollout}%
              </span>
            </div>
            <Slider
              value={[f.rollout]}
              onValueChange={(v) => setFlags((prev) => prev.map((x) => x.key === f.key ? { ...x, rollout: v[0] } : x))}
              max={100}
              step={5}
              disabled={!f.enabled}
            />
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {f.enabled ? (f.rollout === 100 ? "Available to all users" : f.rollout === 0 ? "Disabled for all" : `Available to ~${Math.round(MOCK_ADMIN_STATS.totalUsers * f.rollout / 100).toLocaleString()} users`) : "Flag is off"}
              </span>
              <Badge variant="outline" className={cn("text-[10px]", f.enabled ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground")}>
                {f.enabled ? "Live" : "Off"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 12. Manage AI Settings
// ---------------------------------------------------------------------

function AISection() {
  const [provider, setProvider] = React.useState("openai");
  const [model, setModel] = React.useState("gpt-4o-mini");
  const [temperature, setTemperature] = React.useState(0.7);
  const [maxTokens, setMaxTokens] = React.useState("800");
  const [limits, setLimits] = React.useState({ FREE: 5, SILVER: 50, VIP_PRO: 500, ENTERPRISE: 5000 });

  return (
    <div className="space-y-6">
      <SectionHeading
        title="AI Settings"
        description="Configure the AI provider used for caption generation, content ideas, and smart replies."
        actions={
          <Button size="sm" onClick={() => toast.success("AI settings saved")}>
            <Save className="h-3.5 w-3.5 mr-1" /> Save settings
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Requests today" value="8,420" delta="+12%" trend="up" icon={Zap} accent="amber" />
        <AdminStatCard label="Avg latency" value="1.8s" delta="-0.3s" trend="up" icon={Clock} accent="emerald" />
        <AdminStatCard label="Cost (this month)" value="$1,240" delta="+8%" trend="down" icon={DollarSign} accent="pink" />
        <AdminStatCard label="Error rate" value="0.4%" delta="-0.1%" trend="up" icon={AlertTriangle} accent="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-amber-500" />
            <h3 className="font-semibold">Provider configuration</h3>
          </div>
          <div>
            <Label className="text-xs">Provider</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="google">Google AI</SelectItem>
                <SelectItem value="local">Local (Ollama)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">gpt-4o-mini (fast, cheap)</SelectItem>
                <SelectItem value="gpt-4o">gpt-4o (balanced)</SelectItem>
                <SelectItem value="gpt-4-turbo">gpt-4-turbo (high quality)</SelectItem>
                <SelectItem value="claude-3-5-sonnet">claude-3-5-sonnet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">API key</Label>
            <Input type="password" defaultValue="sk-••••••••••••••••••••••••abcd" className="mt-1 font-mono" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs flex items-center gap-1.5">
                <Thermometer className="h-3 w-3" /> Temperature
              </Label>
              <span className="text-sm font-bold tabular-nums text-amber-600">{temperature.toFixed(2)}</span>
            </div>
            <Slider value={[temperature]} onValueChange={(v) => setTemperature(v[0])} min={0} max={2} step={0.05} />
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>Precise</span><span>Balanced</span><span>Creative</span>
            </div>
          </div>
          <div>
            <Label className="text-xs">Max tokens per request</Label>
            <Input value={maxTokens} onChange={(e) => setMaxTokens(e.target.value)} type="number" className="mt-1" />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-pink-500" />
            <h3 className="font-semibold">Daily limits per plan</h3>
          </div>
          <p className="text-xs text-muted-foreground">Number of AI requests each user can make per day based on their subscription tier.</p>
          <div className="space-y-3">
            {(["FREE", "SILVER", "VIP_PRO", "ENTERPRISE"] as PlanTier[]).map((plan) => (
              <div key={plan} className="flex items-center justify-between gap-3">
                <PlanBadge plan={plan} />
                <div className="flex items-center gap-2 flex-1 max-w-[180px]">
                  <Input
                    type="number"
                    value={limits[plan]}
                    onChange={(e) => setLimits((prev) => ({ ...prev, [plan]: Number(e.target.value) }))}
                    className="h-8"
                  />
                  <span className="text-xs text-muted-foreground shrink-0">requests / day</span>
                </div>
              </div>
            ))}
          </div>
          <Separator />
          <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 flex gap-2">
            <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Enterprise customers can request custom limits. Contact sales for whitelisted API rate overrides.
            </p>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info("Running test prompt…")}>
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Run test prompt
          </Button>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 13. View Logs
// ---------------------------------------------------------------------

function LogsSection() {
  const [level, setLevel] = React.useState<"all" | "info" | "warn" | "error">("all");
  const [query, setQuery] = React.useState("");

  const filtered = MOCK_LOGS.filter((l) => {
    if (level !== "all" && l.level !== level) return false;
    if (query && !l.message.toLowerCase().includes(query.toLowerCase()) && !l.source.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const levelConfig = {
    info: { icon: Info, color: "text-emerald-600 bg-emerald-500/10" },
    warn: { icon: AlertCircle, color: "text-amber-600 bg-amber-500/10" },
    error: { icon: AlertTriangle, color: "text-red-600 bg-red-500/10" },
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        title="System Logs"
        description="Real-time stream of application, scheduler, and payment events."
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.success("Logs exported")}>
            <Download className="h-3.5 w-3.5 mr-1" /> Export
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Info (24h)" value="2,841" delta="+5%" trend="up" icon={Info} accent="emerald" />
        <AdminStatCard label="Warnings (24h)" value="184" delta="+12" trend="down" icon={AlertCircle} accent="amber" />
        <AdminStatCard label="Errors (24h)" value="23" delta="-4" trend="up" icon={AlertTriangle} accent="pink" />
        <AdminStatCard label="Log volume" value="14.2 MB" delta="+2 MB" trend="up" icon={Server} accent="slate" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Tabs value={level} onValueChange={(v) => setLevel(v as "all" | "info" | "warn" | "error")}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="warn">Warnings</TabsTrigger>
            <TabsTrigger value="error">Errors</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter logs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="font-mono text-xs divide-y">
          {filtered.map((log) => {
            const cfg = levelConfig[log.level];
            const Icon = cfg.icon;
            return (
              <div key={log.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors">
                <span className="text-muted-foreground tabular-nums shrink-0 w-20">{log.time}</span>
                <span className={cn("shrink-0 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase w-20", cfg.color)}>
                  <Icon className="h-3 w-3" /> {log.level}
                </span>
                <span className="text-muted-foreground shrink-0 w-20 truncate">[{log.source}]</span>
                <span className="flex-1 min-w-0 break-words">{log.message}</span>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-muted-foreground">No logs match your filters.</div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------
// 14. Revenue Analytics
// ---------------------------------------------------------------------

function RevenueSection() {
  const arpu = MOCK_ADMIN_STATS.mrr / MOCK_ADMIN_STATS.payingUsers;
  const totalRev = MOCK_ADMIN_STATS.revenueByPlan.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Revenue Analytics"
        description="Track MRR growth, revenue distribution by plan, and ARPU."
        actions={
          <Select defaultValue="6m">
            <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 month</SelectItem>
              <SelectItem value="3m">3 months</SelectItem>
              <SelectItem value="6m">6 months</SelectItem>
              <SelectItem value="12m">12 months</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="MRR" value={`$${MOCK_ADMIN_STATS.mrr.toLocaleString()}`} delta="+3.0%" trend="up" icon={DollarSign} accent="emerald" />
        <AdminStatCard label="ARPU" value={`$${arpu.toFixed(2)}`} delta="+0.12" trend="up" icon={CreditCard} accent="amber" />
        <AdminStatCard label="Paying users" value={MOCK_ADMIN_STATS.payingUsers.toLocaleString()} delta="+12.1%" trend="up" icon={UserCheck} accent="pink" />
        <AdminStatCard label="Churn (30d)" value="2.4%" delta="-0.6%" trend="up" icon={TrendingDown} accent="slate" />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">MRR growth</h3>
            <p className="text-xs text-muted-foreground">Last 7 months</p>
          </div>
          <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/5">
            <TrendingUp className="h-3 w-3 mr-1" /> +29.7% YTD
          </Badge>
        </div>
        <BarChart
          data={MRR_TREND.map((d) => ({ label: d.month, value: d.value }))}
          height={240}
          format={(n) => `$${(n / 1000).toFixed(1)}k`}
          color="#10b981"
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Revenue by plan</h3>
          <div className="space-y-4">
            {MOCK_ADMIN_STATS.revenueByPlan.map((p) => (
              <ProgressBar
                key={p.name}
                label={p.name}
                value={p.value}
                total={totalRev}
                color={p.color}
              />
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total MRR</span>
            <span className="font-bold">${totalRev.toLocaleString()}</span>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Subscriber distribution</h3>
          <div className="space-y-3">
            {MOCK_PLANS.map((p) => {
              const totalSubs = MOCK_PLANS.reduce((a, b) => a + b.subscribers, 0);
              const pct = (p.subscribers / totalSubs) * 100;
              return (
                <div key={p.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <PlanBadge plan={p.id} />
                    </div>
                    <span className="text-muted-foreground tabular-nums">
                      {p.subscribers.toLocaleString()} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-pink-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 15. DAU / MAU
// ---------------------------------------------------------------------

function DauMauSection() {
  const stickiness = (MOCK_ADMIN_STATS.dailyActiveUsers[MOCK_ADMIN_STATS.dailyActiveUsers.length - 1].value /
    MAU_TREND[MAU_TREND.length - 1].value) * 100;
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Daily / Monthly Active Users"
        description="Engagement health metrics across the user base."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="DAU (today)" value={MOCK_ADMIN_STATS.dailyActiveUsers[MOCK_ADMIN_STATS.dailyActiveUsers.length - 1].value.toLocaleString()} delta="+5.2%" trend="up" icon={Activity} accent="amber" />
        <AdminStatCard label="MAU" value={MAU_TREND[MAU_TREND.length - 1].value.toLocaleString()} delta="+5.0%" trend="up" icon={Users} accent="pink" />
        <AdminStatCard label="Stickiness" value={`${stickiness.toFixed(1)}%`} delta="+1.2%" trend="up" icon={Zap} accent="emerald" />
        <AdminStatCard label="Active 30d" value={MOCK_ADMIN_STATS.activeUsers30d.toLocaleString()} delta="+4.1%" trend="up" icon={TrendingUp} accent="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Daily active users</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <Badge variant="outline" className="text-amber-600 border-amber-500/30 bg-amber-500/5">
              <TrendingUp className="h-3 w-3 mr-1" /> +20.1%
            </Badge>
          </div>
          <BarChart
            data={MOCK_ADMIN_STATS.dailyActiveUsers.map((d) => ({ label: d.date, value: d.value }))}
            height={220}
            color="#f59e0b"
          />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Monthly active users</h3>
              <p className="text-xs text-muted-foreground">Last 7 months</p>
            </div>
            <Badge variant="outline" className="text-pink-600 border-pink-500/30 bg-pink-500/5">
              <TrendingUp className="h-3 w-3 mr-1" /> +69.1%
            </Badge>
          </div>
          <BarChart
            data={MAU_TREND.map((d) => ({ label: d.month, value: d.value }))}
            height={220}
            format={(n) => `${(n / 1000).toFixed(0)}k`}
            color="#ec4899"
          />
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Engagement breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border p-4">
            <div className="text-xs text-muted-foreground mb-1">Daily / Monthly ratio</div>
            <div className="text-2xl font-bold">{stickiness.toFixed(1)}%</div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> Healthy (target &gt; 10%)
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs text-muted-foreground mb-1">Avg. sessions / user / day</div>
            <div className="text-2xl font-bold">2.4</div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +0.3 vs last week
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs text-muted-foreground mb-1">Avg. session duration</div>
            <div className="text-2xl font-bold">8m 42s</div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +12s vs last week
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------
// 16. Scheduled Posts Statistics
// ---------------------------------------------------------------------

function PostsStatsSection() {
  const totalPosts = POSTS_BY_STATUS.reduce((a, b) => a + b.value, 0);
  const totalByPlatform = MOCK_ADMIN_STATS.postsByPlatform.reduce((a, b) => a + b.count, 0);

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Scheduled Posts Statistics"
        description="Distribution of posts across platforms and publication statuses."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Published today" value={MOCK_ADMIN_STATS.postsPublishedToday.toLocaleString()} delta="+5.2%" trend="up" icon={CheckCircle2} accent="emerald" />
        <AdminStatCard label="Scheduled today" value={MOCK_ADMIN_STATS.postsScheduledToday.toLocaleString()} delta="+8.1%" trend="up" icon={Calendar} accent="amber" />
        <AdminStatCard label="Failed (24h)" value={MOCK_ADMIN_STATS.failedPosts24h.toLocaleString()} delta="+12" trend="down" icon={AlertTriangle} accent="pink" />
        <AdminStatCard label="Success rate" value="98.6%" delta="+0.2%" trend="up" icon={Zap} accent="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Posts by platform</h3>
          <div className="space-y-3">
            {MOCK_ADMIN_STATS.postsByPlatform.map((p) => (
              <ProgressBar
                key={p.platform}
                label={p.platform}
                value={p.count}
                total={totalByPlatform}
                color={p.color}
              />
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total posts (30d)</span>
            <span className="font-bold">{totalByPlatform.toLocaleString()}</span>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Posts by status</h3>
          <div className="space-y-3">
            {POSTS_BY_STATUS.map((s) => (
              <ProgressBar
                key={s.name}
                label={s.name}
                value={s.value}
                total={totalPosts}
                color={s.color}
              />
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total tracked</span>
            <span className="font-bold">{totalPosts}</span>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Publishing volume by platform (last 7 days)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {MOCK_ADMIN_STATS.postsByPlatform.map((p) => {
            const platformId = p.platform.toLowerCase().includes("insta") ? "instagram" :
              p.platform.toLowerCase() === "x" ? "x" :
              p.platform.toLowerCase() === "facebook" ? "facebook" :
              p.platform.toLowerCase() === "linkedin" ? "linkedin" :
              "pinterest";
            return (
              <div key={p.platform} className="rounded-lg border p-3 text-center">
                <div className="flex justify-center mb-2">
                  <PlatformIcon platform={platformId} size={32} />
                </div>
                <div className="text-xs text-muted-foreground">{p.platform}</div>
                <div className="font-bold text-lg">{p.count.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">
                  {((p.count / totalByPlatform) * 100).toFixed(1)}% share
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
