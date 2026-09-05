'use client';

import React from 'react';
import Image from 'next/image';
import { useHRStore, HRRole } from '@/store/useHRStore';
import {
  Users,
  Network,
  FolderLock,
  CalendarCheck2,
  Clock,
  CalendarDays,
  Briefcase,
  UserPlus,
  Target,
  GraduationCap,
  UserCheck,
  LifeBuoy,
  Megaphone,
  BarChart4,
  Sun,
  Moon,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Award
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function HRSidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }: SidebarProps) {
  const {
    theme,
    toggleTheme,
    currentUserRole,
    setCurrentUserRole,
    leaveRequests,
    tickets,
    candidates,
    jobs
  } = useHRStore();

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;
  const openTickets = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;
  const activeCandidates = candidates.filter((c) => c.stage !== 'Hired' && c.stage !== 'Rejected').length;

  const isLight = theme === 'light';

  const MODULE_CATEGORIES = [
    {
      title: 'Core Management',
      items: [
        { id: 'directory', label: 'Employee Directory', desc: 'Digital Profiles & Locker', icon: Users, badge: null },
        { id: 'orgchart', label: 'Org Chart & Hierarchy', desc: 'Interactive Visual Tree', icon: Network, badge: null },
        { id: 'documents', label: 'Document Repository', desc: 'Policies & Auto-Generators', icon: FolderLock, badge: 'Templates' },
      ],
    },
    {
      title: 'Time & Attendance',
      items: [
        { id: 'leaves', label: 'Leave Management (LMS)', desc: 'Balances & Approval Flow', icon: CalendarCheck2, badge: pendingLeaves > 0 ? `${pendingLeaves} Pending` : null, badgeColor: 'bg-amber-500 text-white animate-pulse' },
        { id: 'attendance', label: 'Attendance & Shifts', desc: 'Live Punch, Geo & Roster', icon: Clock, badge: 'Live' },
        { id: 'calendar', label: 'Holiday & Events', desc: 'Corporate Calendar & iCal', icon: CalendarDays, badge: null },
      ],
    },
    {
      title: 'Talent Acquisition',
      items: [
        { id: 'recruitment', label: 'Recruitment & ATS', desc: 'Kanban Pipeline & Jobs', icon: Briefcase, badge: activeCandidates > 0 ? `${activeCandidates}` : null, badgeColor: 'bg-indigo-600 text-white' },
        { id: 'onboarding', label: 'Digital Onboarding', desc: 'Welcome Portal & IT Setup', icon: UserPlus, badge: null },
      ],
    },
    {
      title: 'Performance & Growth',
      items: [
        { id: 'performance', label: 'Goals (OKRs) & Reviews', desc: '360° Appraisals & 9-Box', icon: Target, badge: '9-Box' },
        { id: 'training', label: 'Training & LMS', desc: 'Courses, Skills & Badges', icon: GraduationCap, badge: null },
      ],
    },
    {
      title: 'Self-Service & Helpdesk',
      items: [
        { id: 'ess', label: 'Employee Self-Service', desc: 'Personal Stats & Payslips', icon: UserCheck, badge: null },
        { id: 'helpdesk', label: 'Internal Helpdesk', desc: 'SLA Ticketing & Support', icon: LifeBuoy, badge: openTickets > 0 ? `${openTickets} Open` : null, badgeColor: 'bg-rose-500 text-white' },
        { id: 'announcements', label: 'Announcements & Kudos', desc: 'Broadcasts & Recognition', icon: Megaphone, badge: 'Wall' },
      ],
    },
    {
      title: 'Intelligence & Audit',
      items: [
        { id: 'analytics', label: 'HR Reports & Analytics', desc: 'Executive BI & CSV Export', icon: BarChart4, badge: 'Export' },
      ],
    },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <aside
      className={`fixed md:sticky top-0 left-0 z-40 h-screen w-72 flex flex-col transition-all duration-300 ${
        isLight
          ? 'bg-white border-r border-slate-200 text-slate-800 shadow-xl md:shadow-none'
          : 'bg-[#080c14] border-r border-white/10 text-slate-200'
      } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      {/* Brand Header */}
      <div className={`p-4 border-b ${isLight ? 'border-slate-200 bg-slate-50/70' : 'border-white/10 bg-slate-950/40'} backdrop-blur-md`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-indigo-600 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-slate-950'}`}>
                <Image src="/icon.png" alt="SrijanDev Logo" width={24} height={24} className="w-5 h-5 object-contain" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 bg-clip-text text-transparent">
                  SrijanDev
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                  isLight ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  HR OS
                </span>
              </div>
              <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Human Resource Management
              </p>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all ${
              isLight
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                : 'bg-white/5 text-amber-400 hover:bg-white/10 hover:text-amber-300 border border-white/10'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>

        {/* Role Persona Switcher */}
        <div className={`mt-3 p-2 rounded-xl border transition-all ${
          isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900/80 border-white/10'
        }`}>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className={`font-semibold uppercase tracking-wider text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Active View Persona
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Simulated
            </span>
          </div>
          <select
            value={currentUserRole}
            onChange={(e) => setCurrentUserRole(e.target.value as HRRole)}
            aria-label="Active View Persona"
            className={`w-full text-xs font-semibold py-1.5 px-2 rounded-lg border outline-none cursor-pointer transition-all ${
              isLight
                ? 'bg-white text-slate-900 border-slate-300 focus:border-indigo-500'
                : 'bg-slate-950 text-white border-white/15 focus:border-amber-400'
            }`}
          >
            <option value="HR Super Admin">👑 HR Super Admin (Full Access)</option>
            <option value="Department Manager">👔 Department Manager (Approval Flow)</option>
            <option value="Talent Recruiter">🎯 Talent Recruiter (ATS Pipeline)</option>
            <option value="Employee Self-Service (ESS)">👤 Employee Self-Service (ESS)</option>
          </select>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scrollbar">
        {MODULE_CATEGORIES.map((category) => (
          <div key={category.title} className="space-y-1">
            <h3 className={`text-[10px] font-black uppercase tracking-wider px-3 mb-1.5 ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {category.title}
            </h3>
            {category.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group relative ${
                    isActive
                      ? isLight
                        ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/15 text-indigo-900 border border-indigo-200 shadow-sm font-semibold'
                        : 'bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-indigo-600/30 text-white border border-amber-500/30 shadow-lg shadow-indigo-950/50 font-semibold'
                      : isLight
                      ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-amber-500 to-indigo-600 text-white shadow-md'
                        : isLight
                        ? 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-indigo-600'
                        : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-amber-400'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs truncate font-medium">{item.label}</p>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                            item.badgeColor
                              ? item.badgeColor
                              : isLight
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] truncate ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.desc}
                    </p>
                  </div>
                  {isActive && (
                    <ChevronRight size={14} className={isLight ? 'text-indigo-600' : 'text-amber-400'} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Profile Card Footer */}
      <div className={`p-3 border-t ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-slate-950/70'}`}>
        <div className={`flex items-center gap-3 p-2 rounded-xl border ${
          isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
        }`}>
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shrink-0">
            <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-xs ${
              isLight ? 'bg-white text-indigo-900' : 'bg-slate-900 text-amber-400'
            }`}>
              RB
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold truncate">Rajesh Bhatti</p>
            <p className={`text-[10px] truncate ${isLight ? 'text-indigo-600 font-semibold' : 'text-amber-400/90 font-medium'}`}>
              {currentUserRole}
            </p>
          </div>
          <button
            onClick={() => handleNavClick('ess')}
            className={`p-1.5 rounded-lg text-[10px] font-bold transition-all ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Open Profile"
          >
            ESS
          </button>
        </div>
      </div>
    </aside>
  );
}
