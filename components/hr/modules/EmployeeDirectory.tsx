'use client';

import React, { useState } from 'react';
import { useHRStore, Employee, EmployeeDocument } from '@/store/useHRStore';
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  ShieldCheck,
  Download,
  Trash2,
  Edit,
  Eye,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  X,
  UploadCloud
} from 'lucide-react';

export default function EmployeeDirectory() {
  const {
    theme,
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addEmployeeDocument,
    currentUserRole
  } = useHRStore();

  const isLight = theme === 'light';
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTabDrawer, setActiveTabDrawer] = useState<'overview' | 'compensation' | 'documents' | 'leaves'>('overview');

  // Upload Doc State
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<any>('ID Proof');

  const departments = ['All', 'Executive', 'Engineering', 'Design & UX', 'Product', 'People & HR', 'Marketing & Sales', 'Operations & Security'];
  const statuses = ['All', 'Active', 'On Leave', 'Probation', 'Notice Period'];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
    const matchesWork = selectedWorkMode === 'All' || emp.workMode === selectedWorkMode;
    return matchesSearch && matchesDept && matchesStatus && matchesWork;
  });

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !docName) return;
    const newDoc: EmployeeDocument = {
      id: `doc-${Date.now()}`,
      name: docName,
      type: docType,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'Verified',
      size: '1.2 MB',
    };
    addEmployeeDocument(selectedEmployee.id, newDoc);
    setSelectedEmployee({
      ...selectedEmployee,
      documents: [newDoc, ...selectedEmployee.documents],
    });
    setDocName('');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Top Banner / Summary Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">Digital Employee Directory</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
              {filteredEmployees.length} Personnel
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Centralized digital profiles, statutory records, emergency contacts & encrypted document locker.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-xl border flex items-center ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-white/10'}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-md transition-all active:scale-95"
          >
            <Plus size={15} />
            <span>Add Personnel</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-white/10'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, role, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border outline-none ${
                isLight ? 'bg-slate-50 border-slate-200 focus:border-indigo-500' : 'bg-slate-950 border-white/10 focus:border-amber-400'
              }`}
            />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-none cursor-pointer ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-white/10'
              }`}
            >
              {departments.map((d) => (
                <option key={d} value={d}>Dept: {d}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-none cursor-pointer ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-white/10'
              }`}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>Status: {s}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-none cursor-pointer ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-white/10'
              }`}
            >
              <option value="All">Workplace: All Modes</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] group relative overflow-hidden ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-lg'
                  : 'bg-slate-900/70 border-white/10 hover:border-amber-500/40 hover:shadow-xl hover:shadow-indigo-950/40'
              }`}
            >
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 opacity-80" />

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-indigo-600 p-0.5 shadow-md shrink-0">
                    <div className={`w-full h-full rounded-[14px] flex items-center justify-center font-bold text-sm ${
                      isLight ? 'bg-white text-indigo-900' : 'bg-slate-950 text-amber-400'
                    }`}>
                      {emp.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold truncate group-hover:text-amber-500 transition-colors">
                      {emp.name}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">{emp.id}</p>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    emp.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : emp.status === 'On Leave'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  }`}
                >
                  {emp.status}
                </span>
              </div>

              <div className="space-y-1.5 my-3 text-xs">
                <p className="font-semibold text-xs leading-snug">{emp.designation}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Building size={12} className="text-amber-500 shrink-0" />
                  <span className="truncate">{emp.department}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <MapPin size={12} className="text-indigo-400 shrink-0" />
                  <span className="truncate">{emp.location} · {emp.workMode}</span>
                </div>
              </div>

              {/* Skills tags */}
              <div className="flex flex-wrap gap-1 my-3">
                {emp.skills.slice(0, 3).map((s) => (
                  <span
                    key={s.name}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                      isLight ? 'bg-slate-100 text-slate-700' : 'bg-white/5 text-slate-300'
                    }`}
                  >
                    {s.name}
                  </span>
                ))}
              </div>

              {/* Card Footer */}
              <div className={`pt-3 border-t flex items-center justify-between text-[11px] ${
                isLight ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
              }`}>
                <span className="font-mono">Joined {emp.joiningDate}</span>
                <span className="font-bold text-indigo-500 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  View Profile →
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className={`rounded-2xl border overflow-hidden ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'bg-slate-50 text-slate-500' : 'bg-slate-950 text-slate-400'} border-b border-inherit`}>
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4">Workplace</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Leave Bal</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className={`cursor-pointer transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-xs">{emp.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold">{emp.designation}</p>
                      <p className="text-[10px] text-slate-400">{emp.department}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p>{emp.location}</p>
                      <p className="text-[10px] text-slate-400">{emp.workMode}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p>{emp.email}</p>
                      <p className="text-[10px] text-slate-400">{emp.phone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        emp.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-mono">{emp.leaveBalance.casual + emp.leaveBalance.sick + emp.leaveBalance.earned - (emp.leaveBalance.casualUsed + emp.leaveBalance.sickUsed + emp.leaveBalance.earnedUsed)} Days</p>
                      <p className="text-[10px] text-slate-400">Remaining</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-xs font-bold text-indigo-500 hover:text-indigo-400">
                        Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Detail Drawer Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-2xl h-full flex flex-col shadow-2xl transition-all ${
              isLight ? 'bg-white text-slate-900' : 'bg-[#0b0f19] text-white border-l border-white/10'
            }`}
          >
            {/* Drawer Header */}
            <div className={`p-6 border-b ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-slate-950/80'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-indigo-600 p-0.5 shadow-lg">
                    <div className={`w-full h-full rounded-[14px] flex items-center justify-center font-extrabold text-lg ${
                      isLight ? 'bg-white text-indigo-900' : 'bg-slate-950 text-amber-400'
                    }`}>
                      {selectedEmployee.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black">{selectedEmployee.name}</h2>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        {selectedEmployee.id}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-amber-500">{selectedEmployee.designation}</p>
                    <p className="text-[11px] text-slate-400">{selectedEmployee.department} · {selectedEmployee.location}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEmployee(null)}
                  className={`p-2 rounded-xl transition-all ${isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-white/10 text-slate-400'}`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Tabs */}
              <div className="flex gap-2 mt-6">
                {(['overview', 'compensation', 'documents', 'leaves'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTabDrawer(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      activeTabDrawer === tab
                        ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md'
                        : isLight
                        ? 'bg-slate-200/60 text-slate-600 hover:bg-slate-200'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {activeTabDrawer === 'overview' && (
                <div className="space-y-6">
                  {/* Personal & Contact Grid */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 mb-3">
                      Personal & Employment Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-slate-400 text-[10px] block">Work Email</span>
                        <span className="font-semibold">{selectedEmployee.email}</span>
                      </div>
                      <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-slate-400 text-[10px] block">Phone Number</span>
                        <span className="font-semibold">{selectedEmployee.phone}</span>
                      </div>
                      <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-slate-400 text-[10px] block">Joining Date</span>
                        <span className="font-semibold">{selectedEmployee.joiningDate}</span>
                      </div>
                      <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-slate-400 text-[10px] block">Reporting Manager</span>
                        <span className="font-semibold">{selectedEmployee.managerName || 'Executive Leadership'}</span>
                      </div>
                      <div className={`p-3 rounded-xl border col-span-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-slate-400 text-[10px] block">Residential Address</span>
                        <span className="font-semibold">{selectedEmployee.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 mb-3">
                      Emergency Contact Info
                    </h4>
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${isLight ? 'bg-rose-50/50 border-rose-200' : 'bg-rose-950/20 border-rose-500/20'}`}>
                      <div>
                        <p className="font-bold text-xs">{selectedEmployee.emergencyContact.name}</p>
                        <p className="text-[11px] text-slate-400">Relationship: {selectedEmployee.emergencyContact.relationship}</p>
                      </div>
                      <p className="font-mono text-xs font-bold text-rose-400">{selectedEmployee.emergencyContact.phone}</p>
                    </div>
                  </div>

                  {/* Skills & Competencies */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 mb-3">
                      Skills & Proficiency
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedEmployee.skills.map((s) => (
                        <div
                          key={s.name}
                          className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'
                          }`}
                        >
                          <span className="text-xs font-semibold">{s.name}</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400">
                            {s.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTabDrawer === 'compensation' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 mb-3">
                      Salary Structure & Bank Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className={`p-4 rounded-2xl border col-span-2 bg-gradient-to-r from-amber-500/10 to-indigo-600/10 ${
                        isLight ? 'border-indigo-200' : 'border-white/10'
                      }`}>
                        <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Annual CTC (Cost to Company)</p>
                        <p className="text-2xl font-black mt-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-indigo-600">
                          ₹{selectedEmployee.compensation.ctcAnnual.toLocaleString()} LPA
                        </p>
                      </div>

                      <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-slate-400 text-[10px] block">Basic Salary (Monthly)</span>
                        <span className="font-bold">₹{selectedEmployee.compensation.basicMonthly.toLocaleString()}</span>
                      </div>
                      <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-slate-400 text-[10px] block">House Rent Allowance (HRA)</span>
                        <span className="font-bold">₹{selectedEmployee.compensation.hraMonthly.toLocaleString()}</span>
                      </div>
                      <div className={`p-3 rounded-xl border col-span-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-slate-400 text-[10px] block">Special Allowances</span>
                        <span className="font-bold">₹{selectedEmployee.compensation.specialAllowance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 mb-3">
                      Statutory & Disbursement Account
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-slate-400 text-[10px] block">Bank Name</span>
                        <span className="font-semibold">{selectedEmployee.bankDetails.bankName}</span>
                      </div>
                      <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-slate-400 text-[10px] block">Account Number</span>
                        <span className="font-mono font-semibold">{selectedEmployee.bankDetails.accountNumber}</span>
                      </div>
                      <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-slate-400 text-[10px] block">IFSC Code</span>
                        <span className="font-mono font-semibold">{selectedEmployee.bankDetails.ifscCode}</span>
                      </div>
                      <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-slate-400 text-[10px] block">Income Tax PAN</span>
                        <span className="font-mono font-semibold">{selectedEmployee.bankDetails.panNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTabDrawer === 'documents' && (
                <div className="space-y-6">
                  {/* Upload new document */}
                  <form onSubmit={handleUploadDoc} className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'}`}>
                    <h4 className="text-xs font-bold mb-3 flex items-center gap-1.5">
                      <UploadCloud size={16} className="text-amber-500" />
                      Upload Document to Locker
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <input
                        type="text"
                        required
                        placeholder="Document name (e.g. Passport.pdf)"
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        className={`text-xs p-2 rounded-xl border outline-none ${isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-white/15'}`}
                      />
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as any)}
                        className={`text-xs p-2 rounded-xl border outline-none ${isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-white/15'}`}
                      >
                        <option value="ID Proof">ID Proof (Aadhaar / Passport)</option>
                        <option value="Address Proof">Address Proof</option>
                        <option value="Tax PAN">Tax PAN Card</option>
                        <option value="Appointment Letter">Appointment Letter</option>
                        <option value="Signed NDA">Signed NDA</option>
                        <option value="Degree Certificate">Degree Certificate</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-md"
                    >
                      Save Document to Locker
                    </button>
                  </form>

                  {/* Document List */}
                  <div className="space-y-2">
                    {selectedEmployee.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold">{doc.name}</p>
                            <p className="text-[10px] text-slate-400">{doc.type} · Uploaded {doc.uploadedAt}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {doc.status}
                          </span>
                          <button
                            onClick={() => alert(`Downloading verified copy of ${doc.name}`)}
                            className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                            title="Download"
                          >
                            <Download size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTabDrawer === 'leaves' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-500">
                    Annual Leave Ledger & Balances
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className={`p-3 rounded-xl border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                      <p className="text-[10px] text-slate-400 font-bold">Casual Leave (CL)</p>
                      <p className="text-xl font-black text-amber-500 mt-1">
                        {selectedEmployee.leaveBalance.casual - selectedEmployee.leaveBalance.casualUsed}
                        <span className="text-xs font-normal text-slate-400">/{selectedEmployee.leaveBalance.casual}</span>
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                      <p className="text-[10px] text-slate-400 font-bold">Sick Leave (SL)</p>
                      <p className="text-xl font-black text-rose-400 mt-1">
                        {selectedEmployee.leaveBalance.sick - selectedEmployee.leaveBalance.sickUsed}
                        <span className="text-xs font-normal text-slate-400">/{selectedEmployee.leaveBalance.sick}</span>
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                      <p className="text-[10px] text-slate-400 font-bold">Earned Leave (EL)</p>
                      <p className="text-xl font-black text-indigo-400 mt-1">
                        {selectedEmployee.leaveBalance.earned - selectedEmployee.leaveBalance.earnedUsed}
                        <span className="text-xs font-normal text-slate-400">/{selectedEmployee.leaveBalance.earned}</span>
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                      <p className="text-[10px] text-slate-400 font-bold">Maternity/Paternity</p>
                      <p className="text-xl font-black text-purple-400 mt-1">
                        {selectedEmployee.leaveBalance.maternityPaternity - selectedEmployee.leaveBalance.maternityPaternityUsed}
                        <span className="text-xs font-normal text-slate-400"> Days</span>
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                      <p className="text-[10px] text-slate-400 font-bold">Compensatory Off</p>
                      <p className="text-xl font-black text-emerald-400 mt-1">
                        {selectedEmployee.leaveBalance.compOff}
                        <span className="text-xs font-normal text-slate-400"> Days</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
