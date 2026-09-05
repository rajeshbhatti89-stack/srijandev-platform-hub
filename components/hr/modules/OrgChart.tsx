'use client';

import React, { useState } from 'react';
import { useHRStore, Employee } from '@/store/useHRStore';
import {
  Network,
  Users,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Building,
  MapPin,
  Sparkles,
  Shield,
  Search,
  ExternalLink
} from 'lucide-react';

export default function OrgChart() {
  const { theme, employees } = useHRStore();
  const isLight = theme === 'light';
  const [collapsedDepts, setCollapsedDepts] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDept = (dept: string) => {
    setCollapsedDepts((prev) => ({ ...prev, [dept]: !prev[dept] }));
  };

  // Group employees by department
  const execs = employees.filter((e) => e.department === 'Executive');
  const engLeads = employees.filter((e) => e.department === 'Engineering' && e.designation.includes('Lead'));
  const engMembers = employees.filter((e) => e.department === 'Engineering' && !e.designation.includes('Lead'));
  const hrMembers = employees.filter((e) => e.department === 'People & HR');
  const designMembers = employees.filter((e) => e.department === 'Design & UX');
  const productMembers = employees.filter((e) => e.department === 'Product');

  const OrgCard = ({ emp, isRoot }: { emp: Employee; isRoot?: boolean }) => {
    const isMatched = searchQuery && emp.name.toLowerCase().includes(searchQuery.toLowerCase());
    return (
      <div
        className={`p-4 rounded-2xl border transition-all relative group ${
          isRoot
            ? isLight
              ? 'bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-indigo-500/20 border-indigo-300 shadow-lg'
              : 'bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-indigo-900/40 border-amber-500/40 shadow-xl'
            : isLight
            ? 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
            : 'bg-slate-900/80 border-white/10 hover:border-amber-500/30 shadow-md'
        } ${isMatched ? 'ring-2 ring-amber-400 animate-pulse' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-indigo-600 p-0.5 shrink-0 shadow-md">
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center font-bold text-sm ${
              isLight ? 'bg-white text-indigo-900' : 'bg-slate-950 text-amber-400'
            }`}>
              {emp.name.split(' ').map((n) => n[0]).join('')}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold truncate">{emp.name}</h4>
              <span className="text-[9px] font-mono opacity-60">{emp.id}</span>
            </div>
            <p className="text-[11px] font-semibold text-amber-500 truncate">{emp.designation}</p>
            <p className="text-[10px] text-slate-400 truncate">{emp.department} · {emp.location}</p>
          </div>
        </div>

        <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[10px] ${
          isLight ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <a href={`mailto:${emp.email}`} className="hover:text-indigo-500 flex items-center gap-1" title="Email">
              <Mail size={11} /> {emp.email.split('@')[0]}
            </a>
          </div>
          <span className={`px-1.5 py-0.5 rounded-full font-bold uppercase text-[8px] ${
            emp.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {emp.status}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">Organization Hierarchy & Org Chart</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Interactive Tree
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Company hierarchy, reporting lines, and direct team structures across departments.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Highlight personnel in tree..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs font-medium border outline-none ${
              isLight ? 'bg-white border-slate-200 focus:border-indigo-500' : 'bg-slate-900 border-white/10 focus:border-amber-400'
            }`}
          />
        </div>
      </div>

      {/* Visual Org Chart Container */}
      <div className="space-y-8">
        {/* Tier 1: Executive Leadership */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-sm">
            <div className="text-center mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md">
                Executive Leadership
              </span>
            </div>
            {execs.map((exec) => (
              <OrgCard key={exec.id} emp={exec} isRoot />
            ))}
          </div>

          {/* Vertical Connecting Stem */}
          <div className="w-0.5 h-8 bg-gradient-to-b from-amber-500 to-indigo-600 my-1" />
          <div className="w-4/5 max-w-4xl h-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600" />
        </div>

        {/* Tier 2: Department Heads & Pods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Engineering Pod */}
          <div className={`p-4 rounded-3xl border flex flex-col space-y-4 ${
            isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-950/50 border-white/10'
          }`}>
            <div
              onClick={() => toggleDept('Engineering')}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-wider">Engineering (3)</h3>
              </div>
              {collapsedDepts['Engineering'] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            </div>

            {!collapsedDepts['Engineering'] && (
              <div className="space-y-3">
                {engLeads.map((lead) => (
                  <div key={lead.id} className="space-y-2">
                    <OrgCard emp={lead} />
                    <div className="pl-4 border-l-2 border-amber-500/30 space-y-2 pt-1">
                      {engMembers.map((member) => (
                        <OrgCard key={member.id} emp={member} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* People & Culture Pod */}
          <div className={`p-4 rounded-3xl border flex flex-col space-y-4 ${
            isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-950/50 border-white/10'
          }`}>
            <div
              onClick={() => toggleDept('People')}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <h3 className="text-xs font-black uppercase tracking-wider">People & HR (2)</h3>
              </div>
              {collapsedDepts['People'] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            </div>

            {!collapsedDepts['People'] && (
              <div className="space-y-3">
                {hrMembers.map((member) => (
                  <OrgCard key={member.id} emp={member} />
                ))}
              </div>
            )}
          </div>

          {/* Design & UX Pod */}
          <div className={`p-4 rounded-3xl border flex flex-col space-y-4 ${
            isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-950/50 border-white/10'
          }`}>
            <div
              onClick={() => toggleDept('Design')}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                <h3 className="text-xs font-black uppercase tracking-wider">Design & 3D (1)</h3>
              </div>
              {collapsedDepts['Design'] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            </div>

            {!collapsedDepts['Design'] && (
              <div className="space-y-3">
                {designMembers.map((member) => (
                  <OrgCard key={member.id} emp={member} />
                ))}
              </div>
            )}
          </div>

          {/* Product Pod */}
          <div className={`p-4 rounded-3xl border flex flex-col space-y-4 ${
            isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-950/50 border-white/10'
          }`}>
            <div
              onClick={() => toggleDept('Product')}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="text-xs font-black uppercase tracking-wider">Product (1)</h3>
              </div>
              {collapsedDepts['Product'] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            </div>

            {!collapsedDepts['Product'] && (
              <div className="space-y-3">
                {productMembers.map((member) => (
                  <OrgCard key={member.id} emp={member} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
