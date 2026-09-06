'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Cpu, Activity, Zap, Lock, Sparkles, Wifi, Radio } from 'lucide-react';

export default function CredHeroShowcase() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position values for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);
  const shineX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const shineY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[460px] sm:h-[520px] flex items-center justify-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* Background Radial Ambiance */}
      <div className="absolute w-[360px] h-[360px] rounded-full bg-gradient-to-tr from-[#00ff87]/15 via-[#f5d061]/10 to-[#00e5ff]/10 blur-[90px] pointer-events-none" />

      {/* 3D TILT WRAPPER */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-[420px] h-[340px] flex items-center justify-center"
      >
        {/* ============================================================ */}
        {/* BACKDROP CARD 2: Neon Mint Cyber Tier (Furthest Back) */}
        {/* ============================================================ */}
        <motion.div
          animate={{
            y: [-3, 3, -3],
            rotateZ: [9, 10.5, 9],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[320px] sm:w-[350px] h-[195px] sm:h-[215px] rounded-3xl bg-gradient-to-br from-[#00ff87]/20 via-[#0a0f12] to-[#04080a] border border-[#00ff87]/30 shadow-[0_20px_50px_rgba(0,255,135,0.15)] backdrop-blur-xl opacity-60"
          style={{
            transform: 'translateZ(-60px) translateY(-25px) translateX(25px)',
          }}
        >
          <div className="p-5 flex justify-between items-start">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#00ff87] uppercase">
              CRED PROTOCOL // MINT
            </span>
            <span className="w-2 h-2 rounded-full bg-[#00ff87] shadow-[0_0_8px_#00ff87]" />
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* BACKDROP CARD 1: Champagne Gold VIP Tier */}
        {/* ============================================================ */}
        <motion.div
          animate={{
            y: [3, -4, 3],
            rotateZ: [-6, -7.5, -6],
          }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute w-[320px] sm:w-[360px] h-[200px] sm:h-[220px] rounded-3xl bg-gradient-to-br from-[#f5d061]/25 via-[#18150f] to-[#0c0a06] border border-[#f5d061]/35 shadow-[0_20px_50px_rgba(245,208,97,0.18)] backdrop-blur-xl opacity-80"
          style={{
            transform: 'translateZ(-30px) translateY(-12px) translateX(-20px)',
          }}
        >
          <div className="p-6 flex justify-between items-start">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#f5d061] uppercase">
              SRIJANDEV VIP // GOLD TIER
            </span>
            <Sparkles size={16} className="text-[#f5d061]" />
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* FOREGROUND MAIN HERO CARD: Titanium Black Luxury Card */}
        {/* ============================================================ */}
        <motion.div
          className="relative w-[340px] sm:w-[380px] h-[215px] sm:h-[235px] rounded-3xl bg-gradient-to-b from-[#1c1e28] via-[#14151e] to-[#0b0c10] border border-white/[0.16] shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.8)] p-6 flex flex-col justify-between overflow-hidden cursor-pointer"
          style={{
            transform: 'translateZ(40px)',
          }}
        >
          {/* Holographic Light Sweep Sheen */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent pointer-events-none"
            style={{
              backgroundPositionX: shineX,
              backgroundPositionY: shineY,
            }}
          />

          {/* Top Row: Chip + Contactless Wave + Brand */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              {/* EMV Metallic Smart Chip */}
              <div className="w-11 h-8 rounded-lg bg-gradient-to-br from-[#f5d061] via-[#e5a93b] to-[#b47a16] border border-[#fef08a]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_6px_rgba(0,0,0,0.4)] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/30" />
                <div className="absolute inset-y-0 left-1/3 w-[1px] bg-black/30" />
                <div className="absolute inset-y-0 right-1/3 w-[1px] bg-black/30" />
                <div className="w-3 h-3 rounded-full border border-black/30" />
              </div>
              <Wifi size={18} className="text-white/40 rotate-90" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0f1015]/80 backdrop-blur-md shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#00ff87] animate-pulse shadow-[0_0_8px_#00ff87]" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-white uppercase">
                TITANIUM
              </span>
            </div>
          </div>

          {/* Middle Row: Card Number / Code */}
          <div className="relative z-10 my-2">
            <p className="text-base sm:text-lg font-mono font-bold tracking-[0.25em] text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              •••• •••• •••• 2026
            </p>
          </div>

          {/* Bottom Row: Member Info + Expiry */}
          <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/[0.06]">
            <div>
              <p className="text-[9px] font-mono tracking-widest uppercase text-[#8e95a5]">ENTERPRISE ARCHITECT</p>
              <p className="text-xs font-bold tracking-wider text-white uppercase">SRIJANDEV PLATFORM</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-mono tracking-widest uppercase text-[#8e95a5]">VALID THRU</p>
              <p className="text-xs font-mono font-bold tracking-wider text-[#f5d061]">12 / 28</p>
            </div>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* FLOATING TELEMETRY GLASS BADGES (3D Spatial Nodes) */}
        {/* ============================================================ */}
        
        {/* Node 1: Latency & Speed (Top Left) */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-6 -left-6 sm:-left-10 px-4 py-2.5 rounded-2xl bg-[#14161f]/90 border border-white/[0.12] shadow-[0_15px_30px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-xl flex items-center gap-3 z-30"
          style={{ transform: 'translateZ(70px)' }}
        >
          <div className="w-8 h-8 rounded-xl bg-[#00ff87]/15 border border-[#00ff87]/30 flex items-center justify-center">
            <Zap size={16} className="text-[#00ff87]" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Render Speed</p>
            <p className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>0.12ms Latency</span>
              <span className="text-[10px] text-[#00ff87] font-mono">60 FPS</span>
            </p>
          </div>
        </motion.div>

        {/* Node 2: System Uptime & Security (Bottom Right) */}
        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute -bottom-6 -right-6 sm:-right-8 px-4 py-2.5 rounded-2xl bg-[#14161f]/90 border border-white/[0.12] shadow-[0_15px_30px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-xl flex items-center gap-3 z-30"
          style={{ transform: 'translateZ(65px)' }}
        >
          <div className="w-8 h-8 rounded-xl bg-[#f5d061]/15 border border-[#f5d061]/30 flex items-center justify-center">
            <ShieldCheck size={16} className="text-[#f5d061]" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Core Status</p>
            <p className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>99.99% Uptime</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse" />
            </p>
          </div>
        </motion.div>

        {/* Node 3: Active Engines Count (Top Right) */}
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="absolute -top-10 right-4 px-3.5 py-1.5 rounded-full bg-[#12131a]/90 border border-white/[0.1] shadow-[0_10px_25px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center gap-2 z-20"
          style={{ transform: 'translateZ(50px)' }}
        >
          <Activity size={13} className="text-[#00e5ff]" />
          <span className="text-[11px] font-mono text-gray-300 font-semibold">
            14 Microservices Active
          </span>
        </motion.div>

      </motion.div>
    </div>
  );
}
