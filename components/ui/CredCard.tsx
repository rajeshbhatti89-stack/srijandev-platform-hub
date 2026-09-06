'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CredCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  enableTilt?: boolean;
  onClick?: () => void;
  id?: string;
}

export default function CredCard({
  children,
  className = '',
  glowColor,
  enableTilt = true,
  onClick,
  id,
}: CredCardProps) {
  return (
    <motion.div
      id={id}
      onClick={onClick}
      whileHover={enableTilt ? { y: -6 } : {}}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`
        relative group rounded-2xl overflow-hidden
        bg-gradient-to-b from-[#181a23] via-[#14151c] to-[#0f1015]
        border border-white/[0.08]
        shadow-[8px_8px_24px_rgba(0,0,0,0.7),-4px_-4px_14px_rgba(255,255,255,0.025),inset_0_1px_0_rgba(255,255,255,0.12)]
        hover:border-white/[0.18]
        hover:shadow-[14px_14px_36px_rgba(0,0,0,0.85),-6px_-6px_18px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.22)]
        transition-colors duration-300
        ${className}
      `}
    >
      {/* Top 1px bevel sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Ambient glow flare if glowColor is provided */}
      {glowColor && (
        <div
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: glowColor }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
