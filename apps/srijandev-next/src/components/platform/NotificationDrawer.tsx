'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, X, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PHASE2_NOTIFICATIONS } from '@/lib/mockDataPhase2';
import { NotificationItem } from '@/types/phase2';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(PHASE2_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="w-full max-w-md bg-dark-card border-l border-slate-800 h-full flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {unreadCount} New
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button onClick={markAllRead} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="Mark All Read">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={clearAll} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800" title="Clear All">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-colors ${
                    notif.isRead
                      ? 'bg-slate-900/60 border-slate-800/80 opacity-80'
                      : 'bg-slate-900 border-cyan-500/30 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-cyan-300 uppercase tracking-wider text-[10px]">{notif.category}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">{notif.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="py-20 text-center text-xs text-slate-500">
                  No notifications. All caught up!
                </div>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
