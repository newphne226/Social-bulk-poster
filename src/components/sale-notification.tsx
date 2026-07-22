"use client";

import { useEffect, useState, useRef } from "react";
import { ShoppingBag, X } from "lucide-react";

const NAMES = [
  "James from New York",
  "Sarah from London",
  "Ahmed from Dubai",
  "Maria from Toronto",
  "Chen from Singapore",
  "Priya from Mumbai",
  "David from Sydney",
  "Fatima from Berlin",
  "Carlos from Madrid",
  "Yuki from Tokyo",
  "Oliver from Paris",
  "Aisha from Lagos",
  "Michael from Chicago",
  "Emma from Melbourne",
  "Raj from Bangalore",
  "Sofia from Rome",
  "Liam from Dublin",
  "Noor from Abu Dhabi",
  "Anna from Stockholm",
  "Kofi from Accra",
  "Daniel from Amsterdam",
  "Leila from Beirut",
  "Tom from Seattle",
  "Grace from Nairobi",
  "Hiroshi from Osaka",
];

const PLANS = [
  { name: "Basic", color: "from-blue-500 to-cyan-500" },
  { name: "Silver", color: "from-purple-500 to-pink-500" },
  { name: "Pro", color: "from-amber-500 to-orange-500" },
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SaleNotification() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [plan, setPlan] = useState(PLANS[0]);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function trigger() {
      setName(randomFrom(NAMES));
      setPlan(randomFrom(PLANS));
      setShow(true);
      setVisible(false);
      requestAnimationFrame(() => setVisible(true));
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => setShow(false), 400);
      }, 5000);
    }

    function scheduleNext() {
      const delay = (1 + Math.random() * 4) * 60 * 1000;
      intervalRef.current = setTimeout(() => {
        trigger();
        scheduleNext();
      }, delay);
    }

    const initialDelay = setTimeout(() => {
      trigger();
      scheduleNext();
    }, (1 + Math.random() * 3) * 60 * 1000);

    return () => {
      clearTimeout(initialDelay);
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-[9999]"
      style={{
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl shadow-2xl px-4 py-3 max-w-xs">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shrink-0`}>
          <ShoppingBag size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-800 truncate">{name}</p>
          <p className="text-[11px] text-slate-500">
            just subscribed to{" "}
            <span className="font-bold text-amber-600">{plan.name}</span>
          </p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(() => setShow(false), 400);
          }}
          className="text-slate-300 hover:text-slate-500 shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
