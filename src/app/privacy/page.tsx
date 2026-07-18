"use client";

import * as React from "react";
import { Shield, FileText, Clock, Mail, Lock, Globe, User, Database, Trash2, ArrowLeft, CheckCircle, ChevronDown, ChevronRight, ArrowRight, MessageCircle, Cookie, Eye, EyeOff, Database as DatabaseIcon, Cpu, Share2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  const lastUpdated = "January 15, 2024";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 text-white shadow-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2-2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-semibold text-lg text-slate-900 dark:text-white">SocialPilot</span>
            </a>
            <a href="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              ← Back to Home
            </a>
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-6 inline-flex">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-medium">Updated: January 15, 2024</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 text-slate-600 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Effective: January 15, 2024</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Questions? privacy@socialpilot.io</span>
              </p>
            </div>
          </header>

          {/* Table of Contents */}
          <nav className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-12 sticky top-24">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Table of Contents</h3>
            <ul className="space-y-2">
              {[
                "1. Information We Collect",
                "2. How We Use Your Information",
                "3. Data Sharing & Disclosure",
                "4. Data Security",
                "5. Your Rights & Choices",
                "6. Data Retention",
                "7. International Transfers",
                "8. Children's Privacy",
                "9. Changes to This Policy",
                "10. Contact Us",
              ].map((item, i) => (
                <li key={i}>
                  <a href={`#section-${i+1}`} className="block text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-1 text-sm" onClick={(e) => { e.preventDefault(); document.getElementById(`section-${i+1}`)?.scrollIntoView({ behavior: 'smooth' }); }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sections */}
          <section id="section-1" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">1</span>
              </span>
              Information We Collect
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We collect information you provide directly to us, information we collect automatically when you use our services, and information from third parties.
            </p>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Information You Provide</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 mb-6">
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Account information: name, email, password, profile picture</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Payment information: billing address, payment method (processed by Stripe)</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Content you create: posts, captions, hashtags, media uploads</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Communications: support tickets, emails, chat messages</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Information We Collect Automatically</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 mb-6">
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Usage data: features used, clicks, time spent, errors</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Device information: browser, OS, device type, screen resolution</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Log data: IP address, access times, referral URLs</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Cookies &amp; similar technologies (see Cookie Policy)</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Third-Party Sources</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              When you connect social accounts (Facebook, Instagram, X, LinkedIn, Pinterest), we receive:
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 mb-6">
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Profile info: name, username, profile picture, bio</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Account metrics: follower count, engagement rates</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Access tokens (encrypted, used only for posting on your behalf)</li>
            </ul>
          </section>

          <section id="section-2" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">2</span>
              </span>
              How We Use Your Information
            </h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> Provide, maintain, and improve our services</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Process transactions and send receipts</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Send service-related communications (updates, security alerts)</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Personalize your experience and recommend features</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Analyze usage trends to improve our product</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Detect and prevent fraud, abuse, and security issues</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Comply with legal obligations</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Marketing (only with your consent — unsubscribe anytime)</li>
            </ul>
          </section>

          <section id="section-3" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">3</span>
              </span>
              Data Sharing & Disclosure
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We do not sell your personal information. We share data only in these circumstances:
            </p>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <strong>Service Providers:</strong> Trusted third parties who perform services on our behalf (hosting, payments, analytics, email). They only access data needed to perform their services and are bound by confidentiality agreements.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <strong>Social Platforms:</strong> When you schedule a post, we send the content to the respective platform (Facebook, Instagram, X, LinkedIn, Pinterest) via their official APIs. We only send what you authorize.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <strong>Legal Requirements:</strong> When required by law, court order, or government request. We review each request and only disclose what's legally required.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets, your data may be transferred. You'll be notified and your rights remain protected.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <strong>With Your Consent:</strong> For any other sharing not listed above, we'll ask for your explicit consent first.
                </div>
              </li>
            </ul>
          </section>

          <section id="section-4" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">4</span>
              </span>
              Data Security
            </h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> Encryption in transit (TLS 1.3) and at rest (AES-256)</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Access tokens encrypted with AES-256 before storage</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Regular security audits and penetration testing</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> SOC 2 Type II compliant infrastructure (via Vercel, Supabase, Stripe)</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Role-based access control — employees only access data needed for their role</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Incident response plan with 72-hour breach notification</li>
            </ul>
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Important</h4>
              <p className="text-amber-800 dark:text-amber-200">
                No method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          <section id="section-5" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">5</span>
              </span>
              Your Rights & Choices
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Depending on your location, you may have the following rights under GDPR, CCPA, and other privacy laws:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: User, title: "Access", desc: "Request a copy of your personal data" },
                { icon: Database, title: "Portability", desc: "Receive your data in a portable format" },
                { icon: Lock, title: "Rectification", desc: "Correct inaccurate or incomplete data" },
                { icon: Trash2, title: "Deletion", desc: "Request deletion of your personal data" },
                { icon: Shield, title: "Restriction", desc: "Limit how we process your data" },
                { icon: Globe, title: "Objection", desc: "Object to processing based on legitimate interests or for marketing" },
                { icon: User, title: "Withdraw Consent", desc: "Withdraw consent for cookies or marketing at any time" },
                { icon: Globe, title: "Complaint", desc: "Lodge a complaint with your data protection authority" },
              ].map((right, i) => (
                <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <right.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{right.title}</h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{right.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">How to Exercise Your Rights</h4>
              <p className="text-amber-800 dark:text-amber-200 mb-2">
                Email <a href="mailto:privacy@socialpilot.io" className="underline hover:text-amber-600">privacy@socialpilot.io</a> with "Privacy Request" in the subject line. We'll respond within 30 days (or as required by law).
              </p>
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                You can also manage your data directly in Settings → Privacy within the extension.
              </p>
            </div>
          </section>

          <section id="section-6" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">6</span>
              </span>
              Data Retention
            </h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> Account data: Retained while your account is active + 90 days after deletion</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Scheduled posts: Retained for 90 days after publishing or deletion</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Analytics data: Aggregated and anonymized after 13 months</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Support tickets: Retained for 2 years after resolution</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Payment records: Retained for 7 years (legal requirement)</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Access logs: Retained for 12 months</li>
            </ul>
          </section>

          <section id="section-7" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">7</span>
              </span>
              International Data Transfers
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              SocialPilot is headquartered in the United States. Your data may be processed in the US and other countries where our service providers operate.
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> We use Standard Contractual Clauses (SCCs) approved by the EU Commission for transfers outside the EEA</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Our hosting (Vercel) and database (Supabase) providers are EU-US Data Privacy Framework certified</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Stripe (payments) is PCI DSS Level 1 certified and Privacy Shield compliant</li>
            </ul>
          </section>

          <section id="section-8" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">8</span>
              </span>
              Children's Privacy
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              SocialPilot is not directed at children under 13 (or 16 in the EU/UK). We do not knowingly collect personal information from children. If you believe we've collected data from a child, contact us immediately and we'll delete it.
            </p>
          </section>

          <section id="section-9" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">9</span>
              </span>
              Changes to This Policy
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              We may update this Privacy Policy from time to time. We'll notify you of material changes:
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> Email notification (for significant changes)</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> In-app notification within the extension</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Updated "Last Updated" date at the top of this page</li>
            </ul>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Your continued use of SocialPilot after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section id="section-10" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">10</span>
              </span>
              Contact Us
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Have questions about this Privacy Policy or your data? We'd love to hear from you.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <a href="mailto:privacy@socialpilot.io" className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Email Us</h3>
                <p className="text-slate-600 dark:text-slate-400">privacy@socialpilot.io</p>
                <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">Response within 48 hours</p>
              </a>
              <a href="mailto:support@socialpilot.io" className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Support Team</h3>
                <p className="text-slate-600 dark:text-slate-400">support@socialpilot.io</p>
                <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">General inquiries</p>
              </a>
              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Mailing Address</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  SocialPilot, Inc.<br />
                  123 Market St, Suite 400<br />
                  San Francisco, CA 94105<br />
                  USA
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2-2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-semibold text-lg">SocialPilot</span>
              </div>
              <p className="text-slate-400 text-sm">The fastest way to schedule &amp; publish to 5 platforms.</p>
              <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
                © 2024 SocialPilot. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}