'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Truck, Users, Activity, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'fleet', label: 'Plant & Fleet', icon: Truck },
    { id: 'workforce', label: 'Workforce', icon: Users },
    { id: 'diagnostics', label: 'CBM Diagnostics', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-gray-950 border-r border-white/10 flex flex-col hidden md:flex shrink-0 fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 group">
          <img 
            src="/logo-plus.png" 
            alt="SrijanDev Plus" 
            className="h-8 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.src = "/logo.png";
              e.currentTarget.style.filter = "drop-shadow(0 0 8px rgba(245, 158, 11, 0.5)) hue-rotate(180deg)";
            }}
          />
          <span className="font-bold text-white tracking-tight text-lg">Plus</span>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium relative ${
                isActive ? 'text-amber-500 bg-amber-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-amber-500' : 'text-gray-400'} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/30">
          <p className="text-xs font-semibold text-amber-500 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-gray-300">All Operations Nominal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
