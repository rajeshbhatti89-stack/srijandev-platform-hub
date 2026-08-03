'use client';

import React, { useState } from 'react';
import { HardDrive, Upload, File, Image as ImageIcon, FileText, Download, Star, Trash2 } from 'lucide-react';
import { PLATFORM_DOCUMENTS } from '@/lib/mockData';

export const FileManagerView: React.FC = () => {
  const [docs, setDocs] = useState(PLATFORM_DOCUMENTS);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: 'Uploaded_Enterprise_Asset_' + Math.floor(Math.random() * 1000) + '.pdf',
      category: 'project' as any,
      size: '3.1 MB',
      updatedAt: '2026-08-03',
      author: 'Rajesh Bhatti',
      downloadUrl: '#',
    };
    setDocs([newDoc, ...docs]);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <HardDrive className="w-6 h-6 text-purple-400" />
            <span>File Manager & Storage Vault</span>
          </h1>
          <p className="text-xs text-slate-400">Drag & drop upload, cloud file previews, folder organization, and storage metrics</p>
        </div>

        <div className="text-xs font-mono font-bold text-slate-300">
          Vault Storage: <span className="text-cyan-400">8.5 GB / 100 GB (8.5% used)</span>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`p-10 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer ${
          dragOver ? 'border-purple-500 bg-purple-500/10' : 'border-slate-800 glass-card'
        }`}
      >
        <Upload className="w-10 h-10 text-purple-400 mx-auto mb-3 animate-bounce" style={{ animationDuration: '2s' }} />
        <h3 className="text-base font-bold text-white mb-1">Drag and drop enterprise files here to upload</h3>
        <p className="text-xs text-slate-400">Supports PDF, PNG, SVG, DOCX, XLSX up to 50MB per file</p>
      </div>

      {/* File List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {docs.map((doc) => (
          <div key={doc.id} className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between glass-card-hover">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
                  {doc.name.endsWith('.pdf') ? <FileText className="w-6 h-6" /> : <File className="w-6 h-6" />}
                </div>
                <button className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400">
                  <Star className="w-4 h-4" />
                </button>
              </div>

              <h4 className="text-sm font-bold text-white mb-2 truncate">{doc.name}</h4>
              <div className="text-xs text-slate-400 space-y-1 mb-6">
                <div>Size: <span className="font-mono text-cyan-300">{doc.size}</span></div>
                <div>Author: <span className="text-slate-300">{doc.author}</span></div>
                <div>Date: <span className="font-mono text-slate-400">{doc.updatedAt}</span></div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex-1 py-2.5 rounded-xl glass-panel hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-center space-x-2">
                <Download className="w-4 h-4 text-purple-400" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
