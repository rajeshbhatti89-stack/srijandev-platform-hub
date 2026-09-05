'use client';

import React, { useState } from 'react';
import { useHRStore, HelpdeskTicket, TicketCategory, TicketPriority, TicketStatus } from '@/store/useHRStore';
import {
  LifeBuoy,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  User,
  ShieldAlert,
  Search,
  Filter,
  XCircle,
  Flame
} from 'lucide-react';

export default function HelpdeskTicketing() {
  const {
    theme,
    tickets,
    createTicket,
    updateTicketStatus,
    addTicketComment,
    employees,
    currentUserRole
  } = useHRStore();

  const isLight = theme === 'light';
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedTicket, setSelectedTicket] = useState<HelpdeskTicket | null>(tickets[0] || null);
  const [newComment, setNewComment] = useState('');
  const [isNewTicketModal, setIsNewTicketModal] = useState(false);

  // New Ticket State
  const [sub, setSub] = useState('');
  const [cat, setCat] = useState<TicketCategory>('IT Support');
  const [pri, setPri] = useState<TicketPriority>('High');
  const [desc, setDesc] = useState('');
  const [empId, setEmpId] = useState(employees[1]?.id || 'SRJ-002');

  const filteredTickets = tickets.filter((t) => {
    const matchesCat = filterCategory === 'All' || t.category === filterCategory;
    const matchesStat = filterStatus === 'All' || t.status === filterStatus;
    return matchesCat && matchesStat;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sub) return;
    const emp = employees.find((x) => x.id === empId) || employees[0];
    const newT: HelpdeskTicket = {
      id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      category: cat,
      priority: pri,
      subject: sub,
      description: desc,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 48 * 3600000).toISOString(),
      comments: [],
    };
    createTicket(newT);
    setSelectedTicket(newT);
    setIsNewTicketModal(false);
    setSub('');
    setDesc('');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newComment.trim()) return;
    addTicketComment(selectedTicket.id, {
      authorName: currentUserRole === 'HR Super Admin' ? 'Priya Nair (HR Head)' : 'Aarav Sharma',
      authorRole: currentUserRole === 'HR Super Admin' ? 'Support Lead' : 'Employee',
      message: newComment,
      isStaff: currentUserRole === 'HR Super Admin',
    });
    setNewComment('');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">Internal Helpdesk & Service Desk</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
              SLA Guarantee: 48h
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Raise and track tickets for IT hardware/access, HR payroll queries, policies, or office facilities.
          </p>
        </div>

        <button
          onClick={() => setIsNewTicketModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 shadow-md transition-all active:scale-95"
        >
          <Plus size={15} />
          <span>Create Ticket</span>
        </button>
      </div>

      {/* Main Helpdesk Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tickets Queue */}
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`flex-1 text-xs p-2 rounded-xl border outline-none font-semibold ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'
              }`}
            >
              <option value="All">All Categories</option>
              <option value="IT Support">IT Support</option>
              <option value="HR & Policy">HR & Policy</option>
              <option value="Payroll & Tax">Payroll & Tax</option>
              <option value="Hardware Issue">Hardware Issue</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`flex-1 text-xs p-2 rounded-xl border outline-none font-semibold ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'
              }`}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Ticket List */}
          <div className="space-y-2.5">
            {filteredTickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? isLight
                        ? 'bg-gradient-to-r from-amber-500/10 to-indigo-600/15 border-indigo-300 shadow-md'
                        : 'bg-gradient-to-r from-amber-500/20 to-indigo-600/25 border-amber-500/40 shadow-lg'
                      : isLight
                      ? 'bg-white border-slate-200 hover:border-slate-300'
                      : 'bg-slate-900/70 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-500">{t.id}</span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        t.priority === 'Urgent'
                          ? 'bg-red-500 text-white animate-pulse'
                          : t.priority === 'High'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-indigo-500/20 text-indigo-400'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold leading-snug truncate">{t.subject}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{t.category} · {t.employeeName}</p>

                  <div className="mt-3 pt-2 border-t border-inherit flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-mono">{t.createdAt.split('T')[0]}</span>
                    <span
                      className={`font-bold ${
                        t.status === 'Resolved'
                          ? 'text-emerald-400'
                          : t.status === 'In Progress'
                          ? 'text-amber-400'
                          : 'text-indigo-400'
                      }`}
                    >
                      ● {t.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Active Ticket Conversation & SLA Resolution */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className={`p-6 rounded-3xl border flex flex-col h-full min-h-[550px] shadow-xl ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900/80 border-white/10 text-white'
            }`}>
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-inherit mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-500">{selectedTicket.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {selectedTicket.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400">
                      {selectedTicket.priority} Priority
                    </span>
                  </div>
                  <h2 className="text-base font-black mt-1.5">{selectedTicket.subject}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Raised by <strong>{selectedTicket.employeeName}</strong> ({selectedTicket.department}) · SLA Target: 48h
                  </p>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2">
                  {(['Open', 'In Progress', 'Resolved'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateTicketStatus(selectedTicket.id, st)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                        selectedTicket.status === st
                          ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md'
                          : isLight
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ticket Original Description */}
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed mb-4 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/5'
              }`}>
                <p className="font-bold text-[10px] text-amber-500 uppercase tracking-wider mb-1">Issue Description</p>
                <p className="text-slate-300">{selectedTicket.description}</p>
              </div>

              {/* Threaded Comments */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 custom-scrollbar">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Support Discussion Thread ({selectedTicket.comments.length})
                </h4>

                {selectedTicket.comments.map((comm) => (
                  <div
                    key={comm.id}
                    className={`p-3.5 rounded-2xl border text-xs leading-snug ${
                      comm.isStaff
                        ? isLight
                          ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950 ml-4'
                          : 'bg-indigo-950/30 border-indigo-500/30 text-slate-200 ml-4'
                        : isLight
                        ? 'bg-slate-100 border-slate-200 mr-4'
                        : 'bg-white/5 border-white/5 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-amber-400">{comm.authorName}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400">{comm.authorRole}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">
                        {new Date(comm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="mt-1">{comm.message}</p>
                  </div>
                ))}

                {selectedTicket.comments.length === 0 && (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    No replies yet. Post a resolution or follow-up note below.
                  </p>
                )}
              </div>

              {/* Comment Input Box */}
              <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type reply or status update..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className={`flex-1 text-xs p-3 rounded-2xl border outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                  }`}
                />
                <button
                  type="submit"
                  className="px-4 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-md flex items-center gap-1.5"
                >
                  <Send size={14} /> Send
                </button>
              </form>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
              Select a ticket to view conversation details.
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {isNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0b0f19] border-white/10 text-white'
            }`}
          >
            <div className={`p-5 border-b flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-white/10'}`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <LifeBuoy size={16} className="text-rose-500" />
                Raise Support Ticket
              </h3>
              <button onClick={() => setIsNewTicketModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of issue..."
                  value={sub}
                  onChange={(e) => setSub(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Category</label>
                  <select
                    value={cat}
                    onChange={(e) => setCat(e.target.value as any)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  >
                    <option value="IT Support">IT Support</option>
                    <option value="HR & Policy">HR & Policy</option>
                    <option value="Payroll & Tax">Payroll & Tax</option>
                    <option value="Facilities & Admin">Facilities & Admin</option>
                    <option value="Hardware Issue">Hardware Issue</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Priority</label>
                  <select
                    value={pri}
                    onChange={(e) => setPri(e.target.value as any)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your issue..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 shadow-lg"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
