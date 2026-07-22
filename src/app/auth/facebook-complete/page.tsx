"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function FacebookCompleteContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    const source = searchParams.get("source");

    if (error) {
      return;
    }

    if (token) {
      localStorage.setItem("sp_token", token);

      const user = {
        id: searchParams.get("userId") || "",
        name: searchParams.get("name") || "",
        email: searchParams.get("email") || "",
        avatarUrl: searchParams.get("avatarUrl") || "",
        role: searchParams.get("role") || "USER",
        plan: searchParams.get("plan") || "FREE",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("sp_user", JSON.stringify(user));

      if (source === "extension") {
        document.title = `FB_LOGIN_TOKEN:${token}`;
        try {
          window.postMessage({ type: "FB_LOGIN_COMPLETE", token, user }, "*");
        } catch {}
      } else {
        const role = user.role;
        window.location.href = (role === "ADMIN" || role === "OWNER") ? "/admin" : "/dashboard";
      }
    }
  }, [searchParams]);

  const token = searchParams.get("token");
  const error = searchParams.get("error");
  const source = searchParams.get("source");

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Facebook Login Failed</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <a href="/signin" className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors">
            Back to Sign In
          </a>
        </div>
      </div>
    );
  }

  if (token) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {source === "extension"
              ? "Login successful! You can close this tab and return to the extension."
              : "Redirecting to dashboard..."}
          </p>
          {source === "extension" && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Click the extension icon to start using SMTools.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400">Completing Facebook login...</p>
      </div>
    </div>
  );
}

export default function FacebookCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <FacebookCompleteContent />
    </Suspense>
  );
}
