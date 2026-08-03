'use client';

import React from 'react';
import { HardDrive, Monitor, Laptop, Plus } from 'lucide-react';
import { PHASE2_ASSETS } from '@/lib/mockDataPhase2';

export const AssetInventoryView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <HardDrive className="w-6 h-6 text-cyan-400" />
            <span>Hardware & Software Asset Inventory</span>
          </h1>
          <p className="text-xs text-slate-400">Track company laptops, monitors, mobile devices, and software licenses</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-glow-purple text-xs font-semibold flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PHASE2_ASSETS.map((asset) => (
          <div key={asset.id} className="glass-card p-6 rounded-3xl border border-slate-800 flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
              <Laptop className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-300">{asset.assetTag}</span>
                <span className="px-2 py-0.5 text-[9px] uppercase font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {asset.status.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{asset.name}</h4>
              <div className="text-xs text-slate-400 space-y-0.5">
                <div>Assigned To: <strong className="text-white">{asset.assignedTo}</strong></div>
                <div>Serial Number: <span className="font-mono text-slate-300">{asset.serialNo}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
