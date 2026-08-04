'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ChevronDown, Menu, X, ArrowRight, Sparkles, Code2, Cpu, Cloud, Briefcase } from 'lucide-react';
import { PortalSwitcher } from './PortalSwitcher';

export const CorporateNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* SrijanDev Nexus Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-purple-400 p-0.5 shadow-glow-purple group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-violet-400 group-hover:text-purple-300 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight gradient-text font-sans">
                SrijanDev <span className="font-light italic text-violet-300">Nexus</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold">
                Tech Agency & IT Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Home
            </Link>

            {/* Services Mega Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-slate-300 hover:text-white transition-colors py-2">
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${megaMenuOpen ? 'rotate-180 text-brand-400' : ''}`} />
              </button>

              {/* Services Mega Menu Dropdown */}
              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-[540px] p-4 glass-panel rounded-2xl shadow-2xl border border-brand-500/20 grid grid-cols-2 gap-3 mt-1 backdrop-blur-2xl"
                  >
                    <Link
                      href="/#services"
                      className="flex items-start space-x-3 p-3 rounded-xl hover:bg-brand-500/10 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Web Development</div>
                        <div className="text-xs text-slate-400">Next.js 15 & React micro-frontends</div>
                      </div>
                    </Link>

                    <Link
                      href="/#services"
                      className="flex items-start space-x-3 p-3 rounded-xl hover:bg-brand-500/10 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">AI Engineering</div>
                        <div className="text-xs text-slate-400">LLMs, RAG agents & automation</div>
                      </div>
                    </Link>

                    <Link
                      href="/#services"
                      className="flex items-start space-x-3 p-3 rounded-xl hover:bg-brand-500/10 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <Cloud className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Cloud & DevOps</div>
                        <div className="text-xs text-slate-400">Kubernetes & Multi-cloud IaC</div>
                      </div>
                    </Link>

                    <Link
                      href="/#services"
                      className="flex items-start space-x-3 p-3 rounded-xl hover:bg-brand-500/10 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">ERP & SaaS Solutions</div>
                        <div className="text-xs text-slate-400">Custom business workforce suite</div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/#portfolio" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Portfolio
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/#blog" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/#careers" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Careers
            </Link>
          </nav>

          {/* Right Action Bar: Portal Switcher & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <PortalSwitcher variant="header" />

            <Link
              href="/#contact"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-medium text-sm shadow-glow-purple transition-all duration-200 transform hover:scale-105"
            >
              <span>Get Proposal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <PortalSwitcher variant="compact" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-panel border-t border-slate-800 px-4 py-6 space-y-4"
          >
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 font-medium py-2 hover:text-brand-400"
            >
              Home
            </Link>
            <Link
              href="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 font-medium py-2 hover:text-brand-400"
            >
              Services
            </Link>
            <Link
              href="/#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 font-medium py-2 hover:text-brand-400"
            >
              Portfolio
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 font-medium py-2 hover:text-brand-400"
            >
              Pricing
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block py-3 rounded-xl bg-brand-600 text-white font-semibold shadow-glow-purple"
            >
              Contact Us
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
