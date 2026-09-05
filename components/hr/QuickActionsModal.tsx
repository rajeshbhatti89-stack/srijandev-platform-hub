'use client';

import React, { useState } from 'react';
import { useHRStore, LeaveType, TicketPriority, TicketCategory } from '@/store/useHRStore';
import {
  X,
  UserPlus,
  CalendarCheck2,
  Briefcase,
  LifeBuoy,
  Award,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickActionsModal({ isOpen, onClose }: QuickActionsModalProps) {
  const {
    theme,
    addEmployee,
    applyLeave,
    addJob,
    createTicket,
    giveKudos,
    employees,
    jobs
  } = useHRStore();

  const isLight = theme === 'light';
  const [activeAction, setActiveAction] = useState<'menu' | 'add_emp' | 'apply_leave' | 'post_job' | 'create_ticket' | 'give_kudos'>('menu');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Employee Form State
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empDept, setEmpDept] = useState<'Engineering' | 'Design & UX' | 'Product' | 'People & HR' | 'Marketing & Sales' | 'Operations & Security' | 'Executive'>('Engineering');
  const [empSalary, setEmpSalary] = useState('1800000');

  // Leave Form State
  const [leaveType, setLeaveType] = useState<LeaveType>('Casual Leave (CL)');
  const [leaveDays, setLeaveDays] = useState(2);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveEmpId, setLeaveEmpId] = useState(employees[0]?.id || 'SRJ-001');

  // Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Engineering');
  const [jobSalary, setJobSalary] = useState('₹24 LPA - ₹35 LPA');
  const [jobExp, setJobExp] = useState('3-5 Years');
  const [jobDesc, setJobDesc] = useState('');

  // Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCat, setTicketCat] = useState<TicketCategory>('IT Support');
  const [ticketPri, setTicketPri] = useState<TicketPriority>('High');
  const [ticketDesc, setTicketDesc] = useState('');

  // Kudos Form State
  const [kudosTo, setKudosTo] = useState(employees[1]?.id || 'SRJ-002');
  const [kudosBadge, setKudosBadge] = useState<'Problem Solver' | 'Team Player' | 'Rockstar Dev' | 'Innovation Driver' | 'Customer Hero' | 'Culture Champion'>('Rockstar Dev');
  const [kudosMsg, setKudosMsg] = useState('');

  if (!isOpen) return null;

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
      setActiveAction('menu');
      onClose();
    }, 1500);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empEmail) return;
    const newId = `SRJ-${Math.floor(100 + Math.random() * 900)}`;
    const ctc = parseInt(empSalary) || 1800000;
    addEmployee({
      id: newId,
      name: empName,
      email: empEmail,
      phone: empPhone || '+91 99999 00000',
      designation: empRole || 'Software Engineer',
      department: empDept,
      employmentType: 'Full-time',
      workMode: 'Hybrid',
      location: 'Gurugram HQ',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      gender: 'Male',
      dob: '1996-01-01',
      address: 'Gurugram, Haryana',
      compensation: {
        ctcAnnual: ctc,
        basicMonthly: Math.round((ctc * 0.5) / 12),
        hraMonthly: Math.round((ctc * 0.25) / 12),
        specialAllowance: Math.round((ctc * 0.25) / 12),
        currency: 'INR',
      },
      emergencyContact: { name: 'Family', relationship: 'Guardian', phone: empPhone },
      bankDetails: { accountNumber: '998877665544', bankName: 'HDFC Bank', ifscCode: 'HDFC0001234', panNumber: 'ABCDE1234F' },
      documents: [],
      leaveBalance: { casual: 12, casualUsed: 0, sick: 8, sickUsed: 0, earned: 15, earnedUsed: 0, maternityPaternity: 15, maternityPaternityUsed: 0, compOff: 0 },
      skills: [{ name: 'Engineering', level: 'Intermediate' }],
    });
    showSuccess(`Employee ${empName} successfully onboarded as ${newId}!`);
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x) => x.id === leaveEmpId) || employees[0];
    applyLeave({
      id: `LR-${Date.now().toString().slice(-4)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      leaveType,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + leaveDays * 86400000).toISOString().split('T')[0],
      daysCount: leaveDays,
      reason: leaveReason || 'Personal work',
      status: 'Pending',
      appliedAt: new Date().toISOString(),
    });
    showSuccess(`Leave request for ${emp.name} submitted for approval.`);
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle) return;
    const newJobId = `JOB-${Math.floor(100 + Math.random() * 900)}`;
    addJob({
      id: newJobId,
      title: jobTitle,
      department: jobDept,
      location: 'Gurugram / Hybrid',
      type: 'Full-time',
      workplace: 'Hybrid',
      experience: jobExp,
      salaryRange: jobSalary,
      status: 'Active',
      openingsCount: 1,
      applicantsCount: 0,
      postedDate: new Date().toISOString().split('T')[0],
      description: jobDesc || 'Exciting engineering opening at SrijanDev.',
      requirements: ['Proven experience in modern web technologies and systems.', 'Passionate about engineering excellence.'],
    });
    showSuccess(`Job vacancy ${jobTitle} successfully published!`);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject) return;
    const emp = employees[0];
    createTicket({
      id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      category: ticketCat,
      priority: ticketPri,
      subject: ticketSubject,
      description: ticketDesc || ticketSubject,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 48 * 3600000).toISOString(),
      comments: [],
    });
    showSuccess('Support ticket created with 48h SLA!');
  };

  const handleGiveKudos = (e: React.FormEvent) => {
    e.preventDefault();
    const sender = employees[0];
    const receiver = employees.find((x) => x.id === kudosTo) || employees[1];
    giveKudos({
      id: `KUD-${Date.now()}`,
      fromEmployeeId: sender.id,
      fromEmployeeName: sender.name,
      toEmployeeId: receiver.id,
      toEmployeeName: receiver.name,
      badge: kudosBadge,
      message: kudosMsg || 'Outstanding effort on the project! Thank you for going the extra mile.',
      likesCount: 1,
      timestamp: new Date().toISOString(),
    });
    showSuccess(`Kudos badge awarded to ${receiver.name}! 🎉`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0b0f19] border-white/10 text-white'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-slate-950/60'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {activeAction === 'menu' && 'HR Quick Actions'}
                {activeAction === 'add_emp' && 'Add New Employee'}
                {activeAction === 'apply_leave' && 'Apply for Leave'}
                {activeAction === 'post_job' && 'Post Job Opening'}
                {activeAction === 'create_ticket' && 'Raise Helpdesk Ticket'}
                {activeAction === 'give_kudos' && 'Award Kudos Badge'}
              </h3>
              <p className="text-[11px] text-slate-400">1-Click Fast Workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all ${isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-white/10 text-slate-400'}`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {successMessage ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center animate-bounce">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-sm font-bold text-emerald-500">{successMessage}</p>
            </div>
          ) : activeAction === 'menu' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setActiveAction('add_emp')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all group ${
                  isLight ? 'bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-300' : 'bg-white/5 hover:bg-indigo-950/40 border-white/10 hover:border-indigo-500/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <UserPlus size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold">Add Employee</p>
                  <p className="text-[10px] text-slate-400">Onboard new personnel</p>
                </div>
              </button>

              <button
                onClick={() => setActiveAction('apply_leave')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all group ${
                  isLight ? 'bg-slate-50 hover:bg-amber-50 border-slate-200 hover:border-amber-300' : 'bg-white/5 hover:bg-amber-950/40 border-white/10 hover:border-amber-500/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <CalendarCheck2 size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold">Apply Leave</p>
                  <p className="text-[10px] text-slate-400">Submit leave request</p>
                </div>
              </button>

              <button
                onClick={() => setActiveAction('post_job')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all group ${
                  isLight ? 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-300' : 'bg-white/5 hover:bg-blue-950/40 border-white/10 hover:border-blue-500/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold">Post Job Opening</p>
                  <p className="text-[10px] text-slate-400">Create new ATS requisition</p>
                </div>
              </button>

              <button
                onClick={() => setActiveAction('create_ticket')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all group ${
                  isLight ? 'bg-slate-50 hover:bg-rose-50 border-slate-200 hover:border-rose-300' : 'bg-white/5 hover:bg-rose-950/40 border-white/10 hover:border-rose-500/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                  <LifeBuoy size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold">Helpdesk Ticket</p>
                  <p className="text-[10px] text-slate-400">IT, HR or Facilities issue</p>
                </div>
              </button>

              <button
                onClick={() => setActiveAction('give_kudos')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all sm:col-span-2 group ${
                  isLight ? 'bg-gradient-to-r from-amber-50 to-indigo-50 border-indigo-200' : 'bg-gradient-to-r from-amber-950/30 to-indigo-950/30 border-white/10'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold">Award Kudos Recognition</p>
                  <p className="text-[10px] text-slate-400">Shoutout top performers on company board</p>
                </div>
              </button>
            </div>
          ) : activeAction === 'add_emp' ? (
            <form onSubmit={handleAddEmployee} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Varma"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="aditi@srijandev.in"
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Dev"
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Department</label>
                  <select
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value as any)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design & UX">Design & UX</option>
                    <option value="Product">Product</option>
                    <option value="People & HR">People & HR</option>
                    <option value="Marketing & Sales">Marketing & Sales</option>
                    <option value="Operations & Security">Operations & Security</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Annual CTC (₹)</label>
                <input
                  type="number"
                  value={empSalary}
                  onChange={(e) => setEmpSalary(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveAction('menu')}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-lg"
                >
                  Create Employee
                </button>
              </div>
            </form>
          ) : activeAction === 'apply_leave' ? (
            <form onSubmit={handleApplyLeave} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Select Employee</label>
                <select
                  value={leaveEmpId}
                  onChange={(e) => setLeaveEmpId(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Leave Type</label>
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
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Number of Days</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={leaveDays}
                    onChange={(e) => setLeaveDays(parseInt(e.target.value) || 1)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Reason</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State reason for absence..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveAction('menu')}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 shadow-lg"
                >
                  Submit Leave Request
                </button>
              </div>
            </form>
          ) : activeAction === 'post_job' ? (
            <form onSubmit={handlePostJob} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Cloud & Three.js Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Department</label>
                  <select
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design & UX">Design & UX</option>
                    <option value="Product">Product</option>
                    <option value="Marketing & Sales">Marketing & Sales</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Experience</label>
                  <input
                    type="text"
                    value={jobExp}
                    onChange={(e) => setJobExp(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Salary Range</label>
                <input
                  type="text"
                  value={jobSalary}
                  onChange={(e) => setJobSalary(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveAction('menu')}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 shadow-lg"
                >
                  Publish Vacancy
                </button>
              </div>
            </form>
          ) : activeAction === 'create_ticket' ? (
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Issue Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WiFi connectivity issue in Boardroom 2"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Category</label>
                  <select
                    value={ticketCat}
                    onChange={(e) => setTicketCat(e.target.value as any)}
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
                    value={ticketPri}
                    onChange={(e) => setTicketPri(e.target.value as any)}
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
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your issue with error details..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveAction('menu')}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-90 shadow-lg"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleGiveKudos} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Award To</label>
                <select
                  value={kudosTo}
                  onChange={(e) => setKudosTo(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.name} — {e.designation}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Badge</label>
                <select
                  value={kudosBadge}
                  onChange={(e) => setKudosBadge(e.target.value as any)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                >
                  <option value="Rockstar Dev">⚡ Rockstar Dev</option>
                  <option value="Innovation Driver">🚀 Innovation Driver</option>
                  <option value="Problem Solver">🧠 Problem Solver</option>
                  <option value="Team Player">🤝 Team Player</option>
                  <option value="Customer Hero">🌟 Customer Hero</option>
                  <option value="Culture Champion">🏆 Culture Champion</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Shoutout Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Thank them for their work..."
                  value={kudosMsg}
                  onChange={(e) => setKudosMsg(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveAction('menu')}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-lg"
                >
                  Post to Kudos Wall
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
