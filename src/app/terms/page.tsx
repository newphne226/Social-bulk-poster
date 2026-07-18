"use client";

import * as React from "react";
import { Shield, FileText, Clock, Mail, Lock, Globe, User, Database, Trash2, ArrowLeft, CheckCircle, ChevronDown, ChevronRight, ArrowRight, MessageCircle, Gavel, Scale, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TermsPage() {
  const lastUpdated = "January 15, 2024";
  const effectiveDate = "January 15, 2024";

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
              Terms of Service
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 text-slate-600 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Effective: January 15, 2024</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Questions? legal@socialpilot.io</span>
              </p>
            </div>
          </header>

          {/* Table of Contents */}
          <nav className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-12 sticky top-24">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Table of Contents</h3>
            <ul className="space-y-2">
              {[
                "1. Acceptance of Terms",
                "2. Description of Service",
                "3. Account Registration",
                "4. Subscription & Billing",
                "5. User Content",
                "6. Acceptable Use",
                "7. Intellectual Property",
                "8. Third-Party Services",
                "9. Disclaimers",
                "10. Limitation of Liability",
                "11. Indemnification",
                "12. Termination",
                "13. Governing Law",
                "14. Changes to Terms",
                "15. Contact Us",
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
              Acceptance of Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              By accessing or using SocialPilot ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not use the Service.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              These Terms constitute a legally binding agreement between you ("User", "you", "your") and SocialPilot Inc. ("Company", "we", "us", "our"). Please read them carefully.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms. We'll notify you of material changes via email or in-app notification.
            </p>
          </section>

          <section id="section-2" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">2</span>
              </span>
              Description of Service
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              SocialPilot is a social media management platform that enables users to schedule, publish, and analyze posts across multiple social media platforms including Facebook, Instagram, X (Twitter), LinkedIn, and Pinterest.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Key Features</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 mb-6">
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Post scheduling across 5 platforms</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> AI-powered caption and hashtag generation</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Media library and content calendar</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Analytics and performance tracking</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Team collaboration (Pro plans)</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Browser extension for quick scheduling</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We continuously update and improve the Service. Features may be added, modified, or removed with reasonable notice.
            </p>
          </section>

          <section id="section-3" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">3</span>
              </span>
              Account Registration
            </h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> You must be at least 13 years old (16 in EU) to create an account.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> You must provide accurate, current, and complete information during registration.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> You are responsible for maintaining the confidentiality of your password.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> You are responsible for all activities under your account.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> You must notify us immediately of any unauthorized use of your account.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> One person may not maintain multiple free accounts.</li>
            </ul>
          </section>

          <section id="section-4" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">4</span>
              </span>
              Subscription & Billing
            </h2>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> <strong>Plans:</strong> Free, Silver, VIP Pro, Enterprise tiers with varying features and limits.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> <strong>Billing:</strong> Monthly or annual billing. Annual plans receive a discount.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> <strong>Payments:</strong> Processed securely via Stripe. We don&apos;t store full credit card details.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> <strong>Renewal:</strong> Subscriptions auto-renew unless cancelled before the renewal date.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> <strong>Cancellation:</strong> Cancel anytime. Access continues until the end of the billing period. No partial refunds for unused time.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> <strong>Refunds:</strong> 14-day money-back guarantee for new subscriptions. Contact support for refunds.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> <strong>Upgrades/Downgrades:</strong> Prorated charges apply. Downgrades take effect at the next billing cycle.</li>
            </ul>
          </section>

          <section id="section-5" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">5</span>
              </span>
              User Content
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              You retain ownership of all content you create, upload, or share through the Service ("User Content").
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Your License to Us</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              By posting User Content, you grant us a worldwide, non-exclusive, royalty-free, sublicensable license to use, reproduce, modify, adapt, publish, translate, distribute, and display your content solely for the purpose of providing the Service.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Your Responsibilities</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 mb-6">
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> You own or have rights to all content you post.</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Content doesn&apos;t violate any laws or third-party rights (copyright, trademark, privacy).</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Content doesn't contain malware, spam, or harmful code.</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-amber-500" /> Content complies with each platform&apos;s community guidelines and terms.</li>
            </ul>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Content Removal</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We reserve the right to remove content that violates these Terms or platform policies. We&apos;ll notify you of removals when possible, but are not obligated to do so.
            </p>
          </section>

          <section id="section-6" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">6</span>
              </span>
              Acceptable Use
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              You agree not to use the Service for any unlawful or prohibited purpose. You may not:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> Violate any applicable laws or regulations.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Infringe intellectual property rights.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Post hate speech, harassment, threats, or violence.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Distribute malware, spam, phishing, or deceptive content.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Impersonate others or misrepresent affiliation.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Scrape, crawl, or extract data without permission.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Interfere with service security or integrity.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Use automation beyond what the Service provides.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Violate any connected platform&apos;s terms of service.</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mt-6">
              We may monitor usage and take action against violations, including content removal, account suspension, or termination.
            </p>
          </section>

          <section id="section-7" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">7</span>
              </span>
              Intellectual Property
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              The Service, its original content, features, functionality, design, trademarks, logos, and branding are owned by SocialPilot Inc. and protected by international copyright, trademark, patent, and trade secret laws.
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> "SocialPilot" name, logo, and branding are our trademarks.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> You may not use our marks without written permission.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Our software, code, and algorithms are proprietary.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Feedback you provide becomes our property and may be used freely.</li>
            </ul>
          </section>

          <section id="section-8" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">8</span>
              </span>
              Third-Party Services
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              The Service integrates with third-party platforms (Facebook, Instagram, X, LinkedIn, Pinterest) and services (Stripe, AWS, Google Analytics). Your use of these services is governed by their respective terms and privacy policies.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We are not responsible for the availability, accuracy, or practices of third-party services. Your use of connected accounts is at your own risk.
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> We access connected accounts only with your explicit permission via OAuth.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Access tokens are encrypted and used solely for authorized actions.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> We do not store your social media passwords.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> You can revoke access anytime from platform settings or our dashboard.</li>
            </ul>
          </section>

          <section id="section-9" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">9</span>
              </span>
              Disclaimers
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              <strong className="text-slate-900 dark:text-white">THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.</strong>
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> No warranty of merchantability, fitness for purpose, or non-infringement.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> No guarantee of uninterrupted, error-free, or secure service.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> No guarantee that content will be published successfully on third-party platforms.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Third-party platform API changes may affect functionality without notice.</li>
            </ul>
          </section>

          <section id="section-10" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">10</span>
              </span>
              Limitation of Liability
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              <strong className="text-slate-900 dark:text-white">TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOCIALPILOT INC. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</strong>
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> Lost profits, revenue, data, or business opportunities.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Service interruptions, data loss, or unauthorized access.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Third-party platform actions (account bans, reach reduction).</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Maximum liability limited to fees paid in the 12 months preceding the claim.</li>
            </ul>
          </section>

          <section id="section-11" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">11</span>
              </span>
              Indemnification
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              You agree to defend, indemnify, and hold harmless SocialPilot Inc., its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorney fees) arising from:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> Your use of the Service in violation of these Terms.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Your User Content or connected account activities.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Your violation of any third-party rights or applicable laws.</li>
            </ul>
          </section>

          <section id="section-12" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">12</span>
              </span>
              Termination
            </h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> You may terminate your account anytime via Settings → Delete Account.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> We may suspend or terminate access for Terms violations, with notice when feasible.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Upon termination: license ends, access revoked, data deleted per our retention policy.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Provisions that should survive (IP, disclaimers, liability, indemnification) survive termination.</li>
            </ul>
          </section>

          <section id="section-13" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">13</span>
              </span>
              Governing Law & Dispute Resolution
            </h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" /> These Terms are governed by the laws of the State of Delaware, USA.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Disputes resolved through binding arbitration (JAMS) in San Francisco, CA.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> Class actions and jury trials waived to the maximum extent permitted by law.</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-amber-500" /> EU users: GDPR rights apply. Contact our DPO at dpo@socialpilot.io.</li>
            </ul>
          </section>

          <section id="section-14" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">14</span>
              </span>
              Changes to Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We may update these Terms periodically. Material changes will be communicated via email or in-app notification at least 30 days before taking effect.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Continued use after changes constitutes acceptance. If you disagree, you must stop using the Service and may cancel your subscription.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              The current version is always available at <a href="/terms" className="text-amber-600 dark:text-amber-400 hover:underline">socialpilot.io/terms</a>.
            </p>
          </section>

          <section id="section-15" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-bold">15</span>
              </span>
              Contact Us
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Questions about these Terms? Contact our legal team:
              </p>
              <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-amber-500" /> Email: <a href="mailto:legal@socialpilot.io" className="text-amber-600 dark:text-amber-400 hover:underline">legal@socialpilot.io</a></li>
                <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-amber-500" /> Data Protection: <a href="mailto:dpo@socialpilot.io" className="text-amber-600 dark:text-amber-400 hover:underline">dpo@socialpilot.io</a></li>
                <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-amber-500" /> Support: <a href="mailto:support@socialpilot.io" className="text-amber-600 dark:text-amber-400 hover:underline">support@socialpilot.io</a></li>
                <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-amber-500" /> Mail: SocialPilot Inc., 123 Market St, Suite 400, San Francisco, CA 94104</li>
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
                <span className="font-semibold text-lg">SocialPilot</span>
              </div>
              <p className="text-slate-400 text-sm">The fastest way to schedule &amp; publish to 5 platforms.</p>
            </div>
            <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
              © 2024 SocialPilot. All rights reserved.
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}