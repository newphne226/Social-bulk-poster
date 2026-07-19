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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-auto`}
      >
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-pink-500">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">Admin</span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-500/10 text-amber-500"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 min-h-screen">
        <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 flex items-center px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-white">
            {navItems.find((i) => pathname === i.href || pathname.startsWith(i.href + "/"))?.label ?? "Dashboard"}
          </h1>
          <div className="ml-auto">
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
              Website
            </Link>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
