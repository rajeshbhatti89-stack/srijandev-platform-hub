'use client';

import React, { useState } from 'react';
import { useHRStore, OKRGoal, PerformanceReview } from '@/store/useHRStore';
import {
  Target,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Star,
  Plus,
  BarChart3,
  Sliders,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export default function PerformanceTalent() {
  const {
    theme,
    okrs,
    addOKR,
    updateOKRProgress,
    reviews,
    addReview,
    employees
  } = useHRStore();

  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'okrs' | 'ninebox' | 'reviews'>('okrs');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q3 2026');
  const [isAddOKRModal, setIsAddOKRModal] = useState(false);

  // New OKR Form State
  const [okrTitle, setOkrTitle] = useState('');
  const [okrCategory, setOkrCategory] = useState<any>('Company Objective');
  const [okrTarget, setOkrTarget] = useState('100%');
  const [okrOwnerId, setOkrOwnerId] = useState(employees[0]?.id || 'SRJ-001');

  const NINE_BOX_GRID = [
    { title: 'Star Talent', potential: 'High', performance: 'High', color: 'from-amber-500/30 to-indigo-600/40 border-amber-500/50', desc: 'Top performers ready for promotion' },
    { title: 'High Performer', potential: 'Medium', performance: 'High', color: 'from-emerald-500/20 to-teal-500/30 border-emerald-500/40', desc: 'Deliver consistent high output' },
    { title: 'Solid Performer', potential: 'Low', performance: 'High', color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30', desc: 'Core operational backbone' },
    { title: 'Future Leader', potential: 'High', performance: 'Medium', color: 'from-purple-500/20 to-pink-500/30 border-purple-500/40', desc: 'High capability, growing execution' },
    { title: 'Core Contributor', potential: 'Medium', performance: 'Medium', color: 'from-slate-500/20 to-slate-600/20 border-slate-500/30', desc: 'Key dependable contributor' },
    { title: 'Effective', potential: 'Low', performance: 'Medium', color: 'from-slate-500/10 to-slate-700/10 border-slate-600/20', desc: 'Steady performance in current role' },
    { title: 'Enigma / High Potential', potential: 'High', performance: 'Low', color: 'from-orange-500/20 to-amber-500/20 border-orange-500/30', desc: 'Needs mentoring or role alignment' },
    { title: 'Inconsistent', potential: 'Medium', performance: 'Low', color: 'from-amber-950/20 to-rose-950/20 border-amber-600/20', desc: 'Needs PIP or targeted training' },
    { title: 'Underperformer', potential: 'Low', performance: 'Low', color: 'from-rose-500/20 to-red-600/30 border-rose-500/40', desc: 'Immediate performance intervention' },
  ];

  const handleAddOKR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!okrTitle) return;
    const owner = employees.find((x) => x.id === okrOwnerId) || employees[0];
    const newGoal: OKRGoal = {
      id: `OKR-${Date.now().toString().slice(-3)}`,
      title: okrTitle,
      category: okrCategory,
      ownerId: owner.id,
      ownerName: owner.name,
      department: owner.department,
      quarter: selectedQuarter as any,
      progress: 0,
      targetValue: okrTarget,
      currentValue: '0',
      status: 'On Track',
      keyResults: [
        { id: `kr-${Date.now()}-1`, title: 'Milestone 1 execution', progress: 0, weightage: 50 },
        { id: `kr-${Date.now()}-2`, title: 'Final delivery verification', progress: 0, weightage: 50 },
      ],
    };
    addOKR(newGoal);
    setIsAddOKRModal(false);
    setOkrTitle('');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">Performance & Talent Management</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
              OKRs · 360° · 9-Box
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Company & individual OKRs, 360-degree review cycles, and visual 9-Box talent calibration matrix.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-xl border flex items-center ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-white/10'}`}>
            <button
              onClick={() => setActiveTab('okrs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'okrs'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎯 OKRs & KPIs
            </button>
            <button
              onClick={() => setActiveTab('ninebox')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ninebox'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 9-Box Matrix
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'reviews'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📝 360° Appraisals
            </button>
          </div>

          {activeTab === 'okrs' && (
            <button
              onClick={() => setIsAddOKRModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-md"
            >
              <Plus size={15} />
              <span>Create Goal</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'okrs' && (
        <div className="space-y-4">
          {/* Quarter Switcher */}
          <div className="flex items-center gap-2">
            {['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'].map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQuarter(q)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedQuarter === q
                    ? 'bg-indigo-600 text-white shadow-md'
                    : isLight
                    ? 'bg-white text-slate-600 border border-slate-200'
                    : 'bg-slate-900 text-slate-400 border border-white/10'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* OKR Cards Grid */}
          <div className="space-y-4">
            {okrs.map((okr) => (
              <div
                key={okr.id}
                className={`p-6 rounded-3xl border transition-all ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10 shadow-lg'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {okr.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        Owner: <strong className="text-white">{okr.ownerName}</strong> ({okr.department})
                      </span>
                    </div>
                    <h3 className="text-base font-bold mt-1">{okr.title}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        okr.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : okr.status === 'On Track'
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {okr.status}
                    </span>
                    <span className="text-xl font-black text-amber-500 font-mono">
                      {okr.progress}%
                    </span>
                  </div>
                </div>

                {/* Interactive Progress Slider */}
                <div className="space-y-1.5 my-3">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Target: {okr.targetValue}</span>
                    <span>Current: {okr.currentValue} ({okr.progress}% Completed)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={okr.progress}
                    onChange={(e) => updateOKRProgress(okr.id, parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Key Results Checklist */}
                <div className="mt-4 pt-3 border-t border-inherit space-y-2">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Key Results (KRs)</h4>
                  {okr.keyResults.map((kr) => (
                    <div key={kr.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/5">
                      <span className="font-medium text-slate-300">{kr.title}</span>
                      <span className="font-mono font-bold text-amber-400">{kr.progress}% (Weight: {kr.weightage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ninebox' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Calibration of team members across <strong>Performance (Y-Axis)</strong> vs <strong>Potential (X-Axis)</strong>.
            </p>
            <span className="text-xs font-mono text-amber-500 font-bold">3 Stars Calibrated</span>
          </div>

          {/* 9-Box Interactive Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {NINE_BOX_GRID.map((box, idx) => {
              const matchedReviews = reviews.filter((r) => r.boxClassification === box.title);
              return (
                <div
                  key={box.title}
                  className={`p-5 rounded-3xl border bg-gradient-to-br transition-all flex flex-col justify-between min-h-[160px] ${box.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-black uppercase tracking-wider text-white">
                        {box.title}
                      </h4>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                        {matchedReviews.length} Assigned
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">{box.desc}</p>
                  </div>

                  <div className="space-y-1 mt-3">
                    {matchedReviews.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between p-1.5 rounded-lg bg-black/40 text-xs text-white"
                      >
                        <span className="font-bold">{r.employeeName}</span>
                        <span className="font-mono text-amber-400 text-[11px]">★ {r.calibratedRating}</span>
                      </div>
                    ))}
                    {matchedReviews.length === 0 && (
                      <p className="text-[10px] text-slate-500 italic">No personnel mapped</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-6 rounded-3xl border ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10 shadow-lg'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold">{rev.employeeName}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                      {rev.cycle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{rev.designation} · {rev.department} · Reviewer: {rev.reviewerName}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Calibrated Score</p>
                    <p className="text-xl font-black text-amber-500 font-mono">★ {rev.calibratedRating} / 5.0</p>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {rev.boxClassification}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs my-3">
                <div className={`p-3 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">Key Strengths</span>
                  <p className="text-slate-300 leading-relaxed">{rev.strengths}</p>
                </div>
                <div className={`p-3 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-[10px] font-bold uppercase text-amber-400 block mb-1">Growth Areas</span>
                  <p className="text-slate-300 leading-relaxed">{rev.improvements}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add OKR Modal */}
      {isAddOKRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0b0f19] border-white/10 text-white'
            }`}
          >
            <div className={`p-5 border-b flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-white/10'}`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Target size={16} className="text-amber-500" />
                Define Strategic OKR / KPI Goal
              </h3>
              <button onClick={() => setIsAddOKRModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddOKR} className="p-6 space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Objective Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deploy 3D Digital Twins to 5 New Enterprise Sites"
                  value={okrTitle}
                  onChange={(e) => setOkrTitle(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Category</label>
                  <select
                    value={okrCategory}
                    onChange={(e) => setOkrCategory(e.target.value as any)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  >
                    <option value="Company Objective">Company Objective</option>
                    <option value="Department Goal">Department Goal</option>
                    <option value="Individual KPI">Individual KPI</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Target Metric</label>
                  <input
                    type="text"
                    value={okrTarget}
                    onChange={(e) => setOkrTarget(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Goal Owner</label>
                <select
                  value={okrOwnerId}
                  onChange={(e) => setOkrOwnerId(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.name} ({e.designation})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOKRModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-lg"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
