'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type CredButtonVariant = 'neumorphic' | 'luxury-white' | 'gold' | 'neon-mint' | 'glass';
export type CredButtonSize = 'sm' | 'md' | 'lg';

interface CredButtonProps {
  children: React.ReactNode;
  variant?: CredButtonVariant;
  size?: CredButtonSize;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
  fullWidth?: boolean;
}

export default function CredButton({
  children,
  variant = 'neumorphic',
  size = 'md',
  onClick,
  className = '',
  icon,
  iconPosition = 'right',
  disabled = false,
  type = 'button',
  id,
  fullWidth = false,
}: CredButtonProps) {
  // CRED signature spring transition physics
  const springTransition = {
    type: 'spring' as const,
    stiffness: 420,
    damping: 26,
    mass: 0.7,
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-xs gap-1.5';
      case 'lg':
        return 'px-8 py-4 text-base gap-3';
      case 'md':
      default:
        return 'px-6 py-3 text-sm gap-2.5';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'luxury-white':
        return `
          bg-[#ffffff] text-[#0a0b0e] font-bold
          border border-white
          shadow-[0_10px_28px_rgba(255,255,255,0.18)]
          hover:shadow-[0_14px_38px_rgba(255,255,255,0.32)]
          hover:bg-[#f8fafc]
        `;
      case 'gold':
        return `
          bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706]
          text-[#0a0b0e] font-bold
          border border-[#fef08a]/60
          shadow-[0_10px_28px_rgba(245,158,11,0.22)]
          hover:shadow-[0_14px_36px_rgba(245,158,11,0.4)]
        `;
      case 'neon-mint':
        return `
          bg-[#0f1015] text-[#00ff87] font-semibold
          border border-[#00ff87]/50
          shadow-[0_0_20px_rgba(0,255,135,0.15)]
          hover:shadow-[0_0_32px_rgba(0,255,135,0.35)]
          hover:border-[#00ff87] hover:bg-[#00ff87]/5
        `;
      case 'glass':
        return `
          bg-white/[0.04] text-white font-medium
          border border-white/10 backdrop-blur-md
          shadow-[0_8px_20px_rgba(0,0,0,0.4)]
          hover:bg-white/[0.08] hover:border-white/20
        `;
      case 'neumorphic':
      default:
        return `
          bg-gradient-to-b from-[#1c1e26] via-[#16181f] to-[#111217]
          text-[#f1f5f9] font-medium
          border border-white/[0.09]
          shadow-[6px_6px_16px_rgba(0,0,0,0.7),-3px_-3px_10px_rgba(255,255,255,0.035),inset_0_1px_0_rgba(255,255,255,0.15)]
          hover:border-white/[0.18]
          hover:shadow-[8px_8px_22px_rgba(0,0,0,0.85),-4px_-4px_12px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.25)]
          hover:text-white
        `;
    }
  };

  return (
    <motion.button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { scale: 1.025, y: -1.5 }}
      whileTap={
        disabled
          ? {}
          : {
              scale: 0.965,
              y: 1,
              boxShadow:
                variant === 'neumorphic'
                  ? 'inset 3px 3px 8px rgba(0,0,0,0.85), inset -2px -2px 6px rgba(255,255,255,0.03)'
                  : 'none',
            }
      }
      transition={springTransition}
      className={`
        relative group overflow-hidden rounded-full
        tracking-wider uppercase inline-flex items-center justify-center
        select-none cursor-pointer transition-colors duration-200
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${getSizeStyles()}
        ${getVariantStyles()}
        ${className}
      `}
    >
      {/* Light sweep shimmer beam */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/12 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out pointer-events-none" />

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && iconPosition === 'left' && (
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">{icon}</span>
        )}
        <span>{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>
        )}
      </span>
    </motion.button>
  );
}
