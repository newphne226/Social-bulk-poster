"use client";

import * as React from "react";
import { Shield, CheckCircle, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 text-white shadow-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-semibold text-lg text-slate-900 dark:text-white">SMTools</span>
            </a>
            <a href="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              &larr; Back to Home
            </a>
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              <span>Privacy Policy</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Last updated: January 15, 2024
            </p>
          </header>

          {/* Content */}
          <div className="space-y-12">
            {/* 1. Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">1</span>
                </span>
                Introduction
              </h2>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <p className="text-slate-600 dark:text-slate-400">
                  SMTools (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Chrome extension and related services. By using SMTools, you agree to the collection and use of information in accordance with this policy.
                </p>
              </div>
            </section>

            {/* 2. Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">2</span>
                </span>
                Information We Collect
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">We collect the following types of information:</p>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Account Information:</strong> Name, email address, and profile details when you create an account.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Social Media Tokens:</strong> OAuth access tokens for connected platforms (Facebook, Instagram, X, LinkedIn, Pinterest). We never see or store your passwords.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Content Data:</strong> Posts, captions, images, and scheduling information you create through the Service.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Usage Data:</strong> Features used, pages visited, timestamps, and interaction patterns within the extension.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Device Information:</strong> Browser type, operating system, screen resolution, and extension version.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Log Data:</strong> IP address, access times, and referral URLs for security and analytics.</li>
              </ul>
            </section>

            {/* 3. How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">3</span>
                </span>
                How We Use Your Information
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">We use collected information to:</p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Provide, operate, and maintain the SMTools extension and services.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Process and publish your social media posts to connected platforms.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Generate AI-powered captions, hashtags, and content suggestions.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Optimize posting schedules for maximum engagement.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Send account-related communications (updates, security alerts, billing).</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Improve and personalize the Service based on usage patterns.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Detect and prevent fraud, abuse, and security incidents.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Comply with legal obligations and enforce our Terms of Service.</li>
              </ul>
            </section>

            {/* 4. Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">4</span>
                </span>
                Data Sharing &amp; Disclosure
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">We do NOT sell your personal data. We share information only in the following cases:</p>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>With Social Platforms:</strong> Content is sent directly to your connected platforms (Facebook, Instagram, X, LinkedIn, Pinterest) for publishing.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Service Providers:</strong> Trusted third-party providers (hosting, payment processing, analytics) who assist in operating the Service under strict data protection agreements.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Legal Requirements:</strong> When required by law, court order, or governmental regulation.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (you will be notified).</li>
              </ul>
            </section>

            {/* 5. Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">5</span>
                </span>
                Data Security
              </h2>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-6 mb-4">
                <p className="text-slate-700 dark:text-slate-300 font-semibold">
                  We take security seriously. Your data is protected with industry-standard encryption and security practices.
                </p>
              </div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> AES-256 encryption for data at rest.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> TLS 1.3 encryption for data in transit.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> OAuth 2.0 authentication — we never store social media passwords.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Regular security audits and penetration testing.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> SOC 2 Type II compliance in progress.</li>
              </ul>
            </section>

            {/* 6. Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">6</span>
                </span>
                Data Retention
              </h2>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Active Accounts:</strong> Data is retained as long as your account is active.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Deleted Accounts:</strong> All data is permanently deleted within 30 days of account deletion.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Scheduled Posts:</strong> Deleted after publishing or upon account cancellation.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Analytics Data:</strong> Aggregated and anonymized after 12 months.</li>
              </ul>
            </section>

            {/* 7. Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">7</span>
                </span>
                Your Rights
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">You have the following rights regarding your personal data:</p>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Access:</strong> Request a copy of all personal data we hold about you.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Deletion:</strong> Request permanent deletion of your personal data.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Portability:</strong> Request your data in a structured, machine-readable format.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Objection:</strong> Object to processing of your personal data for specific purposes.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Restriction:</strong> Request restriction of processing in certain circumstances.</li>
              </ul>
            </section>

            {/* 8. GDPR */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">8</span>
                </span>
                GDPR (European Users)
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                If you are located in the European Economic Area (EEA) or the United Kingdom, you have additional rights under the General Data Protection Regulation (GDPR):
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> We process data based on consent, contract performance, and legitimate interests.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> You may withdraw consent at any time without affecting prior processing.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> You have the right to lodge a complaint with your local data protection authority.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Data is stored in secure data centers within the US and EU.</li>
              </ul>
            </section>

            {/* 9. CCPA */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">9</span>
                </span>
                CCPA (California Users)
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Under the California Consumer Privacy Act (CCPA), California residents have the right to:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Know what personal information is collected and how it is used.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Request deletion of personal information.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Opt out of the sale of personal information (we do not sell data).</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Not be discriminated against for exercising your privacy rights.</li>
              </ul>
            </section>

            {/* 10. Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">10</span>
                </span>
                Cookies &amp; Tracking
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                SMTools uses cookies and similar technologies for the following purposes:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Essential Cookies:</strong> Required for authentication and core functionality.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Analytics Cookies:</strong> Help us understand how users interact with the extension.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> <strong>Preference Cookies:</strong> Remember your settings and preferences.</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                For full details, see our <a href="/cookies" className="text-amber-600 dark:text-amber-400 hover:underline">Cookie Policy</a>.
              </p>
            </section>

            {/* 11. Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">11</span>
                </span>
                Children&apos;s Privacy
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                SMTools is not intended for children under 13 (or 16 in the EU). We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will delete it promptly.
              </p>
            </section>

            {/* 12. Changes */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">12</span>
                </span>
                Changes to This Policy
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                We may update this Privacy Policy from time to time. We will notify you of material changes via email or in-app notification at least 30 days before the changes take effect. Continued use after changes constitutes acceptance.
              </p>
            </section>

            {/* 13. Contact */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">13</span>
                </span>
                Contact Us
              </h2>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  For privacy-related questions or to exercise your rights, contact our Data Protection Officer:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Mail className="h-5 w-5 text-amber-500" />
                    <a href="mailto:privacy@smtools.online" className="text-amber-600 dark:text-amber-400 hover:underline">privacy@smtools.online</a>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Mail className="h-5 w-5 text-amber-500" />
                    <a href="mailto:dpo@smtools.online" className="text-amber-600 dark:text-amber-400 hover:underline">dpo@smtools.online</a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-semibold text-lg">SMTools</span>
          </div>
          <p className="text-slate-400 text-sm mb-4">The fastest way to schedule &amp; publish to 5 platforms.</p>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            &copy; 2024 SMTools. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
