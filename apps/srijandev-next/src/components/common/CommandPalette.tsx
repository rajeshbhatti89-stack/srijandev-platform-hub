'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, LayoutDashboard, Users, Clock, Kanban, Building, FileText, BarChart3, Settings, ShieldCheck, X } from 'lucide-react';
import { usePortal } from '@/features/portal/PortalContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectTab }) => {
  const { switchPortal } = usePortal();
  const [query, setQuery] = useState('');

  // Keydown listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items = [
    { label: 'Switch to Corporate Website Portal', action: () => { switchPortal('corporate'); onClose(); }, icon: Building2, category: 'Portals' },
    { label: 'Switch to Business Platform SaaS', action: () => { switchPortal('platform'); onClose(); }, icon: LayoutDashboard, category: 'Portals' },
    { label: 'Executive Dashboard', action: () => { onSelectTab?.('dashboard'); onClose(); }, icon: LayoutDashboard, category: 'Navigation' },
    { label: 'Employee Directory (148 Active)', action: () => { onSelectTab?.('employees'); onClose(); }, icon: Users, category: 'Navigation' },
    { label: 'Shift Attendance & Clock-In', action: () => { onSelectTab?.('attendance'); onClose(); }, icon: Clock, category: 'Navigation' },
    { label: 'Task Kanban Board', action: () => { onSelectTab?.('tasks'); onClose(); }, icon: Kanban, category: 'Navigation' },
    { label: 'CRM & Deals Pipeline', action: () => { onSelectTab?.('crm'); onClose(); }, icon: Building, category: 'Navigation' },
    { label: 'Document Vault Repository', action: () => { onSelectTab?.('documents'); onClose(); }, icon: FileText, category: 'Navigation' },
    { label: 'Business Intelligence & Reports', action: () => { onSelectTab?.('analytics'); onClose(); }, icon: BarChart3, category: 'Navigation' },
    { label: 'Admin Panel & RBAC Settings', action: () => { onSelectTab?.('admin'); onClose(); }, icon: ShieldCheck, category: 'Admin' },
  ];

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-panel w-full max-w-xl rounded-3xl border border-brand-500/30 overflow-hidden shadow-2xl"
          >
            {/* Search Input Header */}
            <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
              <Search className="w-5 h-5 text-brand-400" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command or search page (e.g., 'Switch to Business Platform')..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-500"
              />
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-3 space-y-1">
              {filteredItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-brand-600/20 text-slate-300 hover:text-white text-xs transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] uppercase font-mono font-bold rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {item.category}
                    </span>
                  </button>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500">
                  No matching command or portal page found.
                </div>
              )}
            </div>

            {/* Shortcut Footer */}
            <div className="px-4 py-2.5 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <div>Navigate: <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Ctrl+K</kbd></div>
              <div>SrijanDev Next Command Palette</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
