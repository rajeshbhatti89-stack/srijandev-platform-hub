'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ShieldCheck, User, Sparkles, Info } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';
  const isAbout = pathname === '/about';
  const isHr = pathname?.startsWith('/hr');
  const isPlus = pathname?.startsWith('/plus');

  return (
    <motion.nav 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-400 ${
        scrolled 
          ? 'bg-[#0f1015]/85 backdrop-blur-xl border-b border-white/[0.06] py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)]' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 relative group cursor-pointer">
          <div className="relative flex items-center h-14 w-[160px] transition-transform duration-300 group-hover:scale-105">
            <Image 
              src="/logo.png"
              alt="Srijandev Technologies"
              fill
              className="object-contain drop-shadow-[0_0_12px_rgba(0,255,135,0.2)]"
              sizes="160px"
              priority
            />
          </div>
        </Link>

        {/* NAVIGATION SHORTCUTS - CRED Capsule */}
        <div className="flex items-center gap-3">
          <div className="relative p-1 bg-[#121318] border border-white/[0.08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] rounded-full flex items-center gap-0.5 sm:gap-1">
            {/* Standard Mode / Hub */}
            <Link
              href="/"
              className={`relative z-10 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                isHome
                  ? 'text-white bg-gradient-to-b from-[#222530] to-[#161820] shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] border border-white/10 font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isHome ? 'bg-[#00ff87] shadow-[0_0_8px_#00ff87]' : 'bg-gray-600'}`} />
              Hub
            </Link>

            {/* Clients Area Link */}
            <Link
              href="/#clients"
              className="relative z-10 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all flex items-center gap-1.5 text-gray-400 hover:text-[#00ff87] hover:bg-[#00ff87]/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87]/60" />
              Clients
            </Link>

            {/* About Page */}
            <Link
              href="/about"
              className={`relative z-10 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                isAbout
                  ? 'text-white bg-gradient-to-b from-[#222530] to-[#161820] shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] border border-[#00e5ff]/40 font-bold'
                  : 'text-gray-400 hover:text-[#00e5ff] hover:bg-[#00e5ff]/10'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isAbout ? 'bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]' : 'bg-gray-600'}`} />
              About
            </Link>
            
            {/* SrijanDev HR Portal Link */}
            <Link
              href="/hr"
              className={`relative z-10 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                isHr
                  ? 'text-[#f5d061] bg-gradient-to-b from-[#222530] to-[#161820] shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] border border-[#f5d061]/40 font-bold'
                  : 'text-[#f5d061] hover:text-white hover:bg-[#f5d061]/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5d061] animate-pulse" />
              HR Portal
            </Link>

            {/* Plus OS Gateway Button */}
            <Link
              href="/plus"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`relative z-10 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                isPlus
                  ? 'text-[#00e5ff] bg-gradient-to-b from-[#222530] to-[#161820] shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] border border-[#00e5ff]/40 font-bold'
                  : 'text-gray-400 hover:text-[#00e5ff] hover:bg-[#00e5ff]/10'
              }`}
            >
              <ShieldCheck size={14} className={isHovered || isPlus ? 'text-[#00e5ff] animate-pulse' : 'text-gray-500'} />
              <span className="hidden xs:inline">Plus OS</span>
            </Link>
          </div>
          
          {/* User Profile / Quick Access button */}
          <Link 
            href="/hr" 
            title="SrijanDev HR Portal"
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-white/[0.08] bg-[#16181f] text-[#f5d061] hover:text-white hover:border-[#f5d061]/50 hover:bg-[#f5d061]/10 transition-all shadow-[4px_4px_10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95"
          >
            <User size={17} />
          </Link>
        </div>

      </div>
    </motion.nav>
  );
}
