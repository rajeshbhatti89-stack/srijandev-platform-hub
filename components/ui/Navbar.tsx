'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
  isPlusMode: boolean;
  setIsPlusMode: (val: boolean) => void;
}

export default function Navbar({ isPlusMode, setIsPlusMode }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl bg-gray-950/80 border-b border-white/5 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2 group"
          id="nav-logo"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-colors duration-500 ${isPlusMode ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-orange-500/30' : 'bg-gradient-to-br from-blue-500 to-violet-600 shadow-blue-500/30'}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" opacity="0.8" />
            </svg>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Srijan<span className="text-blue-400">Dev</span></span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.href}
              id={`nav-${item.label.toLowerCase()}`}
              onClick={() => scrollTo(item.href)}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-wide"
            >
              {item.label}
            </button>
          ))}

          {/* Plus Toggle */}
          <button
            onClick={() => setIsPlusMode(!isPlusMode)}
            className={`relative flex items-center w-12 h-6 rounded-full transition-colors duration-300 ${isPlusMode ? 'bg-orange-500/20 border border-orange-500/50' : 'bg-white/5 border border-white/10'}`}
          >
            <span 
              className={`absolute left-1 w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${isPlusMode ? 'translate-x-6 bg-orange-400 shadow-orange-500/50' : 'translate-x-0 bg-gray-400'}`}
            />
          </button>
          
          <a
            id="nav-cta"
            href="mailto:Contact@srijandev.in?subject=Project%20Inquiry"
            className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 shadow-md ${
              isPlusMode 
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-orange-500/30 hover:shadow-orange-500/50' 
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30 hover:shadow-blue-500/50'
            }`}
          >
            Contact@srijandev.in
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          id="nav-mobile-toggle"
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-white/5 backdrop-blur-xl bg-gray-950/95"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  id={`nav-mobile-${item.label.toLowerCase()}`}
                  onClick={() => scrollTo(item.href)}
                  className="text-gray-300 hover:text-white text-left text-sm font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}

              <div className="flex items-center justify-between py-2 border-t border-white/5 mt-2 pt-4">
                <span className="text-sm font-medium text-gray-300">SrijanDev Plus</span>
                <button
                  onClick={() => setIsPlusMode(!isPlusMode)}
                  className={`relative flex items-center w-12 h-6 rounded-full transition-colors duration-300 ${isPlusMode ? 'bg-orange-500/20 border border-orange-500/50' : 'bg-white/5 border border-white/10'}`}
                >
                  <span 
                    className={`absolute left-1 w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${isPlusMode ? 'translate-x-6 bg-orange-400 shadow-orange-500/50' : 'translate-x-0 bg-gray-400'}`}
                  />
                </button>
              </div>

              <a
                id="nav-mobile-cta"
                href="mailto:Contact@srijandev.in?subject=Project%20Inquiry"
                className={`px-4 py-2 mt-2 rounded-lg text-white text-sm font-semibold text-center ${
                  isPlusMode ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-blue-600'
                }`}
              >
                Contact@srijandev.in
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
