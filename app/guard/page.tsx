'use client';

import { useGuardAppStore } from '@/store/useGuardAppStore';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { useState, useEffect } from 'react';
import { Shield, ChevronRight, MapPin, Clock } from 'lucide-react';
import GuardSOSButton from '@/components/guard/GuardSOSButton';
import GuardPatrolExecution from '@/components/guard/GuardPatrolExecution';
import GuardLeaveRequest from '@/components/guard/GuardLeaveRequest';
import GuardClockInOut from '@/components/guard/GuardClockInOut';
import GuardTaskExecution from '@/components/guard/GuardTaskExecution';

export default function GuardCompanionApp() {
  const activeGuardId = useGuardAppStore(s => s.activeGuardId);
  const activeTab = useGuardAppStore(s => s.activeTab);
  const login = useGuardAppStore(s => s.login);
  const logout = useGuardAppStore(s => s.logout);
  const guards = useEnterpriseStore(s => s.guards);
  
  const activeGuard = guards.find(g => g.id === activeGuardId);

  const [guardCode, setGuardCode] = useState('');
  const [phone, setPhone] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (activeGuardId && !activeGuard) {
      logout();
    }
  }, [activeGuardId, activeGuard, logout]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const cleanPhoneInput = phone.replace(/\D/g, '');
    const foundGuard = guards.find(g => 
      g.guardCode.toUpperCase().trim() === guardCode.toUpperCase().trim() && 
      g.phone.replace(/\D/g, '') === cleanPhoneInput
    );
    
    if (foundGuard) {
      login(foundGuard.id);
    } else {
      setLoginError('Invalid Guard Code or Phone Number. Please try again.');
    }
  };

  if (!activeGuardId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 mb-6">
          <Shield size={40} className="text-blue-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Guard Companion</h2>
        <p className="text-sm text-gray-400 mb-8">Select your identity to access your shift details and patrol tasks.</p>
        
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="text-left space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Guard Code</label>
              <input
                type="text"
                placeholder="e.g. GC-001"
                value={guardCode}
                onChange={(e) => setGuardCode(e.target.value)}
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registered Phone</label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            
            {loginError && (
              <p className="text-red-400 text-xs font-medium text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{loginError}</p>
            )}
          </div>
          <button 
            type="submit"
            disabled={!guardCode || !phone}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            Access Companion App
          </button>
        </form>
      </div>
    );
  }
  
  // Render based on activeTab
  if (activeTab === 'patrol') return <GuardPatrolExecution guardId={activeGuardId} siteId={activeGuard?.assignedSiteId || ''} />;
  if (activeTab === 'leave') return <GuardLeaveRequest guardId={activeGuardId} guardName={activeGuard?.name || ''} siteId={activeGuard?.assignedSiteId || ''} />;
  if (activeTab === 'tasks') return <GuardTaskExecution guardId={activeGuardId} />;

  // Home Tab
  return (
    <div className="p-4 space-y-4">
      {/* Status Card */}
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] -mr-10 -mt-10" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Current Shift</h2>
            <p className="text-xs text-gray-400">{activeGuard?.shift} Shift</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${activeGuard?.status === 'On Duty' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
            {activeGuard?.status}
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-3 bg-gray-950 p-3 rounded-xl border border-white/5">
            <MapPin size={18} className="text-gray-500" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Assigned Post</p>
              <p className="text-sm font-medium text-white">{activeGuard?.assignedPost}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-950 p-3 rounded-xl border border-white/5">
            <Clock size={18} className="text-gray-500" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Last Check-in</p>
              <p className="text-sm font-medium text-white">{activeGuard?.lastCheckIn ? new Date(activeGuard.lastCheckIn).toLocaleTimeString() : 'Not checked in today'}</p>
            </div>
          </div>
        </div>

        {/* Geofence & Selfie Clock In/Out UI */}
        <GuardClockInOut
          guardId={activeGuardId}
          guardName={activeGuard?.name || ''}
          siteId={activeGuard?.assignedSiteId || ''}
          post={activeGuard?.assignedPost || ''}
          shift={activeGuard?.shift || 'Morning'}
          status={activeGuard?.status || 'Off Duty'}
          lastCheckIn={activeGuard?.lastCheckIn}
        />
      </div>

      {/* SOS Quick Action (renders actual SOS functionality) */}
      <GuardSOSButton siteId={activeGuard?.assignedSiteId || ''} reporter={activeGuard?.name || ''} guardId={activeGuardId} />

    </div>
  );
}
