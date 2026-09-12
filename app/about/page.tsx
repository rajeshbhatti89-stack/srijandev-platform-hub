import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Smartphone, 
  Boxes, 
  Users, 
  Mail, 
  CheckCircle2, 
  ArrowRight,
  Globe,
  Lock,
  Zap,
  Terminal
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About SrijanDev — 3D Web, Native Android & Enterprise Engineering | srijandev.in',
  description:
    'SrijanDev (srijandev.in) is an advanced digital engineering studio and enterprise software lab building high-performance 3D WebGL experiences, native Android applications, Plus OS workforce systems, and enterprise HR management software.',
  keywords: [
    'SrijanDev',
    'srijandev.in',
    'About SrijanDev',
    'SrijanDev software company',
    '3D Web Design India',
    'WebGL Three.js development',
    'Native Android app development',
    'Plus OS workforce operations',
    'SrijanDev HR management system',
    'Enterprise software engineering',
  ],
  alternates: {
    canonical: 'https://srijandev.in/about',
  },
  openGraph: {
    type: 'website',
    url: 'https://srijandev.in/about',
    title: 'About SrijanDev — High-Performance Digital Engineering',
    description:
      'SrijanDev architects immersive 3D spatial web experiences, native mobile applications, and mission-critical enterprise platforms.',
    siteName: 'SrijanDev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About SrijanDev — High-Performance Digital Engineering',
    description:
      'SrijanDev architects immersive 3D spatial web experiences, native mobile applications, and mission-critical enterprise platforms.',
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://srijandev.in/#organization',
        name: 'SrijanDev',
        legalName: 'SrijanDev',
        url: 'https://srijandev.in',
        logo: 'https://srijandev.in/logo.png',
        image: 'https://srijandev.in/logo.png',
        description:
          'SrijanDev is an advanced digital engineering studio building high-performance 3D Web experiences, native Android applications, Plus OS workforce platforms, and modern enterprise HR software.',
        email: 'Contact@srijandev.in',
        foundingLocation: {
          '@type': 'Country',
          name: 'India',
        },
        knowsAbout: [
          '3D Web Design & WebGL',
          'Three.js Spatial Computing',
          'Native Android App Development',
          'Enterprise Workforce Management (Plus OS)',
          'Human Resource Management Systems (HRMS)',
          'Cloud Architecture & Edge Computing',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Inquiries & Enterprise Support',
          email: 'Contact@srijandev.in',
          availableLanguage: ['English', 'Hindi'],
        },
        sameAs: ['https://srijandev.in'],
      },
      {
        '@type': 'AboutPage',
        '@id': 'https://srijandev.in/about/#webpage',
        url: 'https://srijandev.in/about',
        name: 'About SrijanDev — Engineering, Vision & Digital Innovation',
        description:
          'Official company profile, mission statement, engineering capabilities, and organizational factsheet for SrijanDev.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://srijandev.in/#website',
          url: 'https://srijandev.in',
          name: 'SrijanDev',
          publisher: {
            '@id': 'https://srijandev.in/#organization',
          },
        },
        about: {
          '@id': 'https://srijandev.in/#organization',
        },
      },
    ],
  };

  return (
    <>
      {/* Schema.org JSON-LD Structured Data for Google Indexing & Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="bg-[#0f1015] text-white min-h-screen selection:bg-[#00ff87]/20 selection:text-[#00ff87]">
        <Navbar />

        {/* =====================================================================
            HERO SECTION
            ===================================================================== */}
        <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden border-b border-white/[0.06]">
          {/* Ambient Lighting Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-gradient-to-br from-[#00ff87]/8 via-[#00e5ff]/8 to-transparent blur-[140px]" />
            <div className="absolute top-1/3 right-10 w-[400px] h-[400px] rounded-full bg-[#f5d061]/5 blur-[120px]" />
          </div>

          {/* Dot Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/[0.08] bg-[#14161d] text-xs font-semibold tracking-widest uppercase text-[#00ff87] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-[#00ff87] shadow-[0_0_8px_#00ff87] animate-pulse" />
              About SrijanDev • Engineering &amp; Innovation
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
              Pioneering High-Performance{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#00e5ff] to-[#00ff87]">
                Digital Engineering
              </span>{' '}
              at Scale
            </h1>

            <p className="text-lg sm:text-xl text-[#8e95a5] max-w-3xl mx-auto leading-relaxed mb-10">
              <strong className="text-white font-semibold">SrijanDev (srijandev.in)</strong> is an advanced software engineering lab. We bridge high-fidelity creative computing — interactive 3D WebGL interfaces — with mission-critical enterprise software, native mobile systems, and real-time operational platforms.
            </p>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: 'System Uptime SLA', val: '99.9%', accent: '#00ff87' },
                { label: 'Spatial WebGL', val: '60 FPS', accent: '#00e5ff' },
                { label: 'Integrated Modules', val: '14+ Enterprise', accent: '#f5d061' },
                { label: 'Security & Integrity', val: 'Zero-Trust', accent: '#ff2a7a' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.08] bg-[#13141b]/80 backdrop-blur-md p-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.4)]"
                >
                  <div
                    className="text-2xl sm:text-3xl font-black mb-1"
                    style={{ color: m.accent }}
                  >
                    {m.val}
                  </div>
                  <div className="text-xs font-medium text-[#8e95a5] uppercase tracking-wider">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            ORIGIN & MISSION SECTION ("WHAT SRIJAN MEANS")
            ===================================================================== */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/20">
                  <Sparkles size={13} />
                  Our Origin &amp; Philosophy
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Born from the Sanskrit Root for Creation:{' '}
                  <span className="text-[#00ff87]">सृजन (Srijan)</span>
                </h2>

                <p className="text-[#8e95a5] text-base sm:text-lg leading-relaxed">
                  In Sanskrit, <strong className="text-white">“Srijan”</strong> signifies the act of creation, genesis, and purposeful construction. We founded SrijanDev with an uncompromising belief: digital software should not be sluggish, fragmented, or merely utilitarian. It should be extraordinarily fast, visually mesmerizing, and architecturally indestructible.
                </p>

                <p className="text-[#8e95a5] text-base leading-relaxed">
                  Most organizations are forced to choose between design agencies that produce visually pleasing but fragile websites, or enterprise vendors that build powerful but cumbersome, dated tools. SrijanDev unites both worlds: state-of-the-art WebGL spatial rendering meets bank-grade enterprise workflows.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 size={18} className="text-[#00ff87] flex-shrink-0" />
                    <span>Microsecond latency &amp; edge optimization</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 size={18} className="text-[#00ff87] flex-shrink-0" />
                    <span>Production-proven enterprise architecture</span>
                  </div>
                </div>
              </div>

              {/* Graphical Philosophy Card */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#1c1f2c] via-[#141620] to-[#0c0d12] p-8 sm:p-10 relative overflow-hidden shadow-[12px_12px_32px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff87]/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="w-12 h-12 rounded-2xl bg-[#00ff87]/10 border border-[#00ff87]/30 flex items-center justify-center text-[#00ff87] mb-6 shadow-[0_0_16px_rgba(0,255,135,0.25)]">
                    <Terminal size={24} />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">The SrijanDev Creed</h3>
                  <p className="text-[#8e95a5] text-sm leading-relaxed mb-6">
                    “Every pixel rendered must serve clarity. Every line of code written must sustain scale. Precision is not an afterthought; it is the blueprint.”
                  </p>

                  <div className="border-t border-white/[0.08] pt-6 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-mono">Domain</span>
                      <span className="text-[#00e5ff] font-mono font-semibold">srijandev.in</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-mono">Headquarters</span>
                      <span className="text-white font-mono">India (Global Deployments)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-mono">Official Email</span>
                      <a href="mailto:Contact@srijandev.in" className="text-[#00ff87] font-mono hover:underline">Contact@srijandev.in</a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =====================================================================
            4 CORE ENGINEERING PILLARS
            ===================================================================== */}
        <section className="py-24 bg-[#0c0d12] border-y border-white/[0.06] relative">
          <div className="max-w-6xl mx-auto px-6">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-[#f5d061] bg-[#f5d061]/10 border border-[#f5d061]/20 mb-3">
                Core Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                What We Build at SrijanDev
              </h2>
              <p className="text-[#8e95a5] text-base sm:text-lg">
                Four specialized engineering pillars developed to serve high-growth enterprises, product innovators, and operational teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Pillar 1 */}
              <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#181a24] to-[#111218] p-8 shadow-[8px_8px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-[#00e5ff]/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] mb-6 shadow-[0_0_14px_rgba(0,229,255,0.2)]">
                  <Boxes size={24} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-[#00e5ff] tracking-wider uppercase">Pillar 01</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">3D Web Design &amp; WebGL Experiences</h3>
                <p className="text-[#8e95a5] text-sm leading-relaxed mb-6">
                  Transforming static web surfaces into responsive, tactile 3D universes. We utilize Three.js, React Three Fiber, and custom GLSL vertex/fragment shaders to deliver 60 FPS interactive spatial experiences that run fluidly in modern desktop and mobile browsers.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Three.js', 'WebGL Shaders', 'Interactive 3D UI', 'Real-Time Lighting'].map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#181a24] to-[#111218] p-8 shadow-[8px_8px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-[#00ff87]/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#00ff87]/10 border border-[#00ff87]/30 flex items-center justify-center text-[#00ff87] mb-6 shadow-[0_0_14px_rgba(0,255,135,0.2)]">
                  <Smartphone size={24} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-[#00ff87] tracking-wider uppercase">Pillar 02</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Native &amp; Cross-Platform Android Apps</h3>
                <p className="text-[#8e95a5] text-sm leading-relaxed mb-6">
                  Engineering robust mobile applications crafted for frontline resilience. Built with native performance, zero-lag UI responsiveness, offline-first SQLite synchronizations, background geofencing, hardware telemetry, and secure enterprise packaging.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Android Native', 'Offline-First', 'Geofencing', 'Hardware Telemetry'].map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#181a24] to-[#111218] p-8 shadow-[8px_8px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-[#f5d061]/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#f5d061]/10 border border-[#f5d061]/30 flex items-center justify-center text-[#f5d061] mb-6 shadow-[0_0_14px_rgba(245,208,97,0.2)]">
                  <ShieldCheck size={24} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-[#f5d061] tracking-wider uppercase">Pillar 03</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f5d061]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Enterprise Security &amp; Plus OS</h3>
                <p className="text-[#8e95a5] text-sm leading-relaxed mb-6">
                  Our proprietary enterprise operations and workforce control platform. Powers live GPS-backed checkpoint verification, real-time guard incident reporting, automated guard touring, and multi-facility tactical dashboards for security agencies and facility managers.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Live Dispatch', 'Checkpoint Verification', 'Incident Analytics', 'Guard Tour OS'].map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#181a24] to-[#111218] p-8 shadow-[8px_8px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-[#ff2a7a]/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#ff2a7a]/10 border border-[#ff2a7a]/30 flex items-center justify-center text-[#ff2a7a] mb-6 shadow-[0_0_14px_rgba(255,42,122,0.2)]">
                  <Users size={24} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-[#ff2a7a] tracking-wider uppercase">Pillar 04</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a7a]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">SrijanDev HR Management Suite</h3>
                <p className="text-[#8e95a5] text-sm leading-relaxed mb-6">
                  A modern human resources operating system comprising 14 integrated modules: interactive visual org hierarchy trees, automated LMS leave accrual policies, web &amp; geo-punch attendance, recruitment ATS pipelines, OKRs, and encrypted payslip generation.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['14 HR Modules', 'Visual Org Trees', 'LMS Accrual', 'Automated Payslips'].map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =====================================================================
            ENGINEERING PRINCIPLES / DNA
            ===================================================================== */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-[#00ff87] bg-[#00ff87]/10 border border-[#00ff87]/20 mb-3">
                Engineering Values
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                The DNA Behind Every System We Ship
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Zap size={22} className="text-[#00ff87]" />,
                  title: 'Zero-Lag Mindset',
                  desc: 'We optimize the critical rendering path, eliminate bloated dependencies, and ensure sub-second response times.',
                },
                {
                  icon: <Lock size={22} className="text-[#00e5ff]" />,
                  title: 'Zero-Trust Security',
                  desc: 'Every endpoint, input vector, and database connection is fortified with strict validation and encryption.',
                },
                {
                  icon: <Layers size={22} className="text-[#f5d061]" />,
                  title: 'Scalable By Design',
                  desc: 'Built on modular components, edge compute, and type-safe contracts so systems scale seamlessly from 10 to 1,000,000 users.',
                },
                {
                  icon: <Globe size={22} className="text-[#ff2a7a]" />,
                  title: 'Human-First UX',
                  desc: 'Sensory feedback, ergonomic controls, and intuitive micro-interactions that make complex software a delight to operate.',
                },
              ].map((val, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.08] bg-[#121319] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.4)] hover:bg-[#161822] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-4">
                    {val.icon}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{val.title}</h3>
                  <p className="text-xs sm:text-sm text-[#8e95a5] leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* =====================================================================
            ENTERPRISE CLIENTS & DEPLOYMENTS SECTION
            ===================================================================== */}
        <section className="py-24 bg-[#0a0b0f] border-t border-white/[0.06] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-[#00ff87] bg-[#00ff87]/10 border border-[#00ff87]/20 mb-3">
                Enterprise Portfolio
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Our Clients &amp; Live Deployments
              </h2>
              <p className="text-[#8e95a5] text-base sm:text-lg">
                Software engineered by SrijanDev powering real-world organizations across tourism and heavy industrial infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Client 1: Northen Himalayan Tours */}
              <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#181b26] to-[#10121a] p-8 sm:p-10 relative overflow-hidden shadow-[8px_8px_28px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-[#B89355]/40 transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 text-center sm:text-left">
                  <div className="w-24 h-24 rounded-2xl bg-[#090a0f] border border-[#B89355]/30 p-2 flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_16px_rgba(184,147,85,0.15)]">
                    <img
                      src="/clients/northenhimalayantours.png"
                      alt="Northen Himalayan Tours Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#B89355] px-2.5 py-0.5 rounded-full bg-[#B89355]/10 border border-[#B89355]/30 inline-block mb-1.5">
                      Scope: Website + Corporate Email Setup
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1">Northen Himalayan Tours</h3>
                    <a
                      href="https://northenhimalayantours.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-[#00e5ff] hover:underline inline-flex items-center gap-1"
                    >
                      <span>northenhimalayantours.com</span>
                      <ArrowRight size={11} />
                    </a>
                  </div>
                </div>

                <p className="text-sm text-[#8e95a5] leading-relaxed mb-6">
                  SrijanDev designed and developed the official tour & travel website along with full business email configuration and setup for their high-altitude expeditions and pan-India travel operations.
                </p>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                  {['Official Website', 'Corporate Email Setup', 'Responsive Travel UI', 'Booking Telemetry'].map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Client 2: Shree RR Trading Company */}
              <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#181b26] to-[#10121a] p-8 sm:p-10 relative overflow-hidden shadow-[8px_8px_28px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-[#FF6B00]/40 transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 text-center sm:text-left">
                  <div className="w-24 h-24 rounded-2xl bg-[#090a0f] border border-[#FF6B00]/30 p-2 flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_16px_rgba(255,107,0,0.15)]">
                    <img
                      src="/clients/shreerrtradingcompany.png"
                      alt="Shree RR Trading Company Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#FF6B00] px-2.5 py-0.5 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 inline-block mb-1.5">
                      Scope: Website + Email Portal + Payroll Portal
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1">Shree RR Trading Company</h3>
                    <a
                      href="https://shreerrtradingcompany.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-[#00e5ff] hover:underline inline-flex items-center gap-1"
                    >
                      <span>shreerrtradingcompany.com</span>
                      <ArrowRight size={11} />
                    </a>
                  </div>
                </div>

                <p className="text-sm text-[#8e95a5] leading-relaxed mb-6">
                  SrijanDev engineered their complete digital infrastructure: the official industrial company website with 3D WebGL fleet visuals, a dedicated corporate email portal, and a custom enterprise payroll portal for operator shift wages and attendance management.
                </p>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                  {['Official Website (3D)', 'Corporate Email Portal', 'Workforce Payroll Portal', 'Shift Wage Engine'].map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            VERIFIED COMPANY PROFILE (GOOGLE KNOWLEDGE PANEL FACTSHEET)
            ===================================================================== */}
        <section className="py-20 bg-[#0b0c10] border-t border-white/[0.06] relative">
          <div className="max-w-5xl mx-auto px-6">
            
            <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#171923] via-[#12131a] to-[#0c0d12] p-8 sm:p-12 shadow-[12px_12px_32px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ff87]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00ff87] shadow-[0_0_10px_#00ff87] animate-pulse" />
                    <span className="text-xs font-mono font-bold tracking-widest text-[#00ff87] uppercase">Verified Knowledge Profile</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    SrijanDev Organizational Profile
                  </h2>
                </div>

                <div className="px-4 py-2 rounded-xl bg-[#14161f] border border-white/[0.08] text-xs font-mono text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00ff87]" />
                  Index Status: Active
                </div>
              </div>

              {/* Factsheet Key-Value Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
                <div>
                  <div className="text-xs font-mono uppercase text-gray-400 mb-1">Entity Name</div>
                  <div className="text-sm font-semibold text-white">SrijanDev</div>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase text-gray-400 mb-1">Official Domain</div>
                  <a href="https://srijandev.in" className="text-sm font-semibold text-[#00e5ff] hover:underline">
                    https://srijandev.in
                  </a>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase text-gray-400 mb-1">Official Contact</div>
                  <a href="mailto:Contact@srijandev.in" className="text-sm font-semibold text-[#00ff87] hover:underline">
                    Contact@srijandev.in
                  </a>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase text-gray-400 mb-1">Country of Origin</div>
                  <div className="text-sm font-semibold text-white">India</div>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase text-gray-400 mb-1">Industry &amp; Discipline</div>
                  <div className="text-sm font-semibold text-white">Digital Engineering &amp; Enterprise Software</div>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase text-gray-400 mb-1">Key Platforms</div>
                  <div className="text-sm font-semibold text-[#f5d061]">SrijanDev Hub • Plus OS • SrijanDev HR</div>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase text-gray-400 mb-1">Technology Architecture</div>
                  <div className="text-xs font-mono text-gray-300">Next.js, React 19, TypeScript, Three.js, WebGL, Android, Drizzle ORM</div>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase text-gray-400 mb-1">Operating Hours</div>
                  <div className="text-sm font-semibold text-white">9:30 AM – 6:30 PM IST (Mon – Fri)</div>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase text-gray-400 mb-1">Direct Inquiries</div>
                  <div className="text-xs text-gray-300">New projects, enterprise deployments, and partnerships</div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =====================================================================
            CALL TO ACTION SECTION
            ===================================================================== */}
        <section className="py-24 relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
              Ready to Architect Something{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00ff87] via-[#00e5ff] to-[#f5d061]">
                Extraordinary?
              </span>
            </h2>
            <p className="text-base sm:text-lg text-[#8e95a5] max-w-xl mx-auto mb-10">
              Whether you need an immersive 3D web experience, a native Android application, or a scalable enterprise workforce suite — we are ready to build.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-extrabold text-sm tracking-wide hover:bg-[#00ff87] transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 group"
              >
                Start Your Project
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="mailto:Contact@srijandev.in?subject=Inquiry%20from%20About%20Page"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#14161f] border border-white/[0.1] text-white font-semibold text-sm hover:border-[#00ff87]/50 hover:text-[#00ff87] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                Contact@srijandev.in
              </a>
            </div>
          </div>
        </section>

        {/* =====================================================================
            FOOTER
            ===================================================================== */}
        <footer className="border-t border-white/[0.06] bg-[#0c0d12] py-10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1c1e26] to-[#0f1015] border border-white/10 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#00ff87" strokeWidth="1.5" fill="none" />
                  <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="#00ff87" opacity="0.8" />
                </svg>
              </div>
              <span className="text-[#8e95a5] text-sm font-medium">
                <span className="text-white font-bold tracking-wide">SrijanDev</span> © {new Date().getFullYear()} • Engineered for Scale
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-5 sm:gap-6">
              <Link href="/" className="text-[#8e95a5] hover:text-white text-sm font-medium transition-colors">
                Hub
              </Link>
              <Link href="/about" className="text-[#00e5ff] font-medium text-sm transition-colors">
                About
              </Link>
              <Link href="/hr" className="text-[#8e95a5] hover:text-[#f5d061] text-sm font-medium transition-colors">
                HR Portal
              </Link>
              <Link href="/plus" className="text-[#8e95a5] hover:text-[#00e5ff] text-sm font-medium transition-colors">
                Plus OS
              </Link>
              <a
                href="mailto:Contact@srijandev.in"
                className="text-[#8e95a5] hover:text-[#00ff87] text-sm font-medium transition-colors"
              >
                Contact@srijandev.in
              </a>
              <span className="flex items-center gap-2 text-xs font-mono text-gray-400 px-3 py-1 rounded-full border border-white/[0.06] bg-[#121318]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse shadow-[0_0_8px_#00ff87]" />
                Core Systems Active
              </span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
