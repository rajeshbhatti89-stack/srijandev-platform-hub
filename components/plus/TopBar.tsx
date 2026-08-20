'use client';

import { useRouter } from 'next/navigation';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { useOperationsStore } from '@/store/useOperationsStore';
import { useTenantStore } from '@/store/useTenantStore';
import { Search, Bell, LogOut, User, Siren, Building2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TopBarProps {
  setActiveTab?: (tab: string) => void;
}

export default function TopBar({ setActiveTab }: TopBarProps) {
  const { currentUser, logout, users, setCurrentUser } = useEnterpriseStore();
  const { sosAlerts, triggerSOS, acknowledgeSOS } = useOperationsStore();
  const { getActiveTenant } = useTenantStore();

  if (!currentUser) return null;

  const tenant = getActiveTenant();
  const activeSOS = sosAlerts.find(a => a.status === 'Active');
  const isSuperAdmin = currentUser.role === 'SrijanDev Admin';
  const isHO = currentUser.role === 'Corporate HO Admin';
  const openIncidentCount = sosAlerts.filter(a => a.status === 'Active').length;

  const handleSOS = () => {
    const siteId = currentUser.assignedSiteId === 'GLOBAL' ? 'SITE-01' : currentUser.assignedSiteId;
    triggerSOS({
      id: `SOS-${Date.now()}`,
      tenantId: currentUser.tenantId,
      guardId: currentUser.id,
      guardName: currentUser.name,
      siteId,
      post: 'Manual Trigger',
      coordinates: `${(31.52 + Math.random() * 0.01).toFixed(6)}°N, ${(76.92 + Math.random() * 0.01).toFixed(6)}°E`,
      timestamp: new Date().toISOString(),
      status: 'Active',
    });
    // Navigate to patrol module where SOS overlay renders
    if (setActiveTab) setActiveTab('patrol');
  };

  const roleColors: Record<string, string> = {
    'SrijanDev Admin': 'text-blue-400',
    'Corporate HO Admin': 'text-amber-400',
    'Plant Security Head': 'text-emerald-400',
  };

  return (
    <div className="h-16 bg-gray-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">

      {/* Left: Nav + Search */}
      <div className="flex-1 flex items-center gap-3">
        <a href="/" className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-sm font-medium border border-white/5 whitespace-nowrap shrink-0">
          ← Exit OS
        </a>

        {/* White-label logo */}
        {tenant && tenant.logoUrl && (
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 shrink-0">
            <img src={tenant.logoUrl} alt={tenant.companyName} className="h-6 w-auto object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className="text-[10px] text-gray-500 font-mono hidden md:inline">Powered by SrijanDev</span>
          </div>
        )}
        {tenant && !tenant.logoUrl && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 shrink-0">
            <Building2 size={14} style={{ color: tenant.primaryColor }} />
            <span className="text-xs font-semibold text-white">{tenant.companyName}</span>
            <span className="text-[10px] text-gray-600 font-mono">Powered by SrijanDev</span>
          </div>
        )}

        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-900 border border-white/5 rounded-lg flex-1 max-w-xs">
          <Search size={14} className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search guard, pass, incident..."
            className="bg-transparent border-none focus:outline-none text-sm text-white w-full placeholder-gray-600"
          />
        </div>
      </div>

      {/* Right: SOS + Actions */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* SOS Panic Button */}
        <button
          onClick={handleSOS}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black border transition-all ${
            activeSOS
              ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-lg shadow-red-500/50'
              : 'bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border-red-500/30 hover:shadow-lg hover:shadow-red-500/20'
          }`}
          title="Trigger SOS Panic Alert"
        >
          <Siren size={14} /> <span className="hidden sm:inline">SOS</span>
        </button>

        {/* Role Switcher — SrijanDev Admin emulation */}
        {(isSuperAdmin || isHO) && (
          <select
            className="hidden md:block bg-gray-900 border border-white/10 text-xs text-gray-300 rounded-lg px-2 py-1.5 focus:outline-none max-w-[160px]"
            onChange={e => {
              const u = users.find(u => u.id === e.target.value);
              if (u) setCurrentUser(u);
            }}
            value={currentUser.id}
          >
            <option disabled>-- Switch Role --</option>
            {users.filter(u => u.isActive).map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role.split(' ')[0]})</option>
            ))}
          </select>
        )}

        <div className="w-px h-6 bg-white/10 hidden md:block" />

        {/* Bell */}
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
          <Bell size={18} />
          {openIncidentCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-gray-950 animate-pulse" />
          )}
        </button>

        {/* User badge */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
            <p className={`text-[10px] font-mono ${roleColors[currentUser.role] || 'text-gray-400'}`}>{currentUser.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <User size={16} />
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}
