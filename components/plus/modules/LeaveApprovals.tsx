'use client';

import { useState } from 'react';
import { useEnterpriseStore, LeaveRequest } from '@/store/useEnterpriseStore';
import { exportLeaves } from '@/lib/csvUtils';
import {
  CalendarDays, PlusCircle, CheckCircle2, XCircle,
  Download, Clock, User, Filter, ChevronDown
} from 'lucide-react';

type FilterTab = 'All' | 'Pending' | 'Approved' | 'Rejected';

const statusConfig: Record<LeaveRequest['status'], { label: string; color: string; bg: string; border: string }> = {
  Pending:  { label: 'Pending',  color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30'   },
  Approved: { label: 'Approved', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  Rejected: { label: 'Rejected', color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30'     },
};

const leaveTypeColors: Record<LeaveRequest['leaveType'], string> = {
  Sick:      'text-red-400 bg-red-500/10 border-red-500/20',
  Casual:    'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Emergency: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
};

export default function LeaveApprovals() {
  const { currentUser, guards, leaveRequests, addLeaveRequest, approveLeave, rejectLeave } = useEnterpriseStore();

  const [filterTab, setFilterTab] = useState<FilterTab>('All');
  const [showNewForm, setShowNewForm] = useState(false);

  // Form state
  const [formGuardId, setFormGuardId] = useState('');
  const [formType, setFormType] = useState<LeaveRequest['leaveType']>('Sick');
  const [formFrom, setFormFrom] = useState('');
  const [formTo, setFormTo] = useState('');
  const [formReason, setFormReason] = useState('');

  const isSuperAdmin = currentUser?.role === 'SrijanDev Admin' || currentUser?.role === 'Corporate HO Admin';

  const scopedLeaves = leaveRequests.filter(l =>
    isSuperAdmin || l.siteId === currentUser?.assignedSiteId
  );

  const filteredLeaves = filterTab === 'All'
    ? scopedLeaves
    : scopedLeaves.filter(l => l.status === filterTab);

  const availableGuards = guards.filter(g =>
    isSuperAdmin || g.assignedSiteId === currentUser?.assignedSiteId
  );

  const countFor = (s: LeaveRequest['status']) => scopedLeaves.filter(l => l.status === s).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formGuardId || !formFrom || !formTo || !formReason) return;

    const guard = guards.find(g => g.id === formGuardId);
    if (!guard) return;

    addLeaveRequest({
      id: `LV-${Date.now()}`,
      guardId: formGuardId,
      guardName: guard.name,
      siteId: guard.assignedSiteId,
      leaveType: formType,
      fromDate: formFrom,
      toDate: formTo,
      reason: formReason,
      status: 'Pending',
      appliedAt: new Date().toISOString(),
    });

    setFormGuardId('');
    setFormType('Sick');
    setFormFrom('');
    setFormTo('');
    setFormReason('');
    setShowNewForm(false);
  };

  const calcDays = (from: string, to: string) => {
    const diff = new Date(to).getTime() - new Date(from).getTime();
    return Math.max(1, Math.floor(diff / 86400000) + 1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Leave Management & Approval Portal</h2>
          <p className="text-sm text-gray-400 mt-1">Review and approve / reject personnel leave applications.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowNewForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
            <PlusCircle size={15} /> New Leave Request
          </button>
          <button onClick={() => exportLeaves(filteredLeaves)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm border border-white/10 transition-colors">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {(['Pending', 'Approved', 'Rejected'] as LeaveRequest['status'][]).map(s => {
          const cfg = statusConfig[s];
          return (
            <div key={s} className={`bg-gray-900 border ${cfg.border} rounded-xl p-4 flex items-center justify-between`}>
              <div>
                <p className={`text-2xl font-bold ${cfg.color}`}>{countFor(s)}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s} Requests</p>
              </div>
              {s === 'Pending' && <Clock size={24} className={cfg.color} />}
              {s === 'Approved' && <CheckCircle2 size={24} className={cfg.color} />}
              {s === 'Rejected' && <XCircle size={24} className={cfg.color} />}
            </div>
          );
        })}
      </div>

      {/* New Leave Request Form Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <CalendarDays size={18} className="text-blue-400" />
              Apply Leave Request
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Select Personnel *</label>
                <select value={formGuardId} onChange={e => setFormGuardId(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" required>
                  <option value="">-- Select guard --</option>
                  {availableGuards.map(g => <option key={g.id} value={g.id}>{g.name} ({g.personnelId})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Leave Type *</label>
                <div className="flex gap-2">
                  {(['Sick', 'Casual', 'Emergency'] as LeaveRequest['leaveType'][]).map(t => (
                    <button key={t} type="button" onClick={() => setFormType(t)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${formType === t ? leaveTypeColors[t] : 'bg-white/5 border-white/10 text-gray-400'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">From Date *</label>
                  <input type="date" value={formFrom} onChange={e => setFormFrom(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">To Date *</label>
                  <input type="date" value={formTo} onChange={e => setFormTo(e.target.value)} min={formFrom} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" required />
                </div>
              </div>
              {formFrom && formTo && (
                <p className="text-xs text-blue-400 font-medium">
                  Duration: {calcDays(formFrom, formTo)} day{calcDays(formFrom, formTo) > 1 ? 's' : ''}
                </p>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Reason *</label>
                <textarea value={formReason} onChange={e => setFormReason(e.target.value)} rows={3} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none resize-none" placeholder="Describe the reason for leave..." required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNewForm(false)} className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-gray-500" />
        {(['All', 'Pending', 'Approved', 'Rejected'] as FilterTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filterTab === tab
                ? tab === 'All' ? 'bg-white/10 border-white/20 text-white'
                : `${statusConfig[tab as LeaveRequest['status']].bg} ${statusConfig[tab as LeaveRequest['status']].border} ${statusConfig[tab as LeaveRequest['status']].color}`
                : 'bg-transparent border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20'
            }`}
          >
            {tab}
            {tab !== 'All' && <span className="ml-1.5 opacity-70">{countFor(tab as LeaveRequest['status'])}</span>}
          </button>
        ))}
      </div>

      {/* Leave Cards */}
      <div className="space-y-3">
        {filteredLeaves.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 border border-white/10 rounded-xl">
            <CalendarDays size={36} className="mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500 text-sm">No {filterTab !== 'All' ? filterTab.toLowerCase() : ''} leave requests found.</p>
          </div>
        ) : filteredLeaves.map(req => {
          const cfg = statusConfig[req.status];
          const ltColor = leaveTypeColors[req.leaveType];
          const days = calcDays(req.fromDate, req.toDate);

          return (
            <div key={req.id} className={`bg-gray-900 border rounded-xl p-5 transition-all ${req.status === 'Pending' ? 'border-amber-500/20 hover:border-amber-500/40' : 'border-white/10 hover:border-white/20'}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">

                {/* Left: Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {req.guardName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{req.guardName}</span>
                      <span className="font-mono text-xs text-gray-500">{req.id}</span>
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${ltColor}`}>{req.leaveType}</span>
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${cfg.bg} ${cfg.border} ${cfg.color}`}>{req.status}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{req.reason}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={11} />
                        {req.fromDate} → {req.toDate}
                        <span className="ml-1 text-blue-400 font-medium">({days} day{days > 1 ? 's' : ''})</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> Applied: {new Date(req.appliedAt).toLocaleString()}
                      </span>
                      {req.decidedBy && (
                        <span className="flex items-center gap-1">
                          <User size={11} /> Decided by: {req.decidedBy}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                {req.status === 'Pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => approveLeave(req.id, currentUser?.name || 'PSH')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 size={15} /> Approve
                    </button>
                    <button
                      onClick={() => rejectLeave(req.id, currentUser?.name || 'PSH')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors shadow-lg shadow-red-500/20"
                    >
                      <XCircle size={15} /> Reject
                    </button>
                  </div>
                )}
                {req.status !== 'Pending' && req.decidedAt && (
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-semibold ${cfg.color}`}>{req.status}</p>
                    <p className="text-xs text-gray-500">{new Date(req.decidedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
