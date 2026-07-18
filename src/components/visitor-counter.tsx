"use client";

import * as React from "react";
import { Eye, Users } from "lucide-react";

export function VisitorCounter() {
  const [visitors, setVisitors] = React.useState(487);
  const [todayVisitors, setTodayVisitors] = React.useState(5234);

  React.useEffect(() => {
    // Live visitors: 300-700, changes every 10s
    const visitorInterval = setInterval(() => {
      setVisitors((prev) => {
        const change = Math.floor(Math.random() * 30) - 15;
        const next = prev + change;
        if (next < 300) return 300 + Math.floor(Math.random() * 20);
        if (next > 700) return 700 - Math.floor(Math.random() * 20);
        return next;
      });
    }, 10000);

    // Today visitors: 2000-8000, changes every 30s
    const todayInterval = setInterval(() => {
      setTodayVisitors((prev) => {
        const change = Math.floor(Math.random() * 200) - 100;
        const next = prev + change;
        if (next < 2000) return 2000 + Math.floor(Math.random() * 200);
        if (next > 8000) return 8000 - Math.floor(Math.random() * 200);
        return next;
      });
    }, 30000);

    return () => {
      clearInterval(visitorInterval);
      clearInterval(todayInterval);
    };
  }, []);

  return (
    <div className="hidden sm:flex items-center gap-3 ml-3 pl-3 border-l border-slate-300 dark:border-slate-600">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <Eye className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          {visitors.toLocaleString()} watching
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          {todayVisitors.toLocaleString()} today
        </span>
      </div>
    </div>
  );
}
