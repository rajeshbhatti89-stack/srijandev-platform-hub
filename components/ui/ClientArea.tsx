'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Shield, 
  Mail, 
  Globe, 
  ArrowUpRight,
  Calculator,
  Laptop,
  Check,
  Building
} from 'lucide-react';

interface ClientItem {
  id: string;
  name: string;
  domain: string;
  url: string;
  logo: string;
  industry: string;
  projectScopeBadge: string;
  accentColor: string;
  glowColor: string;
  summary: string;
  deliveredServices: {
    title: string;
    description: string;
    icon: string;
  }[];
  keyHighlights: string[];
}

const clients: ClientItem[] = [
  {
    id: 'northen-himalayan-tours',
    name: 'Northen Himalayan Tours',
    domain: 'northenhimalayantours.com',
    url: 'https://northenhimalayantours.com',
    logo: '/clients/northenhimalayantours.png',
    industry: 'High-Altitude Luxury Travel & Expeditions',
    projectScopeBadge: 'Website Development + Email Setup',
    accentColor: '#B89355',
    glowColor: 'rgba(184, 147, 85, 0.25)',
    summary:
      'Designed and developed the official responsive travel website and completed the full corporate business email setup for their high-altitude expeditions and pan-India tours.',
    deliveredServices: [
      {
        title: 'Official Responsive Website',
        description:
          'Engineered an elegant, responsive luxury travel web platform featuring destination showcases, itinerary layouts, and direct tour booking enquiry integration.',
        icon: 'website',
      },
      {
        title: 'Corporate Email Setup',
        description:
          'Configured full business email infrastructure with custom domain routing, secure DNS records (SPF, DKIM, DMARC), and client webmail setup.',
        icon: 'email',
      },
    ],
    keyHighlights: [
      'Official Responsive Travel Website',
      'Complete Corporate Email Setup',
      'Direct Enquiry & WhatsApp Telemetry',
      'Mobile-First Design & Fast Performance',
    ],
  },
  {
    id: 'shree-rr-trading',
    name: 'Shree RR Trading Company',
    domain: 'shreerrtradingcompany.com',
    url: 'https://shreerrtradingcompany.com',
    logo: '/clients/shreerrtradingcompany.png',
    industry: 'Heavy Earth Moving Machinery (HEMM) & Mining Logistics',
    projectScopeBadge: 'Website + Email Portal + Payroll Portal',
    accentColor: '#FF6B00',
    glowColor: 'rgba(255, 107, 0, 0.25)',
    summary:
      'Engineered their end-to-end digital ecosystem: the official company website with 3D fleet visuals, a dedicated corporate email portal, and a custom enterprise payroll portal.',
    deliveredServices: [
      {
        title: 'Official Company Website',
        description:
          'Engineered the official industrial corporate website featuring heavy fleet showcases, interactive 3D WebGL visuals, and machinery rental quotation tools.',
        icon: 'website',
      },
      {
        title: 'Corporate Email Portal',
        description:
          'Configured and integrated a dedicated corporate email portal for executive, site manager, and operational communication.',
        icon: 'email',
      },
      {
        title: 'Custom Payroll Portal',
        description:
          'Built a custom workforce payroll management portal managing operator shift records, wage computations, overtime, deductions, and salary rollouts.',
        icon: 'payroll',
      },
    ],
    keyHighlights: [
      'Official Industrial Website (with 3D WebGL)',
      'Custom Corporate Email Portal',
      'Enterprise Workforce Payroll Portal',
      'Operator Shift & Automated Wage Calculations',
    ],
  },
];

