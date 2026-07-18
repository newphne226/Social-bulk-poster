"use client";

import * as React from "react";
import { Calendar, Tag, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const posts = [
  {
    slug: "social-media-trends-2024",
    title: "Social Media Trends 2024: What Creators Need to Know",
    excerpt: "From AI-generated content to short-form video dominance, here are the trends shaping social media this year.",
    category: "Trends",
    date: "2024-01-15",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
  },
  {
    slug: "instagram-reels-strategy",
    title: "Instagram Reels Strategy: How to Grow 10K Followers in 30 Days",
    excerpt: "A step-by-step guide to creating viral Reels, optimizing posting times, and leveraging the algorithm.",
    category: "Instagram",
    date: "2024-01-10",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
  },
  {
    slug: "linkedin-content-strategy",
    title: "LinkedIn Content Strategy for B2B: From 0 to 100K Impressions",
    excerpt: "How we helped a SaaS startup generate 500+ qualified leads using strategic LinkedIn content.",
    category: "LinkedIn",
    date: "2024-01-05",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
  },
  {
    slug: "ai-social-media-tools",
    title: "Best AI Tools for Social Media in 2024: Complete Comparison",
    excerpt: "We tested 20+ AI tools for content creation, scheduling, and analytics. Here's our honest review.",
    category: "Tools",
    date: "2024-01-02",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
  },
  {
    slug: "pinterest-marketing-guide",
    title: "Pinterest Marketing 2024: The Complete Guide for E-commerce",
    excerpt: "How to drive traffic and sales with Pinterest. Boards, pins, ads, and SEO strategies that work.",
    category: "Pinterest",
    date: "2023-12-28",
    readTime: "14 min read",
    image: "https://images.unsplash.com/photo-1558655146-9f40137ef565?w=800&h=400&fit=crop",
  },
  {
    slug: "x-twitter-algorithm",
    title: "Understanding the X (Twitter) Algorithm in 2024",
    excerpt: "Deep dive into how the X algorithm ranks tweets. Tips to increase reach and engagement organically.",
    category: "X (Twitter)",
    date: "2023-12-20",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 text-white shadow-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-semibold text-lg text-slate-900 dark:text-white">SocialPilot</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Home</a>
              <a href="/blog" className="text-sm font-medium text-amber-600 dark:text-amber-400">Blog</a>
              <a href="/features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Features</a>
              <a href="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Pricing</a>
              <a href="https://chrome.google.com/webstore/detail/socialpilot" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-amber-500/25">Get Extension</a>
            </nav>            </div>
          </div>
        </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-8">
            <span>📝</span>
            <span>Latest insights on social media marketing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            SocialPilot <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            Expert tips, strategies, and tutorials for growing your social media presence. Written by creators, for creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-xl shadow-amber-500/30 px-8 py-4 text-lg">
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Get the Extension
              </span>
            </Button>
            <a href="#latest">
              <Button size="lg" variant="outline" className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 px-8 py-4 text-lg">
                Browse Articles
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {["All", "Trends", "Instagram", "LinkedIn", "X (Twitter)", "Pinterest", "Tools", "AI"].map((cat) => (
              <button
                key={cat}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  cat === "All"
                    ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg shadow-amber-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.slug} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-700 transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold">{post.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">{post.excerpt}</p>
                  <a href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-sm hover:gap-2 transition-all">
                    Read more <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12">
            <Button variant="outline" size="icon" className="h-10 w-10" disabled>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            {[1, 2, 3].map((n) => (
              <Button
                key={n}
                variant={n === 1 ? "default" : "outline"}
                className="h-10 w-10"
              >
                {n}
              </Button>
            ))}
            <Button variant="outline" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl bg-gradient-to-r from-amber-500 to-pink-500 p-10 sm:p-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Never Miss an Article
            </h2>
            <p className="text-amber-100 text-lg mb-8 max-w-lg mx-auto">
              Get the latest social media tips, strategies, and tutorials delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border-0 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <Button size="lg" className="w-full sm:w-auto bg-white text-amber-600 hover:bg-amber-50 px-8 py-3 text-lg font-semibold shadow-xl">
                Subscribe
              </Button>
            </div>
            <p className="mt-6 text-amber-200 text-sm">
              No spam • Unsubscribe anytime • 15,000+ subscribers
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
                <li><a href="#" className="hover:text-amber-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Platforms</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">API Docs</a></li>
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