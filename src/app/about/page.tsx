"use client";

import * as React from "react";
import { Chrome, Users, Target, Shield, Heart, Zap, Globe, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 text-white shadow-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-semibold text-lg text-slate-900 dark:text-white">SocialPilot</span>
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Home</a>
              <a href="/blog" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Blog</a>
              <a href="/careers" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Careers</a>
              <a href="/contact" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Contact</a>
              <a href="https://chrome.google.com/webstore/detail/socialpilot" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-amber-500/25">Get Extension</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-from))] from-amber-100/50 via-transparent to-transparent dark:from-amber-900/10" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>Built for creators, by creators</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Making Social Media <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">Simple for Everyone</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            SocialPilot was born from a frustrating problem: scheduling social media posts across multiple platforms was too time-consuming. We built a Chrome extension that lets you post to Facebook, Instagram, X, LinkedIn, and Pinterest in seconds — directly from any webpage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://chrome.google.com/webstore/detail/socialpilot" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-xl shadow-amber-500/30 px-8 py-4 text-lg">
                <Chrome className="h-5 w-5 mr-2" />
                Get the Extension — Free
              </Button>
            </a>
            <a href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 px-8 py-4 text-lg">
                Get in Touch
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Our <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">Story</span>
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400">
                <p>
                  Managing social media should not mean logging into five different apps, copying and pasting content, and manually adjusting formats for each platform. We thought there had to be a better way.
                </p>
                <p>
                  So we built SocialPilot — a lightweight Chrome extension that sits right in your browser. Write your post once, pick your platforms, and schedule it in seconds. Our AI engine generates captions, hashtags, and optimizes posting times automatically.
                </p>
                <p>
                  Today, thousands of creators, marketers, and small businesses use SocialPilot to save hours every week on social media management.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-100 to-pink-100 dark:from-amber-900/30 dark:to-pink-900/30 rounded-3xl p-8 border border-amber-200 dark:border-amber-800">
                <div className="space-y-6">
                  {[
                    { num: "5", label: "Platforms Supported", desc: "Facebook, Instagram, X, LinkedIn, Pinterest" },
                    { num: "10s", label: "Average Post Time", desc: "From idea to scheduled post" },
                    { num: "AI", label: "Powered Captions", desc: "Smart hashtags & engagement optimization" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm flex-shrink-0">
                        <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">{item.num}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{item.label}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What We <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">Believe In</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Our core values shape every feature we build and every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Simplicity Wins",
                desc: "Powerful tools should not require a manual. Every feature in SocialPilot is designed to be intuitive from the first click."
              },
              {
                icon: Shield,
                title: "Privacy First",
                desc: "Your social media credentials and data are encrypted end-to-end. We never store passwords or sell your data to third parties."
              },
              {
                icon: Zap,
                title: "Ship Fast, Iterate",
                desc: "We release updates weekly based on user feedback. New platforms, AI features, and improvements — always evolving."
              },
            ].map((value, i) => (
              <div key={i} className="p-8 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SocialPilot */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">SocialPilot</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Globe, title: "5 Platforms, One Click", desc: "Post to Facebook, Instagram, X, LinkedIn, and Pinterest without switching tabs." },
              { icon: Zap, title: "AI-Powered Content", desc: "Generate captions, hashtags, and emojis with built-in AI. Just describe what you want to share." },
              { icon: Chrome, title: "Chrome Native", desc: "Lightweight extension that works offline and syncs when you are back online. No bulky app needed." },
              { icon: Shield, title: "Secure Authentication", desc: "OAuth-based login for each platform. Your credentials are encrypted and never exposed." },
              { icon: Users, title: "Built for Teams", desc: "Manage multiple accounts and platforms from a single dashboard. Perfect for agencies and brands." },
              { icon: Heart, title: "Free to Start", desc: "No credit card required. Try all features free for 14 days, then choose a plan that fits your needs." },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "5", label: "Platforms" },
              { value: "10s", label: "Avg. Post Time" },
              { value: "24/7", label: "Scheduled Posts" },
              { value: "Free", label: "Plan Available" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl bg-gradient-to-r from-amber-500 to-pink-500 p-10 sm:p-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Simplify Your Social Media?
            </h2>
            <p className="text-amber-100 text-lg mb-8 max-w-lg mx-auto">
              Join thousands of creators and businesses saving hours every week with SocialPilot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://chrome.google.com/webstore/detail/socialpilot" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full sm:w-auto bg-white text-amber-600 hover:bg-amber-50 px-8 py-4 text-lg font-semibold shadow-xl">
                  <Chrome className="h-5 w-5 mr-2" />
                  Get SocialPilot Free
                </Button>
              </a>
              <a href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold">
                  Contact Us
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </a>
            </div>
            <p className="mt-6 text-amber-200 text-sm">
              No credit card required. 14-day free trial. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-semibold text-lg">SocialPilot</span>
              </div>
              <p className="text-slate-400 text-sm">The fastest way to schedule &amp; publish to 5 platforms.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/#features" className="hover:text-amber-400 transition-colors">Features</a></li>
                <li><a href="/#platforms" className="hover:text-amber-400 transition-colors">Platforms</a></li>
                <li><a href="/#pricing" className="hover:text-amber-400 transition-colors">Pricing</a></li>
                <li><a href="/docs" className="hover:text-amber-400 transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/about" className="hover:text-amber-400 transition-colors">About</a></li>
                <li><a href="/blog" className="hover:text-amber-400 transition-colors">Blog</a></li>
                <li><a href="/careers" className="hover:text-amber-400 transition-colors">Careers</a></li>
                <li><a href="/contact" className="hover:text-amber-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/privacy" className="hover:text-amber-400 transition-colors">Privacy</a></li>
                <li><a href="/cookies" className="hover:text-amber-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            &copy; 2024 SocialPilot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
