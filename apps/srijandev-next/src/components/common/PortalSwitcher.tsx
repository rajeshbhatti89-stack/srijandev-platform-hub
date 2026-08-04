'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity } from 'lucide-react';
import { usePortal } from '@/features/portal/PortalContext';

interface PortalSwitcherProps {
  variant?: 'header' | 'floating' | 'compact';
}

export const PortalSwitcher: React.FC<PortalSwitcherProps> = ({ variant = 'header' }) => {
  const { activePortal, switchPortal } = usePortal();

  return (
    <div
      className={`relative inline-flex items-center p-1.5 rounded-2xl glass-panel border border-white/10 backdrop-blur-md z-50 gap-1 ${
        variant === 'floating' ? 'fixed bottom-6 right-6 shadow-2xl' : ''
      }`}
      aria-label="Portal Switcher"
    >
      {/* SrijanDev Nexus — TechPurple style enterprise app */}
      <button
        onClick={() => switchPortal('platform')}
        className={`relative px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center space-x-2 focus:outline-none ${
          activePortal === 'platform' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
        title="SrijanDev Nexus — Enterprise Operations Portal"
      >
        {activePortal === 'platform' && (
          <motion.div
            layoutId="portalSwitcherBg"
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <Zap className="w-3.5 h-3.5 z-10 relative" />
        <span className="z-10 relative font-bold">SrijanDev</span>
        <span className="z-10 relative font-light italic text-violet-200">Nexus</span>
      </button>

      {/* SrijanDev Pulse — Unolo style field force platform */}
      <button
        onClick={() => switchPortal('pulse')}
        className={`relative px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center space-x-2 focus:outline-none ${
          activePortal === 'pulse' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
        title="SrijanDev Pulse — Field Force & Operations Platform"
      >
        {activePortal === 'pulse' && (
          <motion.div
            layoutId="portalSwitcherBg"
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <Activity className="w-3.5 h-3.5 z-10 relative" />
        <span className="z-10 relative font-bold">SrijanDev</span>
        <span className="z-10 relative font-light italic text-emerald-200">Pulse</span>
        <span className="z-10 relative ml-0.5 px-1.5 py-0.5 text-[9px] uppercase font-extrabold bg-emerald-500/30 text-emerald-300 rounded-full border border-emerald-400/40 animate-pulse">
          Live
        </span>
      </button>
    </div>
  );
};
