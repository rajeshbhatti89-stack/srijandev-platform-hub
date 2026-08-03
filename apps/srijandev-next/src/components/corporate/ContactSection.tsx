'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Info Side */}
          <div>
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-400 mb-3">
              Get In Touch
            </h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
              Let's Build Your Enterprise Solution
            </p>
            <p className="text-slate-300 text-base leading-relaxed mb-8">
              Schedule an architecture consultation with our engineering team or request a customized proposal for your digital transformation roadmap.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 rounded-2xl glass-panel border border-slate-800">
                <div className="p-3 rounded-xl bg-brand-500/20 text-brand-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Global Headquarters</h4>
                  <p className="text-sm text-slate-400">Tech Park, Outer Ring Rd, Bengaluru, KA 560103</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl glass-panel border border-slate-800">
                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Direct Email</h4>
                  <p className="text-sm text-slate-400">contact@srijandev.com • sales@srijandev.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl glass-panel border border-slate-800">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Enterprise Support</h4>
                  <p className="text-sm text-slate-400">+91 (800) SRIJAN-DEV • 24/7 Hotline</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 sm:p-10 rounded-3xl border border-brand-500/30 shadow-glow-purple"
          >
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-sm text-slate-300">Our senior solutions architect will contact you within 2 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-2">Request Enterprise Consultation</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Rajesh Bhatti"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Corporate Email</label>
                    <input
                      type="email"
                      required
                      placeholder="rajesh@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Service of Interest</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
                  >
                    <option value="web">Web Application & Next.js 15 Portal</option>
                    <option value="ai">AI Engineering & LLM Automation</option>
                    <option value="cloud">Cloud DevOps Infrastructure</option>
                    <option value="erp">Business SaaS Platform Implementation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Project Scope & Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your technical requirements, estimated timeline, and goals..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-base shadow-glow-purple flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02]"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Proposal Request</span>
                </button>
              </form>
            )}
          </motion.div>

        </div>

      </div>
    </section>
  );
};
