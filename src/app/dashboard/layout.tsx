"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Globe,
  Clock,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Crown,
  Zap,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/posts", label: "Posts", icon: FileText },
  { href: "/dashboard/accounts", label: "Accounts", icon: Globe },
  { href: "/dashboard/schedule", label: "Schedule", icon: Clock },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subPlan, setSubPlan] = useState("FREE");

  useEffect(() => {
    const token = localStorage.getItem("sp_token");
    const userData = localStorage.getItem("sp_user");
    if (!token) {
      router.replace("/signin");
      return;
    }
    try {
      setUser(userData ? JSON.parse(userData) : null);
    } catch {
      setUser(null);
    }

    // Fetch subscription status
    fetch("https://smtools.online/api/subscription", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        const plan = d.subscription?.plan || "FREE";
        setSubPlan(plan);
        localStorage.setItem("sp_subscription", JSON.stringify(d.subscription));
      })
      .catch(() => {});

    setLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("sp_token");
    localStorage.removeItem("sp_user");
    localStorage.removeItem("sp_subscription");
    router.replace("/signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  const activeLabel = nav.find((n) => n.href === pathname)?.label || "Dashboard";
  const initials = (user?.name || "U").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-900">SocialPilot</span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Plan Badge */}
        {subPlan !== "FREE" && (
          <div className="px-4 py-2 border-b border-slate-100">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              subPlan === "ALL_ACCESS"
                ? "bg-amber-100 text-amber-700"
                : subPlan === "REELS"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}>
              <Crown size={12} />
              {subPlan === "ALL_ACCESS" ? "All Access" : subPlan === "REELS" ? "Reels" : "Content"}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-amber-50 text-amber-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-900 truncate">{user?.name || "User"}</div>
              <div className="text-xs text-slate-400 truncate">{user?.email || ""}</div>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors" title="Log out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-700 mr-3">
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">{activeLabel}</h1>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 hidden sm:block">
              Back to Site
            </Link>
            <button className="relative text-slate-400 hover:text-slate-600">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
