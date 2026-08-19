'use client';

import { useState, useMemo } from 'react';
import { useEnterpriseStore, Guard, GuardShift } from '@/store/useEnterpriseStore';
import { useOperationsStore, RosterSlot } from '@/store/useOperationsStore';
import { exportToCSV } from '@/lib/csvUtils';
import {
  Calendar, Shuffle, Download, ChevronLeft, ChevronRight,
  RefreshCw, CheckCircle2, Users, LayoutGrid, Trash2
} from 'lucide-react';

const SHIFTS: GuardShift[] = ['Morning', 'Evening', 'Night', 'A Shift', 'B Shift', 'C Shift', 'G Shift', 'General Shift'];
const SHIFT_COLORS: Record<GuardShift, { bg: string; text: string; border: string }> = {
  Morning: { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20'  },
  Evening: { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20'   },
  Night:   { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  'A Shift': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  'B Shift': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  'C Shift': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  'G Shift': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
  'General Shift': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
};

function generateRoster(guards: Guard[], tenantId: string, siteId: string, days: number = 30): RosterSlot[] {
  const siteGuards = guards.filter(g => g.assignedSiteId === siteId && g.status !== 'On Leave');
  if (siteGuards.length === 0) return [];

  const posts = Array.from(new Set(siteGuards.map(g => g.assignedPost)));
  const slots: RosterSlot[] = [];
  const today = new Date();

  // Counter per guard to track assignment frequency (avoid overloading)
  const guardNightCount: Record<string, number> = {};
  siteGuards.forEach(g => { guardNightCount[g.id] = 0; });

  for (let d = 0; d < days; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];

    SHIFTS.forEach((shift, si) => {
      posts.forEach((post, pi) => {
        // Round-robin guard selection with night-shift balance
        let idx = (d * SHIFTS.length * posts.length + si * posts.length + pi) % siteGuards.length;

        // Avoid too many consecutive night shifts for same guard
        if (shift === 'Night') {
          const sorted = [...siteGuards].sort((a, b) => (guardNightCount[a.id] || 0) - (guardNightCount[b.id] || 0));
          const candidate = sorted[(pi) % sorted.length];
          idx = siteGuards.findIndex(g => g.id === candidate.id);
        }

        const guard = siteGuards[idx] || siteGuards[0];
        if (shift === 'Night' && guard) guardNightCount[guard.id] = (guardNightCount[guard.id] || 0) + 1;

        slots.push({
          id: `RS-${dateStr}-${post.replace(/\s+/g, '')}-${shift}`,
          tenantId,
          date: dateStr,
          post,
          shift,
          guardId: guard?.id || '',
          guardName: guard?.name || 'Unassigned',
          siteId,
        });
      });
    });
  }
  return slots;
}

export default function AutoShiftScheduler() {
  const { currentUser, guards, sites } = useEnterpriseStore();
  const { rosterSlots, setRosterSlots, updateRosterSlot, clearRoster } = useOperationsStore();

  const [viewStartOffset, setViewStartOffset] = useState(0); // day offset for 7-day view
  const [generating, setGenerating] = useState(false);
  const [generatedDays, setGeneratedDays] = useState(30);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);

  const isGlobalAdmin = currentUser?.role === 'SrijanDev Admin';
  const isHO = currentUser?.role === 'Corporate HO Admin';
  const isSuperAdmin = isGlobalAdmin || isHO;

  const targetSiteId = (!isSuperAdmin) ? (currentUser?.assignedSiteId || 'SITE-01') : 'SITE-01';
  const targetTenantId = currentUser?.tenantId || 'GLOBAL';

  const scopedSlots = rosterSlots.filter(s => {
    const tenantOk = isGlobalAdmin || s.tenantId === targetTenantId;
    const siteOk = isSuperAdmin || s.siteId === currentUser?.assignedSiteId;
    return tenantOk && siteOk;
  });
  const scopedGuards = guards.filter(g => {
    const tenantOk = isGlobalAdmin || g.tenantId === targetTenantId;
    const siteOk = isSuperAdmin || g.assignedSiteId === currentUser?.assignedSiteId;
    return tenantOk && siteOk;
  });

  // 7-day view window
  const today = new Date();
  const viewDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + viewStartOffset + i);
    return d.toISOString().split('T')[0];
  });

  const posts = Array.from(new Set(scopedSlots.map(s => s.post)));

  const getSlot = (date: string, post: string, shift: GuardShift): RosterSlot | undefined =>
    scopedSlots.find(s => s.date === date && s.post === post && s.shift === shift);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const newSlots = generateRoster(guards, targetTenantId, targetSiteId, generatedDays);
      // Keep slots for other sites
      const otherSlots = rosterSlots.filter(s => s.siteId !== targetSiteId);
      setRosterSlots([...otherSlots, ...newSlots]);
      setGenerating(false);
    }, 800); // simulate generation
  };

  const exportRoster = () => {
    const rows = scopedSlots.map(s => ({
      Date: s.date,
      Post: s.post,
      Shift: s.shift,
      'Guard Name': s.guardName,
      'Guard ID': s.guardId,
      'Site': s.siteId,
    }));
    exportToCSV('auto_roster.csv', rows);
  };

  // Stats
  const totalSlots = scopedSlots.length;
  const uniqueDays = new Set(scopedSlots.map(s => s.date)).size;
  const unassigned = scopedSlots.filter(s => !s.guardId).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar size={22} className="text-emerald-400" /> Auto-Shift Scheduler
          </h2>
          <p className="text-sm text-gray-400 mt-1">Unolo 30-Day Roster Engine · Round-robin allocation across posts & shifts</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleGenerate} disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-70">
            {generating ? <RefreshCw size={15} className="animate-spin" /> : <Shuffle size={15} />}
            {generating ? 'Generating...' : `Generate ${generatedDays}-Day Roster`}
          </button>
          <button onClick={exportRoster} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm border border-white/10">
            <Download size={15} /> Export CSV
          </button>
          <button
            onClick={() => { if (confirm('Clear entire roster for this site?')) clearRoster(targetSiteId); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm border border-red-500/20">
            <Trash2 size={15} /> Clear
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-gray-900 rounded-lg border border-white/10 px-3 py-2">
          <span className="text-xs text-gray-400 font-medium">Days to generate:</span>
          {[7, 14, 30].map(d => (
            <button key={d} onClick={() => setGeneratedDays(d)}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${generatedDays === d ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {d}d
            </button>
          ))}
        </div>

        {!isSuperAdmin && !isHO && (
          <div className="text-xs text-gray-500 bg-gray-900 border border-white/10 px-3 py-2 rounded-lg font-mono">
            Generating for: <span className="text-blue-400">{targetSiteId}</span>
          </div>
        )}
      </div>

      {/* Stats Banner */}
      {totalSlots > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Slots', value: totalSlots, color: 'text-blue-400' },
            { label: 'Days Covered', value: uniqueDays, color: 'text-emerald-400' },
            { label: 'Guards Pooled', value: scopedGuards.length, color: 'text-amber-400' },
            { label: 'Unassigned', value: unassigned, color: unassigned > 0 ? 'text-red-400' : 'text-gray-500' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-white/10 rounded-xl px-4 py-3">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* 7-Day Matrix */}
      {scopedSlots.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-300 flex items-center gap-2">
              <LayoutGrid size={16} className="text-blue-400" /> Deployment Matrix (7-Day View)
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setViewStartOffset(v => Math.max(0, v - 7))}
                className="p-2 rounded-lg bg-gray-900 border border-white/10 hover:bg-white/10 text-gray-400 disabled:opacity-40"
                disabled={viewStartOffset === 0}>
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-gray-400 font-mono px-2">
                {viewDays[0]} → {viewDays[6]}
              </span>
              <button onClick={() => setViewStartOffset(v => v + 7)}
                className="p-2 rounded-lg bg-gray-900 border border-white/10 hover:bg-white/10 text-gray-400">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-xs text-left min-w-[900px]">
              <thead className="bg-gray-950/70 text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 font-semibold sticky left-0 bg-gray-950/70 z-10 min-w-[120px]">Post</th>
                  <th className="px-3 py-3 font-semibold min-w-[70px] text-amber-400">Shift</th>
                  {viewDays.map(d => {
                    const date = new Date(d);
                    return (
                      <th key={d} className="px-3 py-3 font-medium text-center">
                        <div>{date.toLocaleDateString('en-IN', { weekday: 'short' })}</div>
                        <div className="text-gray-600 font-normal">{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.flatMap(post =>
                  SHIFTS.map((shift, si) => {
                    const { bg, text, border } = SHIFT_COLORS[shift];
                    return (
                      <tr key={`${post}-${shift}`} className="hover:bg-white/[0.015]">
                        {si === 0 && (
                          <td rowSpan={3} className={`px-4 py-2 font-semibold text-white border-r border-white/5 sticky left-0 bg-gray-900 z-10 align-middle`}>
                            {post}
                          </td>
                        )}
                        <td className={`px-3 py-2 font-semibold text-[10px] uppercase tracking-wider ${text}`}>
                          {shift}
                        </td>
                        {viewDays.map(date => {
                          const slot = getSlot(date, post, shift);
                          return (
                            <td key={date} className="px-2 py-2 text-center">
                              {slot ? (
                                editingSlot === slot.id ? (
                                  <select
                                    autoFocus
                                    defaultValue={slot.guardId}
                                    onBlur={() => setEditingSlot(null)}
                                    onChange={e => {
                                      const g = scopedGuards.find(g => g.id === e.target.value);
                                      if (g) updateRosterSlot(slot.id, { guardId: g.id, guardName: g.name });
                                      setEditingSlot(null);
                                    }}
                                    className="w-full bg-gray-950 border border-blue-500/50 rounded text-[10px] text-white focus:outline-none p-0.5"
                                  >
                                    {scopedGuards.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                  </select>
                                ) : (
                                  <button
                                    onClick={() => setEditingSlot(slot.id)}
                                    title="Click to override"
                                    className={`w-full px-2 py-1.5 rounded border text-[10px] font-medium transition-all hover:opacity-80 truncate ${bg} ${border} ${text}`}
                                  >
                                    {slot.guardName.split(' ')[0]}
                                  </button>
                                )
                              ) : (
                                <span className="text-gray-700 text-[10px]">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 mt-2">💡 Click any cell to manually override guard assignment</p>
        </div>
      )}

      {scopedSlots.length === 0 && (
        <div className="text-center py-20 bg-gray-900 border border-white/10 border-dashed rounded-xl">
          <Calendar size={48} className="mx-auto text-gray-700 mb-4" />
          <h3 className="text-gray-400 font-semibold mb-2">No Roster Generated</h3>
          <p className="text-gray-600 text-sm mb-6">Click "Generate 30-Day Roster" to auto-allocate {scopedGuards.length} guards across all posts and shifts.</p>
          <button onClick={handleGenerate} disabled={generating}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors">
            {generating ? 'Generating...' : 'Generate Roster Now'}
          </button>
        </div>
      )}
    </div>
  );
}
