"use client";

import * as React from "react";
import { Chrome, Smartphone, Globe, Zap, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VisitorCounter } from "@/components/visitor-counter";

const CHROME_STORE_URL = "https://chrome.google.com/webstore/detail/socialpilot";
const DEMO_URL = "https://youtube.com/watch?v=demo";

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

function openExternalLink(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function ExtensionPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-amber-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 text-white shadow-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-semibold text-lg text-slate-900 dark:text-white">SocialPilot</span>
              <VisitorCounter />
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="#features" 
                onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                Features
              </a>
              <a 
                href="#platforms" 
                onClick={(e) => { e.preventDefault(); scrollToSection("platforms"); }}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                Platforms
              </a>
              <a 
                href="#pricing" 
                onClick={(e) => { e.preventDefault(); scrollToSection("pricing"); }}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                Pricing
              </a>
              <a 
                href="/about"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                About
              </a>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:flex"
                onClick={() => scrollToSection("pricing")}
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-lg shadow-amber-500/25"
                onClick={() => openExternalLink(CHROME_STORE_URL)}
              >
                Get Extension
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>Now with AI-powered captions & hashtags</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                Schedule & Publish to <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">5 Platforms</span> in Seconds
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
                The only Chrome extension that lets you schedule posts to Facebook, Instagram, X, LinkedIn & Pinterest directly from any webpage. Powered by AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-xl shadow-amber-500/30 px-8 py-4 text-lg" onClick={() => openExternalLink(CHROME_STORE_URL)}>
                  <span className="flex items-center gap-2">
                    <Chrome className="h-5 w-5" />
                    Add to Chrome — Free
                  </span>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 px-8 py-4 text-lg" onClick={() => openExternalLink(DEMO_URL)}>
                  <span className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    View Demo
                  </span>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Extension Preview */}
            <div className="relative">
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-48 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center px-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400">chrome-extension://socialpilot/popup.html</span>
                    </div>
                  </div>
                </div>

                {/* Popup Content */}
                <div className="p-6 w-96 min-h-[400px]">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">SocialPilot</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Schedule posts to 5 platforms</p>
                      </div>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-slate-700" />
                  </div>

                  {/* Quick Schedule */}
                  <div className="space-y-4 mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">What do you want to share?</label>
                    <textarea className="w-full h-24 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" placeholder="Write your caption... 🎉"></textarea>
                  </div>

                  {/* Platform Selector */}
                  <div className="space-y-3 mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Post to</label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { name: "FB", color: "bg-blue-600", icon: "f" },
                        { name: "IG", color: "bg-gradient-to-br from-purple-500 to-pink-500", icon: "IG" },
                        { name: "X", color: "bg-slate-900", icon: "X" },
                        { name: "IN", color: "bg-blue-700", icon: "in" },
                        { name: "PN", color: "bg-red-600", icon: "P" }
                      ].map((p) => (
                        <button
                          key={p.name}
                          className={cn(
                            "flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 transition-all",
                            "border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 cursor-pointer"
                          )}
                          onClick={() => console.log(`Select platform: ${p.name}`)}
                        >
                          <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold", p.color)}>
                            {p.icon}
                          </span>
                          <span className="text-xs text-slate-600 dark:text-slate-400">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Button */}
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-lg shadow-amber-500/30 py-3 text-base font-semibold rounded-xl" onClick={() => console.log("Schedule post clicked")}>
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="h-4 w-4" />
                      Schedule Post
                    </span>
                  </Button>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-amber-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-amber-500/40 text-sm font-semibold animate-bounce">
                ⚡ 10x Faster
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">Grow Faster</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Powerful features built for creators, agencies, and businesses who want to scale their social presence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Quick Schedule", desc: "Right-click any webpage to schedule instantly. No copy-paste needed." },
              { icon: Globe, title: "5 Platforms", desc: "Facebook, Instagram, X, LinkedIn & Pinterest — all from one place." },
              { icon: Smartphone, title: "AI Captions", desc: "Generate engaging captions & hashtags with AI in seconds." },
              { icon: Shield, title: "Secure & Private", desc: "Your data is encrypted. We never share your content or credentials." },
              { icon: CheckCircle, title: "Smart Queue", desc: "Auto-optimize posting times for maximum engagement." },
              { icon: Chrome, title: "Chrome Native", desc: "Lightweight extension. Works offline. Syncs when online." },
            ].map((f, i) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              All Your Platforms, <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">One Click</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Connect once. Post everywhere. Native formatting for each platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {[
              { name: "Facebook", color: "bg-blue-600", icon: "f", features: ["Pages & Groups", "Stories & Reels", "Auto-hashtags", "Link preview"] },
              { name: "Instagram", color: "bg-gradient-to-br from-purple-500 to-pink-500", icon: "IG", features: ["Feed & Reels", "Stories", "Carousel posts", "Location tags"] },
              { name: "X (Twitter)", color: "bg-slate-900", icon: "X", features: ["Threads", "Media upload", "Poll support", "Character count"] },
              { name: "LinkedIn", color: "bg-blue-700", icon: "in", features: ["Profiles & Pages", "Document posts", "Article sharing", "Hashtag suggestions"] },
              { name: "Pinterest", color: "bg-red-600", icon: "P", features: ["Boards & Pins", "Rich pins", "Video pins", "SEO optimization"] },
            ].map((p) => (
              <div key={p.name} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-xl hover:shadow-amber-500/10 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg", p.color)}>
                    {p.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{p.name}</h3>
                </div>
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
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
              Ready to 10x Your Social Media?
            </h2>
            <p className="text-amber-100 text-lg mb-8 max-w-lg mx-auto">
              Join 10,000+ creators saving 10+ hours/week. Free to start. Cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="w-full sm:w-auto bg-white text-amber-600 hover:bg-amber-50 px-8 py-4 text-lg font-semibold shadow-xl" onClick={() => openExternalLink(CHROME_STORE_URL)}>
                <Chrome className="h-5 w-5 mr-2" />
                Add to Chrome — Free
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold" onClick={() => openExternalLink(DEMO_URL)}>
                Watch 2-min Demo
              </Button>
            </div>
            <p className="mt-6 text-amber-200 text-sm">
              No credit card • 14-day free trial • Cancel anytime
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
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }} className="hover:text-amber-400 transition-colors cursor-pointer">Features</a></li>
                <li><a href="#platforms" onClick={(e) => { e.preventDefault(); scrollToSection("platforms"); }} className="hover:text-amber-400 transition-colors cursor-pointer">Platforms</a></li>
                <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection("pricing"); }} className="hover:text-amber-400 transition-colors cursor-pointer">Pricing</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openExternalLink("https://docs.socialpilot.io"); }} className="hover:text-amber-400 transition-colors cursor-pointer">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/about" className="hover:text-amber-400 transition-colors cursor-pointer">About</a></li>
                <li><a href="/blog" className="hover:text-amber-400 transition-colors cursor-pointer">Blog</a></li>
                <li><a href="/careers" className="hover:text-amber-400 transition-colors cursor-pointer">Careers</a></li>
                <li><a href="/contact" className="hover:text-amber-400 transition-colors cursor-pointer">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/privacy" className="hover:text-amber-400 transition-colors cursor-pointer">Privacy</a></li>
                <li><a href="/terms" className="hover:text-amber-400 transition-colors cursor-pointer">Terms</a></li>
                <li><a href="/cookies" className="hover:text-amber-400 transition-colors cursor-pointer">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            © 2024 SocialPilot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}