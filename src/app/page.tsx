"use client";

import * as React from "react";
import { AppShell, type AppView } from "@/components/app-shell";
import { PublicSite } from "@/components/public-site";
import { UserDashboard } from "@/components/user-dashboard";
import { AdminDashboard } from "@/components/admin-dashboard";
import { ExtensionPreview } from "@/components/extension-preview";

export default function Home() {
  const [view, setView] = React.useState<AppView>("public");

  return (
    <AppShell view={view} onViewChange={setView}>
      {view === "public" && <PublicSite onNavigateToDashboard={() => setView("dashboard")} />}
      {view === "dashboard" && <UserDashboard />}
      {view === "admin" && <AdminDashboard />}
      {view === "extension" && <ExtensionPreview />}
    </AppShell>
  );
}
