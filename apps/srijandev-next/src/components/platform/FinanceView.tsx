'use client';

import React, { useState } from 'react';
import { DollarSign, FileText, CheckCircle2, Clock, Plus, Download } from 'lucide-react';
import { PHASE2_INVOICES, PHASE2_PAYROLL } from '@/lib/mockDataPhase2';

export const FinanceView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'payroll'>('invoices');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <span>Financials, Invoices & Payroll</span>
          </h1>
          <p className="text-xs text-slate-400">Manage client billing invoices, recurring expenses, and workforce payroll disbursements</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex p-1 glass-card rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveSubTab('invoices')}
              className={`px-3 py-1.5 rounded-lg font-semibold ${activeSubTab === 'invoices' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
            >
              Invoices
            </button>
            <button
              onClick={() => setActiveSubTab('payroll')}
              className={`px-3 py-1.5 rounded-lg font-semibold ${activeSubTab === 'payroll' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
            >
              Payroll
            </button>
          </div>

          <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-purple text-xs font-semibold flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices View */}
      {activeSubTab === 'invoices' && (
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Invoice No</th>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">DueDate</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {PHASE2_INVOICES.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-300">{inv.invoiceNo}</td>
                    <td className="px-6 py-4 font-bold text-white">{inv.clientName}</td>
                    <td className="px-6 py-4 font-mono font-extrabold text-white">${inv.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full border ${
                        inv.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">{inv.dueDate}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg glass-panel text-slate-300 hover:text-white">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payroll View */}
      {activeSubTab === 'payroll' && (
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Base Salary</th>
                  <th className="px-6 py-4">Net Pay</th>
                  <th className="px-6 py-4">Pay Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {PHASE2_PAYROLL.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{pay.employeeName}</td>
                    <td className="px-6 py-4 text-slate-400">{pay.department}</td>
                    <td className="px-6 py-4 font-mono">${pay.baseSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono font-extrabold text-emerald-400">${pay.netPay.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">{pay.payDate}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-[10px] uppercase font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {pay.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
