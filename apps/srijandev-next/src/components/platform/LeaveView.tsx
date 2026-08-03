'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Plus } from 'lucide-react';
import { PHASE2_LEAVES } from '@/lib/mockDataPhase2';

export const LeaveView: React.FC = () => {
  const [leaves, setLeaves] = useState(PHASE2_LEAVES);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-amber-400" />
            <span>PTO & Leave Management</span>
          </h1>
          <p className="text-xs text-slate-400">Track workforce leave requests, annual PTO balances, and manager approvals</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-glow-purple text-xs font-semibold flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Apply Leave</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-bold">Annual PTO Remaining</div>
          <div className="text-2xl font-extrabold text-white mt-1">18 Days</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-bold">Sick Leaves Remaining</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">10 Days</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-bold">Pending Approvals</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">1 Request</div>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Leave Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Days</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {leaves.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{l.employeeName}</td>
                  <td className="px-6 py-4 text-cyan-300 font-semibold">{l.type}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">{l.startDate} → {l.endDate}</td>
                  <td className="px-6 py-4 font-mono font-bold text-white">{l.daysCount} days</td>
                  <td className="px-6 py-4 text-slate-300">{l.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full border ${
                      l.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {l.status}
                    </span>
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
