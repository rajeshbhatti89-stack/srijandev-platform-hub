'use client';

import React, { useState } from 'react';
import { Building, DollarSign, Plus, User, ArrowRight } from 'lucide-react';
import { PLATFORM_LEADS } from '@/lib/mockData';

export const CRMView: React.FC = () => {
  const [leads, setLeads] = useState(PLATFORM_LEADS);

  const stages = [
    { id: 'new', label: 'New Lead' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'proposal', label: 'Proposal Sent' },
    { id: 'negotiation', label: 'Negotiation' },
    { id: 'won', label: 'Closed Won' },
  ];

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Building className="w-6 h-6 text-cyan-400" />
            <span>CRM & Deal Pipelines</span>
          </h1>
          <p className="text-xs text-slate-400">Track client prospect pipelines, deal values, and sales conversion</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-xs font-mono font-bold text-slate-300">
            Total Pipeline Value: <span className="text-emerald-400">$270,000</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.id);
          const totalVal = stageLeads.reduce((acc, curr) => acc + curr.value, 0);

          return (
            <div key={stage.id} className="glass-card p-4 rounded-3xl border border-slate-800 flex flex-col h-[550px]">
              <div className="mb-4 pb-3 border-b border-slate-800">
                <div className="text-xs font-bold text-white uppercase">{stage.label}</div>
                <div className="text-[11px] font-mono text-emerald-400 font-bold mt-0.5">
                  ${totalVal.toLocaleString()}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {stageLeads.map((lead) => (
                  <div key={lead.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                    <div className="font-bold text-white mb-1">{lead.companyName}</div>
                    <div className="text-slate-400 text-[11px] mb-2">{lead.contactName}</div>
                    <div className="text-emerald-400 font-mono font-extrabold text-sm mb-2">
                      ${lead.value.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Assigned: {lead.assignedTo}</div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="h-24 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-[11px] text-slate-500">
                    Empty Stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
