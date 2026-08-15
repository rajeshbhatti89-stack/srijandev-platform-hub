'use client';

import { useGuardAppStore } from '@/store/useGuardAppStore';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { Home, MapPin, CheckSquare, Calendar, PhoneCall, ShieldAlert, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function GuardAppLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const activeTab = useGuardAppStore(s => s.activeTab);
  const setActiveTab = useGuardAppStore(s => s.setActiveTab);
  const activeGuardId = useGuardAppStore(s => s.activeGuardId);
  const logout = useGuardAppStore(s => s.logout);
  const guards = useEnterpriseStore(s => s.guards);
  const activeGuard = guards.find(g => g.id === activeGuardId);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden font-sans sm:max-w-md sm:mx-auto sm:border-x sm:border-white/10 relative">
      {/* Top Header */}
      <header className="flex-shrink-0 bg-gray-900 border-b border-white/10 px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <span className="text-emerald-400 font-bold text-sm">
              {activeGuard ? activeGuard.name.charAt(0) : 'G'}
            </span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">{activeGuard ? activeGuard.name : 'Guard Companion'}</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{activeGuard ? activeGuard.designation : 'Not logged in'}</p>
          </div>
        </div>
        
        {activeGuard && (
          <button onClick={logout} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
            <LogOut size={18} />
          </button>
        )}
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-950 pb-20">
        {children}
      </main>

      {/* Bottom Navigation (Only if logged in) */}
      {activeGuard && (
        <nav className="absolute bottom-0 w-full bg-gray-900 border-t border-white/10 pb-safe z-30">
          <div className="flex items-center justify-around p-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px] transition-colors ${activeTab === 'home' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Home size={20} className="mb-1" />
              <span className="text-[10px] font-semibold">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('patrol')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px] transition-colors ${activeTab === 'patrol' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <MapPin size={20} className="mb-1" />
              <span className="text-[10px] font-semibold">Patrol</span>
            </button>

            {/* Centered SOS Button */}
            <div className="relative -top-5">
              <button 
                onClick={() => {
                  // Direct SOS Trigger Event will be handled by components
                  window.dispatchEvent(new CustomEvent('TRIGGER_SOS'));
                }}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 border-4 border-gray-950 flex items-center justify-center shadow-lg shadow-red-600/30 text-white transition-transform active:scale-95"
              >
                <ShieldAlert size={24} />
              </button>
            </div>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px] transition-colors ${activeTab === 'tasks' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <CheckSquare size={20} className="mb-1" />
              <span className="text-[10px] font-semibold">Tasks</span>
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px] transition-colors ${activeTab === 'leave' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Calendar size={20} className="mb-1" />
              <span className="text-[10px] font-semibold">Leave</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
