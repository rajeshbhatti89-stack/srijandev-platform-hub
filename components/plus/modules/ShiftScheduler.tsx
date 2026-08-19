'use client';

import { useState } from 'react';
import { useEnterpriseStore, Guard, AttendanceLog } from '@/store/useEnterpriseStore';
import { exportAttendance } from '@/lib/csvUtils';
import {
  Calendar, Clock, CheckCircle2, UserMinus, AlertCircle,
  Download, ChevronDown, Users, RefreshCw
} from 'lucide-react';

const POSTS = ['Main Gate 1', 'Main Gate 2', 'Weighbridge', 'Admin Block', 'Material Gate', 'Control Room', 'Perimeter', 'Pump House', 'Material Yard', 'Cash Room'];
const SHIFTS: Guard['shift'][] = ['Morning', 'Evening', 'Night', 'A Shift', 'B Shift', 'C Shift', 'G Shift', 'General Shift'];

const SHIFT_TIMES: Record<Guard['shift'], string> = {
  Morning: '06:00 – 14:00',
  Evening: '14:00 – 22:00',
  Night:   '22:00 – 06:00',
  'A Shift': '06:00 – 14:00',
  'B Shift': '14:00 – 22:00',
  'C Shift': '22:00 – 06:00',
  'G Shift': '08:30 – 17:30',
  'General Shift': '09:00 – 18:00',
};

type AttStatus = AttendanceLog['status'];

