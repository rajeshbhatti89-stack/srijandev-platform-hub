'use client';

import { useRef, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import dynamic from 'next/dynamic';
import DotGridBackground from '@/components/canvas/DotGridBackground';

const IsometricScene = dynamic(() => import('@/components/canvas/IsometricScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-sm border border-white/5 rounded-2xl">
      <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin border-blue-500 mb-3" />
      <span className="text-xs font-mono text-blue-400 tracking-widest uppercase animate-pulse">
        Initializing 3D Canvas...
      </span>
    </div>
  ),
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: 'easeOut' as const },
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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-950"
      onMouseMove={handleMouseMove}
    >
      {/* Dot grid */}
      <DotGridBackground />

      {/* Radial glow center */}
      <div className="absolute inset-0 pointer-events-none transition-colors duration-1000">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[120px] transition-colors duration-1000 bg-blue-600/10" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] transition-colors duration-1000 bg-violet-600/8" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-12 pt-24 pb-12">
        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border bg-opacity-5 text-xs font-semibold tracking-widest uppercase transition-colors duration-500 border-blue-500/30 bg-blue-500/5 text-blue-400"
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-blue-400" />
            Systems Online — Ready for Deployment
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight text-white mb-6 transition-all duration-500"
          >
            Architecting{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r transition-all duration-500 from-blue-400 via-violet-400 to-cyan-400">
              High-Performance
            </span>{' '}
            3D Web Experiences, Android Applications,{' '}
            <span className="text-white/70">&amp; Enterprise Web Apps</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 transition-all duration-500"
          >
            From interactive spatial interfaces to scalable enterprise operations platforms — engineered for performance, precision, and impact.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <button
              id="hero-get-started"
              onClick={scrollToContact}
              className="px-8 py-4 rounded-xl text-white font-bold text-base shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 to-violet-600 shadow-blue-500/30 hover:shadow-blue-500/50"
            >
              Get Started →
            </button>
            <a
              id="hero-email-cta"
              href="mailto:Contact@srijandev.in?subject=Project%20Inquiry%20from%20srijandev.in"
              className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-base hover:bg-white/10 hover:border-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              Contact@srijandev.in
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
                className="px-3 py-1 text-xs font-medium text-gray-400 border border-white/8 rounded-full bg-white/3 backdrop-blur-sm"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />
                {badge}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right: 3D Canvas Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="flex-1 w-full h-[380px] lg:h-[520px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-gray-900/60 to-gray-950/80 shadow-2xl shadow-blue-950/30 relative group"
        >
          {/* Top HUD Telemetry Bar */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg border border-white/10 bg-gray-950/70 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="text-[11px] font-mono text-gray-300 font-semibold tracking-wider">
                SPATIAL ENGINE v4.2
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg border border-white/10 bg-gray-950/70 backdrop-blur-md">
              <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-widest">
                WebGL 2.0 • 60 FPS
              </span>
            </div>
          </div>

          {/* Bottom HUD Hint */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg border border-white/5 bg-gray-950/60 backdrop-blur-md">
              <svg className="w-3.5 h-3.5 text-blue-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />
    </section>
  );
}
