'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, MapPin, QrCode, AlertTriangle, ShieldCheck } from 'lucide-react';

const musterData = [
  { name: 'Arjun Sharma', id: 'EMP001', zone: 'Sector 22, Noida', clockIn: '08:52 AM', clockOut: '—', status: 'clocked-in', lat: '28.594°N', lng: '77.309°E' },
  { name: 'Priya Verma', id: 'EMP002', zone: 'MG Road, Gurugram', clockIn: '09:01 AM', clockOut: '—', status: 'clocked-in', lat: '28.477°N', lng: '77.064°E' },
  { name: 'Ravi Kumar', id: 'EMP003', zone: 'Connaught Place', clockIn: '09:18 AM', clockOut: '—', status: 'clocked-in', lat: '28.632°N', lng: '77.219°E' },
  { name: 'Kavita Nair', id: 'EMP004', zone: 'Sector 4, Dwarka', clockIn: '09:05 AM', clockOut: '—', status: 'clocked-in', lat: '28.592°N', lng: '77.030°E' },
  { name: 'Suresh Yadav', id: 'EMP005', zone: 'Lajpat Nagar', clockIn: '09:22 AM', clockOut: '—', status: 'clocked-in', lat: '28.564°N', lng: '77.243°E' },
  { name: 'Mohit Singh', id: 'EMP006', zone: 'Rohini West', clockIn: '—', clockOut: '—', status: 'not-clocked', lat: '—', lng: '—' },
  { name: 'Sneha Patel', id: 'EMP007', zone: '—', clockIn: '—', clockOut: '—', status: 'on-leave', lat: '—', lng: '—' },
];

const patrolCheckpoints = [
  { id: 'CP001', name: 'Gate A — Main Entrance', lastScan: '10:45 AM', guard: 'Arjun Sharma', status: 'verified' },
  { id: 'CP002', name: 'Server Room — Block B', lastScan: '10:32 AM', guard: 'Priya Verma', status: 'verified' },
  { id: 'CP003', name: 'Parking Exit — Zone 3', lastScan: '10:15 AM', guard: 'Ravi Kumar', status: 'verified' },
  { id: 'CP004', name: 'Rooftop Access — Floor 8', lastScan: '09:58 AM', guard: 'Mohit Singh', status: 'alert' },
  { id: 'CP005', name: 'Generator Room — Basement', lastScan: '09:40 AM', guard: 'Kavita Nair', status: 'verified' },
  { id: 'CP006', name: 'North Perimeter Wall', lastScan: '—', guard: '—', status: 'pending' },
];

const incidents = [
  { id: 'INC001', title: 'Unauthorized access attempt', zone: 'Rooftop — Floor 8', reporter: 'Mohit Singh', time: '09:58 AM', severity: 'high', status: 'open' },
  { id: 'INC002', title: 'CCTV blind spot identified', zone: 'Parking Zone 2', reporter: 'Kavita Nair', time: '08:30 AM', severity: 'medium', status: 'resolved' },
  { id: 'INC003', title: 'Visitor badge not returned', zone: 'Main Reception', reporter: 'Arjun Sharma', time: 'Yesterday', severity: 'low', status: 'resolved' },
];

const leaveRequests = [
  { name: 'Mohit Singh', type: 'Sick Leave', from: '05 Aug', to: '06 Aug', reason: 'Fever and medical rest', status: 'pending' },
  { name: 'Sneha Patel', type: 'Annual Leave', from: '05 Aug', to: '07 Aug', reason: 'Family function', status: 'pending' },
  { name: 'Rajiv Mehra', type: 'Emergency Leave', from: '04 Aug', to: '04 Aug', reason: 'Personal emergency', status: 'approved' },
];

