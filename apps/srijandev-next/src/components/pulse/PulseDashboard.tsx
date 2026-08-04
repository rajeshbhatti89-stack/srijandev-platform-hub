'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, MapPin, Clock, AlertTriangle, ShieldCheck,
  TrendingUp, Activity, ArrowUpRight, CheckCircle, XCircle, Circle,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const attendanceData = [
  { day: 'Mon', present: 21, absent: 3 },
  { day: 'Tue', present: 23, absent: 1 },
  { day: 'Wed', present: 19, absent: 5 },
  { day: 'Thu', present: 24, absent: 0 },
  { day: 'Fri', present: 22, absent: 2 },
  { day: 'Sat', present: 18, absent: 6 },
  { day: 'Today', present: 24, absent: 0 },
];

const liveAgents = [
  { name: 'Arjun Sharma', zone: 'Sector 22 — Noida', status: 'on-duty', time: '09:12 AM', lat: '28.59°N' },
  { name: 'Priya Verma', zone: 'MG Road — Gurugram', status: 'on-duty', time: '09:05 AM', lat: '28.47°N' },
  { name: 'Ravi Kumar', zone: 'Connaught Place — Delhi', status: 'on-duty', time: '09:18 AM', lat: '28.63°N' },
  { name: 'Sneha Patel', zone: 'Sector 4 — Dwarka', status: 'on-leave', time: 'On Leave', lat: '—' },
  { name: 'Mohit Singh', zone: 'Rohini West — Delhi', status: 'off-duty', time: '—', lat: '—' },
];

const recentScans = [
  { checkpoint: 'Gate A — Warehouse 1', guard: 'Arjun Sharma', time: '10:45 AM', status: 'ok' },
  { checkpoint: 'Server Room — Block B', guard: 'Priya Verma', time: '10:32 AM', status: 'ok' },
  { checkpoint: 'Parking Zone — Exit', guard: 'Ravi Kumar', time: '10:15 AM', status: 'ok' },
  { checkpoint: 'Rooftop Access — Floor 8', guard: 'Mohit Singh', time: '09:58 AM', status: 'alert' },
];

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'on-duty') return (
    <span className="flex items-center space-x-1 text-emerald-400 text-[10px] font-bold">
      <CheckCircle className="w-3 h-3" /><span>On Duty</span>
    </span>
  );
  if (status === 'on-leave') return (
    <span className="flex items-center space-x-1 text-amber-400 text-[10px] font-bold">
      <Circle className="w-3 h-3" /><span>On Leave</span>
    </span>
  );
  return (
    <span className="flex items-center space-x-1 text-slate-500 text-[10px] font-bold">
      <XCircle className="w-3 h-3" /><span>Off Duty</span>
    </span>
  );
};

interface PulseDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const PulseDashboard: React.FC<PulseDashboardProps> = ({ setActiveTab }) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  const kpis = [
    { label: 'Field Agents Online', value: '24', sub: '2 on break', icon: Users, color: 'emerald', gradient: 'from-emerald-500/20 to-teal-500/10' },
    { label: 'Clocked In Today', value: '24/24', sub: '100% present', icon: Clock, color: 'cyan', gradient: 'from-cyan-500/20 to-blue-500/10' },
    { label: 'Active Patrols', value: '6', sub: '4 zones covered', icon: ShieldCheck, color: 'violet', gradient: 'from-violet-500/20 to-purple-500/10' },
    { label: 'Incidents Today', value: '2', sub: '1 resolved', icon: AlertTriangle, color: 'amber', gradient: 'from-amber-500/20 to-orange-500/10' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400',
    cyan: 'text-cyan-400',
    violet: 'text-violet-400',
    amber: 'text-amber-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white">Live Operations Dashboard</h1>
          <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Real-time field data • Updated just now</span>
          </p>
        </div>
        <button
          onClick={() => setActiveTab('pulse-attendance')}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center space-x-2"
          style={{ background: 'linear-gradient(135deg, #10b981, #0d9488)' }}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Mark Attendance</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border border-white/5 bg-gradient-to-br ${kpi.gradient}`}
              style={{ background: 'rgba(5,20,12,0.8)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl bg-white/5 ${colorMap[kpi.color]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <TrendingUp className="w-3 h-3 text-emerald-500" />
              </div>
              <div className={`text-2xl font-extrabold ${colorMap[kpi.color]}`}>{kpi.value}</div>
              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{kpi.label}</div>
              <div className="text-[10px] text-slate-600 mt-1">{kpi.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts + Agent Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-white/5" style={{ background: 'rgba(5,20,12,0.8)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Weekly Attendance Trend</h3>
              <p className="text-[10px] text-slate-500">Present vs Absent — This Week</p>
            </div>
            <span className="px-2 py-1 text-[10px] font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              96.4% AVG
            </span>
          </div>
          <div className="h-48">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="pulsePresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0d2818" />
                  <XAxis dataKey="day" stroke="#374151" fontSize={10} />
                  <YAxis stroke="#374151" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#020d0a', borderColor: '#134e2a', borderRadius: '10px', color: '#fff', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#pulsePresent)" name="Present" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Patrol Scans */}
        <div className="p-5 rounded-2xl border border-white/5" style={{ background: 'rgba(5,20,12,0.8)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Patrol Scans</span>
            </h3>
            <button onClick={() => setActiveTab('pulse-patrol')} className="text-[10px] text-emerald-500 hover:text-emerald-300">
              View All →
            </button>
          </div>
          <div className="space-y-2.5">
            {recentScans.map((scan, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-white/3 border border-white/5 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-semibold truncate">{scan.checkpoint}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    scan.status === 'ok'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {scan.status === 'ok' ? 'VERIFIED' : 'ALERT'}
                  </span>
                </div>
                <div className="text-slate-500">{scan.guard} • {scan.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Agent Feed */}
      <div className="p-5 rounded-2xl border border-white/5" style={{ background: 'rgba(5,20,12,0.8)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Live Agent Locations</span>
          </h3>
          <button onClick={() => setActiveTab('pulse-gps')} className="text-[10px] text-emerald-500 hover:text-emerald-300 flex items-center space-x-1">
            <span>Open GPS Map</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[10px] text-slate-600 uppercase tracking-wider border-b border-white/5">
                <th className="pb-2 font-semibold">Agent</th>
                <th className="pb-2 font-semibold">Zone / Location</th>
                <th className="pb-2 font-semibold">Clock In</th>
                <th className="pb-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {liveAgents.map((agent, i) => (
                <tr key={i} className="hover:bg-white/3 transition-colors">
                  <td className="py-2.5 font-semibold text-white">{agent.name}</td>
                  <td className="py-2.5 text-slate-400">{agent.zone}</td>
                  <td className="py-2.5 text-slate-500 font-mono">{agent.time}</td>
                  <td className="py-2.5"><StatusBadge status={agent.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
