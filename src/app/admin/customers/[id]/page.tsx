"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Shield,
  Ban,
  CheckCircle,
  FileText,
  CreditCard,
  MessageSquare,
  AlertCircle,
  Clock,
  Package,
  Plus,
  Trash2,
  Send,
  Globe,
  Link2,
} from "lucide-react";

interface Customer {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: string;
  status: string;
  bannedAt: string | null;
  suspendedAt: string | null;
  suspendedReason: string | null;
  plan: string;
  planName: string;
  billingCycle: string | null;
  currentPeriodEnd: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  counts: { posts: number; accounts: number; payments: number; tickets: number };
  accounts: { id: string; platform: string; displayName: string; isConnected: boolean; createdAt: string }[];
  recentPosts: { id: string; caption: string; platform: string; status: string; createdAt: string }[];
  recentPayments: { id: string; amount: number; status: string; method: string; createdAt: string }[];
  recentTickets: { id: string; subject: string; status: string; priority: string; createdAt: string }[];
  notes: { id: string; body: string; adminName: string; createdAt: string }[];
}

const platformColors: Record<string, string> = {
  facebook: "bg-blue-500/10 text-blue-500",
  instagram: "bg-pink-500/10 text-pink-500",
  x: "bg-slate-500/10 text-slate-300",
  linkedin: "bg-blue-600/10 text-blue-400",
  pinterest: "bg-red-500/10 text-red-500",
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [newNote, setNewNote] = React.useState("");
  const [addingNote, setAddingNote] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("profile");

  const fetchCustomer = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) { window.location.replace("/admin/login"); return; }

    try {
      const res = await fetch(`/api/admin/customers/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setCustomer(data.customer);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [params.id]);

  React.useEffect(() => { fetchCustomer(); }, [fetchCustomer]);

  const handleBlock = async () => {
    if (!customer) return;
    const action = customer.status === "BANNED" ? "unblock" : "block";
    if (!confirm(action === "block" ? "Block this customer?" : "Unblock this customer?")) return;

    const token = localStorage.getItem("sp_admin_token");
    await fetch(`/api/admin/customers/${customer.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    fetchCustomer();
  };

  const handleAddNote = async () => {
    if (!customer || !newNote.trim()) return;
    setAddingNote(true);
    const token = localStorage.getItem("sp_admin_token");
    await fetch(`/api/admin/customers/${customer.id}/notes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ note: newNote }),
    });
    setNewNote("");
    setAddingNote(false);
    fetchCustomer();
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!customer || !confirm("Delete this note?")) return;
    const token = localStorage.getItem("sp_admin_token");
    await fetch(`/api/admin/customers/${customer.id}/notes?noteId=${noteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCustomer();
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm text-red-400">{error || "Customer not found"}</p>
        <button onClick={() => router.back()} className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm">Go Back</button>
      </div>
    );
  }

  const sections = [
    { key: "profile", label: "Profile", icon: User },
    { key: "orders", label: "Order History", icon: Package },
    { key: "accounts", label: "Accounts", icon: Globe },
    { key: "payments", label: "Payments", icon: CreditCard },
    { key: "notes", label: "Notes", icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{customer.name ?? customer.email}</h1>
          <p className="text-sm text-slate-400">{customer.email}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
          customer.status === "ACTIVE" ? "bg-green-500/10 text-green-500" :
          customer.status === "SUSPENDED" ? "bg-yellow-500/10 text-yellow-500" :
          "bg-red-500/10 text-red-500"
        }`}>{customer.status}</span>
        <button onClick={handleBlock}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            customer.status === "BANNED"
              ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
              : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
          }`}>
          {customer.status === "BANNED" ? <><CheckCircle className="h-4 w-4 inline mr-1" /> Unblock</> : <><Ban className="h-4 w-4 inline mr-1" /> Block</>}
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button key={s.key} onClick={() => setActiveSection(s.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeSection === s.key
                ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:text-white"
            }`}>
            <s.icon className="h-3.5 w-3.5" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Profile Section */}
      {activeSection === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Customer Profile</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-500">Name</p><p className="text-sm text-white">{customer.name ?? "—"}</p></div>
                <div><p className="text-xs text-slate-500">Email</p><p className="text-sm text-white">{customer.email}</p></div>
                <div><p className="text-xs text-slate-500">Role</p><p className="text-sm text-white">{customer.role}</p></div>
                <div><p className="text-xs text-slate-500">Status</p><p className="text-sm text-white">{customer.status}</p></div>
                <div><p className="text-xs text-slate-500">Plan</p><p className="text-sm text-white">{customer.planName}</p></div>
                <div><p className="text-xs text-slate-500">Billing</p><p className="text-sm text-white">{customer.billingCycle ?? "—"}</p></div>
                <div><p className="text-xs text-slate-500">Joined</p><p className="text-sm text-white">{formatDate(customer.createdAt)}</p></div>
                <div><p className="text-xs text-slate-500">Last Login</p><p className="text-sm text-white">{formatDate(customer.lastLoginAt)}</p></div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
              <h2 className="text-sm font-medium text-slate-400 mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm text-slate-400">Posts</span><span className="text-sm text-white font-medium">{customer.counts.posts}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-slate-400">Accounts</span><span className="text-sm text-white font-medium">{customer.counts.accounts}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-slate-400">Payments</span><span className="text-sm text-white font-medium">{customer.counts.payments}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-slate-400">Tickets</span><span className="text-sm text-white font-medium">{customer.counts.tickets}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order History */}
      {activeSection === "orders" && (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-slate-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-700">
                {customer.recentPosts.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No orders yet</td></tr>
                ) : customer.recentPosts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/50 cursor-pointer" onClick={() => router.push(`/admin/orders/${p.id}`)}>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">#{p.id.slice(-8)}</td>
                    <td className="px-6 py-4 text-sm text-white truncate max-w-xs">{p.caption}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${platformColors[p.platform] ?? ""}`}>{p.platform}</span></td>
                    <td className="px-6 py-4 text-sm text-slate-300">{p.status}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Accounts */}
      {activeSection === "accounts" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customer.accounts.length === 0 ? (
            <p className="text-slate-400 text-sm col-span-full text-center py-8">No connected accounts</p>
          ) : customer.accounts.map((a) => (
            <div key={a.id} className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${platformColors[a.platform] ?? ""}`}>{a.platform}</span>
                <span className={`w-2 h-2 rounded-full ${a.isConnected ? "bg-green-500" : "bg-red-500"}`} />
              </div>
              <p className="text-sm text-white mt-2">{a.displayName}</p>
              <p className="text-xs text-slate-500 mt-1">Connected {formatDate(a.createdAt)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Payments */}
      {activeSection === "payments" && (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-slate-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-700">
                {customer.recentPayments.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">No payments yet</td></tr>
                ) : customer.recentPayments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 text-sm text-white">${(p.amount / 100).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{p.method}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-medium ${p.status === "SUCCEEDED" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>{p.status}</span></td>
                    <td className="px-6 py-4 text-sm text-slate-400">{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes */}
      {activeSection === "notes" && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
            <div className="flex gap-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note about this customer..."
                rows={3}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
              <button onClick={handleAddNote} disabled={!newNote.trim() || addingNote}
                className="self-end px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors">
                {addingNote ? "Adding..." : <><Plus className="h-4 w-4 inline mr-1" /> Add</>}
              </button>
            </div>
          </div>
          {customer.notes.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No notes yet</p>
          ) : customer.notes.map((n) => (
            <div key={n.id} className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
              <div className="flex items-start justify-between">
                <p className="text-sm text-white whitespace-pre-wrap flex-1">{n.body}</p>
                <button onClick={() => handleDeleteNote(n.id)} className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-3 flex-shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-slate-500">by {n.adminName}</span>
                <span className="text-xs text-slate-600">•</span>
                <span className="text-xs text-slate-500">{formatDate(n.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
