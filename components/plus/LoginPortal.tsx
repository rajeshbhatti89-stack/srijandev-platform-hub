'use client';

import { useState, useEffect } from 'react';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { ShieldCheck, LogIn, Eye, EyeOff, Building2, Users, Shield } from 'lucide-react';



import { useTenantStore, Tenant } from '@/store/useTenantStore';
import Image from 'next/image';

export default function LoginPortal() {
  const { login } = useEnterpriseStore();
  const { tenants } = useTenantStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [whiteLabelTenant, setWhiteLabelTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // Extract subdomain, assuming standard structure like adani.localhost or adani.srijandev.in
      const parts = hostname.split('.');
      if (parts.length > 1 && parts[0] !== 'www') {
        const subdomain = parts[0];
        const match = tenants.find(t => {
          const sub = t.subdomain?.toLowerCase() || '';
          const comp = t.companyName?.toLowerCase() || '';
          return sub.includes(subdomain.toLowerCase()) || comp.includes(subdomain.toLowerCase());
        });
        if (match) {
          setWhiteLabelTenant(match);
        }
      }
    }
  }, [tenants]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Invalid email or password.');
        setLoading(false);
      } else {
        window.location.href = '/plus';
      }
    }, 600);
  };



  return (
    <div className="min-h-screen bg-white flex w-full relative overflow-hidden">
      {/* Left side: Login Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10 bg-white">
        
        {/* Header */}
        <div className="mb-12">
          {whiteLabelTenant?.logoUrl ? (
             <div className="mb-10 flex justify-center">
                <img src={whiteLabelTenant.logoUrl} alt={whiteLabelTenant.companyName} className="object-contain h-28 max-w-[320px]" />
             </div>
          ) : (
             <div className="mb-10 flex justify-center">
                <img src="/logo-plus.png" alt="SrijanDev Enterprise" className="object-contain h-28 max-w-[320px]" />
             </div>
          )}
          
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {whiteLabelTenant ? `${whiteLabelTenant.companyName} Portal` : 'SrijanDev Enterprise OS'}
          </h1>
          <p className="text-base text-gray-500">
            {whiteLabelTenant ? `Powered by SrijanDev Enterprise` : 'Security & Field Force Platform'}
          </p>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-sm text-emerald-600 font-medium tracking-wide">All systems operational</span>
          </div>
        </div>

        {/* Manual Login Form */}
        <div className="w-full max-w-md">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@srijandev.in"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={whiteLabelTenant ? { backgroundColor: whiteLabelTenant.primaryColor } : {}}
              className={`w-full py-3.5 rounded-xl ${!whiteLabelTenant && 'bg-blue-600 hover:bg-blue-700'} text-white font-bold text-base transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={18} /> Sign In to Workspace</>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              By signing in, you agree to the SrijanDev Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Beautiful Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 mix-blend-multiply z-10" />
        <Image 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
          alt="Corporate Building" 
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-12 left-12 right-12 z-20 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-white shadow-2xl">
           <h2 className="text-3xl font-bold mb-3">Enterprise Grade Security.</h2>
           <p className="text-lg text-white/80 leading-relaxed">
             Deploy intelligent patrols, manage global gate logistics, and command your field force from one centralized OS.
           </p>
        </div>
      </div>
    </div>
  );
}
