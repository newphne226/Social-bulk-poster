"use client";

import * as React from "react";
import { Calendar, Tag, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

const posts = [
  {
    slug: "social-media-trends-2024",
    title: "Social Media Trends 2024: What Creators Need to Know",
    excerpt: "From AI-generated content to short-form video dominance, here are the trends shaping social media this year.",
    category: "Trends",
    date: "2024-01-15",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
    content: `
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
        The social media landscape is evolving faster than ever. As we move through 2024, several key trends are emerging that every creator and marketer needs to understand.
      </p>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">1. AI-Generated Content Goes Mainstream</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        AI tools for content creation have moved from experimental to essential. From AI-generated captions to automated video editing, creators who embrace these tools are seeing significant time savings and engagement boosts.
      </p>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">2. Short-Form Video Dominance</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        Short-form video continues to dominate across all platforms. Instagram Reels, TikTok, and YouTube Shorts are where the attention is. The key is consistency and authenticity over production value.
      </p>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">3. Social Commerce Explosion</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        Social commerce is no longer experimental. Instagram Shopping, TikTok Shop, and Pinterest Shopping are driving real revenue. Brands that integrate shopping seamlessly into content are winning.
      </p>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">4. AI-Powered Personalization</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        Platforms are using AI to deliver hyper-personalized feeds. Understanding how these algorithms work & creating content that signals relevance is crucial for reach.
      </p>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">5. Authenticity Over Polish</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        Audiences are increasingly rejecting overly polished, corporate-feeling content. Raw, authentic, behind-the-scenes content outperforms highly produced content across all platforms.
      </p>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">6. Community Over Followers</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        Building engaged communities matters more than follower counts. Private communities, Discord servers, and close friends lists are where real engagement happens.
      </p>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">7. SEO for Social</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        Social platforms are becoming search engines. TikTok and Instagram are now primary search engines for Gen Z. Optimizing captions, hashtags, and profile keywords for search is essential.
      </p>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">8. Creator Economy Maturity</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        The creator economy is maturing. Creators are building real businesses with diversified revenue streams: sponsorships, digital products, courses, memberships, and affiliate marketing.
      </p>
      
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 mt-12">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Key Takeaway</h3>
        <p className="text-slate-600 dark:text-slate-300">
          The creators who win in 2024 will be those who embrace AI tools, prioritize authenticity, build genuine communities, and diversify their revenue streams. The tools are available &mdash; the execution is up to you.
        </p>
      </div>
    `,
  },
  {
    slug: "instagram-reels-strategy",
    title: "Instagram Reels Strategy: How to Grow 10K Followers in 30 Days",
    excerpt: "A step-by-step guide to creating viral Reels, optimizing posting times, and leveraging the algorithm.",
    category: "Instagram",
    date: "2024-01-10",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
    content: `
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
        Instagram Reels is the single biggest growth lever on the platform right now. Here's the exact strategy we used to grow accounts from 0 to 10K+ followers in 30 days.
      </p>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">Phase 1: Foundation (Days 1-3)</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        Before you post a single Reel, nail your foundation.
      </p>
      <ul className="space-y-2 text-slate-600 dark:text-slate-300 mb-6 list-disc list-inside">
        <li>Optimize your bio with keywords and a clear value proposition</li>
        <li>Set up Linktree or similar with your best content</li>
        <li>Create 3-5 content pillars (topics you'll rotate)</li>
        <li>Set up saved replies for common DMs</li>
        <li>Turn on Instagram Insights</li>
      </ul>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">Phase 2: Content Strategy (Days 4-10)</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">Post 2 Reels per day. Here's the content mix:</p>
      <ul className="space-y-2 text-slate-600 dark:text-slate-300 mb-6 list-disc list-inside">
        <li><strong>40% Educational</strong> - Teach something valuable in your niche</li>
        <li><strong>30% Entertainment</strong> - Relatable humor, trends, behind-the-scenes</li>
        <li><strong>20% Authority</strong> - Case studies, results, testimonials</li>
        <li><strong>10% Personal</strong> - Behind the scenes, journey, values</li>
      </ul>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">The Viral Reel Formula</h2>
      <ol className="space-y-3 list-decimal list-inside text-slate-600 dark:text-slate-300 mb-6">
        <li><strong>Hook (0-3 seconds):</strong> Visual + verbal hook that stops the scroll</li>
        <li><strong>Value delivery (3-15 seconds):</strong> Deliver on the hook's promise</li>
        <li><strong>Pattern interrupt (every 3-4 seconds):</strong> Text overlay, camera angle change, zoom</li>
        <li><strong>Call to action (last 2 seconds):</strong> One clear CTA &mdash; save, share, comment, follow</li>
      </ol>
      
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 mt-8">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Pro Tip: The 3-Second Rule</h2>
        <p className="text-slate-600 dark:text-slate-300">
          If you don't hook them in 3 seconds, they scroll past. Spend 50% of your editing time on the first 3 seconds.
        </p>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">Posting Schedule & Optimization</h2>
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left p-3 font-semibold">Day</th>
            <th className="text-left p-3 font-semibold">Post 1 (9 AM)</th>
            <th className="text-left p-3 font-semibold">Post 2 (7 PM)</th>
          </tr>
        </thead>
                    <tbody>
          <tr className="border-b border-slate-100 dark:border-slate-700"><td className="p-3 font-medium">Mon</td><td className="p-3">Educational</td><td className="p-3">Entertainment</td></tr>
          <tr className="border-b border-slate-100 dark:border-slate-700"><td className="p-3 font-medium">Tue</td><td className="p-3">Authority</td><td className="p-3">Educational</td></tr>
          <tr className="border-b border-slate-100 dark:border-slate-700"><td className="p-3 font-medium">Wed</td><td className="p-3">Entertainment</td><td className="p-3">Authority</td></tr>
          <tr className="border-b border-slate-100 dark:border-slate-700"><td className="p-3 font-medium">Thu</td><td className="p-3">Educational</td><td className="p-3">Personal</td></tr>
          <tr className="border-b border-slate-100 dark:border-slate-700"><td className="p-3 font-medium">Fri</td><td className="p-3">Authority</td><td className="p-3">Educational</td></tr>
          <tr className="border-b border-slate-100 dark:border-slate-700"><td className="p-3 font-medium">Sat</td><td className="p-3">Personal</td><td className="p-3">Entertainment</td></tr>
          <tr><td className="p-3 font-medium">Sun</td><td className="p-3">Rest/Repurpose</td><td className="p-3">Rest/Repurpose</td></tr>
        </tbody>
      </table>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">Growth Tactics That Actually Work</h2>
      <ul className="space-y-3 list-disc list-inside text-slate-600 dark:text-slate-300 mb-8">
        <li><strong>Collaborate</strong> with 3-5 creators in your niche weekly</li>
        <li>Reply to <strong>every comment</strong> within the first hour</li>
        <li>Use <strong>3-5 niche hashtags</strong> + 1-2 broad ones</li>
        <li>Repurpose TikToks as Reels (remove watermark!)</li>
        <li>Post <strong>Stories daily</strong> &mdash; they feed the algorithm differently</li>
        <li>Run a <strong>monthly giveaway</strong> with niche-relevant prizes</li>
      </ul>
      
      <div className="bg-gradient-to-r from-amber-500 to-pink-500 rounded-2xl p-8 text-white mt-12">
        <h3 className="text-2xl font-bold mb-4">Ready to Start Growing?</h2>
        <p className="text-amber-100 mb-6 max-w-lg">
          SocialPilot helps you schedule, optimize, and analyze your Reels across all platforms. Free 14-day trial.
        </p>
        <a href="https://chrome.google.com/webstore/detail/socialpilot" target="_blank" rel="noopener noreferrer">
          <button className="bg-white text-amber-600 hover:bg-amber-50 px-8 py-3 rounded-xl font-semibold text-lg shadow-xl">
            Get SocialPilot Free &rarr;
          </button>
        </a>
      </div>
    `,
  },
  {
    slug: "linkedin-content-strategy",
    title: "LinkedIn Content Strategy for B2B: From 0 to 100K Impressions",
    excerpt: "How we helped a SaaS startup generate 500+ qualified leads using strategic LinkedIn content.",
    category: "LinkedIn",
    date: "2024-01-05",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    content: `
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
        LinkedIn is the most underutilized platform for B2B growth. Here's the exact strategy we used to take a SaaS startup from 0 to 100K monthly impressions and 500+ qualified leads in 6 months.
      </p>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">The Foundation: Profile Optimization</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        Before posting, your profile must convert visitors into connections.
      </p>
      <ul className="space-y-2 text-slate-600 dark:text-slate-300 mb-6 list-disc list-inside">
        <li><strong>Headline:</strong> Value proposition + keywords (not just job title)</li>
        <li><strong>Banner:</strong> Professional, shows value prop or social proof</li>
        <li><strong>About:</strong> Story format &mdash; problem you solve, who you help, proof</li>
        <li><strong>Featured:</strong> Pin 3 best posts, case studies, or media mentions</li>
        <li><strong>Skills:</strong> 15-20 relevant skills (endorsements matter for search)</li>
      </ul>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">The Content Framework: 3 Content Types</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">Rotate these three content types for maximum reach and authority.</p>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 00.707.293h7.707a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2v-5.586a1 1 0 00-.293-.707l-5.414-5.414a1 1 0 00-.707-.293H7a2 2 0 01-2-2v-2z" /></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Educational (50%)</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">How-to guides, industry insights, frameworks, tutorials. Positions you as an expert.</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Social Proof (30%)</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Client wins, testimonials, case studies, metrics. Builds trust and authority.</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Personal/Insight (20%)</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Behind-the-scenes, lessons learned, failures, values. Humanizes your brand.</p>
        </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">The Posting Schedule</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">Consistency beats intensity. Here's the schedule that worked:</p>
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left p-3 font-semibold">Day</th>
            <th className="text-left p-3 font-semibold">Content Type</th>
            <th className="text-left p-3 font-semibold">Time</th>
          </tr>
        </thead>
                    <tbody>
          <tr className="border-b border-slate-100 dark:border-slate-700"><td className="p-3 font-medium">Mon</td><td className="p-3">Educational</td><td className="p-3">8:00 AM EST</td></tr>
          <tr><td className="p-3 font-medium">Tue</td><td className="p-3">Social Proof</td><td className="p-3">12:00 PM EST</td></tr>
          <tr><td className="p-3 font-medium">Wed</td><td className="p-3">Educational</td><td className="p-3">8:00 AM EST</td></tr>
          <tr><td className="p-3 font-medium">Thu</td><td className="p-3">Personal/Insight</td><td className="p-3">12:00 PM EST</td></tr>
          <tr><td className="p-3 font-medium">Fri</td><td className="p-3">Educational</td><td className="p-3">8:00 AM EST</td></tr>
        </tbody>
      </table>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">Growth Tactics That Worked</h2>
      <ul className="space-y-3 list-disc list-inside text-slate-600 dark:text-slate-300 mb-8">
        <li><strong>Comment strategically:</strong> 20 meaningful comments/day on target accounts' posts</li>
        <li><strong>DM strategy:</strong> 5 personalized DMs/day to ideal prospects (no pitch, just value)</li>
        <li><strong>Comment on competitor posts:</strong> Add value, don't pitch</li>
        <li><strong>LinkedIn Newsletter:</strong> Weekly deep-dive to email subscribers</li>
        <li><strong>Employee advocacy:</strong> Get team to engage with company posts</li>
        <li><strong>Repurpose content:</strong> Blog &rarr; LinkedIn carousel &rarr; Twitter thread &rarr; Newsletter</li>
      </ul>
      
      <div className="bg-gradient-to-r from-amber-500 to-pink-500 rounded-2xl p-8 text-white mt-12">
        <h3 className="text-2xl font-bold mb-4">Ready to Scale Your LinkedIn?</h2>
        <p className="text-amber-100 mb-6 max-w-lg">
          SocialPilot helps you schedule, analyze, and optimize your LinkedIn content alongside all your other platforms.
        </p>
        <a href="https://chrome.google.com/webstore/detail/socialpilot" target="_blank" rel="noopener noreferrer">
          <button className="bg-white text-amber-600 hover:bg-amber-50 px-8 py-3 rounded-xl font-semibold text-lg shadow-xl">
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2-2v14a2 2 0 002 2z" /></svg>
              Try SocialPilot Free
            </span>
          </button>
        </a>
      </div>
    `,
  },
];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find(p => p.slug === params.slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 text-white shadow-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2-2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-semibold text-lg text-slate-900 dark:text-white">SocialPilot</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Home</Link>
              <Link href="/blog" className="text-sm font-medium text-amber-600 dark:text-amber-400">Blog</Link>
              <Link href="/features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Features</Link>
              <Link href="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Pricing</Link>
              <a href="https://chrome.google.com/webstore/detail/socialpilot" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-amber-500/25">Get Extension</a>
            </nav>            </div>
          </div>
        </header>

      <article className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{post.title}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-6">
              <span>{post.category}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm mb-8">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
              <span>&bull;</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden mb-12">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold">{post.category}</span>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Share & Navigation */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Share:</span>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors" aria-label="Share on Twitter">
                  <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 003 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 13-18.56z"/></svg>
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors" aria-label="Share on LinkedIn">
                  <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM12 17.25a2.251 2.251 0 01-2.25-2.25 2.251 2.251 0 012.25-2.25 2.251 2.251 0 012.25 2.25 2.251 2.251 0 01-2.25 2.25zm3.5-8h-3v5.5h-2V9.5h-2V12h2v4.5h3V9.5h3V9h-3V5.5c0-.836.464-1.25 1.158-1.449.506-.136 1.062-.102 1.493.078l.013.02c.21.106.362.342.362.606v5.5H19l.002 4.501h-2.5V19h-2.5v-4.5c0-.939-.054-1.657-.328-2.052-.278-.394-.743-.47-1.122-.47h-2.1v-1.75h2.5c.55 0 .75-.445.75-1s-.45-1-.75-1z"/></svg>
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors" aria-label="Share on Facebook">
                  <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.046V9.433c0-3.007 1.792-4.667 4.533-4.667 1.312 0 2.686.235 2.686.235v2.22h-1.81c-1.152 0-1.447.679-1.447 1.66v2.126h2.773l-.41 3.083h-2.27V21h3.823c1.196 0 2.26-1.056 2.26-2.323v-4.849c0-.784-.168-1.452-.47-1.97-.296-.515-.86-.65-1.56-.65-.65 0-1.23.29-1.53.65-.3.37-.47.77-.47 1.77v.63h3.128Z"/></svg>
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/blog" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">&larr; Back to Blog</Link>
                <Link href={`/blog/${posts[posts.findIndex(p => p.slug === post.slug) + 1]?.slug || posts[0].slug}`} className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline">Next Article &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
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
                <li><Link href="/about" className="hover:text-amber-400 transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-amber-400 transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-amber-400 transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-amber-400 transition-colors">Cookie Policy</Link></li>
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