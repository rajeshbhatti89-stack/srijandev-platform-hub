'use client';

import React from 'react';
import { Target, Award, CheckCircle2, TrendingUp } from 'lucide-react';

export const PerformanceView: React.FC = () => {
  const okrs = [
    { title: 'Achieve 99.999% SLA Uptime Across Multi-Region AWS Nodes', progress: 95, category: 'DevOps & Reliability' },
    { title: 'Deploy Fine-Tuned Clinical RAG Model for Apex Health', progress: 80, category: 'AI Research' },
    { title: 'Complete Next.js 15 App Router Migration with 0 Downtime', progress: 100, category: 'Architecture' },
  ];

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <Target className="w-6 h-6 text-brand-400" />
          <span>Employee Performance, OKRs & Company Goals</span>
        </h1>
        <p className="text-xs text-slate-400">Quarterly key results, quarterly reviews, and workforce achievement tracking</p>
      </div>

      <div className="space-y-4">
        {okrs.map((okr, idx) => (
          <div key={idx} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 text-[10px] uppercase font-mono font-bold rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {okr.category}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">{okr.progress}% Target Hit</span>
            </div>
            <h4 className="text-sm font-bold text-white">{okr.title}</h4>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div className="bg-gradient-to-r from-brand-600 to-emerald-400 h-2.5 rounded-full" style={{ width: `${okr.progress}%` }} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
