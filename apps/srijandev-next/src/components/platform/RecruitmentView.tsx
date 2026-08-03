'use client';

import React from 'react';
import { UserCheck, Star, Plus } from 'lucide-react';
import { PHASE2_APPLICANTS } from '@/lib/mockDataPhase2';

export const RecruitmentView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-purple-400" />
            <span>Recruitment & Applicant Tracking System (ATS)</span>
          </h1>
          <p className="text-xs text-slate-400">Track candidate pipelines, interview stages, ratings, and job offers</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple text-xs font-semibold flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Applicant</span>
        </button>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Target Position</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Pipeline Stage</th>
                <th className="px-6 py-4">Interview Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {PHASE2_APPLICANTS.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{app.candidateName}</td>
                  <td className="px-6 py-4 text-slate-200 font-semibold">{app.position}</td>
                  <td className="px-6 py-4 text-slate-400">{app.department}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-[10px] uppercase font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {app.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-amber-400 flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{app.rating} / 5.0</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1.5 rounded-lg glass-panel text-xs text-slate-300 hover:text-white">
                      Schedule Interview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
