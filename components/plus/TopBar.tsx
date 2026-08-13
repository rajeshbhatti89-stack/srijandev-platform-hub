'use client';

import { useRouter } from 'next/navigation';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { Search, Bell, LogOut } from 'lucide-react';

export default function TopBar() {
  const router = useRouter();
  const setIsPlusMode = useEnterpriseStore((state) => state.setIsPlusMode);

  const exitPlusMode = () => {
    setIsPlusMode(false);
    router.push('/');
  };

  return (
    <div className="h-16 bg-gray-950/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search assets, personnel, or diagnostics..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all text-sm font-medium">
          <span className="text-lg leading-none">+</span> Quick Check-in
        </button>
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-all text-sm font-medium">
          <span className="text-lg leading-none">+</span> Assign Task
        </button>

        <div className="w-px h-6 bg-white/10 mx-2 hidden md:block" />

        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-gray-950 animate-pulse" />
        </button>
        
        <div className="w-px h-6 bg-white/10 mx-2" />

        <button
          onClick={exitPlusMode}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm font-medium"
        >
          <LogOut size={16} />
          Exit OS
        </button>
      </div>
    </div>
  );
}
