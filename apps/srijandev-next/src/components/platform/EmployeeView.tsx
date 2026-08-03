'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, Mail, Phone, MapPin, ShieldCheck, UserCheck } from 'lucide-react';
import { PLATFORM_EMPLOYEES } from '@/lib/mockData';
import { Employee } from '@/types/platform';

export const EmployeeView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const filteredEmployees = PLATFORM_EMPLOYEES.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Employee Directory</h1>
          <p className="text-xs text-slate-400">Manage workforce profiles, roles, and departmental permissions</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-glow-purple text-xs font-semibold flex items-center space-x-2 transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-4 glass-card p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="AI & Data">AI & Data</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Operations">Operations</option>
            <option value="Business Operations">Business Operations</option>
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department & Role</th>
                <th className="px-6 py-4">Permission Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-white text-sm">{emp.name}</div>
                        <div className="text-slate-400 text-[11px]">{emp.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-200">{emp.role}</div>
                    <div className="text-[11px] text-slate-400">{emp.department}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md border ${
                      emp.userRole === 'ADMIN'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : emp.userRole === 'MANAGER'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {emp.userRole}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                      emp.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : emp.status === 'remote'
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{emp.status.replace('_', ' ')}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4 text-[11px] text-slate-400">
                    <div>{emp.location}</div>
                    <div>{emp.phone}</div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1.5 rounded-lg glass-panel hover:bg-slate-800 text-slate-300 text-xs font-medium">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
