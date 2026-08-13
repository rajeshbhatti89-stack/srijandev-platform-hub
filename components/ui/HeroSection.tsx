'use client';

import { useRef, useCallback, lazy, Suspense } from 'react';
import { motion, type Variants } from 'framer-motion';
import DotGridBackground from '@/components/canvas/DotGridBackground';

const IsometricScene = lazy(() => import('@/components/canvas/IsometricScene'));

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: 'easeOut' as const },
  }),
};

interface HeroSectionProps {
  isPlusMode: boolean;
}

export default function HeroSection({ isPlusMode }: HeroSectionProps) {
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
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[120px] transition-colors duration-1000 ${isPlusMode ? 'bg-amber-600/15' : 'bg-blue-600/10'}`} />
        <div className={`absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] transition-colors duration-1000 ${isPlusMode ? 'bg-orange-600/10' : 'bg-violet-600/8'}`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-12 pt-24 pb-12">
        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={`inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border bg-opacity-5 text-xs font-semibold tracking-widest uppercase transition-colors duration-500 ${
              isPlusMode 
                ? 'border-orange-500/30 bg-orange-500/5 text-orange-400' 
                : 'border-blue-500/30 bg-blue-500/5 text-blue-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPlusMode ? 'bg-orange-400' : 'bg-blue-400'}`} />
            {isPlusMode ? 'Plus Mode — Unlocked' : 'Systems Online — Ready for Deployment'}
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight text-white mb-6 transition-all duration-500"
          >
            Architecting{' '}
            <span className={`bg-clip-text text-transparent bg-gradient-to-r transition-all duration-500 ${
              isPlusMode ? 'from-amber-400 via-orange-400 to-yellow-300' : 'from-blue-400 via-violet-400 to-cyan-400'
            }`}>
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
            {isPlusMode 
              ? 'Premium enterprise engineering and cutting-edge 3D WebGL experiences designed for industry leaders.'
              : 'From interactive spatial interfaces to scalable enterprise operations platforms — engineered for performance, precision, and impact.'}
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
              className={`px-8 py-4 rounded-xl text-white font-bold text-base shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                isPlusMode 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-orange-500/30 hover:shadow-orange-500/50' 
                  : 'bg-gradient-to-r from-blue-600 to-violet-600 shadow-blue-500/30 hover:shadow-blue-500/50'
              }`}
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
            {['3D Web Design', 'Android Apps', 'Enterprise Systems'].map((badge) => (
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

        {/* Right: 3D Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="flex-1 w-full h-[380px] lg:h-[520px] rounded-2xl overflow-hidden border border-white/5 bg-white/2 shadow-2xl shadow-black/50 relative"
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className={`w-10 h-10 border-2 border-t-transparent rounded-full animate-spin ${isPlusMode ? 'border-orange-500' : 'border-blue-500'}`} />
              </div>
            }
          >
            <IsometricScene mouseRef={mouseRef} />
          </Suspense>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />
    </section>
  );
}
