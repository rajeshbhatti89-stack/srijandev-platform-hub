'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, LayoutDashboard, Sparkles } from 'lucide-react';
import { usePortal } from '@/features/portal/PortalContext';

interface PortalSwitcherProps {
  variant?: 'header' | 'floating' | 'compact';
}

export const PortalSwitcher: React.FC<PortalSwitcherProps> = ({ variant = 'header' }) => {
  const { activePortal, switchPortal, isSwitching } = usePortal();

  return (
    <div
      className={`relative inline-flex items-center p-1.5 rounded-full glass-panel border border-brand-500/30 shadow-glow-purple backdrop-blur-md z-50 ${
        variant === 'floating' ? 'fixed bottom-6 right-6 shadow-2xl' : ''
      }`}
      aria-label="Portal Switcher"
    >
      {/* Background active tab animation */}
      <div className="relative flex items-center space-x-1">
        {/* Corporate Portal Tab */}
        <button
          onClick={() => switchPortal('corporate')}
          className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
            activePortal === 'corporate' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {activePortal === 'corporate' && (
            <motion.div
              layoutId="portalSwitcherBg"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 shadow-lg"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Building2 className="w-4 h-4 z-10" />
          <span className="z-10 font-medium">Corporate Portal</span>
        </button>

        {/* Business SaaS Platform Tab */}
        <button
          onClick={() => switchPortal('platform')}
          className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
            activePortal === 'platform' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {activePortal === 'platform' && (
            <motion.div
              layoutId="portalSwitcherBg"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-600 to-brand-600 shadow-lg"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <LayoutDashboard className="w-4 h-4 z-10" />
          <span className="z-10 font-medium">Business Platform</span>
          <span className="z-10 ml-1 px-1.5 py-0.5 text-[10px] uppercase font-extrabold bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30">
            SaaS
          </span>
        </button>
      </div>

      {/* Keyboard shortcut hint badge */}
      <div className="hidden lg:flex items-center ml-2 pr-2 text-[10px] text-slate-400 border-l border-slate-700/60 pl-2">
        <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono">Alt</kbd>
        <span className="mx-0.5">+</span>
        <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono">S</kbd>
      </div>
    </div>
  );
};
