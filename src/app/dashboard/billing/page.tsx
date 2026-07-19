"use client";

import { useEffect, useState } from "react";
import { CreditCard, Check, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

const API = "https://smtools.online/api";

const plans = [
  { id: "FREE", name: "Free", price: "$0", period: "forever", features: ["5 posts/month", "1 account", "Basic scheduling", "Email support"], color: "border-slate-200" },
  { id: "SILVER", name: "Silver", price: "$9", period: "/month", features: ["50 posts/month", "3 accounts", "Advanced scheduling", "Priority support", "Analytics"], color: "border-slate-300", popular: false },
  { id: "VIP_PRO", name: "VIP Pro", price: "$29", period: "/month", features: ["Unlimited posts", "10 accounts", "AI captions", "Smart queue", "24/7 support", "API access"], color: "border-amber-400", popular: true },
  { id: "ENTERPRISE", name: "Enterprise", price: "$99", period: "/month", features: ["Everything in VIP Pro", "Unlimited accounts", "Custom integrations", "Dedicated support", "SLA guarantee", "White label"], color: "border-purple-400" },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState("FREE");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sub = localStorage.getItem("sp_subscription");
    if (sub) {
      try { setCurrentPlan(JSON.parse(sub).plan || "FREE"); } catch {}
    }
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Billing & Subscription</h2>
        <p className="text-sm text-slate-500">Manage your plan and payments</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-amber-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard size={20} />
          <span className="text-sm font-medium opacity-90">Current Plan</span>
        </div>
        <div className="text-2xl font-bold">{plans.find(p => p.id === currentPlan)?.name || "Free"}</div>
        <div className="text-sm opacity-80 mt-1">
          {currentPlan === "FREE" ? "Upgrade to unlock more features" : "Your plan is active"}
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-xl border-2 p-5 relative transition-shadow hover:shadow-md ${
              currentPlan === plan.id ? "border-amber-400 shadow-md" : plan.color
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-amber-500 to-pink-500 text-white text-[10px] font-bold rounded-full uppercase">
                Most Popular
              </div>
            )}
            {currentPlan === plan.id && (
              <div className="absolute top-3 right-3 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                Current
              </div>
            )}
            <div className="text-base font-bold text-slate-900">{plan.name}</div>
            <div className="flex items-baseline gap-0.5 mt-2">
              <span className="text-2xl font-bold text-slate-900">{plan.price}</span>
              <span className="text-sm text-slate-500">{plan.period}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check size={14} className="text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/checkout?plan=${plan.id}`}
              className={`mt-5 block text-center py-2.5 rounded-lg text-sm font-semibold transition-all ${
                currentPlan === plan.id
                  ? "bg-slate-100 text-slate-400 cursor-default"
                  : plan.popular
                  ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:opacity-90"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {currentPlan === plan.id ? "Active" : "Upgrade"}
            </Link>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Payment Methods</h3>
        <p className="text-sm text-slate-500 mb-4">We accept cryptocurrency payments via NOWPayments.</p>
        <Link
          href="/checkout"
          className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700"
        >
          Add Payment Method <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
