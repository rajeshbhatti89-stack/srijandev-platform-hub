'use client';

import React, { useState, useEffect } from 'react';
import { useHRStore } from '@/store/useHRStore';
import {
  Search,
  Plus,
  Bell,
  Clock,
  Coffee,
  CheckCircle2,
  XCircle,
  Menu,
  ShieldCheck,
  Zap,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface TopBarProps {
  onOpenQuickAction: () => void;
  onOpenMobileMenu: () => void;
}

export default function HRTopBar({ onOpenQuickAction, onOpenMobileMenu }: TopBarProps) {
  const {
    theme,
    activeTab,
    setActiveTab,
    isPunchedIn,
    punchInTime,
    punchOutTime,
    activeBreak,
    punchIn,
    punchOut,
    startBreak,
    endBreak,
    searchQuery,
    setSearchQuery,
    employees,
    jobs,
    leaveRequests,
    tickets
  } = useHRStore();

  const isLight = theme === 'light';
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBreakMenu, setShowBreakMenu] = useState(false);
  const [showSearchDrawer, setShowSearchDrawer] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const searchResults = {
    employees: employees.filter(
      (e) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.department.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
    jobs: jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.department.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 2),
    tickets: tickets.filter(
      (t) =>
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 2),
  };

  const hasSearchResults =
    searchQuery.trim().length > 0 &&
    (searchResults.employees.length > 0 || searchResults.jobs.length > 0 || searchResults.tickets.length > 0);

  const notifications = [
    {
      id: 'n1',
      title: 'New Leave Request Submitted',
      desc: 'Aarav Sharma requested 3 days Casual Leave',
      time: '10 min ago',
      tab: 'leaves',
      type: 'leave',
    },
    {
      id: 'n2',
      title: 'Candidate Interview Scheduled',
      desc: 'Rohan Mehra — 3D WebGL Technical Round on Friday',
      time: '1 hr ago',
      tab: 'recruitment',
      type: 'recruitment',
    },
    {
      id: 'n3',
      title: 'IT Helpdesk SLA Escalation',
      desc: 'High Priority ticket for GitHub access resolved',
      time: '2 hrs ago',
      tab: 'helpdesk',
      type: 'ticket',
    },
  ];

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 py-3 border-b backdrop-blur-xl transition-all ${
        isLight
          ? 'bg-white/80 border-slate-200 text-slate-900 shadow-sm'
          : 'bg-[#080c14]/80 border-white/10 text-white shadow-lg'
      }`}
    >
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className={`md:hidden p-2 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-white'
          }`}
          title="Open Menu"
        >
          <Menu size={18} />
        </button>

        {/* Global Instant Search */}
        <div className="relative flex-1">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
              isLight
                ? 'bg-slate-100/90 border-slate-200 focus-within:border-indigo-500 focus-within:bg-white focus-within:shadow-md'
                : 'bg-slate-900/90 border-white/10 focus-within:border-amber-400 focus-within:bg-slate-950 focus-within:shadow-lg focus-within:shadow-amber-500/5'
            }`}
          >
            <Search size={15} className={isLight ? 'text-slate-400' : 'text-slate-500'} />
            <input
              type="text"
              placeholder="Search employees, jobs, policies, tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchDrawer(true)}
              className="w-full bg-transparent text-xs font-medium outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-600">
                ✕
              </button>
            )}
          </div>

          {/* Instant Search Results Dropdown */}
          {showSearchDrawer && hasSearchResults && (
            <div
              className={`absolute top-full left-0 right-0 mt-2 p-3 rounded-2xl border shadow-2xl z-50 animate-in fade-in zoom-in-95 ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
              }`}
            >
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {searchResults.employees.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1.5 px-2">
                      Employees
                    </p>
                    {searchResults.employees.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={() => {
                          setActiveTab('directory');
                          setShowSearchDrawer(false);
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          isLight ? 'hover:bg-slate-100' : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold">{emp.name}</p>
                            <p className="text-[10px] text-slate-400">{emp.designation} · {emp.department}</p>
                          </div>
                        </div>
                        <ArrowUpRight size={14} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.jobs.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1.5 px-2">
                      Job Openings
                    </p>
                    {searchResults.jobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => {
                          setActiveTab('recruitment');
                          setShowSearchDrawer(false);
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          isLight ? 'hover:bg-slate-100' : 'hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold">{job.title}</p>
                          <p className="text-[10px] text-slate-400">{job.department} · {job.salaryRange}</p>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.tickets.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1.5 px-2">
                      Helpdesk Tickets
                    </p>
                    {searchResults.tickets.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setActiveTab('helpdesk');
                          setShowSearchDrawer(false);
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          isLight ? 'hover:bg-slate-100' : 'hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold">{t.subject}</p>
                          <p className="text-[10px] text-slate-400">{t.category} · {t.priority} Priority</p>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Live Punch, Time Widget, Notifications & Quick Action */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Live Attendance Punch Box */}
        <div
          className={`hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border ${
            isLight
              ? isPunchedIn
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/90 border-rose-200 text-rose-900'
              : isPunchedIn
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isPunchedIn ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-wider">
                {isPunchedIn ? 'Punched In' : 'Punched Out'}
              </p>
              <p className="text-[10px] font-mono opacity-80">
                {isPunchedIn ? `Since ${punchInTime}` : `Left at ${punchOutTime || '--'}`}
              </p>
            </div>
          </div>

          {isPunchedIn ? (
            <div className="flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setShowBreakMenu(!showBreakMenu)}
                  className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                    activeBreak
                      ? 'bg-amber-500 text-white'
                      : isLight
                      ? 'bg-emerald-200/70 hover:bg-emerald-300 text-emerald-900'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'
                  }`}
                  title="Take a break"
                >
                  <Coffee size={12} />
                  {activeBreak ? `On ${activeBreak}` : 'Break'}
                </button>

                {showBreakMenu && (
                  <div
                    className={`absolute top-full right-0 mt-1.5 p-1.5 rounded-xl border shadow-xl z-50 w-36 ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'
                    }`}
                  >
                    {activeBreak ? (
                      <button
                        onClick={() => {
                          endBreak();
                          setShowBreakMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-500 hover:bg-emerald-500/10"
                      >
                        End Break
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            startBreak('Lunch');
                            setShowBreakMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-white/10 font-medium"
                        >
                          🍱 Lunch Break (45m)
                        </button>
                        <button
                          onClick={() => {
                            startBreak('Tea');
                            setShowBreakMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-white/10 font-medium"
                        >
                          ☕ Tea Break (15m)
                        </button>
                        <button
                          onClick={() => {
                            startBreak('Bio');
                            setShowBreakMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-white/10 font-medium"
                        >
                          🚶 Bio Break (10m)
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={punchOut}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-500 hover:bg-rose-600 text-white transition-all shadow-sm"
              >
                Punch Out
              </button>
            </div>
          ) : (
            <button
              onClick={punchIn}
              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
            >
              Punch In
            </button>
          )}
        </div>

        {/* Live Clock badge */}
        <div
          className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
            isLight
              ? 'bg-slate-100 border-slate-200 text-slate-700'
              : 'bg-slate-900 border-white/10 text-amber-400'
          }`}
        >
          <Clock size={13} className="text-amber-500" />
          <span>{currentTime || '09:30:00 AM'}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl border relative transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300'
            }`}
            title="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
          </button>

          {showNotifications && (
            <div
              className={`absolute top-full right-0 mt-2 w-80 p-3 rounded-2xl border shadow-2xl z-50 animate-in fade-in zoom-in-95 ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <p className="text-xs font-bold uppercase tracking-wider">Recent Activity</p>
                <span className="text-[10px] text-amber-500 font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setActiveTab(n.tab);
                      setShowNotifications(false);
                    }}
                    className={`p-2 rounded-xl cursor-pointer transition-all ${
                      isLight ? 'hover:bg-slate-100' : 'hover:bg-white/5'
                    }`}
                  >
                    <p className="text-xs font-bold">{n.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.desc}</p>
                    <p className="text-[9px] text-amber-500 font-mono mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Universal Quick Action Launchpad */}
        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 shadow-lg shadow-indigo-600/25 active:scale-95 transition-all"
        >
          <Plus size={14} className="stroke-[3]" />
          <span className="hidden sm:inline">Quick Action</span>
        </button>
      </div>
    </header>
  );
}
