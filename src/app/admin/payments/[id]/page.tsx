"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, CreditCard, AlertCircle, RotateCcw, Clock, CheckCircle,
  XCircle, DollarSign, User, Calendar, Hash, FileText, Ban,
} from "lucide-react";

interface Payment {
  id: string; amount: number; currency: string; status: string; method: string;
  failureReason: string | null; refundAmount: number; refundReason: string | null;
  refundedAt: string | null; refundedBy: string | null; metadata: string;
  stripePaymentIntentId: string | null; stripeInvoiceId: string | null;
  createdAt: string; updatedAt: string;
  user: { id: string; name: string | null; email: string; avatarUrl: string | null; role: string };
  subscription: { id: string; status: string; billingCycle: string; currentPeriodEnd: string | null;
    plan: { name: string; tier: string; priceMonthly: number; priceYearly: number } } | null;
}

const methodLabels: Record<string, string> = {
  CARD: "Credit Card", CRYPTO: "Crypto", PAYPAL: "PayPal", BANK_TRANSFER: "Bank Transfer",
};

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [payment, setPayment] = React.useState<Payment | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [showRefundModal, setShowRefundModal] = React.useState(false);
  const [refundAmount, setRefundAmount] = React.useState("");
  const [refundReason, setRefundReason] = React.useState("");
  const [processing, setProcessing] = React.useState(false);

  const fetchPayment = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) { window.location.replace("/admin/login"); return; }
    try {
      const res = await fetch(`/api/admin/payments/${params.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setPayment(data.payment);
      setLoading(false);
    } catch (err: any) { setError(err.message); setLoading(false); }
  }, [params.id]);

  React.useEffect(() => { fetchPayment(); }, [fetchPayment]);

  const handleRefund = async () => {
    if (!payment || !refundAmount) return;
    setProcessing(true);
    const token = localStorage.getItem("sp_admin_token");
    const res = await fetch(`/api/admin/payments/${payment.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "refund", amount: Math.round(parseFloat(refundAmount) * 100), reason: refundReason }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error); setProcessing(false); return; }
    setShowRefundModal(false); setRefundAmount(""); setRefundReason("");
    fetchPayment(); setProcessing(false);
  };

  const handleRetry = async () => {
    if (!payment) return;
    const token = localStorage.getItem("sp_admin_token");
    await fetch(`/api/admin/payments/${payment.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "retry" }),
    });
    fetchPayment();
  };

  const formatAmount = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "PENDING": return "bg-yellow-500/10 text-yellow-400";
      case "SUCCEEDED": return "bg-green-500/10 text-green-400";
      case "FAILED": return "bg-red-500/10 text-red-400";
      case "REFUNDED": return "bg-purple-500/10 text-purple-400";
      case "PARTIALLY_REFUNDED": return "bg-blue-500/10 text-blue-400";
      default: return "bg-slate-700 text-slate-300";
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !payment) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <AlertCircle className="h-10 w-10 text-red-500" />
      <p className="text-sm text-red-400">{error || "Payment not found"}</p>
      <button onClick={() => router.back()} className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm">Go Back</button>
    </div>
  );

  const maxRefund = payment.amount - payment.refundAmount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Payment #{payment.id.slice(-8)}</h1>
          <p className="text-sm text-slate-400">{formatDate(payment.createdAt)}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${statusColor(payment.status)}`}>
          {payment.status.replace("_", " ")}
        </span>
        {payment.status === "FAILED" && (
          <button onClick={handleRetry}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors">
            <RotateCcw className="h-4 w-4 inline mr-1" /> Retry
          </button>
        )}
        {(payment.status === "SUCCEEDED" || payment.status === "PARTIALLY_REFUNDED") && maxRefund > 0 && (
          <button onClick={() => { setShowRefundModal(true); setRefundAmount((maxRefund / 100).toFixed(2)); }}
            className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-500 text-sm font-medium hover:bg-purple-500/20 transition-colors">
            <RotateCcw className="h-4 w-4 inline mr-1" /> Refund
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Payment Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-slate-500">Amount</p><p className="text-xl font-bold text-white">{formatAmount(payment.amount)}</p></div>
              <div><p className="text-xs text-slate-500">Currency</p><p className="text-sm text-white uppercase">{payment.currency}</p></div>
              <div><p className="text-xs text-slate-500">Method</p><p className="text-sm text-white">{methodLabels[payment.method] ?? payment.method}</p></div>
              <div><p className="text-xs text-slate-500">Status</p><span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColor(payment.status)}`}>{payment.status.replace("_", " ")}</span></div>
              {payment.stripePaymentIntentId && <div><p className="text-xs text-slate-500">Stripe Payment ID</p><p className="text-sm text-white font-mono truncate">{payment.stripePaymentIntentId}</p></div>}
              {payment.stripeInvoiceId && <div><p className="text-xs text-slate-500">Stripe Invoice ID</p><p className="text-sm text-white font-mono truncate">{payment.stripeInvoiceId}</p></div>}
            </div>
            {payment.failureReason && (
              <div className="mt-4 p-3 rounded-xl bg-red-900/20 border border-red-800">
                <p className="text-xs text-red-400 font-medium mb-1">Failure Reason</p>
                <p className="text-sm text-red-300">{payment.failureReason}</p>
              </div>
            )}
          </div>

          {/* Refund History */}
          {payment.refundAmount > 0 && (
            <div className="bg-slate-800/50 rounded-2xl border border-purple-500/20 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Refund Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-500">Refunded Amount</p><p className="text-lg font-bold text-purple-400">{formatAmount(payment.refundAmount)}</p></div>
                <div><p className="text-xs text-slate-500">Refunded At</p><p className="text-sm text-white">{formatDate(payment.refundedAt)}</p></div>
                {payment.refundReason && <div className="col-span-2"><p className="text-xs text-slate-500">Reason</p><p className="text-sm text-white">{payment.refundReason}</p></div>}
              </div>
              <div className="mt-4 p-3 rounded-xl bg-slate-900/50 border border-slate-700">
                <p className="text-xs text-slate-500">Remaining Refundable</p>
                <p className="text-lg font-bold text-white">{formatAmount(maxRefund)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
            <h2 className="text-sm font-medium text-slate-400 mb-4">Customer</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                {(payment.user.name ?? payment.user.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{payment.user.name ?? "No Name"}</p>
                <p className="text-xs text-slate-400">{payment.user.email}</p>
              </div>
            </div>
            <button onClick={() => router.push(`/admin/customers/${payment.user.id}`)}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800 transition-colors text-center">
              View Customer Profile
            </button>
          </div>

          {/* Subscription */}
          {payment.subscription && (
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
              <h2 className="text-sm font-medium text-slate-400 mb-4">Subscription</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm text-slate-400">Plan</span><span className="text-sm text-white font-medium">{payment.subscription.plan.name}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-slate-400">Cycle</span><span className="text-sm text-white">{payment.subscription.billingCycle}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-slate-400">Status</span><span className={`px-2 py-0.5 rounded text-xs ${payment.subscription.status === "ACTIVE" ? "bg-green-500/10 text-green-400" : "bg-slate-700 text-slate-300"}`}>{payment.subscription.status}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-slate-400">Price</span><span className="text-sm text-white">{formatAmount(payment.subscription.plan.priceMonthly)}/mo</span></div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
            <h2 className="text-sm font-medium text-slate-400 mb-4">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-slate-500 mt-1.5 flex-shrink-0" />
                <div><p className="text-white">Payment created</p><p className="text-xs text-slate-500">{formatDate(payment.createdAt)}</p></div>
              </div>
              {payment.status === "SUCCEEDED" && (
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  <div><p className="text-white">Payment succeeded</p></div>
                </div>
              )}
              {payment.status === "FAILED" && (
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <div><p className="text-white">Payment failed</p><p className="text-xs text-slate-500">{payment.failureReason}</p></div>
                </div>
              )}
              {payment.refundedAt && (
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                  <div><p className="text-white">Refund processed: {formatAmount(payment.refundAmount)}</p><p className="text-xs text-slate-500">{formatDate(payment.refundedAt)}</p></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowRefundModal(false)}>
          <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-white mb-4">Process Refund</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Refund Amount (max: {formatAmount(maxRefund)})</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" step="0.01" min="0.01" max={(maxRefund / 100).toFixed(2)}
                    value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Reason</label>
                <textarea value={refundReason} onChange={(e) => setRefundReason(e.target.value)} rows={3}
                  placeholder="Reason for refund..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={handleRefund} disabled={!refundAmount || parseFloat(refundAmount) <= 0 || processing}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 disabled:opacity-50 transition-colors">
                  {processing ? "Processing..." : `Refund ${refundAmount ? formatAmount(Math.round(parseFloat(refundAmount) * 100)) : ""}`}
                </button>
                <button onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm hover:bg-slate-800 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
