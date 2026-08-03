'use client';

import React from 'react';
import { FileText, Download, Upload, HardDrive, File, Shield } from 'lucide-react';
import { PLATFORM_DOCUMENTS } from '@/lib/mockData';

export const DocumentView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <FileText className="w-6 h-6 text-purple-400" />
            <span>Document & Policy Repository</span>
          </h1>
          <p className="text-xs text-slate-400">Secure cloud storage for company compliance, financial forecasts, and project blueprints</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple text-xs font-semibold flex items-center space-x-2 transition-all">
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLATFORM_DOCUMENTS.map((doc) => (
          <div key={doc.id} className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between glass-card-hover">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <File className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2 leading-snug truncate">{doc.name}</h4>
              <div className="text-xs text-slate-400 space-y-1 mb-6">
                <div>Category: <span className="text-slate-200 uppercase font-mono font-bold">{doc.category}</span></div>
                <div>Author: <span className="text-slate-200">{doc.author}</span></div>
                <div>Size: <span className="text-cyan-300 font-mono">{doc.size}</span></div>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl glass-panel hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-center space-x-2 transition-colors">
              <Download className="w-4 h-4 text-purple-400" />
              <span>Download Vault File</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
