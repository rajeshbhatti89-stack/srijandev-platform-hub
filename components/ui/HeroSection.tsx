'use client';

import { useRef, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import DotGridBackground from '@/components/canvas/DotGridBackground';
import CredButton from '@/components/ui/CredButton';
import CredAppShowcase from '@/components/ui/CredAppShowcase';
import { ArrowRight, Mail } from 'lucide-react';

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

        {/* Right: CRED Live App Showcase Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full flex items-center justify-center"
        >
          <CredAppShowcase />
        </motion.div>
      </div>

      {/* Bottom subtle fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f1015] to-transparent pointer-events-none" />
    </section>
  );
}
