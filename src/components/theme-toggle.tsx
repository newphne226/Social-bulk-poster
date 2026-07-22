"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        theme === "dark"
          ? "bg-slate-700 text-yellow-300 hover:bg-slate-600"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      } ${className}`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden lg:inline">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
