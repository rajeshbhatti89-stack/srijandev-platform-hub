'use client';

import { useState } from 'react';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { ShieldCheck, LogIn, Eye, EyeOff, Building2, Users, Shield } from 'lucide-react';

interface DemoUser {
  label: string;
  email: string;
  role: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
}

const DEMO_USERS: DemoUser[] = [
  {
    label: 'SrijanDev Admin',
    email: 'rajesh@srijandev.in',
    role: 'Master Platform Access',
    badge: 'Level 1',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: <Shield size={18} className="text-blue-400" />,
  },
  {
    label: 'Corporate HO Admin',
    email: 'anand.ho@adani.in',
    role: 'Multi-Plant Group Oversight',
    badge: 'Level 2',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: <Building2 size={18} className="text-amber-400" />,
  },
  {
    label: 'PSH — Darlaghat Plant',
    email: 'vikram.psh@srijandev.in',
    role: 'Site-Scoped Operations',
    badge: 'Level 3',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: <Users size={18} className="text-emerald-400" />,
  },
  {
    label: 'PSH — Bhatapara Plant',
    email: 'amit.psh@srijandev.in',
    role: 'Site-Scoped Operations',
    badge: 'Level 3',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: <Users size={18} className="text-emerald-400" />,
  },
];

export default function LoginPortal() {
  const { login } = useEnterpriseStore();
  const [email, setEmail] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const success = login(email);
      if (!success) setError('No active account found for this email address.');
      setLoading(false);
    }, 600);
  };

  const handleDemoLogin = (email: string) => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      login(email);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:48px_48px] opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-blue-500/30 mb-4">
            <ShieldCheck size={30} className="text-blue-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">SrijanDev Enterprise OS</h1>
          <p className="text-sm text-gray-400">Security & Field Force Platform · Unolo + TechnoPurple</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-500 font-mono">All systems operational</span>
          </div>
        </div>

        {/* Demo Login Cards — 3-tier */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">Quick Demo Access · 3-Tier Hierarchy</p>
          <div className="space-y-2">
            {DEMO_USERS.map(u => (
              <button
                key={u.email}
                onClick={() => handleDemoLogin(u.email)}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-900 border border-white/10 hover:border-white/20 rounded-xl text-left transition-all group hover:bg-white/[0.02] disabled:opacity-60"
              >
                <div className="p-2 rounded-lg bg-gray-950 border border-white/5 shrink-0">
                  {u.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">{u.label}</p>
                  <p className="text-xs text-gray-500 truncate">{u.role}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${u.badgeColor}`}>
                  {u.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-600">or sign in with email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Manual Login Form */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-gray-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  defaultValue="demo"
                  className="w-full bg-gray-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-gray-600 mt-1">Any password accepted in demo mode</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                <span className="text-xs text-red-400">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={16} /> Sign In to OS</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-700 mt-4">
          SrijanDev Enterprise OS v4.0 · Unolo + TechnoPurple Architecture
        </p>
      </div>
    </div>
  );
}
