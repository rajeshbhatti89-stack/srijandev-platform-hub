'use client';

import React, { useState } from 'react';
import { useHRStore, ProfileChangeRequest } from '@/store/useHRStore';
import {
  UserCheck,
  CreditCard,
  CalendarCheck2,
  Clock,
  Printer,
  FileText,
  ShieldCheck,
  Edit,
  CheckCircle2,
  AlertCircle,
  Building,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Send,
  Download
} from 'lucide-react';

export default function EmployeeSelfService() {
  const {
    theme,
    employees,
    profileRequests,
    submitProfileRequest,
    reviewProfileRequest,
    currentUserRole
  } = useHRStore();

  const isLight = theme === 'light';
  const [selectedEmpId, setSelectedEmpId] = useState(employees[1]?.id || 'SRJ-002'); // Aarav Sharma
  const currentEmp = employees.find((e) => e.id === selectedEmpId) || employees[0];

  const [activeTab, setActiveTab] = useState<'profile' | 'payslip' | 'requests'>('profile');
  const [selectedMonth, setSelectedMonth] = useState('August 2026');

  // Profile Edit Request State
  const [fieldToChange, setFieldToChange] = useState('Residential Address');
  const [newValue, setNewValue] = useState('');
  const [reqSentMessage, setReqSentMessage] = useState(false);

  const handleSendProfileRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue) return;
    const req: ProfileChangeRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      employeeId: currentEmp.id,
      employeeName: currentEmp.name,
      field: fieldToChange,
      oldValue: fieldToChange === 'Residential Address' ? currentEmp.address : currentEmp.phone,
      newValue,
      requestedAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    submitProfileRequest(req);
    setReqSentMessage(true);
    setNewValue('');
    setTimeout(() => setReqSentMessage(false), 3000);
  };

  // Monthly payslip calculations
  const basic = currentEmp.compensation.basicMonthly;
  const hra = currentEmp.compensation.hraMonthly;
  const special = currentEmp.compensation.specialAllowance;
  const gross = basic + hra + special;
  const pfDeduction = Math.round(basic * 0.12);
  const professionalTax = 200;
  const tdsEstimated = Math.round(gross * 0.10);
  const totalDeductions = pfDeduction + professionalTax + tdsEstimated;
  const netPay = gross - totalDeductions;

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">Employee Self-Service (ESS) Portal</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Personal Hub
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Manage personal records, download itemized monthly payslips, and submit profile change requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">View as Employee:</span>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className={`text-xs px-3 py-1.5 rounded-xl border outline-none font-semibold ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/15'
              }`}
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.name} ({e.designation})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-inherit pb-2">
        {(['profile', 'payslip', 'requests'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              activeTab === t
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md'
                : isLight
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-slate-900 text-slate-400 hover:bg-white/10'
            }`}
          >
            {t === 'profile' && '👤 Personal Profile & Bank'}
            {t === 'payslip' && '💳 Itemized Monthly Payslip'}
            {t === 'requests' && `📋 Profile Change Requests (${profileRequests.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Profile Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10 shadow-lg'}`}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-indigo-600 p-0.5 shadow-md">
                  <div className={`w-full h-full rounded-[14px] flex items-center justify-center font-extrabold text-xl ${
                    isLight ? 'bg-white text-indigo-900' : 'bg-slate-950 text-amber-400'
                  }`}>
                    {currentEmp.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black">{currentEmp.name}</h3>
                  <p className="text-xs font-semibold text-amber-500">{currentEmp.designation}</p>
                  <p className="text-[11px] text-slate-400">{currentEmp.department} · {currentEmp.location} · {currentEmp.employmentType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-slate-400 text-[10px] block">Employee ID</span>
                  <span className="font-mono font-bold text-amber-400">{currentEmp.id}</span>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-slate-400 text-[10px] block">Date of Joining</span>
                  <span className="font-bold">{currentEmp.joiningDate}</span>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-slate-400 text-[10px] block">Official Email</span>
                  <span className="font-bold">{currentEmp.email}</span>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-slate-400 text-[10px] block">Contact Phone</span>
                  <span className="font-bold">{currentEmp.phone}</span>
                </div>
                <div className={`p-3 rounded-xl border col-span-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-slate-400 text-[10px] block">Registered Address</span>
                  <span className="font-medium">{currentEmp.address}</span>
                </div>
              </div>
            </div>

            {/* Statutory Bank Details */}
            <div className={`p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10 shadow-lg'}`}>
              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 mb-3">
                Disbursement & Bank Account
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-slate-400 text-[10px] block">Bank Name</span>
                  <span className="font-bold">{currentEmp.bankDetails.bankName}</span>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-slate-400 text-[10px] block">Account Number</span>
                  <span className="font-mono font-bold">{currentEmp.bankDetails.accountNumber}</span>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-slate-400 text-[10px] block">IFSC Code</span>
                  <span className="font-mono font-bold">{currentEmp.bankDetails.ifscCode}</span>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-slate-400 text-[10px] block">Tax PAN Card</span>
                  <span className="font-mono font-bold">{currentEmp.bankDetails.panNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Submit Change Request to HR */}
          <div className="space-y-4">
            <div className={`p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10 shadow-lg'}`}>
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-1.5">
                <Edit size={14} /> Request Profile Update
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-snug">
                Submit modifications to your address, phone, or emergency contacts for HR verification.
              </p>

              <form onSubmit={handleSendProfileRequest} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Field to Update</label>
                  <select
                    value={fieldToChange}
                    onChange={(e) => setFieldToChange(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'}`}
                  >
                    <option value="Residential Address">Residential Address</option>
                    <option value="Phone Number">Phone Number</option>
                    <option value="Emergency Contact">Emergency Contact</option>
                    <option value="Bank Account Number">Bank Account Number</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">New Value</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter updated information..."
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'}`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-md flex items-center justify-center gap-1.5"
                >
                  <Send size={14} /> Submit for HR Approval
                </button>

                {reqSentMessage && (
                  <p className="text-xs font-bold text-emerald-500 text-center animate-pulse">
                    Request submitted to HR approval queue!
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payslip' && (
        <div className="space-y-6">
          {/* Month selector & Print */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Select Pay Period:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`text-xs px-3 py-1.5 rounded-xl border outline-none font-semibold ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/15'
                }`}
              >
                <option value="August 2026">August 2026</option>
                <option value="July 2026">July 2026</option>
                <option value="June 2026">June 2026</option>
              </select>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 shadow-md hover:opacity-90"
            >
              <Printer size={14} /> Print / Export PDF Payslip
            </button>
          </div>

          {/* Printable Payslip Card Sheet */}
          <div className={`p-8 md:p-12 rounded-3xl border shadow-2xl ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-white/10 text-white'
          }`}>
            <div className="flex items-center justify-between border-b pb-6 mb-6 border-inherit">
              <div>
                <h2 className="text-lg font-black bg-gradient-to-r from-amber-500 to-indigo-600 bg-clip-text text-transparent">
                  SRIJANDEV TECHNOLOGIES PVT. LTD.
                </h2>
                <p className="text-[10px] text-slate-400">DLF Cyber City, Phase 2, Gurugram, Haryana - 122002</p>
                <p className="text-xs font-bold text-amber-500 mt-1">MONTHLY SALARY DISBURSEMENT SLIP — {selectedMonth}</p>
              </div>
              <div className="text-right text-xs">
                <span className="font-mono text-slate-400 font-bold">SLIP-SRJ-2026/{currentEmp.id}</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Paid on: 31st August 2026</p>
              </div>
            </div>

            {/* Employee Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 border border-inherit text-xs mb-6">
              <div>Employee Name: <strong className="block text-white font-bold">{currentEmp.name}</strong></div>
              <div>Employee ID: <strong className="block text-white font-mono">{currentEmp.id}</strong></div>
              <div>Designation: <strong className="block text-white font-bold">{currentEmp.designation}</strong></div>
              <div>Bank A/C: <strong className="block text-white font-mono">****{currentEmp.bankDetails.accountNumber.slice(-4)}</strong></div>
            </div>

            {/* Earnings & Deductions Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Earnings */}
              <div className="border border-inherit rounded-2xl p-4 space-y-2">
                <h4 className="font-black uppercase tracking-wider text-emerald-400 pb-2 border-b border-inherit">
                  Earnings (INR)
                </h4>
                <div className="flex justify-between py-1">
                  <span>Basic Salary</span>
                  <span className="font-mono font-bold">₹{basic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>House Rent Allowance (HRA)</span>
                  <span className="font-mono font-bold">₹{hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Special Allowance</span>
                  <span className="font-mono font-bold">₹{special.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-inherit font-bold text-emerald-400">
                  <span>Gross Earnings (A)</span>
                  <span className="font-mono">₹{gross.toLocaleString()}</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="border border-inherit rounded-2xl p-4 space-y-2">
                <h4 className="font-black uppercase tracking-wider text-rose-400 pb-2 border-b border-inherit">
                  Statutory Deductions (INR)
                </h4>
                <div className="flex justify-between py-1">
                  <span>Provident Fund (PF @ 12%)</span>
                  <span className="font-mono font-bold">₹{pfDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Professional Tax</span>
                  <span className="font-mono font-bold">₹{professionalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Income Tax (TDS Estimated)</span>
                  <span className="font-mono font-bold">₹{tdsEstimated.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-inherit font-bold text-rose-400">
                  <span>Total Deductions (B)</span>
                  <span className="font-mono">₹{totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Net Salary Calculation Banner */}
            <div className={`mt-6 p-5 rounded-2xl border flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-600/20 ${
              isLight ? 'border-indigo-200' : 'border-white/10'
            }`}>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Net Take-Home Salary (A - B)</p>
                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-indigo-600">
                  ₹{netPay.toLocaleString()} INR
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Disbursed via HDFC NEFT
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-500">
            Profile Change Verification Requests
          </h3>

          <div className="space-y-3">
            {profileRequests.map((req) => (
              <div
                key={req.id}
                className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{req.employeeName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{req.id}</span>
                  </div>
                  <p className="text-xs mt-1">
                    Field: <strong className="text-amber-400">{req.field}</strong>
                  </p>
                  <p className="text-xs text-slate-400">
                    Old: <span className="line-through">{req.oldValue}</span> → New: <strong className="text-white">{req.newValue}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    req.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {req.status}
                  </span>
                  {req.status === 'Pending' && currentUserRole === 'HR Super Admin' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => reviewProfileRequest(req.id, 'Approved', 'Verified by HR')}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-600 text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reviewProfileRequest(req.id, 'Rejected', 'Invalid documentation')}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-rose-600 text-white"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {profileRequests.length === 0 && (
              <p className="text-xs text-slate-500 italic text-center py-6">
                No active profile update requests in queue.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
