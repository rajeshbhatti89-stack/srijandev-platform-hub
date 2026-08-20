'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

export default function MobileAppPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    // Check if user previously dismissed
    const hasDismissed = localStorage.getItem('srijandev_app_dismissed');

    if (isMobile && !hasDismissed) {
      // Small delay before showing
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('srijandev_app_dismissed', 'true');
  };

  const handleInstall = () => {
    // In a real app, this would route to Play Store or trigger PWA install
    alert("Opening Google Play Store...");
    setIsVisible(false);
    localStorage.setItem('srijandev_app_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:hidden pointer-events-none"
        >
          <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl pointer-events-auto relative overflow-hidden">
            {/* Glossy gradient accent */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
            
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors active:bg-white/20"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-0.5 shadow-lg shadow-blue-900/50">
                <div className="w-full h-full bg-gray-950 rounded-[14px] flex items-center justify-center">
                  <Smartphone className="text-white w-7 h-7" />
                </div>
              </div>

              <div className="flex-1 pr-10">
                <h3 className="text-white font-bold text-lg leading-tight tracking-tight">SrijanDev Plus</h3>
                <p className="text-gray-400 text-sm mt-1 leading-snug">
                  Get the native Android app for offline sync, GPS tracking & better performance.
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleInstall}
                className="flex-1 bg-white text-black font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-white/10"
              >
                <Download size={18} />
                Install Free App
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
