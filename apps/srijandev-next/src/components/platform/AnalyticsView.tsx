'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const deptPerformance = [
  { dept: 'Engineering', velocity: 94, efficiency: 98 },
  { dept: 'AI & Data', velocity: 92, efficiency: 96 },
  { dept: 'UI/UX Design', velocity: 88, efficiency: 94 },
  { dept: 'Operations', velocity: 90, efficiency: 95 },
];

export const AnalyticsView: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-brand-400" />
            <span>Business Intelligence & Workforce Reports</span>
          </h1>
          <p className="text-xs text-slate-400">Department velocity, operational throughput, and audit metrics</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl glass-panel text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export PDF Audit</span>
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h3 className="text-base font-bold text-white mb-6">Department Operational Velocity vs Efficiency Score</h3>
        <div className="h-80 w-full">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="dept" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#121723', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="velocity" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Velocity Score" />
                <Bar dataKey="efficiency" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Efficiency %" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
};
