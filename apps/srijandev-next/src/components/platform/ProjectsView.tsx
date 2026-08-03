'use client';

import React, { useState } from 'react';
import { Briefcase, Calendar, DollarSign, Plus, CheckCircle2, Users, Layers, Play } from 'lucide-react';
import { PHASE2_PROJECTS } from '@/lib/mockDataPhase2';

export const ProjectsView: React.FC = () => {
  const [projects] = useState(PHASE2_PROJECTS);
  const [viewMode, setViewMode] = useState<'grid' | 'gantt'>('grid');

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-brand-400" />
            <span>Project Management & Gantt Timeline</span>
          </h1>
          <p className="text-xs text-slate-400">Track client project lifecycles, milestones, budgets, and team allocations</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex p-1 glass-card rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg font-semibold ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`px-3 py-1.5 rounded-lg font-semibold ${viewMode === 'gantt' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
            >
              Gantt Timeline
            </button>
          </div>

          <button className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-glow-purple text-xs font-semibold flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between glass-card-hover">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-[10px] uppercase font-mono font-bold rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {proj.client}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">{proj.progress}% Done</span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">{proj.name}</h3>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-brand-600 to-cyan-400 h-2 rounded-full" style={{ width: `${proj.progress}%` }} />
                </div>

                <div className="text-xs text-slate-400 space-y-1 mb-6">
                  <div className="flex justify-between">
                    <span>Budget: <strong className="text-white">${proj.budget.toLocaleString()}</strong></span>
                    <span>Spent: <strong className="text-cyan-300">${proj.spent.toLocaleString()}</strong></span>
                  </div>
                  <div>Timeline: <span className="text-slate-300 font-mono">{proj.startDate} → {proj.endDate}</span></div>
                </div>
              </div>

              {/* Team Members */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {proj.teamMembers.map((m, mIdx) => (
                    <img
                      key={mIdx}
                      src={m.avatar}
                      alt={m.name}
                      className="w-7 h-7 rounded-full border-2 border-dark-bg object-cover"
                      title={m.name}
                    />
                  ))}
                </div>
                <button className="px-3 py-1 rounded-lg glass-panel text-xs text-slate-300 hover:text-white font-medium">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gantt Timeline View */}
      {viewMode === 'gantt' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white mb-4">Gantt Milestone Schedule</h3>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{proj.name}</span>
                  <span className="text-slate-400 font-mono">{proj.startDate} to {proj.endDate}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden relative">
                  <div
                    className="bg-gradient-to-r from-brand-600 via-purple-500 to-cyan-400 h-4 rounded-full flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                    style={{ width: `${proj.progress}%` }}
                  >
                    {proj.progress}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
