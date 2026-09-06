'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const services = [
  {
    id: 'service-3d-web',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="#00e5ff" strokeWidth="1.5" />
        <path d="M16 9L24 13.5V22.5L16 27L8 22.5V13.5L16 9Z" fill="#00e5ff" opacity="0.15" />
        <circle cx="16" cy="16" r="3" fill="#00e5ff" />
        <line x1="16" y1="13" x2="16" y2="4" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
        <line x1="18.6" y1="14.5" x2="24" y2="10" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
        <line x1="18.6" y1="17.5" x2="24" y2="22" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
      </svg>
    ),
    color: '#00e5ff',
    glow: 'rgba(0,229,255,0.22)',
    badge: 'ACTIVE',
    badgeColor: 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/30',
    title: '3D Web Design & WebGL',
    subtitle: 'Immersive Spatial Experiences',
    description:
      'Custom Three.js environments, GLSL shader programming, and interactive spatial user interfaces. We design and build the web experiences that redefine what a browser can render.',
    features: ['Custom WebGL Shaders', 'Interactive 3D UI', 'Real-Time Rendering', 'Physics Simulation'],
  },
  {
    id: 'service-android',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <rect x="8" y="5" width="16" height="22" rx="3" stroke="#00ff87" strokeWidth="1.5" />
        <rect x="11" y="8" width="10" height="13" rx="1" fill="#00ff87" opacity="0.2" />
        <circle cx="16" cy="24" r="1.5" fill="#00ff87" />
        <line x1="14" y1="6.5" x2="18" y2="6.5" stroke="#00ff87" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: '#00ff87',
    glow: 'rgba(0,255,135,0.22)',
    badge: 'ACTIVE',
    badgeColor: 'bg-[#00ff87]/10 text-[#00ff87] border-[#00ff87]/30',
    title: 'Android App Development',
    subtitle: 'Native & Cross-Platform',
    description:
      'Robust, scalable mobile applications built for performance. From native solutions to cross-platform deployments — engineered for the real world.',
    features: ['Native Android', 'Cross-Platform', 'Offline-First Architecture', 'Performance Optimized'],
  },
  {
    id: 'service-enterprise',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <rect x="3" y="8" width="10" height="8" rx="1.5" stroke="#f5d061" strokeWidth="1.5" />
        <rect x="19" y="8" width="10" height="8" rx="1.5" stroke="#f5d061" strokeWidth="1.5" />
        <rect x="11" y="20" width="10" height="8" rx="1.5" stroke="#f5d061" strokeWidth="1.5" />
        <line x1="8" y1="16" x2="8" y2="24" stroke="#f5d061" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
        <line x1="8" y1="24" x2="16" y2="24" stroke="#f5d061" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
        <line x1="24" y1="16" x2="24" y2="24" stroke="#f5d061" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
        <line x1="24" y1="24" x2="21" y2="24" stroke="#f5d061" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
      </svg>
    ),
    color: '#f5d061',
    glow: 'rgba(245,208,97,0.22)',
    badge: 'ENTERPRISE',
    badgeColor: 'bg-[#f5d061]/10 text-[#f5d061] border-[#f5d061]/30',
    title: 'Enterprise Security & Plus OS',
    subtitle: 'Operations & Workforce',
    description:
      'Real-time workforce tracking, custom admin dashboards, automated operational workflows, and field force management systems — built to scale.',
    features: ['Real-Time Tracking', 'Custom Dashboards', 'Workflow Automation', 'Field Force Management'],
    linkUrl: '/plus',
  },
  {
    id: 'service-hr',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M16 6C18.2091 6 20 7.79086 20 10C20 12.2091 18.2091 14 16 14C13.7909 14 12 12.2091 12 10C12 7.79086 13.7909 6 16 6Z" stroke="#ff2a7a" strokeWidth="1.5" />
        <path d="M8 26C8 21.5817 11.5817 18 16 18C20.4183 18 24 21.5817 24 26" stroke="#ff2a7a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 10C23.6569 10 25 11.3431 25 13C25 14.6569 23.6569 16 22 16" stroke="#ff2a7a" strokeWidth="1.2" opacity="0.6" />
        <path d="M25 24C26.1046 24 27 23.1046 27 22C27 20.3431 25.6569 19 24 19" stroke="#ff2a7a" strokeWidth="1.2" opacity="0.6" />
      </svg>
    ),
    color: '#ff2a7a',
    glow: 'rgba(255,42,122,0.22)',
    badge: 'NEW PLATFORM',
    badgeColor: 'bg-[#ff2a7a]/10 text-[#ff2a7a] border-[#ff2a7a]/30',
    title: 'SrijanDev HR Management',
    subtitle: 'Complete HRMS & ESS Portal',
    description:
      'Digital employee database, org chart tree, LMS leave balance tracker, GPS & web punch attendance, OKRs, talent matrix, and automated payslip generation.',
    features: ['14 HR Modules', 'Visual Org Hierarchy', 'Live Payslip Engine', 'Role-Based Access'],
    linkUrl: '/hr',
  },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="services" ref={ref} className="relative py-28 bg-[#0f1015] overflow-hidden">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-[#00ff87] border border-white/[0.08] bg-[#14161d] rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_8px_rgba(0,0,0,0.4)]">
            Core Ecosystem
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            What We Engineer
          </h2>
          <p className="text-[#8e95a5] max-w-xl mx-auto text-base">
            High-performance web apps, spatial 3D interfaces, native mobile solutions, and enterprise workforce platforms.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.id}
              id={svc.id}
              initial={{ opacity: 0, y: 35 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl bg-gradient-to-b from-[#181a24] via-[#13141b] to-[#0d0e12] border border-white/[0.08] p-7 transition-all duration-400 cursor-default overflow-hidden shadow-[8px_8px_24px_rgba(0,0,0,0.65),-3px_-3px_12px_rgba(255,255,255,0.025),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-white/[0.18] hover:shadow-[14px_14px_36px_rgba(0,0,0,0.85),-4px_-4px_16px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.22)]"
            >
              {/* Top 1px bevel sheen */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

              {/* Glow overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 30% 15%, ${svc.glow} 0%, transparent 70%)` }}
              />

              {/* LED indicator */}
              <div className="absolute top-5 right-5 flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: svc.color, boxShadow: `0 0 8px ${svc.color}` }}
                />
                <span className={`text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${svc.badgeColor}`}>
                  {svc.badge}
                </span>
              </div>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border border-white/[0.08] bg-[#121318] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.4)]"
                style={{
                  boxShadow: `0 0 20px ${svc.color}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
                }}
              >
                {svc.icon}
              </div>

              <span className="text-xs font-bold tracking-widest uppercase mb-1 block" style={{ color: svc.color }}>
                {svc.subtitle}
              </span>
              <h3 className="text-xl font-bold text-white mb-3">{svc.title}</h3>
              <p className="text-[#8e95a5] text-sm leading-relaxed mb-6">{svc.description}</p>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {svc.features.map((f) => (
                  <span
                    key={f}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/[0.05] bg-[#0c0d12] text-gray-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* Optional Direct Platform Link */}
              {svc.linkUrl && (
                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                  <Link
                    href={svc.linkUrl}
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-all duration-200 group-hover:translate-x-1"
                    style={{ color: svc.color }}
                  >
                    <span>Launch Application</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}

              {/* Bottom connector line */}
              <div
                className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ backgroundColor: svc.color, boxShadow: `0 0 10px ${svc.color}` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
