'use client';

import React, { useState } from 'react';
import { Building, DollarSign, Download, Upload, Plus, TrendingUp, Filter } from 'lucide-react';
import { PLATFORM_LEADS } from '@/lib/mockData';

export const EnterpriseCRM: React.FC = () => {
  const [leads, setLeads] = useState(PLATFORM_LEADS);

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Company,Contact,Email,Value,Stage\n' +
      leads.map((l) => `${l.companyName},${l.contactName},${l.email},${l.value},${l.stage}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'SrijanDev_CRM_Leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Building className="w-6 h-6 text-cyan-400" />
            <span>Enterprise CRM & Sales Forecasting</span>
          </h1>
          <p className="text-xs text-slate-400">Deal pipelines, company accounts, sales forecasting, and CSV import/export</p>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={exportCSV} className="px-3.5 py-2 rounded-xl glass-panel text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-2">
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-glow-purple text-xs font-semibold flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-bold">Weighted Sales Forecast</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">$270,000</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-bold">Average Deal Size</div>
          <div className="text-2xl font-extrabold text-white mt-1">$90,000</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-bold">Win Rate</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">68.4%</div>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Deal Value</th>
                <th className="px-6 py-4">Pipeline Stage</th>
                <th className="px-6 py-4">Account Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{lead.companyName}</td>
                  <td className="px-6 py-4 text-slate-300">{lead.contactName} ({lead.email})</td>
                  <td className="px-6 py-4 font-mono font-extrabold text-emerald-400">${lead.value.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-[10px] uppercase font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono">{lead.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