export default function ClientArea() {
  const [activeTab, setActiveTab] = useState<string>(clients[0].id);

  return (
    <section id="clients" className="relative py-28 bg-[#0b0c10] border-t border-b border-white/[0.06] overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] rounded-full bg-[#00ff87]/5 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] rounded-full bg-[#00e5ff]/5 blur-[140px]" />
      </div>

      {/* Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-white/[0.08] bg-[#14161d] text-xs font-semibold tracking-widest uppercase text-[#00ff87] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.5)]">
            <span className="w-2 h-2 rounded-full bg-[#00ff87] shadow-[0_0_8px_#00ff87] animate-pulse" />
            Client Area • Real-World Deployments
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-5">
            Client Work &amp;{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#00e5ff] to-[#00ff87]">
              Delivered Solutions
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#8e95a5] leading-relaxed">
            Real enterprise projects designed, developed, and deployed by SrijanDev — delivering custom websites, corporate email infrastructure, and mission-critical payroll portals.
          </p>
        </div>

        {/* Client Switcher Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {clients.map((c) => {
            const isActive = activeTab === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 border ${
                  isActive
                    ? 'text-white bg-[#191c26] border-white/25 shadow-[0_4px_24px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2)] scale-[1.02]'
                    : 'text-gray-400 bg-[#121318]/80 border-white/[0.06] hover:text-white hover:border-white/15'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: c.accentColor, boxShadow: `0 0 10px ${c.accentColor}` }}
                />
                <span>{c.name}</span>
                <span className="text-[11px] font-mono text-gray-400 font-normal hidden md:inline">({c.domain})</span>
              </button>
            );
          })}
        </div>

        {/* Showcase Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {clients.map((client) => {
            const isSelected = activeTab === client.id;
            return (
              <div
                key={client.id}
                onMouseEnter={() => setActiveTab(client.id)}
                className={`relative rounded-3xl p-8 sm:p-10 transition-all duration-500 overflow-hidden border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#1a1d29] via-[#141620] to-[#0e1017] border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.2)]'
                    : 'bg-gradient-to-b from-[#14161e] to-[#0e0f14] border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] opacity-95'
                }`}
              >
                {/* 1px top highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                {/* Ambient Glow */}
                <div
                  className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-opacity duration-500"
                  style={{ backgroundColor: client.accentColor, opacity: isSelected ? 0.15 : 0.05 }}
                />

                <div>
                  {/* Top Header Strip: Project Scope Pill & Live Domain Link */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <span
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase border shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                      style={{
                        color: client.accentColor,
                        backgroundColor: `${client.accentColor}18`,
                        borderColor: `${client.accentColor}40`,
                      }}
                    >
                      <Sparkles size={12} />
                      {client.projectScopeBadge}
                    </span>

                    <a
                      href={client.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-gray-300 hover:text-white px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] hover:border-white/20 transition-colors group"
                    >
                      <Globe size={12} className="text-[#00e5ff]" />
                      <span>{client.domain}</span>
                      <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>

                  {/* Logo + Company Header */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 text-center sm:text-left">
                    {/* Logo Box */}
                    <div
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#090a0e] border border-white/10 p-3 flex items-center justify-center relative shrink-0 transition-transform duration-300 hover:scale-105"
                      style={{
                        boxShadow: `0 12px 28px rgba(0,0,0,0.7), 0 0 20px ${client.accentColor}25, inset 0 1px 0 rgba(255,255,255,0.15)`,
                      }}
                    >
                      <Image
                        src={client.logo}
                        alt={`${client.name} official logo`}
                        width={120}
                        height={120}
                        className="object-contain max-h-full max-w-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                        priority
                      />
                    </div>

                    {/* Company Details */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white tracking-tight mb-1.5">
                        {client.name}
                      </h3>
                      <p className="text-xs font-mono font-medium mb-3" style={{ color: client.accentColor }}>
                        {client.industry}
                      </p>
                      <p className="text-sm text-[#8e95a5] leading-relaxed">
                        {client.summary}
                      </p>
                    </div>
                  </div>

                  {/* Delivered Systems Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="text-xs font-mono uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87]" />
                      Delivered Systems &amp; Work
                    </div>

                    <div className="space-y-2.5">
                      {client.deliveredServices.map((service, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-start gap-3.5"
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                            style={{
                              backgroundColor: `${client.accentColor}15`,
                              borderColor: `${client.accentColor}35`,
                              color: client.accentColor,
                            }}
                          >
                            {service.icon === 'website' && <Globe size={16} />}
                            {service.icon === 'email' && <Mail size={16} />}
                            {service.icon === 'payroll' && <Calculator size={16} />}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white mb-1">
                              {service.title}
                            </h4>
                            <p className="text-xs text-[#8e95a5] leading-relaxed">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] mb-6">
                    <div className="text-[11px] font-mono uppercase text-gray-400 font-bold mb-2.5 tracking-wider">
                      Engineering Highlights
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {client.keyHighlights.map((h, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                          <Check size={14} className="text-[#00ff87] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Strip */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="text-xs font-mono text-gray-400">
                    Client Website: <span className="text-white font-medium">{client.domain}</span>
                  </div>

                  <a
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:brightness-110"
                    style={{
                      backgroundColor: client.accentColor,
                      color: client.id === 'northen-himalayan-tours' ? '#1C3144' : '#0B1936',
                    }}
                  >
                    <span>View Live Site</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Capabilities Banner */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#121319]/80 backdrop-blur-md p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00ff87]/10 border border-[#00ff87]/30 flex items-center justify-center text-[#00ff87] shadow-[0_0_14px_rgba(0,255,135,0.2)]">
              <Laptop size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Need Websites, Corporate Email, or Custom Enterprise Portals?
              </h4>
              <p className="text-xs text-[#8e95a5]">
                We build bespoke business platforms tailored to your operations — with bank-grade reliability and zero bloat.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
              <CheckCircle2 size={15} className="text-[#00ff87]" />
              <span>Websites &amp; 3D Apps</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
              <CheckCircle2 size={15} className="text-[#00e5ff]" />
              <span>Email &amp; Messaging Systems</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
              <CheckCircle2 size={15} className="text-[#f5d061]" />
              <span>Payroll &amp; HR Portals</span>
            </div>
            <a
              href="mailto:Contact@srijandev.in?subject=Project%20Inquiry%20from%20Client%20Area"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-[#00ff87] text-black text-xs font-bold transition-all duration-300 shadow-md"
            >
              Start a Project
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
