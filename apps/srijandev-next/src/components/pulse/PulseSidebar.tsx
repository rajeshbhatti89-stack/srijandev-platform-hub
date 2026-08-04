'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  MapPin,
  ShieldCheck,
  BarChart3,
  Calendar,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  LogOut,
} from 'lucide-react';

interface PulseSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'pulse-dashboard', label: 'Live Dashboard', icon: LayoutDashboard, badge: 'LIVE' },
  { id: 'pulse-agents', label: 'Field Agents', icon: Users, badge: '24' },
  { id: 'pulse-attendance', label: 'Attendance Muster', icon: Clock },
  { id: 'pulse-gps', label: 'Live GPS Map', icon: MapPin, badge: '🟢' },
  { id: 'pulse-patrol', label: 'Patrol Operations', icon: ShieldCheck },
  { id: 'pulse-leaves', label: 'Leave Approvals', icon: Calendar, badge: '3' },
  { id: 'pulse-incidents', label: 'Incident Reports', icon: AlertTriangle, badge: '2' },
  { id: 'pulse-analytics', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'pulse-admin', label: 'Admin Settings', icon: Settings },
];

export const PulseSidebar: React.FC<PulseSidebarProps> = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col border-r border-emerald-900/40 transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      style={{ background: 'linear-gradient(180deg, #020d0a 0%, #041a10 100%)' }}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-emerald-900/40">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/30">
              <div className="w-full h-full bg-[#020d0a] rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="text-sm font-extrabold text-white tracking-tight">
                SrijanDev <span className="text-emerald-400 font-light italic">Pulse</span>
              </div>
              <div className="text-[9px] text-emerald-500 font-mono font-semibold tracking-wider">
                FIELD FORCE PLATFORM
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-500 hover:text-emerald-300 transition-colors hidden md:block"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Live status bar */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-1 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] text-emerald-400 font-mono font-semibold">24 AGENTS ONLINE</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-500 hover:bg-emerald-900/20 hover:text-emerald-400'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-600'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className={`ml-auto px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
                  item.badge === 'LIVE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom user area */}
      <div className="p-3 border-t border-emerald-900/40">
        <div className="flex items-center space-x-3">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
              RB
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#020d0a]" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">Rajesh Bhatti</div>
              <div className="text-[9px] text-emerald-500 font-mono">SUPER ADMIN</div>
            </div>
          )}
          {!collapsed && (
            <button className="p-1.5 text-slate-600 hover:text-red-400 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
