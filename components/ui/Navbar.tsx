'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gray-950/80 backdrop-blur-md border-b border-white/5 py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 relative">
          <div className="relative group flex items-center h-16 w-[180px]">
            <Image 
              src="/logo.png"
              alt="SrijanDev"
              fill
              className="object-contain transition-opacity duration-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
              sizes="180px"
              priority
            />
          </div>
        </div>

        {/* PLUS TOGGLE */}
        <div className="flex items-center gap-4">
          <div className="relative p-1 bg-gray-900 border border-white/10 rounded-full flex items-center">
            
            {/* Standard Mode - Active */}
            <div className="relative z-10 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors text-white bg-white/10 shadow-sm border border-white/5">
              Standard
            </div>
            
            {/* Plus OS Gateway Button */}
            <a
              href="/plus"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative z-10 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 text-gray-400 hover:text-emerald-400"
            >
              <ShieldCheck size={14} className={isHovered ? 'text-emerald-500 animate-pulse' : 'text-gray-500'} />
              Plus OS Gateway
            </a>
          </div>
          
          <a href="/plus" className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-gray-900 text-gray-400 hover:text-white hover:border-white/20 transition-all shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5">
            <User size={18} />
          </a>
        </div>

      </div>
    </motion.nav>
  );
}
