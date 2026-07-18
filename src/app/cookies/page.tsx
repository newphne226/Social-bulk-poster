"use client";

import * as React from "react";
import { Shield, FileText, Clock, Mail, Lock, Globe, User, Database, Trash2, ArrowLeft, CheckCircle, ChevronDown, ChevronRight, ArrowRight, MessageCircle, Cookie, Eye, EyeOff, Database as DatabaseIcon, Cpu, Share2, Link2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookiesPage() {
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
              Cookie Policy
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

          {/* What are Cookies */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Cookie className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </span>
              What Are Cookies?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Cookies are small text files stored on your device (computer, phone, tablet) when you visit a website. They help websites remember your preferences, understand how you use the site, and provide a better experience.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Cookies can be "persistent" (stay until deleted or expired) or "session" (deleted when you close your browser). They can be "first-party" (set by us) or "third-party" (set by other domains).
            </p>
          </section>

          {/* Types of Cookies */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">2</span>
              </span>
              Types of Cookies We Use
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { 
                  icon: Shield, 
                  title: "Essential", 
                  desc: "Required for the site to function. Cannot be disabled.",
                  color: "bg-red-100 dark:bg-red-900/30",
                  iconColor: "text-red-600 dark:text-red-400",
                  items: ["Session management", "Security/CSRF protection", "Load balancing", "Consent preferences"]
                },
                { 
                  icon: Cpu, 
                  title: "Performance", 
                  desc: "Help us understand how visitors use our site.",
                  color: "bg-blue-100 dark:bg-blue-900/30",
                  iconColor: "text-blue-600 dark:text-blue-400",
                  items: ["Page views/navigation", "Load times/errors", "Feature usage", "A/B testing"]
                },
                { 
                  icon: Database, 
                  title: "Functional", 
                  desc: "Enable enhanced functionality and personalization.",
                  color: "bg-green-100 dark:bg-green-900/30",
                  iconColor: "text-green-600 dark:text-green-400",
                  items: ["Language/region prefs", "Dashboard customizations", "Saved filters/views", "Chat widget state"]
                },
                { 
                  icon: Share2, 
                  title: "Marketing", 
                  desc: "Used to deliver relevant ads and measure campaigns.",
                  color: "bg-purple-100 dark:bg-purple-900/30",
                  iconColor: "text-purple-600 dark:text-purple-400",
                  items: ["Ad attribution", "Conversion tracking", "Audience building", "Retargeting"]
                },
              ].map((cat, i) => (
                <div key={i} className={`p-6 rounded-2xl border ${cat.color} border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-all`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color.replace('bg-', 'bg-').replace('dark:bg-', 'dark:bg-') }}>
                      <cat.icon className={`h-6 w-6 ${cat.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{cat.title}</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{cat.desc}</p>
                  <ul className="space-y-2">
                    {cat.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Cookie Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Cookie Name</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Type</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Duration</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Purpose</th>
                  </tr>
                </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {[
                    { name: "sp_session", type: "Essential", duration: "Session", purpose: "Maintains user login session" },
                    { name: "sp_csrf", type: "Essential", duration: "Session", purpose: "CSRF protection for forms" },
                    { name: "sp_consent", type: "Essential", duration: "1 year", purpose: "Stores cookie consent preferences" },
                    { name: "sp_theme", type: "Functional", duration: "1 year", purpose: "Remembers light/dark mode preference" },
                    { name: "sp_locale", type: "Functional", duration: "1 year", purpose: "Remembers language/region preference" },
                    { name: "_ga", type: "Performance", duration: "2 years", purpose: "Google Analytics - distinguishes users" },
                    { name: "_ga_*", type: "Performance", duration: "2 years", purpose: "Google Analytics 4 - session tracking" },
                    { name: "_fbp", type: "Marketing", duration: "3 months", purpose: "Facebook Pixel - ad attribution" },
                    { name: "_ttclid", type: "Marketing", duration: "30 days", purpose: "TikTok Ads - click tracking" },
                    { name: "sp_ab_test", type: "Performance", duration: "30 days", purpose: "A/B test variant assignment" },
                  ].map((cookie) => (
                    <tr key={cookie.name} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-4 font-mono text-sm font-medium text-slate-900 dark:text-white">{cookie.name}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cookie.type === "Essential" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        } || (
                          cookie.type === "Performance" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        ) || (
                          cookie.type === "Functional" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        ) || (
                          cookie.type === "Marketing" && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        )}`}>
                          {cookie.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{cookie.duration}</td>
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{cookie.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Managing Cookies */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">3</span>
              </span>
              Managing Your Cookie Preferences
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { 
                  icon: Eye, 
                  title: "Cookie Banner", 
                  desc: "Click the cookie icon in the bottom corner of any page to open the consent manager and change preferences anytime." 
                },
                { 
                  icon: Lock, 
                  title: "Browser Settings", 
                  desc: "Most browsers let you block or delete cookies. Check your browser's help section for instructions." 
                },
                { 
                  icon: Globe, 
                  title: "Opt-Out Tools", 
                  desc: "Use industry opt-out tools: <a href='https://optout.aboutads.info/' target='_blank' rel='noopener noreferrer' className='text-amber-600 dark:text-amber-400 underline'>DAA Opt-Out</a>, <a href='https://www.networkadvertising.org/choices/' target='_blank' rel='noopener noreferrer' className='text-amber-600 dark:text-amber-400 underline'>NAI Opt-Out</a>." 
                },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                Important Notes
              </h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Disabling essential cookies will break core functionality (login, security, payments).</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Disabling performance cookies limits our ability to improve the product.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Disabling marketing cookies won&apos;t reduce ad count, just makes them less relevant.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Clearing cookies logs you out and resets preferences.</li>
                </ul>
              </div>
            </section>

            {/* Third Party Cookies */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">4</span>
                </span>
                Third-Party Cookies
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We use these trusted third-party services that may set their own cookies:
              </p>
              <ul className="space-y-4">
                {[
                  { name: "Google Analytics", purpose: "Website analytics and performance monitoring", link: "https://policies.google.com/technologies/cookies" },
                  { name: "Google Tag Manager", purpose: "Tag management for analytics and marketing tags", link: "https://policies.google.com/technologies/cookies" },
                  { name: "Facebook Pixel / Meta", purpose: "Advertising attribution and audience building", link: "https://www.facebook.com/policies/cookies/" },
                  { name: "Stripe", purpose: "Payment processing and fraud prevention", link: "https://stripe.com/cookies" },
                  { name: "Intercom", purpose: "Customer messaging and support widget", link: "https://www.intercom.com/terms-and-policies#cookie-policy" },
                  { name: "Vercel Analytics", purpose: "Performance and usage analytics", link: "https://vercel.com/legal/cookies" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.purpose}</p>
                      </div>
                    </div>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline text-sm font-medium">
                      Cookie Policy →
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {/* Your Rights */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">5</span>
                </span>
                Your Rights &amp; Choices
              </h2>
              <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                {[
                  "Access: Request a copy of the personal data we hold about you.",
                  "Rectification: Request correction of inaccurate or incomplete data.",
                  "Erasure: Request deletion of your data (subject to legal obligations).",
                  "Restriction: Request limitation of processing your data.",
                  "Portability: Receive your data in a portable, machine-readable format.",
                  "Objection: Object to processing based on legitimate interests or for marketing.",
                  "Withdraw Consent: Withdraw consent for cookies or marketing at any time.",
                  "Complaint: Lodge a complaint with your data protection authority."
                ].map((right, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>{right}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-slate-600 dark:text-slate-400">
                To exercise your rights, email <a href="mailto:privacy@socialpilot.io" className="text-amber-600 dark:text-amber-400 hover:underline">privacy@socialpilot.io</a>. We'll respond within 30 days.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">6</span>
                </span>
                Contact Us
              </h2>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Questions about this Cookie Policy or your data? Contact our privacy team:
                </p>
                <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-amber-500" /> Email: <a href="mailto:privacy@socialpilot.io" className="text-amber-600 dark:text-amber-400 hover:underline">privacy@socialpilot.io</a></li>
                  <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-amber-500" /> Data Protection Officer: <a href="mailto:dpo@socialpilot.io" className="text-amber-600 dark:text-amber-400 hover:underline">dpo@socialpilot.io</a></li>
                  <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-amber-500" /> Mail: SocialPilot Inc., 548 Market St #98765, San Francisco, CA 94104</li>
                </ul>
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
                </div>
                <span className="font-semibold text-lg">SocialPilot</span>
              </div>
              <p className="text-slate-400 text-sm">The fastest way to schedule &amp; publish to 5 platforms.</p>
              <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
                © 2024 SocialPilot. All rights reserved.
              </div>
            </footer>
        </div>
      </main>
    </div>
  );
}