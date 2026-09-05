'use client';

import React, { useState } from 'react';
import { useHRStore, Employee } from '@/store/useHRStore';
import {
  FolderLock,
  FileText,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  Search,
  BookOpen,
  Award,
  CheckCircle2,
  FileCheck,
  Building,
  Calendar,
  X,
  Plus
} from 'lucide-react';

interface CompanyPolicy {
  id: string;
  title: string;
  category: 'Governance & Conduct' | 'Security & Compliance' | 'Benefits & Leaves' | 'Workplace Safety';
  version: string;
  effectiveDate: string;
  summary: string;
  downloadUrl?: string;
}

export default function DocumentRepository() {
  const { theme, employees } = useHRStore();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'policies' | 'generator'>('policies');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Generator State
  const [generatorType, setGeneratorType] = useState<'experience' | 'salary_cert' | 'appraisal_sheet' | 'offer_letter'>('experience');
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[1]?.id || 'SRJ-002');
  const [relievingDate, setRelievingDate] = useState<string>('2026-09-30');
  const [conductRating, setConductRating] = useState<string>('Exemplary and highly commendable');
  const [purposeLoan, setPurposeLoan] = useState<string>('HDFC Bank Home Loan Application');

  const selectedEmp = employees.find((e) => e.id === selectedEmpId) || employees[0];

  const POLICIES: CompanyPolicy[] = [
    {
      id: 'POL-01',
      title: 'SrijanDev Master Employee Handbook & Code of Conduct',
      category: 'Governance & Conduct',
      version: 'v4.2 (2026)',
      effectiveDate: '2026-01-01',
      summary: 'Comprehensive guidelines on company values, intellectual property protection, hybrid work etiquette, and communication norms.',
    },
    {
      id: 'POL-02',
      title: 'Prevention of Sexual Harassment (POSH) Policy & Internal Committee',
      category: 'Workplace Safety',
      version: 'v3.0 (2026)',
      effectiveDate: '2026-01-15',
      summary: 'Zero-tolerance policy on workplace harassment, reporting mechanisms, confidential redressal committee, and grievance SLAs.',
    },
    {
      id: 'POL-03',
      title: 'ISO 27001 & SOC-2 Enterprise Information Security Policy',
      category: 'Security & Compliance',
      version: 'v5.1 (2026)',
      effectiveDate: '2026-02-01',
      summary: 'Data protection standards, 2FA credential management, client confidential source code handling, and VPN protocols.',
    },
    {
      id: 'POL-04',
      title: 'Annual Leave, Maternity/Paternity & Health Insurance Framework',
      category: 'Benefits & Leaves',
      version: 'v3.4 (2026)',
      effectiveDate: '2026-03-01',
      summary: 'Leave accrual rules, encashment policy, comp-off guidelines, and ₹10 Lakhs family medical insurance OPD benefits.',
    },
    {
      id: 'POL-05',
      title: 'Remote & Hybrid Workplace Technology Stipend Policy',
      category: 'Benefits & Leaves',
      version: 'v2.0 (2026)',
      effectiveDate: '2026-04-01',
      summary: 'Annual ₹50,000 ergonomic equipment stipend, high-speed fiber internet reimbursement, and coworking space passes.',
    },
  ];

  const filteredPolicies = POLICIES.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">Document Repository & Auto-Generators</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
              ISO 27001 Vault
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Company handbooks, compliance policies, and instant PDF/Printable statutory document generators.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className={`p-1 rounded-xl border flex items-center ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-white/10'}`}>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'policies'
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📚 Policy Library
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'generator'
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Dynamic Letter Generators
          </button>
        </div>
      </div>

      {activeTab === 'policies' ? (
        <div className="space-y-6">
          {/* Search & Category Filter */}
          <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-white/10'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative md:col-span-2">
                <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search handbook, POSH, leave, or security guidelines..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border outline-none ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-white/10'
                  }`}
                />
              </div>

              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-none cursor-pointer ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-white/10'
                  }`}
                >
                  <option value="All">All Categories</option>
                  <option value="Governance & Conduct">Governance & Conduct</option>
                  <option value="Security & Compliance">Security & Compliance</option>
                  <option value="Benefits & Leaves">Benefits & Leaves</option>
                  <option value="Workplace Safety">Workplace Safety</option>
                </select>
              </div>
            </div>
          </div>

          {/* Policy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPolicies.map((policy) => (
              <div
                key={policy.id}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] flex flex-col justify-between group ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg'
                    : 'bg-slate-900/80 border-white/10 hover:border-amber-500/40 hover:shadow-xl'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {policy.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{policy.version}</span>
                  </div>

                  <h3 className="text-sm font-bold group-hover:text-amber-500 transition-colors">
                    {policy.title}
                  </h3>
                  <p className={`text-xs mt-2 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {policy.summary}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
                  isLight ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
                }`}>
                  <span className="text-[10px] font-mono">Effective: {policy.effectiveDate}</span>
                  <button
                    onClick={() => alert(`Opening PDF viewer for ${policy.title}`)}
                    className="flex items-center gap-1 font-bold text-xs text-indigo-500 hover:text-indigo-400"
                  >
                    <Download size={13} />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Dynamic Document Generator Studio */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Controls */}
          <div className={`p-5 rounded-3xl border space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <Sparkles size={14} /> Generator Settings
            </h3>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Document Template</label>
              <select
                value={generatorType}
                onChange={(e) => setGeneratorType(e.target.value as any)}
                className={`w-full text-xs p-2.5 rounded-xl border outline-none font-semibold ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'}`}
              >
                <option value="experience">📜 Experience & Relieving Certificate</option>
                <option value="salary_cert">💳 Salary & Bonafide Certificate</option>
                <option value="appraisal_sheet">📊 Annual Performance Appraisal Sheet</option>
                <option value="offer_letter">💼 Executive Offer Letter & NDA</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Select Employee</label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'}`}
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name} ({e.designation})</option>
                ))}
              </select>
            </div>

            {generatorType === 'experience' && (
              <>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Relieving Date</label>
                  <input
                    type="date"
                    value={relievingDate}
                    onChange={(e) => setRelievingDate(e.target.value)}
                    className={`w-full text-xs p-2 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'}`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Conduct & Performance Remark</label>
                  <textarea
                    rows={2}
                    value={conductRating}
                    onChange={(e) => setConductRating(e.target.value)}
                    className={`w-full text-xs p-2 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'}`}
                  />
                </div>
              </>
            )}

            {generatorType === 'salary_cert' && (
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Certificate Purpose</label>
                <input
                  type="text"
                  value={purposeLoan}
                  onChange={(e) => setPurposeLoan(e.target.value)}
                  className={`w-full text-xs p-2 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'}`}
                />
              </div>
            )}

            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:opacity-90 shadow-lg"
            >
              <Printer size={15} />
              <span>Print / Export PDF Letter</span>
            </button>
          </div>

          {/* Right Live Document Preview Sheet */}
          <div className="lg:col-span-2">
            <div className={`p-8 md:p-12 rounded-3xl border shadow-2xl transition-all font-sans relative ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-white/10 text-white'
            }`}>
              {/* Document Header with Logo */}
              <div className="flex items-center justify-between border-b pb-6 mb-6 border-inherit">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-indigo-600 bg-clip-text text-transparent">
                    SRIJANDEV TECHNOLOGIES PVT. LTD.
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    DLF Cyber City, Phase 2, Gurugram, Haryana - 122002 · CIN: U72900HR2022PTC099881
                  </p>
                  <p className="text-[10px] text-slate-400">Website: https://srijandev.in · Email: hr@srijandev.in</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/30">
                    REF: SRJ/HR/2026/{selectedEmp.id}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Date: {new Date().toLocaleDateString('en-GB')}</p>
                </div>
              </div>

              {/* Document Body depending on generator type */}
              {generatorType === 'experience' && (
                <div className="space-y-4 text-xs leading-relaxed">
                  <div className="text-center py-2">
                    <h3 className="text-sm font-black uppercase tracking-wider underline underline-offset-4">
                      TO WHOMSOEVER IT MAY CONCERN
                    </h3>
                    <p className="text-xs font-bold text-amber-500 mt-1">EXPERIENCE & RELIEVING CERTIFICATE</p>
                  </div>

                  <p>
                    This is to certify that <strong>{selectedEmp.name}</strong> (Employee ID: <strong>{selectedEmp.id}</strong>) was employed with <strong>SrijanDev Technologies Pvt. Ltd.</strong> from <strong>{selectedEmp.joiningDate}</strong> to <strong>{relievingDate}</strong>.
                  </p>

                  <p>
                    During tenure with us, {selectedEmp.gender === 'Female' ? 'she' : 'he'} served as <strong>{selectedEmp.designation}</strong> in the <strong>{selectedEmp.department}</strong> department.
                  </p>

                  <p>
                    During {selectedEmp.gender === 'Female' ? 'her' : 'his'} period of employment, we found {selectedEmp.name} to be professional, hardworking, and result-oriented. Conduct and performance were <strong>{conductRating}</strong>.
                  </p>

                  <p>
                    {selectedEmp.gender === 'Female' ? 'She' : 'He'} has been officially relieved of all company duties and intellectual property handover responsibilities effective close of business hours on <strong>{relievingDate}</strong>.
                  </p>

                  <p>We thank {selectedEmp.name} for valuable contributions and wish the very best in all future endeavors.</p>
                </div>
              )}

              {generatorType === 'salary_cert' && (
                <div className="space-y-4 text-xs leading-relaxed">
                  <div className="text-center py-2">
                    <h3 className="text-sm font-black uppercase tracking-wider underline underline-offset-4">
                      SALARY & BONAFIDE EMPLOYMENT CERTIFICATE
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Purpose: {purposeLoan}</p>
                  </div>

                  <p>
                    This is to confirm that <strong>{selectedEmp.name}</strong> is currently a full-time, confirmed employee of <strong>SrijanDev Technologies Pvt. Ltd.</strong> holding the designation of <strong>{selectedEmp.designation}</strong> since <strong>{selectedEmp.joiningDate}</strong>.
                  </p>

                  <div className={`p-4 rounded-xl border my-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                    <h4 className="font-bold text-xs mb-2">Monthly Compensation Breakdown (INR):</h4>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>Basic Salary: <strong>₹{selectedEmp.compensation.basicMonthly.toLocaleString()}</strong></div>
                      <div>House Rent Allowance (HRA): <strong>₹{selectedEmp.compensation.hraMonthly.toLocaleString()}</strong></div>
                      <div>Special Allowance: <strong>₹{selectedEmp.compensation.specialAllowance.toLocaleString()}</strong></div>
                      <div>Total Gross Monthly: <strong>₹{(selectedEmp.compensation.basicMonthly + selectedEmp.compensation.hraMonthly + selectedEmp.compensation.specialAllowance).toLocaleString()}</strong></div>
                    </div>
                  </div>

                  <p>
                    Annual Cost to Company (CTC) is <strong>₹{selectedEmp.compensation.ctcAnnual.toLocaleString()} per annum</strong>.
                  </p>

                  <p>This certificate is issued on employee request for statutory / financial institution verification.</p>
                </div>
              )}

              {generatorType === 'appraisal_sheet' && (
                <div className="space-y-4 text-xs leading-relaxed">
                  <div className="text-center py-2">
                    <h3 className="text-sm font-black uppercase tracking-wider underline underline-offset-4">
                      ANNUAL PERFORMANCE APPRAISAL & RATING SCORECARD
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl border border-inherit">
                    <div>Employee: <strong>{selectedEmp.name}</strong></div>
                    <div>Designation: <strong>{selectedEmp.designation}</strong></div>
                    <div>Department: <strong>{selectedEmp.department}</strong></div>
                    <div>Review Cycle: <strong>FY 2025-26</strong></div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between p-2 rounded-lg bg-white/5">
                      <span>1. Technical Excellence & Velocity (Weightage: 30%)</span>
                      <strong className="text-amber-500">4.9 / 5.0 (Exceeds Expectations)</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-white/5">
                      <span>2. System Reliability & Zero Regressions (Weightage: 30%)</span>
                      <strong className="text-amber-500">4.8 / 5.0 (Outstanding)</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-white/5">
                      <span>3. Team Mentorship & Ownership (Weightage: 20%)</span>
                      <strong className="text-amber-500">4.9 / 5.0 (Role Model)</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-white/5">
                      <span>4. Innovation & 3D Tech Leadership (Weightage: 20%)</span>
                      <strong className="text-amber-500">5.0 / 5.0 (Top 1%)</strong>
                    </div>
                  </div>

                  <p>Overall Calibrated Rating: <strong>4.9 / 5.0 — STAR TALENT (9-Box Grid Quadrant 1)</strong>.</p>
                </div>
              )}

              {generatorType === 'offer_letter' && (
                <div className="space-y-4 text-xs leading-relaxed">
                  <div className="text-center py-2">
                    <h3 className="text-sm font-black uppercase tracking-wider underline underline-offset-4">
                      FORMAL APPOINTMENT LETTER & COMPENSATION SCHEDULE
                    </h3>
                  </div>
                  <p>Dear <strong>{selectedEmp.name}</strong>,</p>
                  <p>
                    On behalf of <strong>SrijanDev Technologies Pvt. Ltd.</strong>, we are pleased to offer you the position of <strong>{selectedEmp.designation}</strong> with effective joining date from <strong>{selectedEmp.joiningDate}</strong>.
                  </p>
                  <p>
                    Your annual compensation package will be <strong>₹{selectedEmp.compensation.ctcAnnual.toLocaleString()} LPA</strong> with health benefits and remote equipment allowances as per company policy.
                  </p>
                </div>
              )}

              {/* Signatures Footer */}
              <div className="pt-10 mt-8 border-t border-inherit flex items-end justify-between">
                <div>
                  <div className="w-28 h-10 border-b border-dashed border-slate-400 flex items-center justify-center text-[10px] text-slate-400 font-mono italic">
                    [Digital Seal]
                  </div>
                  <p className="text-[11px] font-bold mt-1">Priya Nair</p>
                  <p className="text-[10px] text-slate-400">Head of People & Culture</p>
                  <p className="text-[9px] text-slate-400">SrijanDev Technologies Pvt. Ltd.</p>
                </div>

                <div className="text-right">
                  <div className="w-28 h-10 border-b border-dashed border-slate-400 flex items-center justify-center text-[10px] text-slate-400 font-mono italic">
                    [Employee Ack]
                  </div>
                  <p className="text-[11px] font-bold mt-1">{selectedEmp.name}</p>
                  <p className="text-[10px] text-slate-400">Signature / Acknowledged</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