const attConfig: Record<AttStatus, { label: string; color: string; bg: string; border: string }> = {
  Present:  { label: 'Present',  color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  Late:     { label: 'Late',     color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30'   },
  Absent:   { label: 'Absent',   color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30'     },
  Relieved: { label: 'Relieved', color: 'text-gray-400',    bg: 'bg-gray-500/10',    border: 'border-gray-500/30'    },
};

const shiftColors: Record<Guard['shift'], string> = {
  Morning: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Evening: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Night:   'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  'A Shift': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'B Shift': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'C Shift': 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  'G Shift': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  'General Shift': 'text-teal-400 bg-teal-500/10 border-teal-500/20',
};

export default function ShiftScheduler() {
  const { currentUser, guards, updateGuard, attendanceLogs, logAttendance } = useEnterpriseStore();
  const [activeShift, setActiveShift] = useState<Guard['shift']>('Morning');
  const [editingAssign, setEditingAssign] = useState<string | null>(null); // guardId being reassigned
  const [newPost, setNewPost] = useState('');
  const [newShift, setNewShift] = useState<Guard['shift']>('Morning');

  const today = new Date().toISOString().split('T')[0];
  const isGlobalAdmin = currentUser?.role === 'SrijanDev Admin';
  const isHO = currentUser?.role === 'Corporate HO Admin';
  const isSuperAdmin = isGlobalAdmin || isHO;

  const scopedGuards = guards.filter(g => {
    const tenantOk = isGlobalAdmin || g.tenantId === currentUser?.tenantId;
    const siteOk = isSuperAdmin || g.assignedSiteId === currentUser?.assignedSiteId;
    return tenantOk && siteOk;
  });

  const shiftGuards = scopedGuards.filter(g => g.shift === activeShift);

  const todayLogs = attendanceLogs.filter(l => {
    const tenantOk = isGlobalAdmin || l.tenantId === currentUser?.tenantId;
    const siteOk = isSuperAdmin || l.siteId === currentUser?.assignedSiteId;
    return l.date === today && tenantOk && siteOk;
  });

  const getTodayLog = (guardId: string): AttendanceLog | undefined =>
    todayLogs.find(l => l.guardId === guardId && l.shift === activeShift);

  const logStatus = (guard: Guard, status: AttStatus) => {
    const existing = getTodayLog(guard.id);
    if (existing) {
      // Already logged — no duplicate, just update guard status if needed
      if (status === 'Absent' || status === 'Relieved') {
        updateGuard(guard.id, { status: status === 'Relieved' ? 'Relieved' : 'On Leave' });
      } else {
        updateGuard(guard.id, { status: 'On Duty', lastCheckIn: new Date().toISOString() });
      }
      return;
    }
    logAttendance({
      id: `ATT-${Date.now()}`,
      tenantId: currentUser?.tenantId || 'GLOBAL',
      guardId: guard.id,
      guardName: guard.name,
      siteId: guard.assignedSiteId,
      date: today,
      shift: activeShift,
      status,
      loggedAt: new Date().toISOString(),
      loggedBy: currentUser?.name || 'System',
    });
    if (status === 'Present' || status === 'Late') {
      updateGuard(guard.id, { status: 'On Duty', lastCheckIn: new Date().toISOString() });
    } else if (status === 'Absent') {
      updateGuard(guard.id, { status: 'On Leave' });
    } else if (status === 'Relieved') {
      updateGuard(guard.id, { status: 'Relieved' });
    }
  };

  const handleReassign = (guard: Guard) => {
    if (!newPost && !newShift) return;
    updateGuard(guard.id, {
      ...(newPost ? { assignedPost: newPost } : {}),
      ...(newShift ? { shift: newShift } : {}),
    });
    setEditingAssign(null);
    setNewPost('');
    setNewShift('Morning');
  };

  // Build deployment matrix: Posts × Shifts
  const matrixData = POSTS.map(post => {
    const row: Record<string, Guard[]> = {};
    SHIFTS.forEach(sh => {
      row[sh] = scopedGuards.filter(g => g.assignedPost === post && g.shift === sh);
    });
    return { post, shifts: row };
  }).filter(r => SHIFTS.some(sh => r.shifts[sh].length > 0));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Shift Scheduler & Deployment Board</h2>
          <p className="text-sm text-gray-400 mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button onClick={() => exportAttendance(todayLogs)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm border border-white/10 transition-colors">
          <Download size={15} /> Export Today's Attendance
        </button>
      </div>

      {/* ── SECTION 1: Deployment Matrix ── */}
      <section>
        <h3 className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <Users size={16} className="text-blue-400" /> Post × Shift Deployment Matrix
        </h3>
        <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-gray-950/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-44">Post / Gate</th>
                  {SHIFTS.map(sh => (
                    <th key={sh} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      <span className={`px-2.5 py-1 rounded border text-[11px] ${shiftColors[sh]}`}>
                        {sh} <span className="opacity-60 font-normal">{SHIFT_TIMES[sh]}</span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {matrixData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-gray-500">No deployments configured. Add personnel via Staff Directory.</td>
                  </tr>
                ) : matrixData.map(({ post, shifts }) => (
                  <tr key={post} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-300 text-xs">{post}</td>
                    {SHIFTS.map(sh => (
                      <td key={sh} className="px-5 py-3">
                        <div className="flex flex-col gap-1.5">
                          {shifts[sh].length === 0 ? (
                            <span className="text-gray-700 text-xs italic">—</span>
                          ) : shifts[sh].map(g => (
                            <div key={g.id} className="group/cell flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${g.status === 'On Duty' ? 'bg-emerald-400' : g.status === 'On Leave' ? 'bg-amber-400' : 'bg-red-400'}`} />
                              <span className="text-xs text-gray-300">{g.name}</span>
                              <button
                                onClick={() => { setEditingAssign(g.id); setNewPost(g.assignedPost); setNewShift(g.shift); }}
                                className="hidden group-hover/cell:inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 ml-auto"
                              >
                                <RefreshCw size={10} /> swap
                              </button>
                              {/* Inline swap panel */}
                              {editingAssign === g.id && (
                                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                  <div className="bg-gray-900 border border-white/20 rounded-xl p-6 w-full max-w-sm shadow-2xl">
                                    <h4 className="font-semibold text-white mb-4">Reassign: {g.name}</h4>
                                    <div className="space-y-3 mb-5">
                                      <div>
                                        <label className="block text-xs text-gray-400 mb-1">New Post</label>
                                        <select value={newPost} onChange={e => setNewPost(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                                          {POSTS.map(p => <option key={p}>{p}</option>)}
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-400 mb-1">New Shift</label>
                                        <select value={newShift} onChange={e => setNewShift(e.target.value as Guard['shift'])} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                                          <option>Morning</option><option>Evening</option><option>Night</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="flex gap-3">
                                      <button onClick={() => setEditingAssign(null)} className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm">Cancel</button>
                                      <button onClick={() => handleReassign(g)} className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium">Apply</button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Daily Attendance Logger ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-300 flex items-center gap-2">
            <Calendar size={16} className="text-emerald-400" /> Daily Attendance Logger
            <span className="text-xs text-gray-500 font-normal">{today}</span>
          </h3>
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {SHIFTS.map(sh => (
              <button
                key={sh}
                onClick={() => setActiveShift(sh)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${activeShift === sh ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-white/5'}`}
              >
                {sh}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shiftGuards.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-900 border border-white/10 rounded-xl">
              <Clock size={32} className="mx-auto mb-3 text-gray-700" />
              <p className="text-gray-500 text-sm">No guards assigned to the {activeShift} shift.</p>
            </div>
          )}
          {shiftGuards.map(guard => {
            const todayLog = getTodayLog(guard.id);
            return (
              <div key={guard.id} className="bg-gray-900 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-bold text-white text-sm">
                      {guard.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{guard.name}</p>
                      <p className="text-[10px] font-mono text-gray-500">{guard.personnelId} · {guard.designation}</p>
                    </div>
                  </div>
                  {todayLog ? (
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${attConfig[todayLog.status].bg} ${attConfig[todayLog.status].border} ${attConfig[todayLog.status].color}`}>
                      {todayLog.status}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded border border-gray-700 text-[10px] font-bold uppercase text-gray-600 bg-gray-800">
                      Pending
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500">Post: <span className="text-gray-300">{guard.assignedPost}</span></p>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/5">
                  {(['Present', 'Late', 'Absent', 'Relieved'] as AttStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => logStatus(guard, st)}
                      className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
                        todayLog?.status === st
                          ? `${attConfig[st].bg} ${attConfig[st].border} ${attConfig[st].color} ring-1 ring-offset-0 ring-current`
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {st === 'Present' && <CheckCircle2 className="inline mr-1" size={10} />}
                      {st === 'Absent' && <AlertCircle className="inline mr-1" size={10} />}
                      {st === 'Relieved' && <UserMinus className="inline mr-1" size={10} />}
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 3: Attendance Log Table ── */}
      {todayLogs.length > 0 && (
        <section>
          <h3 className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-amber-400" /> Today's Attendance Log
          </h3>
          <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="bg-gray-950/50 text-gray-500 text-xs uppercase border-b border-white/10">
                  <tr>
                    <th className="px-5 py-3">Personnel</th>
                    <th className="px-5 py-3">Shift</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Logged At</th>
                    <th className="px-5 py-3">Logged By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {todayLogs.map(log => {
                    const cfg = attConfig[log.status];
                    return (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3 font-medium text-white">{log.guardName}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded border text-[11px] ${shiftColors[log.shift]}`}>{log.shift}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${cfg.bg} ${cfg.border} ${cfg.color}`}>{log.status}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs">{new Date(log.loggedAt).toLocaleTimeString()}</td>
                        <td className="px-5 py-3 text-gray-400 text-xs">{log.loggedBy}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
