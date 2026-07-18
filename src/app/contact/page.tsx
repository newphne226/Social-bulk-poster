"use client";

import * as React from "react";
import { Mail, Phone, MapPin, Clock, Send, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <a href="/blog" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Blog</a>
              <a href="/features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Features</a>
              <a href="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Pricing</a>
              <a href="https://chrome.google.com/webstore/detail/socialpilot" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-amber-500/25">Get Extension</a>
            </nav>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-8">
            <span>💬</span>
            <span>We'd love to hear from you</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Let's Start a <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">Conversation</span>
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            Have questions about SocialPilot? Need help with your account? Want to partner with us? 
            Fill out the form and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                {[
                  { icon: Mail, title: "Email Us", content: "support@socialpilot.io", sub: "We respond within 24 hours" },
                  { icon: Clock, title: "Business Hours", content: "Mon–Fri, 9AM–6PM EST", sub: "Weekends: Limited support" },
                  { icon: MapPin, title: "Office", content: "San Francisco, CA", sub: "Remote-first team worldwide" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{item.content}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})} required>
                    <SelectTrigger>
                      <SelectValue placeholder="What's this about?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="press">Press & Media</SelectItem>
                      <SelectItem value="careers">Careers</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us how we can help..."
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-xl shadow-amber-500/30 px-8 py-4 text-lg font-semibold disabled:opacity-50" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                By submitting this form, you agree to our <a href="/privacy" className="text-amber-600 dark:text-amber-400 hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">Quick answers to common questions</p>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "How quickly do you respond to support requests?", a: "We typically respond within 4-6 hours during business hours (Mon-Fri, 9AM-6PM EST). For urgent issues, please mark your request as 'Urgent' in the subject line." },
              { q: "Can I schedule a demo with your team?", a: "Absolutely! Book a 15-minute demo at socialpilot.io/demo or email sales@socialpilot.io. We'd love to show you around." },
              { q: "Do you offer discounts for non-profits or educational institutions?", a: "Yes! We offer 50% off for verified non-profits and educational institutions. Contact us with your organization details to apply." },
              { q: "I found a bug. How do I report it?", a: "Please use the form above and select 'Technical Support' as the subject. Include steps to reproduce, browser/OS version, and screenshots if possible." },
              { q: "Can I suggest a new feature?", a: "We love feature requests! Submit them via the form above with 'Feature Request' in the subject, or email product@socialpilot.io." },
            ].map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-slate-900 dark:text-white pr-4">{faq.q}</span>
                  <ChevronDown className="h-5 w-5 text-slate-500 dark:text-slate-400 transition-transform group-open:rotate-180 flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 animate-in fade-in slide-in-from-top-2 duration-200">
                  {faq.a}
                </div>
              </details>
            ))}
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
                <li><a href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
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