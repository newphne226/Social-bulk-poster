"use client";

import { useEffect, useState } from "react";
import { CreditCard, Check, Zap, Camera, Film, Crown, Shield, ArrowRight } from "lucide-react";

const API = "https://smtools.online/api";

const plans = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    icon: Shield,
    color: "from-slate-400 to-slate-500",
    borderColor: "border-slate-200",
    activeColor: "border-slate-400",
    features: [
      "1 connected account",
      "View dashboard",
      "Community support",
    ],
  },
  {
    id: "BASIC",
    name: "Basic",
    price: 3,
    icon: Camera,
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-300",
    activeColor: "border-blue-500",
    features: [
      "Content post scheduling",
      "Photo uploads",
      "3 connected accounts",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    id: "SILVER",
    name: "Silver",
    price: 5,
    icon: Film,
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-300",
    activeColor: "border-purple-500",
    popular: true,
    features: [
      "Reels upload & scheduling",
      "Video uploads",
      "5 connected accounts",
      "Advanced analytics",
      "Priority support",
      "AI captions",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    price: 10,
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    borderColor: "border-amber-300",
    activeColor: "border-amber-500",
    features: [
      "Everything in Content + Reels",
      "Unlimited posts",
      "Unlimited accounts",
      "AI hashtags & captions",
      "Smart queue & scheduling",
      "24/7 priority support",
      "API access",
    ],
  },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState("FREE");
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem("sp_user");
      if (u) setUser(JSON.parse(u));
      const sub = localStorage.getItem("sp_subscription");
      if (sub) setCurrentPlan(JSON.parse(sub).plan || "FREE");
    } catch {}
    setLoading(false);
  }, []);

  const handleSubscribe = async (planId: string) => {
    const token = localStorage.getItem("sp_token");
    if (!token) {
      window.location.href = "/signin";
      return;
    }
    setPurchasing(planId);
    try {
      const res = await fetch(`${API}/billing/nowpayments/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: planId, cycle: "monthly" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch (err: any) {
      alert(err.message || "Failed to start checkout");
      setPurchasing(null);
    }
  };

  const activePlan = plans.find((p) => p.id === currentPlan);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Subscription Plans</h2>
        <p className="text-sm text-slate-500">Choose a plan that fits your needs. Pay with crypto.</p>
      </div>

      {/* Current Plan Banner */}
      <div className={`bg-gradient-to-r ${activePlan?.color || "from-slate-400 to-slate-500"} rounded-xl px-5 py-3 text-white flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <CreditCard size={18} />
          <span className="text-sm font-semibold">
            Current: {activePlan ? activePlan.name : "Free"} {activePlan && activePlan.price > 0 && `— $${activePlan.price}/mo`}
          </span>
        </div>
        <span className="text-xs opacity-80">{activePlan ? "Active" : "No subscription"}</span>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isActive = currentPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border-2 p-4 relative transition-all hover:shadow-lg ${
                isActive ? `${plan.activeColor} shadow-lg` : plan.borderColor
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[11px] font-bold rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              {isActive && (
                <div className="absolute top-4 right-4 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                  Active
                </div>
              )}

              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3`}>
                <Icon size={20} className="text-white" />
              </div>

              <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>

              <div className="flex items-baseline gap-1 mt-1 mb-3">
                <span className="text-2xl font-bold text-slate-900">${plan.price}</span>
                <span className="text-xs text-slate-500">/mo</span>
              </div>

              <ul className="space-y-2 mb-4">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <Check size={12} className="text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  if (plan.id === "FREE") return;
                  handleSubscribe(plan.id);
                }}
                disabled={isActive || purchasing === plan.id || plan.id === "FREE"}
                className={`w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  isActive || plan.id === "FREE"
                    ? "bg-slate-100 text-slate-400 cursor-default"
                    : plan.popular
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                    : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90`
                }`}
              >
                {plan.id === "FREE" ? (
                  "Free Forever"
                ) : isActive ? (
                  <>
                    <Shield size={14} /> Active
                  </>
                ) : purchasing === plan.id ? (
                  <>
                    <Zap size={14} className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Zap size={14} /> Subscribe Now
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-base font-semibold text-slate-900 mb-3">Crypto Payments</h3>
        <p className="text-sm text-slate-500">
          Payments are processed securely via <strong>NOWPayments.io</strong>. You can pay with BTC, ETH, USDT,
          LTC, DOGE, and 150+ other cryptocurrencies. After payment confirmation, your plan activates instantly.
        </p>
      </div>
    </div>
  );
}
