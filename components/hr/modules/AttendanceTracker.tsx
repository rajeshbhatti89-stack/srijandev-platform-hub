'use client';

import React, { useState } from 'react';
import { useHRStore, AttendanceRecord } from '@/store/useHRStore';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Coffee,
  Calendar,
  Layers,
  Sparkles,
  Wifi,
  ShieldCheck,
  UserCheck,
  Search,
  Filter
} from 'lucide-react';

export default function AttendanceTracker() {
  const {
    theme,
    attendanceRecords,
    logAttendance,
    isPunchedIn,
    punchInTime,
    punchOutTime,
    activeBreak,
    punchIn,
    punchOut,
    startBreak,
    endBreak,
    employees
  } = useHRStore();

  const isLight = theme === 'light';
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterShift, setFilterShift] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const SHIFTS = [
    { name: 'General Shift', time: '09:30 AM - 06:30 PM', count: 6, tag: 'Standard HQ' },
    { name: 'Morning Shift', time: '08:00 AM - 04:30 PM', count: 1, tag: 'Operations' },
    { name: 'Evening Shift', time: '02:00 PM - 10:30 PM', count: 1, tag: 'Support' },
    { name: 'Night Shift', time: '10:00 PM - 06:30 AM', count: 0, tag: 'Security' },
  ];

  const filteredRecords = attendanceRecords.filter((rec) => {
    const matchesShift = filterShift === 'All' || rec.shift.includes(filterShift);
    const matchesStatus = filterStatus === 'All' || rec.status === filterStatus;
    return matchesShift && matchesStatus;
  });

  const totalPresent = attendanceRecords.filter((r) => r.status === 'Present').length;
  const totalLate = attendanceRecords.filter((r) => r.status === 'Late').length;
  const totalOnLeave = attendanceRecords.filter((r) => r.status === 'On Leave').length;
  const totalOvertime = attendanceRecords.filter((r) => r.isOvertime).length;

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">Time, Attendance & Shift Tracking</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Web & Geofenced Punch
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Live check-in/out timers, break duration tracking, automated shift rosters & anomaly detection.
          </p>
        </div>

        {/* Live Personal Punch Action Card */}
        <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
          isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900 border-white/10 shadow-lg'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isPunchedIn ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <div>
              <p className="text-xs font-bold">{isPunchedIn ? 'Active Session' : 'Offline'}</p>
              <p className="text-[10px] font-mono text-slate-400">
                {isPunchedIn ? `In @ ${punchInTime}` : 'Not punched in'}
              </p>
            </div>
          </div>

          {isPunchedIn ? (
            <button
              onClick={punchOut}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-sm"
            >
              Punch Out
            </button>
          ) : (
            <button
              onClick={punchIn}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm"
            >
              Punch In
            </button>
          )}
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present Today</p>
          <p className="text-2xl font-black text-emerald-500 mt-1">
            {totalPresent} <span className="text-xs font-normal text-slate-400">/ {employees.length}</span>
          </p>
          <p className="text-[10px] text-emerald-500 font-semibold mt-1">92% Headcount on Duty</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Late Arrivals (&gt;15m)</p>
          <p className="text-2xl font-black text-amber-500 mt-1">{totalLate}</p>
          <p className="text-[10px] text-amber-500 font-semibold mt-1">1 Anomaly Logged</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On Approved Leave</p>
          <p className="text-2xl font-black text-indigo-400 mt-1">{totalOnLeave}</p>
          <p className="text-[10px] text-indigo-400 font-semibold mt-1">Planned Absences</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overtime Hours Logged</p>
          <p className="text-2xl font-black text-purple-400 mt-1">{totalOvertime * 0.9} hrs</p>
          <p className="text-[10px] text-purple-400 font-semibold mt-1">Eligible for Comp-Off</p>
        </div>
      </div>

      {/* Shift Roster Summary Grid */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 mb-3">
          Shift Schedules & Deployment Roster
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SHIFTS.map((shift) => (
            <div
              key={shift.name}
              className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-white/10'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{shift.name}</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
                  {shift.tag}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1.5">{shift.time}</p>
              <p className="text-[11px] font-bold text-indigo-400 mt-2">
                {shift.count} Personnel Assigned
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Attendance Logs Table */}
      <div className={`rounded-3xl border overflow-hidden ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10'}`}>
        <div className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-slate-950/80'
        }`}>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold">Daily Attendance & Punch Logs</h3>
            <span className="text-xs font-mono text-slate-400">Date: {selectedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`text-xs px-2.5 py-1.5 rounded-xl border outline-none ${
                isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-white/15'
              }`}
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late Arrival</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'bg-slate-50 text-slate-500' : 'bg-slate-950 text-slate-400'} border-b border-inherit`}>
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Total Working Hrs</th>
                <th className="py-3 px-4">Verification Location</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                        {rec.employeeName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-xs">{rec.employeeName}</p>
                        <p className="text-[10px] text-slate-400">{rec.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">{rec.shift}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{rec.checkIn}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-400">{rec.checkOut || 'Active'}</td>
                  <td className="py-3 px-4">
                    <p className="font-mono font-bold">{rec.workingHours} hrs</p>
                    <p className="text-[10px] text-slate-400">Break: {rec.breakMinutes}m</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-[11px]">
                      <MapPin size={12} className="text-amber-500" />
                      <span>{rec.locationType}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">IP: {rec.ipAddress}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        rec.status === 'Present'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : rec.status === 'Late'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                          : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
