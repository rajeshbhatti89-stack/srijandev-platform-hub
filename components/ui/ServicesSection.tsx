'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const services = [
  {
    id: 'service-3d-web',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="#3b82f6" strokeWidth="1.5" />
        <path d="M16 9L24 13.5V22.5L16 27L8 22.5V13.5L16 9Z" fill="#3b82f6" opacity="0.15" />
        <circle cx="16" cy="16" r="3" fill="#3b82f6" />
        <line x1="16" y1="13" x2="16" y2="4" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
        <line x1="18.6" y1="14.5" x2="24" y2="10" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
        <line x1="18.6" y1="17.5" x2="24" y2="22" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
      </svg>
    ),
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.25)',
    badge: 'ACTIVE',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
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
        <rect x="8" y="5" width="16" height="22" rx="3" stroke="#8b5cf6" strokeWidth="1.5" />
        <rect x="11" y="8" width="10" height="13" rx="1" fill="#8b5cf6" opacity="0.2" />
        <circle cx="16" cy="24" r="1.5" fill="#8b5cf6" />
        <line x1="14" y1="6.5" x2="18" y2="6.5" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.25)',
    badge: 'ACTIVE',
    badgeColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
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
        <rect x="3" y="8" width="10" height="8" rx="1.5" stroke="#06b6d4" strokeWidth="1.5" />
        <rect x="19" y="8" width="10" height="8" rx="1.5" stroke="#06b6d4" strokeWidth="1.5" />
        <rect x="11" y="20" width="10" height="8" rx="1.5" stroke="#06b6d4" strokeWidth="1.5" />
        <line x1="8" y1="16" x2="8" y2="24" stroke="#06b6d4" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
        <line x1="8" y1="24" x2="16" y2="24" stroke="#06b6d4" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
        <line x1="24" y1="16" x2="24" y2="24" stroke="#06b6d4" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
        <line x1="24" y1="24" x2="21" y2="24" stroke="#06b6d4" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
      </svg>
    ),
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.25)',
    badge: 'ACTIVE',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    title: 'Enterprise Web Applications',
    subtitle: 'Operations & Workforce Management',
    description:
      'Real-time workforce tracking, custom admin dashboards, automated operational workflows, and field force management systems — built to scale.',
    features: ['Real-Time Tracking', 'Custom Dashboards', 'Workflow Automation', 'Field Force Management'],
  },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="services" ref={ref} className="relative py-24 bg-gray-950 overflow-hidden">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-blue-400 border border-blue-500/30 bg-blue-500/5 rounded-full">
            Core Services
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            What We Build
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Three specialized engineering disciplines. One unified vision of precision digital systems.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.id}
              id={svc.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl border border-white/8 bg-white/2 backdrop-blur-sm p-7 hover:border-white/15 transition-all duration-400 cursor-default overflow-hidden"
              style={{
                transform: 'perspective(800px)',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'perspective(800px) rotateX(-4deg) rotateY(3deg) translateY(-8px)';
                el.style.boxShadow = `0 30px 60px -15px ${svc.glow}, 0 0 0 1px ${svc.color}22`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Glow overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 30% 20%, ${svc.glow} 0%, transparent 70%)` }}
              />

              {/* LED indicator */}
              <div className="absolute top-5 right-5 flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: '#22c55e', boxShadow: '0 0 6px #22c55e' }}
                />
                <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full border ${svc.badgeColor}`}>
                  {svc.badge}
                </span>
              </div>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 border"
                style={{
                  backgroundColor: `${svc.color}15`,
                  borderColor: `${svc.color}30`,
                  boxShadow: `0 0 20px ${svc.color}20`,
                }}
              >
                {svc.icon}
              </div>

              <span className="text-xs font-semibold tracking-widest uppercase mb-1 block" style={{ color: svc.color }}>
                {svc.subtitle}
              </span>
              <h3 className="text-xl font-bold text-white mb-3">{svc.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{svc.description}</p>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-2">
                {svc.features.map((f) => (
                  <span
                    key={f}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-md border"
                    style={{
                      color: svc.color,
                      borderColor: `${svc.color}30`,
                      backgroundColor: `${svc.color}0d`,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>

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
