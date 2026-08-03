'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Compass, Award, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CompanyStory: React.FC = () => {
  const leadership = [
    { name: 'Rajesh Bhatti', role: 'Founder & Principal Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    { name: 'Aisha Sharma', role: 'VP of Artificial Intelligence', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
    { name: 'Priya Nair', role: 'Director of Cloud SRE & Security', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
  ];

  const timeline = [
    { year: '2022', title: 'SrijanDev Founded', desc: 'Started as a high-performance web architecture consultancy in Bengaluru.' },
    { year: '2024', title: 'AI & Hyper-Automation Division', desc: 'Expanded into LLM workflows, RAG agents, and cloud DevOps.' },
    { year: '2026', title: 'Multi-Portal SaaS Launch', desc: 'Unifying Corporate Web and Business Ops Platform into SrijanDev Next.' },
  ];

  return (
    <section id="about" className="py-24 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Mission & Vision */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-400 mb-3">Our Mission & Purpose</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
            Empowering Enterprises Through Next-Gen Architecture
          </p>
          <p className="text-slate-300 text-base leading-relaxed">
            At SrijanDev, we bridge the gap between high-converting corporate web experiences and unified workforce operations SaaS platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8 rounded-3xl border border-brand-500/30">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To engineer resilient, zero-downtime software products that automate business operations and elevate client growth with sub-second performance.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-cyan-500/30">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To define the global benchmark for multi-portal web architecture, AI agent networks, and unified cloud workforce management.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-2xl font-extrabold text-white text-center mb-12">Company Journey & Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {timeline.map((item, idx) => (
              <div key={idx} className="glass-card p-6 rounded-3xl border border-slate-800 relative">
                <div className="text-3xl font-extrabold text-brand-400 font-mono mb-2">{item.year}</div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div>
          <h3 className="text-2xl font-extrabold text-white text-center mb-12">Executive Leadership</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader, idx) => (
              <div key={idx} className="glass-card p-6 rounded-3xl border border-slate-800 text-center glass-card-hover">
                <img
                  src={leader.avatar}
                  alt={leader.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-brand-500/40 object-cover"
                />
                <h4 className="text-lg font-bold text-white">{leader.name}</h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">{leader.role}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
