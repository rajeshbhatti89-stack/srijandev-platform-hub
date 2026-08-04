'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  Kanban,
  Building,
  FileText,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  DollarSign,
  Calendar,
  UserCheck,
  HardDrive,
  Target,
  BookOpen,
  MessageSquare,
} from 'lucide-react';

interface PlatformSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const PlatformSidebar: React.FC<PlatformSidebarProps> = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects & Gantt', icon: Briefcase },
    { id: 'employees', label: 'Employee Directory', icon: Users, badge: '148' },
    { id: 'attendance', label: 'Attendance & Clock-In', icon: Clock },
    { id: 'leaves', label: 'PTO & Leave Mgmt', icon: Calendar },
    { id: 'tasks', label: 'Task Kanban Board', icon: Kanban, badge: '4 Open' },
    { id: 'crm', label: 'Enterprise CRM', icon: Building },
    { id: 'finance', label: 'Invoices & Payroll', icon: DollarSign },
    { id: 'chat', label: 'Internal Team Chat', icon: MessageSquare, badge: 'Live' },
    { id: 'files', label: 'File Manager Vault', icon: HardDrive },
    { id: 'org', label: 'Org Chart Tree', icon: Users },
    { id: 'recruitment', label: 'ATS Recruitment', icon: UserCheck },
    { id: 'assets', label: 'Hardware Assets', icon: HardDrive },
    { id: 'performance', label: 'OKRs & Goals', icon: Target },
    { id: 'knowledge', label: 'Support & Docs', icon: BookOpen },
    { id: 'analytics', label: 'Reports & Intelligence', icon: BarChart3 },
    { id: 'admin', label: 'Admin RBAC Panel', icon: ShieldCheck },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col glass-panel border-r border-slate-800 transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800/80">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-0.5 shadow-glow-cyan">
              <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-white tracking-tight">SrijanDev <span className="text-emerald-400 font-light italic">Pulse</span></div>
              <div className="text-[9px] text-emerald-400 font-mono font-semibold">FIELD FORCE PLATFORM</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-0.5 flex items-center justify-center shadow-glow-cyan">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors hidden md:block"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Menu Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-brand-600/20 text-cyan-300 border border-cyan-500/30 shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto px-2 py-0.5 text-[9px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Rajesh Bhatti"
              className="w-10 h-10 rounded-full border border-cyan-500/40 object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-dark-bg" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">Rajesh Bhatti</div>
              <div className="flex items-center space-x-1">
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                  SUPER ADMIN
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
