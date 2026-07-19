"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard, Zap, Shield, Clock, CheckCircle, ExternalLink, RefreshCw, X } from "lucide-react";

const plans = [
  { id: "SILVER", name: "Silver", monthly: 3, yearly: 30, features: ["3 Platforms", "5 Accounts/Platform", "50 Scheduled Posts", "Basic Analytics"] },
  { id: "VIP_PRO", name: "VIP Pro", monthly: 10, yearly: 100, features: ["5 Platforms", "10 Accounts/Platform", "500 Scheduled Posts", "Advanced Analytics", "AI Captions", "Priority Support"] },
  { id: "ENTERPRISE", name: "Enterprise", monthly: 99, yearly: 990, features: ["Unlimited Platforms", "Unlimited Accounts", "Unlimited Posts", "Full Analytics Suite", "AI Suite", "White Label", "Dedicated Support"] },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") || "VIP_PRO";
  const initialCycle = searchParams.get("cycle") || "monthly";

  const [selectedPlan, setSelectedPlan] = React.useState(initialPlan);
  const [cycle, setCycle] = React.useState(initialCycle);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const currentPlan = plans.find((p) => p.id === selectedPlan) || plans[1];
  const price = cycle === "yearly" ? currentPlan.yearly : currentPlan.monthly;
  const yearlySavings = currentPlan.monthly * 12 - currentPlan.yearly;

  const handleCryptoCheckout = async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("sp_token");
      if (!token) { window.location.href = "/signin?redirect=/checkout"; return; }

      const res = await fetch("/api/billing/nowpayments/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, cycle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Redirect to NOWPayments hosted checkout
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch (err: any) {
      setError(err.message || "Checkout failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">SocialPilot</span>
          </div>
          <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Back to Home</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h1>
          <p className="text-slate-400">Pay with crypto via NOWPayments.io</p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button onClick={() => setCycle("monthly")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${cycle === "monthly" ? "bg-amber-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
            Monthly
          </button>
          <button onClick={() => setCycle("yearly")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${cycle === "yearly" ? "bg-amber-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
            Yearly
            {cycle === "yearly" && <span className="px-1.5 py-0.5 rounded bg-green-500 text-[10px] font-bold">SAVE</span>}
          </button>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const planPrice = cycle === "yearly" ? plan.yearly : plan.monthly;
            return (
              <div key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected ? "border-amber-500 bg-slate-800/80" : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                }`}>
                {plan.id === "VIP_PRO" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">MOST POPULAR</div>
                )}
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-white">${planPrice}</span>
                  <span className="text-sm text-slate-400">/{cycle === "yearly" ? "year" : "mo"}</span>
                </div>
                {cycle === "yearly" && yearlySavings > 0 && (
                  <p className="text-xs text-green-400 mb-4">Save ${yearlySavings}/year</p>
                )}
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Payment Method */}
        <div className="max-w-lg mx-auto">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Payment Method</h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm">{error}</div>
            )}

            <button onClick={handleCryptoCheckout} disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all text-lg">
              {loading ? (
                <><RefreshCw className="h-5 w-5 animate-spin" /> Processing...</>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Pay ${price} with Crypto
                </>
              )}
            </button>

            <p className="text-xs text-slate-500 text-center mt-4">
              Powered by NOWPayments.io. Supports BTC, ETH, USDT, USDC, and 100+ cryptocurrencies.
            </p>

            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Secure</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Instant</span>
              <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> No KYC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <CheckoutContent />
    </React.Suspense>
  );
}