export const PulseAttendanceView: React.FC = () => (
  <div className="space-y-5">
    <div>
      <h2 className="text-xl font-extrabold text-white">Attendance Muster</h2>
      <p className="text-xs text-slate-500 mt-0.5">Today's field agent clock-in register with geo-verified timestamps</p>
    </div>
    <div className="grid grid-cols-3 gap-4 mb-2">
      {[
        { label: 'Present', value: '5', color: 'text-emerald-400' },
        { label: 'On Leave', value: '1', color: 'text-amber-400' },
        { label: 'Absent', value: '1', color: 'text-red-400' },
      ].map(stat => (
        <div key={stat.label} className="p-4 rounded-xl border border-white/5 text-center" style={{ background: '#020d0a' }}>
          <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
    <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: '#020d0a' }}>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/5 text-[10px] text-slate-600 uppercase tracking-wider">
            {['Agent', 'Zone', 'Clock In', 'Clock Out', 'Geo Tag', 'Status'].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {musterData.map((row, i) => (
            <tr key={i} className="hover:bg-white/3 transition-colors">
              <td className="px-4 py-3 font-semibold text-white">{row.name}<div className="text-[9px] text-slate-600">{row.id}</div></td>
              <td className="px-4 py-3 text-slate-400">{row.zone}</td>
              <td className="px-4 py-3 font-mono text-emerald-400">{row.clockIn}</td>
              <td className="px-4 py-3 font-mono text-slate-500">{row.clockOut}</td>
              <td className="px-4 py-3 text-[10px] text-slate-500">{row.lat !== '—' ? <span className="flex items-center space-x-1"><MapPin className="w-3 h-3 text-emerald-600" /><span>{row.lat}</span></span> : '—'}</td>
              <td className="px-4 py-3">
                {row.status === 'clocked-in' && <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-bold border border-emerald-500/25">✓ CLOCKED IN</span>}
                {row.status === 'not-clocked' && <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[9px] font-bold border border-red-500/25">ABSENT</span>}
                {row.status === 'on-leave' && <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[9px] font-bold border border-amber-500/25">ON LEAVE</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const PulsePatrolView: React.FC = () => (
  <div className="space-y-5">
    <div>
      <h2 className="text-xl font-extrabold text-white">Patrol Operations</h2>
      <p className="text-xs text-slate-500 mt-0.5">Checkpoint scan log • QR verification status</p>
    </div>
    <div className="grid grid-cols-1 gap-3">
      {patrolCheckpoints.map((cp) => (
        <div key={cp.id} className="p-4 rounded-xl border border-white/5 flex items-center justify-between" style={{ background: '#020d0a' }}>
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl ${cp.status === 'verified' ? 'bg-emerald-500/10' : cp.status === 'alert' ? 'bg-red-500/10' : 'bg-slate-800'}`}>
              {cp.status === 'verified' ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : cp.status === 'alert' ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <QrCode className="w-4 h-4 text-slate-500" />}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{cp.name}</div>
              <div className="text-[10px] text-slate-500">{cp.id} • {cp.guard !== '—' ? cp.guard : 'Not scanned'} • {cp.lastScan}</div>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
            cp.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : cp.status === 'alert' ? 'bg-red-500/10 text-red-400 border-red-500/20'
            : 'bg-slate-800 text-slate-500 border-slate-700'
          }`}>
            {cp.status.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const PulseIncidentView: React.FC = () => (
  <div className="space-y-5">
    <div>
      <h2 className="text-xl font-extrabold text-white">Incident Reports</h2>
      <p className="text-xs text-slate-500 mt-0.5">Security incidents logged by field agents</p>
    </div>
    {incidents.map((inc) => (
      <div key={inc.id} className="p-4 rounded-xl border border-white/5" style={{ background: '#020d0a' }}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className={`w-4 h-4 ${inc.severity === 'high' ? 'text-red-400' : inc.severity === 'medium' ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="text-sm font-bold text-white">{inc.title}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
              inc.severity === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : inc.severity === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>{inc.severity}</span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${inc.status === 'open' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>{inc.status}</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 flex items-center space-x-3">
          <span className="flex items-center space-x-1"><MapPin className="w-3 h-3" /><span>{inc.zone}</span></span>
          <span>•</span>
          <span>{inc.reporter}</span>
          <span>•</span>
          <span className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{inc.time}</span></span>
        </div>
      </div>
    ))}
  </div>
);

export const PulseLeaveView: React.FC = () => (
  <div className="space-y-5">
    <div>
      <h2 className="text-xl font-extrabold text-white">Leave Approvals</h2>
      <p className="text-xs text-slate-500 mt-0.5">Pending and recent leave requests</p>
    </div>
    {leaveRequests.map((req, i) => (
      <div key={i} className="p-4 rounded-xl border border-white/5" style={{ background: '#020d0a' }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-bold text-white">{req.name}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{req.type} • {req.from} to {req.to}</div>
            <div className="text-[11px] text-slate-600 mt-1 italic">"{req.reason}"</div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${req.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
              {req.status}
            </span>
            {req.status === 'pending' && (
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 hover:bg-emerald-500/30 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" /><span>Approve</span>
                </button>
                <button className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30 hover:bg-red-500/30 flex items-center space-x-1">
                  <XCircle className="w-3 h-3" /><span>Reject</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);
