"use client";

import { useEffect, useState } from "react";
import { CreditCard, Check, Zap, Camera, Film, Crown, Shield, Clock, AlertCircle } from "lucide-react";

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
      "Everything in Basic + Silver",
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
  const [subStatus, setSubStatus] = useState("ACTIVE");
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      const token = localStorage.getItem("sp_token");
      if (!token) { setLoading(false); return; }

      try {
        const res = await fetch(`${API}/subscription`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.subscription) {
          const sub = data.subscription;
          setCurrentPlan(sub.plan || "FREE");
          setSubStatus(sub.status || "ACTIVE");
          setPeriodEnd(sub.currentPeriodEnd);

          if (sub.status === "PENDING_APPROVAL") {
            setPendingPlan(sub.plan);
          }
        }
      } catch {}
      setLoading(false);
    };

    fetchSubscription();
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

      {/* Pending Approval Banner */}
      {subStatus === "PENDING_APPROVAL" && pendingPlan && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Your {pendingPlan} subscription is pending admin approval
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              You submitted a subscription request. An admin will review and approve it shortly.
              You&apos;ll have access to all {pendingPlan} features once approved.
            </p>
          </div>
        </div>
      )}

      {/* Current Plan Banner */}
      <div className={`bg-gradient-to-r ${activePlan?.color || "from-slate-400 to-slate-500"} rounded-xl px-5 py-3 text-white flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <CreditCard size={18} />
          <span className="text-sm font-semibold">
            Current: {activePlan ? activePlan.name : "Free"} {activePlan && activePlan.price > 0 && `— $${activePlan.price}/mo`}
          </span>
        </div>
        <div className="text-right">
          {subStatus === "PENDING_APPROVAL" ? (
            <span className="text-xs bg-amber-500/30 px-2 py-0.5 rounded-full">Pending Approval</span>
          ) : subStatus === "ACTIVE" && currentPlan !== "FREE" ? (
            <span className="text-xs opacity-80">Active</span>
          ) : (
            <span className="text-xs opacity-80">No subscription</span>
          )}
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isActive = currentPlan === plan.id && subStatus === "ACTIVE";
          const isPending = subStatus === "PENDING_APPROVAL" && pendingPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border-2 p-4 relative transition-all hover:shadow-lg ${
                isActive ? `${plan.activeColor} shadow-lg` : isPending ? "border-amber-300 shadow-md" : plan.borderColor
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
              {isPending && (
                <div className="absolute top-4 right-4 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Pending
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
                disabled={isActive || isPending || purchasing === plan.id || plan.id === "FREE"}
                className={`w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  isActive || plan.id === "FREE"
                    ? "bg-slate-100 text-slate-400 cursor-default"
                    : isPending
                    ? "bg-amber-100 text-amber-600 cursor-default"
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
                ) : isPending ? (
                  <>
                    <Clock size={14} /> Pending Approval
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
        <h3 className="text-base font-semibold text-slate-900 mb-3">How It Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">1</span>
            <div>
              <p className="font-medium text-slate-900">Choose & Pay</p>
              <p className="text-xs text-slate-500">Select a plan and pay with crypto via NOWPayments</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <div>
              <p className="font-medium text-slate-900">Admin Review</p>
              <p className="text-xs text-slate-500">An admin reviews and approves your subscription</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0">3</span>
            <div>
              <p className="font-medium text-slate-900">Access Granted</p>
              <p className="text-xs text-slate-500">Your plan activates and all features unlock</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
