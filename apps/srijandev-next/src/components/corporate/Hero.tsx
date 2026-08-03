'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Layers, Activity, Users, Award, Play } from 'lucide-react';
import { usePortal } from '@/features/portal/PortalContext';

export const Hero: React.FC = () => {
  const { switchPortal } = usePortal();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Animated Mesh Gradients & Floating Glow Orbs */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[140px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[140px] animate-pulse-slow pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Sub-header Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-brand-500/30 text-xs font-semibold text-brand-300 shadow-glow-purple mb-8"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>SrijanDev Enterprise Suite 2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </motion.div>

        {/* Hero Title with Gradient Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-none mb-6"
        >
          Engineering Next-Gen <br />
          <span className="gradient-text">Web Portals & Business Platforms</span>
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10"
        >
          SrijanDev unifies enterprise software development, autonomous AI workflows, and cloud-native workforce management in a single, seamlessly integrated multi-portal ecosystem.
        </motion.p>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={() => switchPortal('platform')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-brand-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-base shadow-glow-purple flex items-center justify-center space-x-3 transform hover:scale-105 transition-all duration-300 group"
          >
            <span>Launch Business Platform</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#services"
            className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel hover:bg-slate-800/60 text-slate-200 hover:text-white font-semibold text-base border border-slate-700/80 flex items-center justify-center space-x-2 transition-colors"
          >
            <Layers className="w-5 h-5 text-brand-400" />
            <span>Explore Services</span>
          </a>
        </motion.div>

        {/* Animated KPI Counter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <div className="glass-card p-5 rounded-2xl glass-card-hover text-center">
            <div className="text-3xl font-extrabold text-white tracking-tight">150+</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Enterprise Projects</div>
          </div>
          <div className="glass-card p-5 rounded-2xl glass-card-hover text-center">
            <div className="text-3xl font-extrabold text-cyan-400 tracking-tight">99.99%</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">SLA Uptime Uptime</div>
          </div>
          <div className="glass-card p-5 rounded-2xl glass-card-hover text-center">
            <div className="text-3xl font-extrabold text-brand-400 tracking-tight">45+</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">AI Agents Deployed</div>
          </div>
          <div className="glass-card p-5 rounded-2xl glass-card-hover text-center">
            <div className="text-3xl font-extrabold text-purple-400 tracking-tight">148k+</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Active SaaS Users</div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
