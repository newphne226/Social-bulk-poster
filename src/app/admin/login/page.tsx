"use client";

import * as React from "react";
import { Eye, EyeOff, Loader2, Shield, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [redirecting, setRedirecting] = React.useState(false);
  const [seeding, setSeeding] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First, ensure DB is seeded
      setSeeding(true);
      try {
        await fetch("/api/admin/seed", { method: "POST", signal: AbortSignal.timeout(5000) });
      } catch {
        // seed failed, but try login anyway
      }
      setSeeding(false);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }

      if (data.user.role !== "ADMIN" && data.user.role !== "OWNER") {
        setError("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      localStorage.setItem("sp_admin_token", data.token);
      localStorage.setItem("sp_admin_user", JSON.stringify(data.user));

      setRedirecting(true);
      setTimeout(() => {
        window.location.replace("/admin");
      }, 300);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
      setSeeding(false);
    }
  };

  if (redirecting) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/25">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400">Sign in with admin credentials</p>
        </div>

        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {seeding && (
            <div className="mb-4 p-3 rounded-xl bg-amber-900/20 border border-amber-800 text-amber-400 text-sm flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Setting up database...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="sreja174@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-600 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || redirecting}
              className="w-full bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white py-3 text-base font-semibold rounded-xl shadow-lg shadow-amber-500/25 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
