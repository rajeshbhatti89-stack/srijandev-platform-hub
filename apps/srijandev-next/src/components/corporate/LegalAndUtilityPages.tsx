'use client';

import React, { useState } from 'react';
import { ShieldCheck, Mail, Send, CheckCircle2, Clock, Wrench, AlertTriangle } from 'lucide-react';

export const LegalAndUtilityPages: React.FC<{ type: 'privacy' | 'terms' | 'cookie' | '500' | 'maintenance' | 'coming_soon' }> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  if (type === 'coming_soon') {
    return (
      <div className="py-24 max-w-xl mx-auto text-center space-y-6">
        <Clock className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
        <h1 className="text-4xl font-extrabold text-white">Feature Launching Soon</h1>
        <p className="text-sm text-slate-300">We are fine-tuning this module for the upcoming SrijanDev Enterprise release.</p>
        {subscribed ? (
          <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold">Subscribed for launch notification!</div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter corporate email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-glow-purple">
              Notify Me
            </button>
          </form>
        )}
      </div>
    );
  }

  if (type === 'maintenance') {
    return (
      <div className="py-24 max-w-md mx-auto text-center space-y-4">
        <Wrench className="w-16 h-16 text-amber-400 mx-auto" />
        <h1 className="text-3xl font-extrabold text-white">Scheduled Maintenance</h1>
        <p className="text-xs text-slate-400">Our SRE team is upgrading database indexes. Expected downtime &lt; 10 minutes.</p>
      </div>
    );
  }

  if (type === '500') {
    return (
      <div className="py-24 max-w-md mx-auto text-center space-y-4">
        <AlertTriangle className="w-16 h-16 text-rose-400 mx-auto" />
        <h1 className="text-4xl font-extrabold text-white">500 Server Error</h1>
        <p className="text-xs text-slate-400">An unexpected system exception occurred. The incident log has been logged automatically.</p>
      </div>
    );
  }

  return (
    <div className="py-24 max-w-4xl mx-auto px-4 space-y-8">
      <h1 className="text-3xl font-extrabold text-white uppercase tracking-wide">
        {type === 'privacy' && 'Privacy Policy'}
        {type === 'terms' && 'Terms of Service'}
        {type === 'cookie' && 'Cookie Policy'}
      </h1>

      <div className="glass-card p-8 rounded-3xl border border-slate-800 text-xs text-slate-300 space-y-4 leading-relaxed">
        <p>
          Welcome to SrijanDev Technologies Inc. This policy governs your access to our corporate multi-portal applications, software platforms, and cloud services.
        </p>
        <h3 className="text-sm font-bold text-white uppercase">1. Information Governance</h3>
        <p>
          We prioritize data privacy and security compliance across all operational workloads. Data collected via contact forms or platform sessions is encrypted in transit and at rest.
        </p>
        <h3 className="text-sm font-bold text-white uppercase">2. Acceptable Use</h3>
        <p>
          Users must comply with all security standards, local regulations, and role-based permissions granted by system administrators.
        </p>
      </div>
    </div>
  );
};
