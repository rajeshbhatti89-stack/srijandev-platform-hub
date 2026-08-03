'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  DollarSign,
  CheckSquare,
  Clock,
  TrendingUp,
  Activity,
  Plus,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { PLATFORM_METRICS, PLATFORM_LOGS, PLATFORM_TASKS, PLATFORM_EMPLOYEES } from '@/lib/mockData';

const revenueData = [
  { month: 'Jan', revenue: 120000, tasks: 30 },
  { month: 'Feb', revenue: 135000, tasks: 34 },
  { month: 'Mar', revenue: 142000, tasks: 38 },
  { month: 'Apr', revenue: 158000, tasks: 41 },
  { month: 'May', revenue: 170000, tasks: 45 },
  { month: 'Jun', revenue: 184500, tasks: 42 },
];

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-8">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-400">Welcome back, Rajesh Bhatti • Real-time Operations Feed</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('attendance')}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-2 transition-colors"
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Clock In / Out</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-glow-purple text-xs font-semibold flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Workforce</div>
            <div className="text-2xl font-extrabold text-white mt-1">{PLATFORM_METRICS.totalEmployees}</div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>{PLATFORM_METRICS.presentToday} Present Today</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Projects</div>
            <div className="text-2xl font-extrabold text-cyan-400 mt-1">{PLATFORM_METRICS.activeProjects}</div>
            <div className="text-[11px] text-cyan-300 font-medium flex items-center mt-1">
              <span>94.2% On Track</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Monthly Revenue</div>
            <div className="text-2xl font-extrabold text-white mt-1">
              ${PLATFORM_METRICS.monthlyRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+14.8% vs last month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Open Tasks</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">{PLATFORM_METRICS.openTasks}</div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center mt-1">
              <span>6 High Priority</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Monthly Revenue Growth</h3>
              <p className="text-xs text-slate-400">Financial performance across Q1 & Q2</p>
            </div>
            <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-emerald-500/20 text-emerald-300">
              ARR: $2.2M
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121723', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <span>Live Audit Log</span>
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">System Activity</span>
            </div>

            <div className="space-y-4">
              {PLATFORM_LOGS.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-bold text-white">{log.user}</span>
                    <span className="text-[10px]">{log.timestamp}</span>
                  </div>
                  <div className="text-slate-300">{log.action}</div>
                  <div className="text-[10px] text-cyan-400 mt-1 font-mono">{log.target}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('analytics')}
            className="w-full mt-6 py-2.5 rounded-xl glass-panel text-xs text-slate-300 hover:text-white font-semibold flex items-center justify-center space-x-1"
          >
            <span>View Full Audit Logs</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
