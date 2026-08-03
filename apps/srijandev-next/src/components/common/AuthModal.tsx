'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, User, Key, CheckCircle, ArrowRight, X, Github, Chrome } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { ExtendedRole } from '@/types/phase2';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<ExtendedRole>('SUPER_ADMIN');
  const [rememberMe, setRememberMe] = useState(true);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setSubmittedMessage('Password reset link sent to ' + email);
      setTimeout(() => setSubmittedMessage(null), 3000);
      return;
    }
    login(email || 'admin@srijandev.com', selectedRole as any);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="glass-panel w-full max-w-md p-8 rounded-3xl border border-brand-500/30 relative shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white glass-panel"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-glow-purple mx-auto mb-3">
                <div className="w-full h-full bg-dark-bg rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-brand-400" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                {mode === 'login' && 'Sign In to SrijanDev'}
                {mode === 'signup' && 'Create Enterprise Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Multi-Portal Authentication & Role Governance Engine
              </p>
            </div>

            {submittedMessage ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold text-white">{submittedMessage}</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@srijandev.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                )}

                {/* Role Switcher Selector */}
                {mode !== 'forgot' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Select Active Session Role</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-brand-500 font-mono"
                    >
                      <option value="SUPER_ADMIN">SUPER_ADMIN (Full Access)</option>
                      <option value="ADMIN">ADMIN (System Administrator)</option>
                      <option value="HR">HR (Human Resources)</option>
                      <option value="MANAGER">MANAGER (Department Manager)</option>
                      <option value="TEAM_LEAD">TEAM_LEAD (Team Lead)</option>
                      <option value="EMPLOYEE">EMPLOYEE (Standard Staff)</option>
                      <option value="CLIENT">CLIENT (External Client)</option>
                      <option value="GUEST">GUEST (Read Only)</option>
                    </select>
                  </div>
                )}

                {/* Remember me & Forgot password link */}
                {mode === 'login' && (
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-brand-600 focus:ring-brand-500"
                      />
                      <span>Remember Me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="hover:text-brand-400 text-xs"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-xs shadow-glow-purple flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02]"
                >
                  <span>
                    {mode === 'login' && 'Sign In to Session'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Email'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* OAuth Login Placeholders */}
                {mode !== 'forgot' && (
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <div className="text-[10px] text-center text-slate-500 uppercase font-mono tracking-wider">
                      Or Authenticate via Enterprise Provider
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => login('google-user@srijandev.com', 'ADMIN')}
                        className="py-2 rounded-xl glass-panel hover:bg-slate-800 text-[11px] font-semibold text-slate-300 flex items-center justify-center space-x-1"
                      >
                        <Chrome className="w-3.5 h-3.5 text-rose-400" />
                        <span>Google</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => login('github-user@srijandev.com', 'SUPER_ADMIN')}
                        className="py-2 rounded-xl glass-panel hover:bg-slate-800 text-[11px] font-semibold text-slate-300 flex items-center justify-center space-x-1"
                      >
                        <Github className="w-3.5 h-3.5 text-slate-200" />
                        <span>GitHub</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => login('microsoft-user@srijandev.com', 'MANAGER')}
                        className="py-2 rounded-xl glass-panel hover:bg-slate-800 text-[11px] font-semibold text-slate-300 flex items-center justify-center space-x-1"
                      >
                        <Key className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Azure</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Toggle mode text */}
                <div className="text-center text-xs text-slate-400 pt-2">
                  {mode === 'login' ? (
                    <span>
                      Don't have an account?{' '}
                      <button type="button" onClick={() => setMode('signup')} className="text-brand-400 font-semibold hover:underline">
                        Sign Up
                      </button>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{' '}
                      <button type="button" onClick={() => setMode('login')} className="text-brand-400 font-semibold hover:underline">
                        Sign In
                      </button>
                    </span>
                  )}
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
