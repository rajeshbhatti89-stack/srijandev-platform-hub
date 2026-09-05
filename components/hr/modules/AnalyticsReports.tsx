'use client';

import React, { useState } from 'react';
import { useHRStore } from '@/store/useHRStore';
import {
  BarChart4,
  TrendingUp,
  Users,
  Download,
  FileSpreadsheet,
  PieChart,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Clock
} from 'lucide-react';

export default function AnalyticsReports() {
  const { theme, employees, leaveRequests, attendanceRecords, jobs, candidates, reviews } = useHRStore();
  const isLight = theme === 'light';

  const [activeReportTab, setActiveReportTab] = useState<'analytics' | 'export'>('analytics');
  const [reportType, setReportType] = useState<string>('census');

  // Core Metric Calculations
  const totalEmployees = employees.length;
  const femaleCount = employees.filter((e) => e.gender === 'Female').length;
  const maleCount = employees.filter((e) => e.gender === 'Male').length;
  const genderDiversityRatio = Math.round((femaleCount / totalEmployees) * 100);

  // Department distribution
  const deptCounts: Record<string, number> = {};
  employees.forEach((e) => {
    deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
  });

  const generateCSV = (type: string) => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = '';

    if (type === 'census') {
      filename = 'srijandev_master_employee_census_2026.csv';
      headers = ['Employee ID', 'Name', 'Designation', 'Department', 'Email', 'Phone', 'Joining Date', 'Workplace', 'Annual CTC', 'Status'];
      rows = employees.map((e) => [
        e.id,
        `"${e.name}"`,
        `"${e.designation}"`,
        `"${e.department}"`,
        e.email,
        e.phone,
        e.joiningDate,
        e.workMode,
        e.compensation.ctcAnnual.toString(),
        e.status,
      ]);
    } else if (type === 'attendance') {
      filename = 'srijandev_monthly_attendance_audit_2026.csv';
      headers = ['Record ID', 'Employee Name', 'Department', 'Date', 'Shift', 'Check In', 'Check Out', 'Working Hours', 'Status', 'Location'];
      rows = attendanceRecords.map((a) => [
        a.id,
        `"${a.employeeName}"`,
        `"${a.department}"`,
        a.date,
        `"${a.shift}"`,
        a.checkIn,
        a.checkOut || 'N/A',
        a.workingHours.toString(),
        a.status,
        `"${a.locationType}"`,
      ]);
    } else if (type === 'leaves') {
      filename = 'srijandev_leave_balances_audit_2026.csv';
      headers = ['Employee ID', 'Name', 'Department', 'CL Remaining', 'SL Remaining', 'EL Remaining', 'Total Left', 'Comp-Off'];
      rows = employees.map((e) => {
        const cl = e.leaveBalance.casual - e.leaveBalance.casualUsed;
        const sl = e.leaveBalance.sick - e.leaveBalance.sickUsed;
        const el = e.leaveBalance.earned - e.leaveBalance.earnedUsed;
        return [
          e.id,
          `"${e.name}"`,
          `"${e.department}"`,
          cl.toString(),
          sl.toString(),
          el.toString(),
          (cl + sl + el).toString(),
          e.leaveBalance.compOff.toString(),
        ];
      });
    } else if (type === 'appraisals') {
      filename = 'srijandev_performance_9box_matrix_2026.csv';
      headers = ['Review ID', 'Employee Name', 'Department', 'Cycle', 'Manager Score', 'Calibrated Score', '9-Box Quadrant', 'Status'];
      rows = reviews.map((r) => [
        r.id,
        `"${r.employeeName}"`,
        `"${r.department}"`,
        r.cycle,
        r.managerRating.toString(),
        r.calibratedRating.toString(),
        `"${r.boxClassification}"`,
        r.status,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">Executive HR Analytics & Reports</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm">
              BI Intelligence & Audit
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Headcount velocity, gender diversity ratios, compensation distribution & exportable audit spreadsheets.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className={`p-1 rounded-xl border flex items-center ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-white/10'}`}>
          <button
            onClick={() => setActiveReportTab('analytics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeReportTab === 'analytics'
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Visual BI Dashboards
          </button>
          <button
            onClick={() => setActiveReportTab('export')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeReportTab === 'export'
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📥 CSV / Excel Export Engine
          </button>
        </div>
      </div>

      {activeReportTab === 'analytics' ? (
        <div className="space-y-6">
          {/* Top KPI Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className={`p-5 rounded-3xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Headcount</p>
              <p className="text-2xl font-black text-white mt-1">{totalEmployees}</p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-1">↑ +25% QoQ Growth</p>
            </div>

            <div className={`p-5 rounded-3xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Attrition Rate</p>
              <p className="text-2xl font-black text-amber-500 mt-1">0.0%</p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-1">Zero Regrettable Exits</p>
            </div>

            <div className={`p-5 rounded-3xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender Diversity</p>
              <p className="text-2xl font-black text-indigo-400 mt-1">{genderDiversityRatio}%</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Female Representation</p>
            </div>

            <div className={`p-5 rounded-3xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Tenure</p>
              <p className="text-2xl font-black text-purple-400 mt-1">2.4 Years</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">High Talent Retention</p>
            </div>
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Headcount Breakdown */}
            <div className={`p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-1.5">
                <PieChart size={15} /> Departmental Headcount Distribution
              </h3>

              <div className="space-y-3">
                {Object.entries(deptCounts).map(([dept, count]) => {
                  const pct = Math.round((count / totalEmployees) * 100);
                  return (
                    <div key={dept} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{dept}</span>
                        <span className="font-mono text-slate-400">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-indigo-600 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hiring Pipeline Velocity */}
            <div className={`p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-white/10'}`}>
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-1.5">
                <TrendingUp size={15} /> Recruitment Funnel Conversion Rates
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                  <span>Applications Ingested</span>
                  <strong className="font-mono text-white">123 Leads (100%)</strong>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                  <span>Passed Technical Assessment</span>
                  <strong className="font-mono text-amber-400">28 Candidates (22.7%)</strong>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                  <span>Final HR Round Cleared</span>
                  <strong className="font-mono text-indigo-400">12 Candidates (9.7%)</strong>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                  <span>Offers Accepted & Hired</span>
                  <strong className="font-mono">4 Offers (3.2%)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Export Engine View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              className={`p-6 rounded-3xl border flex flex-col justify-between ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mb-3">
                  <FileSpreadsheet size={20} />
                </div>
                <h3 className="text-sm font-bold">Master Employee Census Report</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Complete statutory details, emergency contacts, compensation & designations of all active personnel.
                </p>
              </div>
              <button
                onClick={() => generateCSV('census')}
                className="mt-6 w-full py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-md flex items-center justify-center gap-1.5"
              >
                <Download size={14} /> Download Census CSV
              </button>
            </div>

            <div
              className={`p-6 rounded-3xl border flex flex-col justify-between ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-3">
                  <Clock size={20} />
                </div>
                <h3 className="text-sm font-bold">Monthly Attendance & Punch Audit</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Daily check-in timestamps, working hours, break records, and geofence locations for payroll processing.
                </p>
              </div>
              <button
                onClick={() => generateCSV('attendance')}
                className="mt-6 w-full py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 shadow-md flex items-center justify-center gap-1.5"
              >
                <Download size={14} /> Download Attendance CSV
              </button>
            </div>

            <div
              className={`p-6 rounded-3xl border flex flex-col justify-between ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                  <Calendar size={20} />
                </div>
                <h3 className="text-sm font-bold">Leave Balance & Encashment Sheet</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Remaining casual, sick, and earned leave balances across all employees for fiscal year audit.
                </p>
              </div>
              <button
                onClick={() => generateCSV('leaves')}
                className="mt-6 w-full py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 shadow-md flex items-center justify-center gap-1.5"
              >
                <Download size={14} /> Download Leave Ledger CSV
              </button>
            </div>

            <div
              className={`p-6 rounded-3xl border flex flex-col justify-between ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                  <Activity size={20} />
                </div>
                <h3 className="text-sm font-bold">Performance Appraisal & 9-Box Matrix</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Calibrated manager scores, potential metrics, and 9-box talent classifications for compensation review.
                </p>
              </div>
              <button
                onClick={() => generateCSV('appraisals')}
                className="mt-6 w-full py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-90 shadow-md flex items-center justify-center gap-1.5"
              >
                <Download size={14} /> Download 9-Box CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
