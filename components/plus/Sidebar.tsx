'use client';

import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { useOperationsStore } from '@/store/useOperationsStore';
import {
  ShieldCheck, Users, CalendarDays, ClipboardList, AlertTriangle,
  Clock, LayoutGrid, KeyRound, Route, Calendar, Radio, Package,
  BarChart3, Globe, Building2, Siren
} from 'lucide-react';
import Image from 'next/image';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItemDef {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  badge?: number | string;
  badgeColor?: string;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { currentUser } = useEnterpriseStore();
  const { sosAlerts } = useOperationsStore();

  const isSuperAdmin = currentUser?.role === 'SrijanDev Admin';
  const isHO = currentUser?.role === 'Corporate HO Admin';
  const isPSH = currentUser?.role === 'Plant Security Head';
  const isSupervisor = currentUser?.role === 'Supervisor';

  const activeSOS = sosAlerts.filter(a => a.status === 'Active').length;

  const OPERATIONS_NAV: NavItemDef[] = [
    { id: 'staff',    label: 'Staff Directory',     icon: <Users size={16} />,         desc: '200+ Personnel CRUD'     },
    { id: 'shifts',   label: 'Shift Scheduler',      icon: <Clock size={16} />,         desc: 'Deployment Board'        },
    { id: 'leaves',   label: 'Leave Approvals',      icon: <CalendarDays size={16} />,  desc: 'Leave Pipeline'          },
    { id: 'tasks',    label: 'Task Dispatch',         icon: <ClipboardList size={16} />, desc: 'Patrol & Task Lifecycle' },
    { id: 'gatepass', label: 'Gate Pass & Incidents', icon: <AlertTriangle size={16} />, desc: 'Incident Logger'        },
  ];

  const PATROL_NAV: NavItemDef[] = [
    { id: 'patrol',    label: 'Guard Tour Engine',   icon: <Route size={16} />,    desc: 'QR Checkpoint Patrol', badge: activeSOS > 0 ? 'SOS' : undefined, badgeColor: 'bg-red-500 text-white animate-pulse' },
    { id: 'autoschedule', label: 'Auto-Shift Roster', icon: <Calendar size={16} />, desc: '30-Day Generator'      },
    { id: 'geofence', label: 'Geofence Manager',     icon: <Radio size={16} />,    desc: 'GPS Boundary Check-in' },
    { id: 'livemap',  label: 'Live Map View',        icon: <Globe size={16} />,    desc: 'Real-time Guard Tracking' },
  ];

  const LOGISTICS_NAV: NavItemDef[] = [
    { id: 'gatelogistics', label: 'Gate Logistics',    icon: <Package size={16} />,    desc: 'Truck & Visitor Passes' },
  ];

  const ANALYTICS_NAV: NavItemDef[] = [
    { id: 'hodashboard', label: 'HO Dashboard',       icon: <BarChart3 size={16} />,   desc: 'Multi-Plant Overview'   },
  ];

  const ADMIN_NAV: NavItemDef[] = [
    { id: 'usermanagement', label: 'User Access Management', icon: <KeyRound size={16} />, desc: 'Provision & Access' },
  ];

  const SDADMIN_NAV: NavItemDef[] = [
    { id: 'tenants',   label: 'Tenant Management',   icon: <Globe size={16} />,      desc: 'Client Onboarding'      },
  ];

  const NavItem = ({ id, label, icon, desc, badge, badgeColor }: NavItemDef) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
        activeTab === id
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm'
          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
      }`}
    >
      <span className={`shrink-0 transition-colors ${activeTab === id ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
        {icon}
      </span>
      <div className="text-left min-w-0 flex-1">
        <p className="leading-tight truncate text-xs">{label}</p>
        <p className={`text-[10px] font-normal leading-none mt-0.5 truncate ${activeTab === id ? 'text-blue-400/60' : 'text-gray-600 group-hover:text-gray-500'}`}>{desc}</p>
      </div>
      {badge && (
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${badgeColor || 'bg-blue-500 text-white'} shrink-0`}>
          {badge}
        </span>
      )}
    </button>
  );

  const SectionLabel = ({ label }: { label: string }) => (
    <p className="px-3 text-[9px] font-black text-gray-600 uppercase tracking-[0.1em] mb-1 mt-3">{label}</p>
  );

  return (
    <aside className="w-60 bg-gray-900 border-r border-white/5 flex-col h-full hidden md:flex absolute inset-y-0 left-0 z-20">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <Image src="/logo.png" alt="SrijanDev" width={120} height={40} className="h-9 w-auto object-contain drop-shadow-md" />
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={11} className="text-emerald-500" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Enterprise Security OS</span>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        <SectionLabel label="Operations" />
        {OPERATIONS_NAV.map(item => <NavItem key={item.id} {...item} />)}

        <SectionLabel label="Patrol & Security" />
        {PATROL_NAV.map(item => <NavItem key={item.id} {...item} />)}

        <SectionLabel label="Plant Logistics" />
        {LOGISTICS_NAV.map(item => <NavItem key={item.id} {...item} />)}

        {(isSuperAdmin || isHO) && (
          <>
            <SectionLabel label="Analytics" />
            {ANALYTICS_NAV.map(item => <NavItem key={item.id} {...item} />)}
          </>
        )}

        {(isSuperAdmin || isHO || isPSH) && (
          <>
            <div className="my-2 h-px bg-white/5" />
            <SectionLabel label="Admin" />
            {ADMIN_NAV.map(item => <NavItem key={item.id} {...item} />)}
          </>
        )}

        {isSuperAdmin && (
          <>
            <SectionLabel label="SrijanDev Platform" />
            {SDADMIN_NAV.map(item => <NavItem key={item.id} {...item} />)}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-white/5 space-y-2">
        {currentUser && (
          <div className="bg-gray-950/50 rounded-lg px-3 py-2.5 border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/30 to-emerald-500/30 border border-white/10 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                <p className={`text-[9px] font-mono truncate ${
                  currentUser.role === 'SrijanDev Admin' ? 'text-blue-400' :
                  currentUser.role === 'Corporate HO Admin' ? 'text-amber-400' :
                  currentUser.role === 'Plant Security Head' ? 'text-emerald-400' : 'text-purple-400'
                }`}>{currentUser.role}</p>
              </div>
            </div>
            {currentUser.assignedSiteId !== 'GLOBAL' && (
              <p className="text-[9px] font-mono text-gray-600 mt-1 pl-9">{currentUser.assignedSiteId}</p>
            )}
          </div>
        )}

        <div className="bg-gray-950 px-3 py-2 rounded-lg border border-white/5 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="text-[9px] text-gray-500 font-mono">
            <p>System Live · v4.0.0</p>
            <p className="text-gray-700">3-Store Persistence</p>
          </div>
          {activeSOS > 0 && (
            <Siren size={12} className="text-red-500 animate-pulse ml-auto" />
          )}
        </div>
      </div>
    </aside>
  );
}
