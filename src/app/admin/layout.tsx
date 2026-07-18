"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/posts", label: "Posts", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [authorized, setAuthorized] = React.useState(false);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    try {
      const token = localStorage.getItem("sp_admin_token");
      const user = localStorage.getItem("sp_admin_user");

      if (!token || !user) {
        window.location.replace("/admin/login");
        return;
      }

      const parsed = JSON.parse(user);
      if (parsed.role !== "ADMIN" && parsed.role !== "OWNER") {
        window.location.replace("/admin/login");
        return;
      }

      setAuthorized(true);
    } catch {
      window.location.replace("/admin/login");
      return;
    } finally {
      setChecking(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sp_admin_token");
    localStorage.removeItem("sp_admin_user");
    window.location.replace("/admin/login");
  };

  // Show nothing while checking (prevents flash)
  if (checking && !authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-auto`}
      >
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-pink-500">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">Admin Panel</span>
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

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 flex items-center px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-white">
            {navItems.find((i) => i.href === pathname)?.label ?? "Dashboard"}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              View Website
            </Link>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
