'use client';

import React, { useState } from 'react';
import { useHRStore, LeaveRequest, LeaveType } from '@/store/useHRStore';
import {
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Filter,
  User,
  AlertCircle,
  Sparkles,
  FileSpreadsheet,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function LeaveManagement() {
  const {
    theme,
    leaveRequests,
    applyLeave,
    approveLeave,
    rejectLeave,
    employees,
    currentUserRole
  } = useHRStore();

  const isLight = theme === 'light';
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [remarksInput, setRemarksInput] = useState<Record<string, string>>({});

  // Apply Form State
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || 'SRJ-001');
  const [leaveType, setLeaveType] = useState<LeaveType>('Casual Leave (CL)');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [handoverTo, setHandoverTo] = useState('');

  const currentEmp = employees.find((e) => e.id === selectedEmpId) || employees[0];

  const filteredRequests = leaveRequests.filter((l) => {
    if (filterStatus === 'All') return true;
    return l.status === filterStatus;
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    // calculate days
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const days = Math.max(1, Math.round((end - start) / (1000 * 3600 * 24)) + 1);

    const newReq: LeaveRequest = {
      id: `LR-${Date.now().toString().slice(-4)}`,
      employeeId: currentEmp.id,
      employeeName: currentEmp.name,
      department: currentEmp.department,
      leaveType,
      startDate,
      endDate,
      daysCount: days,
      reason,
      status: 'Pending',
      appliedAt: new Date().toISOString(),
      handoverTo: handoverTo || 'Team Member',
    };

    applyLeave(newReq);
    setIsApplyModalOpen(false);
    setReason('');
  };

  const handleApprove = (id: string) => {
    approveLeave(id, 'Priya Nair (HR Head)', remarksInput[id] || 'Approved by Manager');
  };

  const handleReject = (id: string) => {
    rejectLeave(id, 'Priya Nair (HR Head)', remarksInput[id] || 'Declined due to operational overlap');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">Leave Management System (LMS)</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Auto-Balance Ledger
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Automated quota tracking, multi-tier approval workflows, and vacation planning.
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-md transition-all active:scale-95"
        >
          <Plus size={15} />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Quota Summary Cards (for active employee) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Casual (CL)</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-500 mt-2">
            {currentEmp.leaveBalance.casual - currentEmp.leaveBalance.casualUsed}
            <span className="text-xs font-normal text-slate-400">/{currentEmp.leaveBalance.casual} left</span>
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Sick (SL)</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-400 mt-2">
            {currentEmp.leaveBalance.sick - currentEmp.leaveBalance.sickUsed}
            <span className="text-xs font-normal text-slate-400">/{currentEmp.leaveBalance.sick} left</span>
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Earned (EL)</span>
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
          </div>
          <p className="text-2xl font-black text-indigo-400 mt-2">
            {currentEmp.leaveBalance.earned - currentEmp.leaveBalance.earnedUsed}
            <span className="text-xs font-normal text-slate-400">/{currentEmp.leaveBalance.earned} left</span>
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Comp-Off</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">
            {currentEmp.leaveBalance.compOff}
            <span className="text-xs font-normal text-slate-400"> Days</span>
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className={`p-1 rounded-xl border flex items-center ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-white/10'}`}>
          {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredRequests.length} applications
        </span>
      </div>

      {/* Leave Requests Pipeline List */}
      <div className="space-y-3">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className={`p-5 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md">
                  {req.employeeName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">{req.employeeName}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400">
                      {req.department}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
                      {req.leaveType}
                    </span>
                  </div>

                  <p className="text-xs mt-1 font-medium text-slate-300">
                    Duration: <strong className="text-white">{req.startDate}</strong> to <strong className="text-white">{req.endDate}</strong> ({req.daysCount} {req.daysCount === 1 ? 'Day' : 'Days'})
                  </p>
                  <p className={`text-xs mt-1 italic ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    "{req.reason}" {req.handoverTo && `· Handover to: ${req.handoverTo}`}
                  </p>
                </div>
              </div>

              {/* Status & Decision Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="text-left sm:text-right">
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      req.status === 'Approved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : req.status === 'Rejected'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                    }`}
                  >
                    {req.status}
                  </span>
                  {req.reviewedBy && (
                    <p className="text-[9px] font-mono text-slate-400 mt-1">
                      {req.reviewedBy}
                    </p>
                  )}
                </div>

                {req.status === 'Pending' && (currentUserRole === 'HR Super Admin' || currentUserRole === 'Department Manager') && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Remarks..."
                      value={remarksInput[req.id] || ''}
                      onChange={(e) => setRemarksInput({ ...remarksInput, [req.id]: e.target.value })}
                      className={`text-xs px-2.5 py-1.5 rounded-xl border outline-none w-32 ${
                        isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                      }`}
                    />
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all active:scale-95"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all active:scale-95"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0b0f19] border-white/10 text-white'
            }`}
          >
            <div className={`p-5 border-b flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-white/10'}`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <CalendarCheck2 size={16} className="text-emerald-500" />
                Apply for Leave
              </h3>
              <button onClick={() => setIsApplyModalOpen(false)}>
                <XCircle size={18} className="text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Applying As</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                >
                  <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                  <option value="Sick Leave (SL)">Sick Leave (SL)</option>
                  <option value="Earned Leave (EL)">Earned Leave (EL)</option>
                  <option value="Maternity / Paternity">Maternity / Paternity</option>
                  <option value="Compensatory Off">Compensatory Off</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full text-xs p-2 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full text-xs p-2 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Work Handover Person</label>
                <input
                  type="text"
                  placeholder="e.g. Sneha Kulkarni"
                  value={handoverTo}
                  onChange={(e) => setHandoverTo(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Reason for Leave</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide context for manager approval..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 shadow-lg"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
