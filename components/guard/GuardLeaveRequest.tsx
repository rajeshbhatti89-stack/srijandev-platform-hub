'use client';

import { useState } from 'react';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface GuardLeaveRequestProps {
  guardId: string;
  guardName: string;
  siteId: string;
}

export default function GuardLeaveRequest({ guardId, guardName, siteId }: GuardLeaveRequestProps) {
  const addLeaveRequest = useEnterpriseStore(s => s.addLeaveRequest);
  const myLeaves = useEnterpriseStore(s => s.leaveRequests.filter(l => l.guardId === guardId));
  const users = useEnterpriseStore(s => s.users);

  const [leaveType, setLeaveType] = useState<'Sick' | 'Casual' | 'Emergency'>('Casual');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reqId = `LR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const tenantId = users.find(u => u.id === guardId)?.tenantId || 'GLOBAL';
    addLeaveRequest({
      id: reqId,
      tenantId,
      guardId,
      guardName,
      siteId,
      leaveType,
      fromDate,
      toDate,
      reason,
      status: 'Pending',
      appliedAt: new Date().toISOString()
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFromDate('');
      setToDate('');
      setReason('');
    }, 3000);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Calendar size={20} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Request Leave</h2>
            <p className="text-xs text-gray-400">Submit to Plant Security Head</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <CheckCircle2 size={48} className="text-emerald-500 mb-3" />
            <h3 className="text-white font-bold mb-1">Request Submitted!</h3>
            <p className="text-xs text-gray-400">Your leave request is pending approval.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Leave Type</label>
              <select 
                value={leaveType} 
                onChange={(e) => setLeaveType(e.target.value as any)}
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
              >
                <option value="Casual">Casual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Emergency">Emergency Leave</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">From</label>
                <input 
                  type="date" 
                  required
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className="w-full bg-gray-950 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">To</label>
                <input 
                  type="date" 
                  required
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  className="w-full bg-gray-950 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Reason</label>
              <textarea 
                required
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={3}
                placeholder="Briefly explain the reason for your leave..."
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors">
              Submit Request
            </button>
          </form>
        )}
      </div>

      <div>
        <h3 className="text-sm font-bold text-white mb-3">My Recent Requests</h3>
        <div className="space-y-3">
          {myLeaves.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
              <FileText size={24} className="mx-auto text-gray-600 mb-2" />
              <p className="text-xs text-gray-500">No leave requests found.</p>
            </div>
          ) : (
            myLeaves.map(leave => (
              <div key={leave.id} className="bg-gray-900 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{leave.leaveType}</p>
                  <p className="text-[10px] text-gray-500">{new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}</p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold ${
                  leave.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' :
                  leave.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {leave.status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
