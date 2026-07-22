"use client";

import * as React from "react";
import { FileText, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TermsPage() {
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
              <FileText className="h-4 w-4" />
              <span>Terms of Service</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Last updated: January 15, 2024
            </p>
          </header>

          {/* Content */}
          <div className="space-y-12">
            {/* 1. Acceptance */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">1</span>
                </span>
                Acceptance of Terms
              </h2>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  By accessing or using SMTools (the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
                </p>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> You must be at least 13 years old (16 in EU) to use the Service.</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> You are responsible for all activity under your account.</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> We may update these Terms at any time. Continued use constitutes acceptance.</li>
                </ul>
              </div>
            </section>

            {/* 2. Description of Service */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">2</span>
                </span>
                Description of Service
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                SMTools is a Chrome extension that enables users to schedule and publish social media posts across multiple platforms including Facebook, Instagram, X (Twitter), LinkedIn, and Pinterest. Key features include:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Multi-platform post scheduling and publishing</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> AI-powered caption and hashtag generation</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Smart queue and posting time optimization</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Content management and analytics</li>
              </ul>
            </section>

            {/* 3. Account Registration */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">3</span>
                </span>
                Account Registration
              </h2>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> You must provide accurate, current, and complete information during registration.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> You are responsible for maintaining the confidentiality of your password.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> You are responsible for all activities under your account.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> You must notify us immediately of any unauthorized use of your account.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> One person may not maintain multiple free accounts.</li>
              </ul>
            </section>

            {/* 4. User Content */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">4</span>
                </span>
                User Content
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                You retain ownership of all content you create and publish through SMTools. By using the Service, you grant us a limited license to process and transmit your content solely for the purpose of publishing it to your connected social media platforms.
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> You are solely responsible for your content.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> You must have the rights to all content you publish.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Content must comply with each platform&apos;s community guidelines.</li>
              </ul>
            </section>

            {/* 5. Acceptable Use */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">5</span>
                </span>
                Acceptable Use
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                You agree not to use the Service for any unlawful or prohibited purpose. You may not:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Violate any applicable laws or regulations.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Infringe intellectual property rights.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Post hate speech, harassment, threats, or violence.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Distribute malware, spam, phishing, or deceptive content.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Impersonate others or misrepresent affiliation.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Scrape, crawl, or extract data without permission.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Interfere with service security or integrity.</li>
              </ul>
            </section>

            {/* 6. Subscription & Billing */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">6</span>
                </span>
                Subscription &amp; Billing
              </h2>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> <strong>Plans:</strong> Free, Silver, VIP Pro, and Enterprise tiers with varying features and limits.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> <strong>Billing:</strong> Monthly or annual billing. Annual plans receive a discount.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> <strong>Payments:</strong> Processed securely via Stripe. We do not store full credit card details.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> <strong>Renewal:</strong> Subscriptions auto-renew unless cancelled before the renewal date.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> <strong>Cancellation:</strong> Cancel anytime. Access continues until the end of the billing period.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> <strong>Refunds:</strong> 14-day money-back guarantee for new subscriptions.</li>
              </ul>
            </section>

            {/* 7. Third-Party Services */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">7</span>
                </span>
                Third-Party Services
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                SMTools integrates with third-party social media platforms. Your use of these platforms is governed by their respective terms of service.
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> We are not responsible for the availability or practices of third-party services.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Platform API changes may affect functionality without notice.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Your use of connected accounts is at your own risk.</li>
              </ul>
            </section>

            {/* 8. Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">8</span>
                </span>
                Intellectual Property
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                The Service, including its design, code, features, trademarks, and branding, is owned by SMTools and protected by international intellectual property laws.
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> You may not copy, modify, or distribute any part of the Service.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> Feedback you provide becomes our property and may be used freely.</li>
              </ul>
            </section>

            {/* 9. Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">9</span>
                </span>
                Disclaimers
              </h2>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-6 mb-4">
                <p className="text-slate-700 dark:text-slate-300 font-semibold">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
                </p>
              </div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> No warranty of merchantability, fitness for purpose, or non-infringement.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> No guarantee of uninterrupted, error-free, or secure service.</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /> No guarantee that content will be published successfully on third-party platforms.</li>
              </ul>
            </section>

            {/* 10. Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">10</span>
                </span>
                Limitation of Liability
              </h2>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <p className="text-slate-600 dark:text-slate-400">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOCIALPILOT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES.
                </p>
              </div>
            </section>

            {/* 11. Termination */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">11</span>
                </span>
                Termination
              </h2>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> You may terminate your account anytime from your settings.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> We may suspend or terminate access for Terms violations.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Upon termination, your license ends and data is deleted per our retention policy.</li>
              </ul>
            </section>

            {/* 12. Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">12</span>
                </span>
                Governing Law &amp; Disputes
              </h2>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> These Terms are governed by the laws of the State of Delaware, USA.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Disputes resolved through binding arbitration in San Francisco, CA.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Class actions and jury trials waived to the maximum extent permitted by law.</li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> EU users: GDPR rights apply. Contact our DPO at dpo@smtools.online.</li>
              </ul>
            </section>

            {/* 13. Changes */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">13</span>
                </span>
                Changes to Terms
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                We reserve the right to modify these Terms at any time. We will notify you of material changes via email or in-app notification. Continued use after changes constitutes acceptance.
              </p>
            </section>

            {/* 14. Contact */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">14</span>
                </span>
                Contact Us
              </h2>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Questions about these Terms? Contact us:
                </p>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <Mail className="h-5 w-5 text-amber-500" />
                  <a href="mailto:legal@smtools.online" className="text-amber-600 dark:text-amber-400 hover:underline">legal@smtools.online</a>
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
