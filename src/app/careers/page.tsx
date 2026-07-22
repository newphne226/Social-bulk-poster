"use client";

import * as React from "react";
import { Chrome, Users, Target, Shield, Heart, Zap, GraduationCap, Coffee, MapPin, Mail, Phone, Globe, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CareersPage() {
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "Remote (US/EU)",
      type: "Full-time",
      experience: "5+ years",
      description: "Build the next generation of our Chrome extension and web dashboard. Work with React, TypeScript, and modern tooling.",
      requirements: ["React, TypeScript, Next.js", "Chrome Extension APIs", "Tailwind CSS, Framer Motion", "Testing (Jest, Cypress)"],
      benefits: ["Competitive salary + equity", "401k matching", "Health + dental + vision", "Home office stipend", "Learning budget"],
    },
    {
      id: 2,
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Remote (US)",
      type: "Full-time",
      experience: "3+ years",
      description: "Build and scale our API services. Work with Node.js, Prisma, PostgreSQL, and modern cloud infrastructure.",
      requirements: ["Node.js, TypeScript", "PostgreSQL, Prisma", "AWS/GCP, Docker", "GraphQL/REST APIs"],
      benefits: ["Competitive salary + equity", "401k matching", "Health + dental + vision", "Home office stipend", "Learning budget"],
    },
    {
      id: 3,
      title: "Product Designer",
      department: "Design",
      location: "Remote (US/EU)",
      type: "Full-time",
      experience: "4+ years",
      description: "Design intuitive experiences for our Chrome extension and web dashboard. Own the design system and user research.",
      requirements: ["Figma expertise", "Design systems", "User research", "Prototyping"],
      benefits: ["Competitive salary + equity", "401k matching", "Health + dental + vision", "Design tool budget", "Conference budget"],
    },
    {
      id: 4,
      title: "Content Marketing Lead",
      department: "Marketing",
      location: "Remote (US)",
      type: "Full-time",
      experience: "5+ years",
      description: "Own our content strategy. Create blog posts, tutorials, case studies, and video content that drives organic growth.",
      requirements: ["SEO/content strategy", "Social media expertise", "Video editing", "Analytics"],
      benefits: ["Competitive salary + equity", "401k matching", "Health + dental + vision", "Creative budget", "Conference budget"],
    },
    {
      id: 5,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote (US)",
      type: "Full-time",
      experience: "3+ years",
      description: "Help customers succeed with SMTools. Onboard new users, reduce churn, and gather product feedback.",
      requirements: ["SaaS experience", "Customer communication", "Data analysis", "Intercom/Zendesk"],
      benefits: ["Competitive salary + equity", "401k matching", "Health + dental + vision", "Home office stipend", "Learning budget"],
    },
    {
      id: 6,
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote (US)",
      type: "Full-time",
      experience: "4+ years",
      description: "Build and maintain our cloud infrastructure. CI/CD, monitoring, scaling, and security.",
      requirements: ["AWS/GCP", "Kubernetes, Docker", "Terraform", "Monitoring (Datadog/Prometheus)"],
      benefits: ["Competitive salary + equity", "401k matching", "Health + dental + vision", "Home office stipend", "Learning budget"],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-amber-200/50 dark:border-slate-700/50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 text-white shadow-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2-2V5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-semibold text-lg text-slate-900 dark:text-white">SMTools</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Features</a>
              <a href="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Pricing</a>
              <a href="/blog" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Blog</a>
              <a href="/docs" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Docs</a>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Sign In
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-lg shadow-amber-500/25">
                Get Extension
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-medium">We're hiring! Join our mission to simplify social media</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Build the Future of <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">Social Media Tools</span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
              We're a small, passionate team building tools that help 50,000+ creators save hours every week. 
              Join us in making social media management effortless.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#jobs">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-xl shadow-amber-500/30 px-8 py-4 text-lg">
                  View Open Roles
                </Button>
              </a>
              <a href="#culture">
                <Button size="lg" variant="outline" className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 px-8 py-4 text-lg">
                  Our Culture
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-5xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Users, label: "Team Size", value: "15+" },
              { icon: Globe, label: "Countries", value: "8" },
              { icon: Heart, label: "Retention", value: "95%" },
              { icon: Zap, label: "Growth YoY", value: "3x" },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-amber-500/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                    <stat.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="font-medium text-slate-600 dark:text-slate-400">{stat.label}</span>
                </div>
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section id="culture" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Our <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">Culture & Values</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              We're builders who believe in transparency, user obsession, and continuous learning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "User Obsession", desc: "Every decision starts with our users. We talk to them weekly, iterate daily, and ship features that solve real problems." },
              { icon: Shield, title: "Transparency", desc: "Open salaries, open roadmap, open communication. No secrets, no politics — just great work." },
              { icon: Zap, title: "Bias for Action", desc: "Ship fast, learn faster. We'd rather ask forgiveness than permission. Done is better than perfect." },
              { icon: Heart, title: "Empathy First", desc: "We design for real humans with real constraints. Accessibility, privacy, and mental health matter." },
              { icon: GraduationCap, title: "Continuous Learning", desc: "$2,000/year learning budget. Conference trips, courses, books — if it helps you grow, we'll pay for it." },
              { icon: Coffee, title: "Work-Life Harmony", desc: "Flexible hours, unlimited PTO, no meetings Wednesdays. We trust you to do your best work on your terms." },
            ].map((value, i) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Benefits & <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">Perks</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              We invest in our people because great products come from happy, healthy teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Health & Wellness", items: ["Medical, dental, vision (100% covered)", "Mental health support", "Wellness stipend", "Gym membership reimbursement"] },
              { icon: Briefcase, title: "Financial", items: ["Competitive salary + equity", "401k with 4% match", "Annual bonus", "Equipment budget ($3,000)"] },
              { icon: GraduationCap, title: "Growth", items: ["$2,000/year learning budget", "Conference trips", "Mentorship program", "Internal tech talks"] },
              { icon: MapPin, title: "Flexibility", items: ["Fully remote", "Flexible hours", "Unlimited PTO", "No-meeting Wednesdays"] },
              { icon: Zap, title: "Equipment", items: ["MacBook Pro (M-series)", "External monitor", "Ergonomic keyboard/mouse", "Standing desk stipend"] },
              { icon: Users, title: "Team", items: ["Quarterly team retreats", "Virtual coffee chats", "Annual offsite", "Swag & merch"] },
            ].map((benefit, i) => (
              <div key={i} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-xl hover:shadow-amber-500/10 transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{benefit.title}</h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  {benefit.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <svg className="h-4 w-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section id="jobs" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Open <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">Roles</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Don't see your dream role? We're always looking for exceptional talent. Email us at jobs@smtools.online
            </p>
          </div>

          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-700 transition-all">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold">{job.department}</span>
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm">{job.type}</span>
                        <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">{job.location}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{job.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{job.experience} experience</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" onClick={() => window.open(`mailto:jobs@smtools.online?subject=Application: ${job.title}`, "_blank")}>
                        Apply Now
                      </Button>
                      <Button variant="ghost" size="sm">
                        Share
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">About the Role</h4>
                      <p className="text-slate-600 dark:text-slate-400">{job.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <svg className="h-4 w-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Benefits</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits.map((benefit) => (
                        <span key={benefit} className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
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
              Ready to Join Us?
            </h2>
            <p className="text-amber-100 text-lg mb-8 max-w-lg mx-auto">
              We're looking for passionate people who want to make social media management effortless for millions of creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="w-full sm:w-auto bg-white text-amber-600 hover:bg-amber-50 px-8 py-4 text-lg font-semibold shadow-xl" onClick={() => window.open("mailto:jobs@smtools.online", "_blank")}>
                <Mail className="h-5 w-5 mr-2" />
                Apply Now
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold">
                View All Roles
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
                <span className="font-semibold text-lg">SMTools</span>
              </div>
              <p className="text-slate-400 text-sm">The fastest way to schedule &amp; publish to 5 platforms.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/features" className="hover:text-amber-400 transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-amber-400 transition-colors">Pricing</a></li>
                <li><a href="/careers" className="hover:text-amber-400 transition-colors">Careers</a></li>
                <li><a href="/docs" className="hover:text-amber-400 transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/about" className="hover:text-amber-400 transition-colors">About</a></li>
                <li><a href="/blog" className="hover:text-amber-400 transition-colors">Blog</a></li>
                <li><a href="/contact" className="hover:text-amber-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</a></li>
                <li><a href="/cookies" className="hover:text-amber-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            © 2024 SMTools. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}