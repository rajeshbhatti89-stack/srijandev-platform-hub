'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-bg border-t border-slate-800/80 pt-16 pb-12 relative overflow-hidden">
      {/* Mesh background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-glow-purple">
                <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-brand-400" />
                </div>
              </div>
              <span className="text-2xl font-extrabold tracking-tight gradient-text">
                SrijanDev
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Architecting next-generation enterprise web portals, AI automation agent networks, and unified workforce operational SaaS platforms.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="p-2 rounded-lg glass-panel hover:text-brand-400 transition-colors text-slate-400">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg glass-panel hover:text-brand-400 transition-colors text-slate-400">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg glass-panel hover:text-brand-400 transition-colors text-slate-400">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Portals & Products</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Corporate Web Portal</Link></li>
              <li><Link href="/?portal=platform" className="hover:text-white transition-colors">Workforce Business SaaS</Link></li>
              <li><Link href="/#services" className="hover:text-white transition-colors">AI Engineering</Link></li>
              <li><Link href="/#services" className="hover:text-white transition-colors">Enterprise Cloud DevOps</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/#about" className="hover:text-white transition-colors">About SrijanDev</Link></li>
              <li><Link href="/#portfolio" className="hover:text-white transition-colors">Case Studies & Work</Link></li>
              <li><Link href="/#blog" className="hover:text-white transition-colors">Engineering Insights</Link></li>
              <li><Link href="/#careers" className="hover:text-white transition-colors">Career Openings</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Contact HQ</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>Tech Park, Outer Ring Rd, Bengaluru</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>contact@srijandev.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>+91 (800) SRIJAN-DEV</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <div>
            © {new Date().getFullYear()} SrijanDev Technologies Inc. All rights reserved. Original Multi-Portal Platform.
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Built with Next.js 15 & React 19</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
