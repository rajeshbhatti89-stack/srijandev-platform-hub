'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Smartphone, 
  ExternalLink,
  Layers,
  CheckCircle2,
  Download
} from 'lucide-react';
import Link from 'next/link';

export default function MobileAppPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if user previously dismissed first-run modal
    const hasDismissed = localStorage.getItem('srijandev_app_first_run_dismissed') || localStorage.getItem('srijandev_app_dismissed');

    if (!hasDismissed) {
      // Delay display slightly for smooth page load
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('srijandev_app_first_run_dismissed', 'true');
    localStorage.setItem('srijandev_app_dismissed', 'true');
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallSuccess(true);
        setTimeout(() => handleDismiss(), 1800);
      }
      setDeferredPrompt(null);
    } else {
      setInstallSuccess(true);
      setTimeout(() => handleDismiss(), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-gray-950/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] text-white overflow-hidden z-10 backdrop-blur-2xl"
          >
            {/* Background Glows */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/15 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors active:scale-95"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            {/* Header / Brand Badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-gray-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  SrijanDev Platform Hub
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  Welcome to SrijanDev Web Apps
                </h2>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Experience our next-generation web & mobile ecosystems built for enterprise scale, precision HR automation, and high-performance 3D digital experiences.
            </p>

            {/* Core Apps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {/* SrijanDev HR */}
              <Link
                href="/hr"
                onClick={handleDismiss}
                className="group p-3.5 rounded-2xl bg-white/[0.04] hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Users size={18} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      New Release
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                    SrijanDev HR Management
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    14 modules: LMS, punch attendance, OKRs, payslips, recruitment ATS, & org tree.
                  </p>
                </div>
                <div className="mt-3 flex items-center text-xs font-semibold text-amber-400 gap-1 group-hover:translate-x-1 transition-transform">
                  Launch HR App <ArrowRight size={14} />
                </div>
              </Link>

              {/* SrijanDev Plus */}
              <Link
                href="/plus"
                onClick={handleDismiss}
                className="group p-3.5 rounded-2xl bg-white/[0.04] hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                      <ShieldCheck size={18} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                      Enterprise
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                    SrijanDev Plus Security
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    Field force management, geofenced patrols, gate logistics & multi-tenant security.
                  </p>
                </div>
                <div className="mt-3 flex items-center text-xs font-semibold text-indigo-400 gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Enterprise <ArrowRight size={14} />
                </div>
              </Link>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-white/10">
              <button
                onClick={handleInstallPWA}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
              >
                {installSuccess ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-950" />
                    Web App Ready!
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Install Web App (PWA)
                  </>
                )}
              </button>

              <button
                onClick={handleDismiss}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium text-sm transition-colors"
              >
                Continue to Website
              </button>
            </div>

            {/* Device Info */}
            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <Smartphone size={12} className="text-gray-400" /> Mobile & Desktop Ready
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Layers size={12} className="text-gray-400" /> Offline Sync Enabled
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
