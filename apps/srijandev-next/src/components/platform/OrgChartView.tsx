'use client';

import React from 'react';
import { Users, ShieldCheck, ChevronDown } from 'lucide-react';
import { PHASE2_ORG } from '@/lib/mockDataPhase2';

export const OrgChartView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <Users className="w-6 h-6 text-brand-400" />
          <span>Organization Tree & Department Hierarchy</span>
        </h1>
        <p className="text-xs text-slate-400">Interactive visual organization chart and reporting lines</p>
      </div>

      <div className="glass-card p-10 rounded-3xl border border-slate-800 text-center space-y-8 overflow-x-auto">
        
        {/* Executive Node */}
        <div className="inline-block p-6 rounded-3xl bg-slate-900 border-2 border-brand-500/50 shadow-glow-purple max-w-sm">
          <img src={PHASE2_ORG.avatar} alt={PHASE2_ORG.name} className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-brand-400 object-cover" />
          <h3 className="text-lg font-bold text-white">{PHASE2_ORG.name}</h3>
          <p className="text-xs text-brand-300 font-semibold mt-1">{PHASE2_ORG.role}</p>
          <span className="inline-block mt-2 px-2.5 py-0.5 text-[10px] uppercase font-mono font-bold rounded bg-brand-500/20 text-brand-300">
            {PHASE2_ORG.department}
          </span>
        </div>

        <div className="w-0.5 h-8 bg-slate-700 mx-auto" />

        {/* Subordinates Row */}
        <div className="flex flex-wrap justify-center gap-6">
          {PHASE2_ORG.subordinates?.map((sub) => (
            <div key={sub.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-xs text-center">
              <img src={sub.avatar} alt={sub.name} className="w-12 h-12 rounded-full mx-auto mb-2 border border-slate-700 object-cover" />
              <h4 className="text-sm font-bold text-white">{sub.name}</h4>
              <p className="text-xs text-cyan-300 font-semibold mt-0.5">{sub.role}</p>
              <span className="inline-block mt-2 px-2 py-0.5 text-[9px] uppercase font-mono rounded bg-slate-800 text-slate-400">
                {sub.department}
              </span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
