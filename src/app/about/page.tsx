"use client";

import * as React from "react";
import { Chrome, Users, Target, Shield, Heart, Zap, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-from))] from-amber-100/50 via-transparent to-transparent dark:from-amber-900/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-medium">We're on a mission to simplify social media for everyone</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Building the Future of <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">Social Media Management</span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
              SocialPilot started with a simple idea: managing social media shouldn't be complicated. 
              Today, we help 50,000+ creators, agencies, and businesses save hours every week.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://chrome.google.com/webstore/detail/socialpilot" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-xl shadow-amber-500/30 px-8 py-4 text-lg">
                  Get the Extension
                </Button>
              </a>
              <a href="#team">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 px-8 py-4 text-lg">
                  Meet the Team
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-5xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { value: "50K+", label: "Active Users" },
              { value: "10M+", label: "Posts Scheduled" },
              { value: "500K+", label: "Hours Saved" },
              { value: "99%", label: "Uptime" },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Our <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">Mission</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              To democratize social media management by making powerful scheduling tools accessible to everyone — from solo creators to enterprise teams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Simplicity First",
                desc: "We believe powerful tools should be intuitive. No steep learning curves, no unnecessary complexity."
              },
              {
                icon: Shield,
                title: "Privacy & Security",
                desc: "Your data belongs to you. End-to-end encryption, GDPR compliant, and never sold to third parties."
              },
              {
                icon: Zap,
                title: "Continuous Innovation",
                desc: "We ship updates weekly. AI features, new platforms, and automation — always evolving with your needs."
              },
            ].map((value, i) => (
              <div key={i} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-all">
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

      {/* Team */}
      <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Meet the <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              A diverse group of builders, designers, and marketers passionate about simplifying social media.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "CEO & Co-founder", bio: "Former PM at Buffer. 10+ years in social media tools. Stanford CS graduate.", avatar: "SC" },
              { name: "Marcus Johnson", role: "CTO & Co-founder", bio: "Ex-Google engineer. Distributed systems expert. Built infrastructure handling 1B+ requests/day.", avatar: "MJ" },
              { name: "Priya Sharma", role: "Head of Design", bio: "Led design at Canva. Passionate about accessible, delightful user experiences. RISD alum.", avatar: "PS" },
              { name: "Alex Rivera", role: "Head of Growth", bio: "Scaled 3 SaaS startups from 0 to $10M+ ARR. Community-driven growth strategist.", avatar: "AR" },
              { name: "Lisa Wang", role: "Lead Engineer", bio: "Open source contributor. Chrome extensions expert. Built tools used by 100K+ developers.", avatar: "LW" },
              { name: "James Okafor", role: "Developer Advocate", bio: "Former teacher turned coder. Creates tutorials loved by 50K+ followers on YouTube.", avatar: "JO" },
            ].map((member, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-700 transition-all">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white text-center mb-1">{member.name}</h3>
                <p className="text-amber-600 dark:text-amber-400 text-sm font-medium text-center mb-3">{member.role}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm text-center">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl bg-gradient-to-r from-amber-500 to-pink-500 p-10 sm:p-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Join Us in Building the Future
            </h2>
            <p className="text-amber-100 text-lg mb-8 max-w-lg mx-auto">
              We're always looking for talented people who share our vision. Check out our open roles.
            </p>
            <a href="https://socialpilot.io/careers" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full sm:w-auto bg-white text-amber-600 hover:bg-amber-50 px-8 py-4 text-lg font-semibold shadow-xl">
                View Open Positions
              </Button>
            </a>
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
                <li><a href="#features" className="hover:text-amber-400 transition-colors">Features</a></li>
                <li><a href="#platforms" className="hover:text-amber-400 transition-colors">Platforms</a></li>
                <li><a href="#pricing" className="hover:text-amber-400 transition-colors">Pricing</a></li>
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
                <li><a href="/terms" className="hover:text-amber-400 transition-colors">Terms</a></li>
                <li><a href="/cookies" className="hover:text-amber-400 transition-colors">Cookie Policy</a></li>
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