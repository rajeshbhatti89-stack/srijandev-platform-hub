'use client';

import React from 'react';
import { BookOpen, Ticket, Search, Plus, MessageSquare } from 'lucide-react';
import { PHASE2_TICKETS } from '@/lib/mockDataPhase2';

export const KnowledgeBaseView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <span>Knowledge Base & Support Ticket Desk</span>
          </h1>
          <p className="text-xs text-slate-400">Search technical documentation, troubleshooting articles, and manage customer tickets</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple text-xs font-semibold flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4">Active Customer Support Tickets</h3>
        <div className="space-y-3">
          {PHASE2_TICKETS.map((tkt) => (
            <div key={tkt.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono font-bold text-cyan-300">{tkt.ticketNo}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-bold text-white">{tkt.customer}</span>
                </div>
                <div className="text-slate-300 font-semibold">{tkt.subject}</div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 text-[10px] uppercase font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {tkt.status.replace('_', ' ')}
                </span>
                <button className="px-3 py-1.5 rounded-lg glass-panel text-xs text-slate-300 hover:text-white">
                  Respond
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
