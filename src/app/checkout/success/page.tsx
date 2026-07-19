"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Zap, Clock } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Payment Received!</h1>
        <p className="text-slate-400 mb-6">
          Your payment is being processed. Your subscription will be activated once the blockchain confirms the transaction.
        </p>
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
            <Clock className="h-4 w-4 text-amber-400" />
            <span>Waiting for blockchain confirmation...</span>
          </div>
          {orderId && <p className="text-xs text-slate-500 mt-2">Order: {orderId}</p>}
        </div>
        <div className="flex gap-3">
          <a href="/" className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors text-center">
            Go Home
          </a>
          <a href="/admin" className="flex-1 px-4 py-3 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
            Dashboard <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <SuccessContent />
    </React.Suspense>
  );
}
