'use client';

import React, { useState } from 'react';
import { ShieldCheck, Users, Briefcase, FileText, Settings, Key, Image, CheckCircle, Database } from 'lucide-react';
import { PLATFORM_EMPLOYEES } from '@/lib/mockData';

export const AdminView: React.FC = () => {
  const [adminTab, setAdminTab] = useState<'users' | 'roles' | 'services' | 'database'>('users');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <span>Admin Management Panel</span>
          </h1>
          <p className="text-xs text-slate-400">Configure global roles, permissions, blog content, services, and system integrations</p>
        </div>

        <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 w-fit">
          Role: SUPER ADMIN
        </span>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex flex-wrap gap-2 p-1.5 glass-card rounded-2xl border border-slate-800">
        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            adminTab === 'users' ? 'bg-purple-600 text-white shadow-glow-purple' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Employee Access</span>
        </button>

        <button
          onClick={() => setAdminTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            adminTab === 'roles' ? 'bg-purple-600 text-white shadow-glow-purple' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>RBAC Roles & Matrix</span>
        </button>

        <button
          onClick={() => setAdminTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            adminTab === 'services' ? 'bg-purple-600 text-white shadow-glow-purple' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Portal Content CMS</span>
        </button>

        <button
          onClick={() => setAdminTab('database')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            adminTab === 'database' ? 'bg-purple-600 text-white shadow-glow-purple' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Prisma & Database Engine</span>
        </button>
      </div>

      {/* Tab Contents */}
      {adminTab === 'users' && (
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-800 p-6">
          <h3 className="text-base font-bold text-white mb-4">User Permission Governance</h3>
          <div className="space-y-3">
            {PLATFORM_EMPLOYEES.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center space-x-3">
                  <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full border border-slate-700" />
                  <div>
                    <div className="font-bold text-white">{emp.name}</div>
                    <div className="text-slate-400 text-[11px]">{emp.email}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="px-2 py-0.5 font-mono font-bold text-[10px] rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {emp.userRole}
                  </span>
                  <button className="px-3 py-1 rounded-lg glass-panel text-[11px] text-slate-300 hover:text-white">
                    Edit Permissions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {adminTab === 'roles' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Role-Based Access Control (RBAC) Matrix</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30">
              <h4 className="font-bold text-purple-300 mb-2">ADMIN ROLE</h4>
              <p className="text-slate-400 mb-3">Full system read, write, update, delete, role assignment, and Prisma schema migration rights.</p>
              <span className="text-[10px] font-mono text-emerald-400">Status: Unrestricted</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
              <h4 className="font-bold text-cyan-300 mb-2">MANAGER ROLE</h4>
              <p className="text-slate-400 mb-3">Department workforce management, task assignment, CRM pipeline edits, and attendance reporting.</p>
              <span className="text-[10px] font-mono text-cyan-400">Status: Department Scoped</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700">
              <h4 className="font-bold text-slate-300 mb-2">EMPLOYEE ROLE</h4>
              <p className="text-slate-400 mb-3">Self shift clock-in/out, personal task updates, document view, and profile management.</p>
              <span className="text-[10px] font-mono text-slate-400">Status: Restricted</span>
            </div>
          </div>
        </div>
      )}

      {adminTab === 'services' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Portal CMS Content Manager</h3>
          <p className="text-xs text-slate-400">Manage live services, portfolio projects, and blog articles displayed on Portal 1 (Corporate Portal).</p>
        </div>
      )}

      {adminTab === 'database' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Prisma ORM & PostgreSQL Engine Status</h3>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
            <div>Database Provider: <span className="text-cyan-400">PostgreSQL / Supabase</span></div>
            <div>Prisma Client: <span className="text-emerald-400">Connected & Synced</span></div>
            <div>Schema Path: <span className="text-purple-400">apps/srijandev-next/prisma/schema.prisma</span></div>
          </div>
        </div>
      )}

    </div>
  );
};
