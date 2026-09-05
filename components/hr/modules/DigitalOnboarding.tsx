'use client';

import React, { useState } from 'react';
import { useHRStore } from '@/store/useHRStore';
import {
  UserPlus,
  CheckCircle2,
  Circle,
  Laptop,
  ShieldCheck,
  FileCheck,
  Award,
  Sparkles,
  ChevronRight,
  UserCheck,
  UploadCloud,
  Send,
  Calendar
} from 'lucide-react';

export default function DigitalOnboarding() {
  const { theme, onboardingList, toggleOnboardingItem, employees } = useHRStore();
  const isLight = theme === 'light';

  const [selectedEmpId, setSelectedEmpId] = useState<string>(onboardingList[0]?.employeeId || 'SRJ-008');
  const currentChecklist = onboardingList.find((ob) => ob.employeeId === selectedEmpId) || onboardingList[0];

  const ROADMAP = [
    {
      period: 'Days 1 - 30',
      title: 'Foundations & Architecture Immersion',
      items: [
        'Complete identity verification & bank statutory setup',
        'Receive MacBook Pro 16" & authenticate Cloudflare Access',
        'Pair-program with Welcome Buddy on core codebase',
        'Deploy first PR to staging environment with CI/CD checks',
      ],
      progress: 90,
    },
    {
      period: 'Days 31 - 60',
      title: 'Feature Ownership & Client Delivery',
      items: [
        'Take independent ownership of a 3D Canvas / UI subsystem',
        'Participate in enterprise design review & sprint planning',
        'Pass ISO 27001 SOC-2 security compliance certification',
      ],
      progress: 40,
    },
    {
      period: 'Days 61 - 90',
      title: 'Autonomy & Probation Milestone Review',
      items: [
        'Present quarterly OKR demo to CTO & department head',
        'Mentor incoming interns and document best practices',
        'Final probation appraisal & permanent confirmation',
      ],
      progress: 0,
    },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">Digital Onboarding & Welcome Portal</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Interactive Checklist
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Pre-boarding document submission, e-signatures, IT asset provisioning, and 30-60-90 day milestone roadmap.
          </p>
        </div>

        {/* Employee Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Onboarding New Hire:</span>
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className={`text-xs px-3 py-1.5 rounded-xl border outline-none font-semibold ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/15'
            }`}
          >
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.name} ({e.designation})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Card */}
      {currentChecklist && (
        <div className={`p-6 rounded-3xl border relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-600/15 ${
          isLight ? 'border-indigo-200 shadow-md' : 'border-white/10 shadow-xl'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-indigo-600 p-0.5 shadow-md">
                <div className={`w-full h-full rounded-[14px] flex items-center justify-center font-extrabold text-lg ${
                  isLight ? 'bg-white text-indigo-900' : 'bg-slate-950 text-amber-400'
                }`}>
                  {currentChecklist.employeeName.charAt(0)}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black">{currentChecklist.employeeName}</h2>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                    Probation Hire
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Joined {currentChecklist.joiningDate} · Welcome Buddy: <strong className="text-indigo-400">{currentChecklist.buddyName}</strong>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Onboarding Progress</p>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-indigo-600">
                {currentChecklist.progressPercentage}% Complete
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-800 mt-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${currentChecklist.progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Checklist & 30-60-90 Roadmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Pre-Boarding Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <ShieldCheck size={16} /> Statutory & IT Provisioning Tasks
          </h3>

          <div className="space-y-3">
            {currentChecklist?.items.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleOnboardingItem(currentChecklist.employeeId, item.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  item.isCompleted
                    ? isLight
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-700'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                    : isLight
                    ? 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                    : 'bg-slate-900/80 border-white/10 hover:border-amber-500/30 shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5 text-emerald-500 shrink-0">
                    {item.isCompleted ? (
                      <CheckCircle2 size={18} className="fill-emerald-500 text-white dark:text-slate-950" />
                    ) : (
                      <Circle size={18} className="text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-bold ${item.isCompleted ? 'line-through opacity-70' : ''}`}>
                        {item.title}
                      </h4>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] font-mono text-slate-400 block">Due {item.dueDate}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                    item.isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {item.isCompleted ? 'Completed' : item.assignedToRole}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: 30-60-90 Day Milestone Roadmap */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Sparkles size={16} /> 30-60-90 Day Milestone Roadmap
          </h3>

          <div className="space-y-3">
            {ROADMAP.map((phase) => (
              <div
                key={phase.period}
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 text-white">
                    {phase.period}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-500">
                    {phase.progress}% Done
                  </span>
                </div>

                <h4 className="text-xs font-bold mb-2">{phase.title}</h4>

                <ul className="space-y-1.5 text-[11px] text-slate-400">
                  {phase.items.map((it, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span className="leading-tight">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
