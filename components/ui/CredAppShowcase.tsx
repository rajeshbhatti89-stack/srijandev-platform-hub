'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Receipt, ArrowRight, Sparkles, CheckCircle2, Clock, MapPin, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface AppSlide {
  id: string;
  badge: string;
  badgeColor: string;
  accentColor: string;
  glowColor: string;
  title: string;
  subtitle: string;
  tagline: string;
  linkUrl: string;
  icon: React.ReactNode;
  metrics: { label: string; value: string }[];
  previewContent: React.ReactNode;
}

export default function CredAppShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides: AppSlide[] = [
    {
      id: 'guard-app',
      badge: 'FIELD SECURITY OS',
      badgeColor: 'text-[#00ff87] border-[#00ff87]/40 bg-[#00ff87]/10',
      accentColor: '#00ff87',
      glowColor: 'rgba(0,255,135,0.22)',
      title: 'Guard Companion App',
      subtitle: 'Real-time Patrol & Geofence Engine',
      tagline: 'GPS-guided check-ins, biometric attendance, and one-tap SOS emergency response for security personnel.',
      linkUrl: '/guard',
      icon: <Shield className="w-5 h-5 text-[#00ff87]" />,
      metrics: [
        { label: 'GPS Precision', value: '< 2.5m' },
        { label: 'SOS Response', value: 'Instant' },
        { label: 'Shift Sync', value: '100% Live' },
      ],
      previewContent: (
        <div className="space-y-3">
          {/* Active Guard Status Mini-Widget */}
          <div className="p-3.5 rounded-xl bg-[#090a0d] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00ff87]/15 border border-[#00ff87]/30 flex items-center justify-center">
                <Shield size={16} className="text-[#00ff87]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Main Entrance Post</p>
                <p className="text-[10px] text-gray-400 font-mono">Guard: Rajesh (GC-102)</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono text-[#00ff87] bg-[#00ff87]/10 border border-[#00ff87]/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse" />
              ON DUTY
            </span>
          </div>

          {/* Quick Patrol Checkpoints */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-[#0d0e14] border border-white/[0.05]">
              <p className="text-[9px] uppercase font-mono text-gray-500">Patrol Progress</p>
              <p className="text-xs font-bold text-white mt-0.5">8 / 8 Checkpoints</p>
              <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-[#00ff87] w-full" />
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d0e14] border border-white/[0.05]">
              <p className="text-[9px] uppercase font-mono text-gray-500">Geofence Lock</p>
              <p className="text-xs font-bold text-[#00ff87] mt-0.5 flex items-center gap-1">
                <CheckCircle2 size={12} /> Perimeter Safe
              </p>
              <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-[#00ff87] w-[95%]" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'hr-portal',
      badge: 'ENTERPRISE HRMS',
      badgeColor: 'text-[#f5d061] border-[#f5d061]/40 bg-[#f5d061]/10',
      accentColor: '#f5d061',
      glowColor: 'rgba(245,208,97,0.22)',
      title: 'HR Management Suite',
      subtitle: 'Complete ESS & Payroll Engine',
      tagline: 'Automated payslips, digital employee records, leave approval matrices, and visual org hierarchies.',
      linkUrl: '/hr',
      icon: <Users className="w-5 h-5 text-[#f5d061]" />,
      metrics: [
        { label: 'HR Modules', value: '14 Active' },
        { label: 'Payroll Auto', value: 'Instant' },
        { label: 'Compliance', value: '100% Tax' },
      ],
      previewContent: (
        <div className="space-y-3">
          {/* Active Employee Roster Widget */}
          <div className="p-3.5 rounded-xl bg-[#090a0d] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f5d061]/15 border border-[#f5d061]/30 flex items-center justify-center">
                <Users size={16} className="text-[#f5d061]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Workforce Hierarchy</p>
                <p className="text-[10px] text-gray-400 font-mono">14 Departments Synced</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono text-[#f5d061] bg-[#f5d061]/10 border border-[#f5d061]/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5d061] animate-pulse" />
              LIVE ESS
            </span>
          </div>

          {/* Quick Leave & Attendance Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-[#0d0e14] border border-white/[0.05]">
              <p className="text-[9px] uppercase font-mono text-gray-500">Live Attendance</p>
              <p className="text-xs font-bold text-white mt-0.5">98.4% Present</p>
              <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-[#f5d061] w-[98%]" />
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d0e14] border border-white/[0.05]">
              <p className="text-[9px] uppercase font-mono text-gray-500">Payslip Engine</p>
              <p className="text-xs font-bold text-[#f5d061] mt-0.5 flex items-center gap-1">
                <CheckCircle2 size={12} /> Auto-Dispatched
              </p>
              <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-[#f5d061] w-full" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'bill-plus',
      badge: 'FINANCIAL AUTOMATION',
      badgeColor: 'text-[#00e5ff] border-[#00e5ff]/40 bg-[#00e5ff]/10',
      accentColor: '#00e5ff',
      glowColor: 'rgba(0,229,255,0.22)',
      title: 'Smart Bill & Invoice Engine',
      subtitle: 'Plus OS Logistics & Operations',
      tagline: 'Multi-tenant automated billing, PSH calculations, material dispatch receipts, and operations telemetry.',
      linkUrl: '/plus',
      icon: <Receipt className="w-5 h-5 text-[#00e5ff]" />,
      metrics: [
        { label: 'GST Format', value: 'Compliant' },
        { label: 'PDF Export', value: '1-Click' },
        { label: 'Multi-Tenant', value: 'Integrated' },
      ],
      previewContent: (
        <div className="space-y-3">
          {/* Active Invoice Generator Widget */}
          <div className="p-3.5 rounded-xl bg-[#090a0d] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/15 border border-[#00e5ff]/30 flex items-center justify-center">
                <Receipt size={16} className="text-[#00e5ff]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Invoice #INV-2026-09</p>
                <p className="text-[10px] text-gray-400 font-mono">Enterprise Service Pack</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
              VERIFIED
            </span>
          </div>

          {/* Quick Billing Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-[#0d0e14] border border-white/[0.05]">
              <p className="text-[9px] uppercase font-mono text-gray-500">Tax Breakdown</p>
              <p className="text-xs font-bold text-white mt-0.5">18% GST Calculated</p>
              <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-[#00e5ff] w-full" />
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d0e14] border border-white/[0.05]">
              <p className="text-[9px] uppercase font-mono text-gray-500">Receipt Dispatch</p>
              <p className="text-xs font-bold text-[#00e5ff] mt-0.5 flex items-center gap-1">
                <CheckCircle2 size={12} /> Instant PDF
              </p>
              <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-[#00e5ff] w-full" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Auto slide timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const activeSlide = slides[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full max-w-[540px] select-none"
    >
      {/* Dynamic Ambient Background Glow based on current slide */}
      <div
        className="absolute -inset-4 rounded-3xl blur-[80px] opacity-25 transition-all duration-700 pointer-events-none"
        style={{ backgroundColor: activeSlide.accentColor }}
      />

      {/* Main Convex Device Showcase Container */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#181a24] via-[#12131a] to-[#0a0b0e] border border-white/[0.12] shadow-[12px_12px_36px_rgba(0,0,0,0.85),-4px_-4px_16px_rgba(255,255,255,0.03),inset_0_1px_0_rgba(255,255,255,0.2)] p-6 sm:p-7 overflow-hidden">
        
        {/* Top 1px Bevel Sheen */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

        {/* Tab Selector Bar */}
        <div className="flex items-center justify-between gap-1 p-1 bg-[#090a0d] border border-white/[0.08] rounded-2xl mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                idx === currentIndex
                  ? 'bg-gradient-to-b from-[#222530] to-[#14151c] text-white shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] border border-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  idx === currentIndex ? 'animate-pulse' : 'opacity-40'
                }`}
                style={{ backgroundColor: s.accentColor }}
              />
              <span className="truncate">{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Animated Slide Content */}
        <div className="min-h-[280px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`inline-block mb-2 px-3 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase rounded-full border ${activeSlide.badgeColor}`}>
                    {activeSlide.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    {activeSlide.title}
                  </h3>
                  <p className="text-xs font-medium tracking-wide" style={{ color: activeSlide.accentColor }}>
                    {activeSlide.subtitle}
                  </p>
                </div>

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/[0.08] bg-[#121318] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.5)] flex-shrink-0"
                  style={{ boxShadow: `0 0 20px ${activeSlide.glowColor}` }}
                >
                  {activeSlide.icon}
                </div>
              </div>

              {/* Tagline Description */}
              <p className="text-[#8e95a5] text-xs sm:text-sm leading-relaxed">
                {activeSlide.tagline}
              </p>

              {/* Interactive Live Screen Mockup */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0f1015] p-3.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8),0_4px_16px_rgba(0,0,0,0.4)]">
                {activeSlide.previewContent}
              </div>

              {/* Metrics & Launch Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center gap-4">
                  {activeSlide.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="text-[9px] font-mono text-gray-500 uppercase">{m.label}</p>
                      <p className="text-xs font-bold text-white font-mono">{m.value}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href={activeSlide.linkUrl}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white text-[#0a0b0e] text-xs font-bold uppercase tracking-wider shadow-[0_4px_15px_rgba(255,255,255,0.2)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Launch Portal</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Pagination Indicators & Auto-Slide Progress */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex ? 'w-8 bg-[#00ff87]' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              className="w-7 h-7 rounded-full border border-white/[0.08] bg-[#14161f] text-gray-400 hover:text-white hover:border-white/20 flex items-center justify-center transition-all cursor-pointer"
              title="Previous App"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
              className="w-7 h-7 rounded-full border border-white/[0.08] bg-[#14161f] text-gray-400 hover:text-white hover:border-white/20 flex items-center justify-center transition-all cursor-pointer"
              title="Next App"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
