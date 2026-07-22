"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  LogOut,
  Shield,
  Menu,
  X,
  UserCheck,
  ShoppingCart,
  FolderTree,
  Globe,
  CreditCard,
  BarChart3,
  Ticket,
  Settings,
  Crown,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Membership", icon: Crown },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/products", label: "Products", icon: ShoppingCart },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/brands", label: "Brands", icon: Globe },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/customers", label: "Customers", icon: UserCheck },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  const isLoginPage = pathname === "/admin/login";

  React.useEffect(() => {
    if (isLoginPage) {
      setReady(true);
      return;
    }
    const timer = setTimeout(() => {
      const token = localStorage.getItem("sp_admin_token");
      if (!token) {
        window.location.replace("/admin/login");
        return;
      }
      setReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [isLoginPage]);

  const handleLogout = () => {
    localStorage.removeItem("sp_admin_token");
    localStorage.removeItem("sp_admin_user");
    window.location.href = "/admin/login";
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">SMTools</span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded">ADMIN</span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="px-3 pb-3">
          <ThemeToggle className="w-full" />
        </div>

        {/* Sign Out */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 flex items-center px-4 lg:px-6 gap-4 transition-colors">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {navItems.find((i) => pathname === i.href || pathname.startsWith(i.href + "/"))?.label ?? "Dashboard"}
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Website
            </Link>
          </div>
        </header>
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
