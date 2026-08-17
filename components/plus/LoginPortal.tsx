'use client';

import { useState } from 'react';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { ShieldCheck, LogIn, Eye, EyeOff, Building2, Users, Shield } from 'lucide-react';



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
      if (!success) {
        setError('No active account found for this email address.');
        setLoading(false);
      } else {
        window.location.href = '/plus';
      }
    }, 600);
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
                  className="w-full bg-gray-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
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

        <div className="mt-6 bg-gray-900 border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-gray-400 text-center mb-3">Simulation / Demo Logins</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { setEmail('rajesh@srijandev.in'); }} type="button" className="py-2 text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors border border-blue-500/20">Root Admin</button>
            <button onClick={() => { setEmail('ho@srijandev.in'); }} type="button" className="py-2 text-xs font-medium bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors border border-amber-500/20">HO Manager</button>
            <button onClick={() => { setEmail('psh@srijandev.in'); }} type="button" className="py-2 text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20">Plant Security Head</button>
            <button onClick={() => { setEmail('supervisor@srijandev.in'); }} type="button" className="py-2 text-xs font-medium bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors border border-purple-500/20">Supervisor</button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-700 mt-4">
          SrijanDev Enterprise OS v4.0 · Unolo + TechnoPurple Architecture
        </p>
      </div>
    </div>
  );
}
