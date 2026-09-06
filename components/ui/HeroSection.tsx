'use client';

import { useRef, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import dynamic from 'next/dynamic';
import DotGridBackground from '@/components/canvas/DotGridBackground';
import CredButton from '@/components/ui/CredButton';
import { ArrowRight, Mail } from 'lucide-react';

const IsometricScene = dynamic(() => import('@/components/canvas/IsometricScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0f1015]/90 backdrop-blur-sm border border-white/5 rounded-2xl">
      <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin border-[#00ff87] mb-3" />
      <span className="text-xs font-mono text-[#00ff87] tracking-widest uppercase animate-pulse">
        Initializing Spatial Matrix...
      </span>
    </div>
  ),
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function HeroSection() {
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mouseRef.current = {
      x: (e.clientX - cx) / cx,
      y: (e.clientY - cy) / cy,
    };
  }, []);

  const scrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0f1015]"
      onMouseMove={handleMouseMove}
    >
      {/* Dot grid */}
      <DotGridBackground />

      {/* CRED Ambient Lighting: Subtle Mint & Gold Glows */}
      <div className="absolute inset-0 pointer-events-none transition-colors duration-1000">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] bg-[#00ff87]/5 pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] rounded-full blur-[130px] bg-[#f5d061]/5 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-12 pt-28 pb-16">
        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/[0.08] bg-[#14161d] text-xs font-semibold tracking-widest uppercase text-[#00ff87] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.5)]"
          >
            <span className="w-2 h-2 rounded-full animate-pulse bg-[#00ff87] shadow-[0_0_8px_#00ff87]" />
            Systems Operational • Ready for Deployment
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl xl:text-6xl font-black leading-tight tracking-tight text-white mb-6"
          >
            Architecting{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#f5d061] to-[#00ff87]">
              High-Performance
            </span>{' '}
            3D Web Experiences, Android Apps,{' '}
            <span className="text-white/60">&amp; Enterprise Systems</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-[#8e95a5] text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
          >
            From interactive spatial interfaces to scalable enterprise operations platforms — engineered for precision, luxury aesthetics, and real-world scale.
          </motion.p>

          {/* CRED CTA Buttons */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
          >
            <CredButton
              id="hero-get-started"
              variant="luxury-white"
              size="lg"
              onClick={scrollToContact}
              icon={<ArrowRight size={18} />}
            >
              Get Started
            </CredButton>
            
            <a href="mailto:Contact@srijandev.in?subject=Project%20Inquiry%20from%20srijandev.in">
              <CredButton
                id="hero-email-cta"
                variant="neumorphic"
                size="lg"
                icon={<Mail size={16} />}
              >
                Contact@srijandev.in
              </CredButton>
            </a>
          </motion.div>

          {/* Status badges */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-wrap gap-3 justify-center lg:justify-start"
          >
            {['3D Web Design', 'Android Apps', 'Enterprise OS', 'Webmail Client'].map((badge) => (
              <span
                key={badge}
                className="px-3.5 py-1 text-xs font-medium text-gray-300 border border-white/[0.06] rounded-full bg-[#14151b] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff87] mr-1.5 shadow-[0_0_6px_#00ff87]" />
                {badge}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right: 3D Canvas Card in CRED Convex Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full h-[380px] lg:h-[520px] rounded-2xl overflow-hidden border border-white/[0.09] bg-gradient-to-b from-[#181a24] via-[#12131a] to-[#0a0b0e] shadow-[12px_12px_32px_rgba(0,0,0,0.8),-4px_-4px_16px_rgba(255,255,255,0.03),inset_0_1px_0_rgba(255,255,255,0.15)] relative group"
        >
          {/* Top HUD Telemetry Bar */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-[#0f1015]/80 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-[#00ff87] animate-pulse shadow-[0_0_8px_#00ff87]" />
              <span className="text-[11px] font-mono text-gray-200 font-bold tracking-wider">
                SPATIAL ENGINE v4.2
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-[#0f1015]/80 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              <span className="text-[10px] font-mono text-[#f5d061] font-bold uppercase tracking-widest">
                WebGL 2.0 • 60 FPS
              </span>
            </div>
          </div>

          {/* Bottom HUD Hint */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg border border-white/[0.06] bg-[#0f1015]/70 backdrop-blur-md">
              <svg className="w-3.5 h-3.5 text-[#00ff87] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span className="text-[11px] font-mono text-gray-400">
                Move cursor to rotate 3D matrix
              </span>
            </div>
          </div>

          {/* 3D Canvas */}
          <IsometricScene mouseRef={mouseRef} />
        </motion.div>
      </div>

      {/* Bottom subtle fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f1015] to-transparent pointer-events-none" />
    </section>
  );
}
