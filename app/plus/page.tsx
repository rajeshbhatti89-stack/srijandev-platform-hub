'use client';

import { useState, useEffect } from 'react';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import Sidebar from '@/components/plus/Sidebar';
import TopBar from '@/components/plus/TopBar';
import LoginPortal from '@/components/plus/LoginPortal';

// ── Core operational modules ──────────────────────────────
import StaffDirectory    from '@/components/plus/modules/StaffDirectory';
import ShiftScheduler    from '@/components/plus/modules/ShiftScheduler';
import LeaveApprovals    from '@/components/plus/modules/LeaveApprovals';
import TaskDispatch      from '@/components/plus/modules/TaskDispatch';
import IncidentLogger    from '@/components/plus/modules/IncidentLogger';

// ── New Phase 4–7 modules ─────────────────────────────────
import PatrolTourEngine    from '@/components/plus/modules/PatrolTourEngine';
import AutoShiftScheduler  from '@/components/plus/modules/AutoShiftScheduler';
import GeofenceManager     from '@/components/plus/modules/GeofenceManager';
import LiveMapView         from '@/components/plus/modules/LiveMapView';
import GateLogistics       from '@/components/plus/modules/GateLogistics';
import HoExecutiveDashboard from '@/components/plus/modules/HoExecutiveDashboard';
import TenantOnboarding    from '@/components/plus/TenantOnboarding';

// ── Legacy preserved modules ──────────────────────────────
import UserManagement  from '@/components/plus/modules/UserManagement';
import GuardRegistry   from '@/components/plus/modules/GuardRegistry';
import GateDeployment  from '@/components/plus/modules/GateDeployment';

export default function PlusDashboard() {
  const currentUser = useEnterpriseStore(state => state.currentUser);
  const [activeTab, setActiveTab] = useState('staff');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-sm tracking-wider text-slate-400">Loading SrijanDev Plus...</p>
      </div>
    );
  }
  if (!currentUser) return <LoginPortal />;

  const renderModule = () => {
    switch (activeTab) {
      // ── Core operations ──
      case 'staff':        return <StaffDirectory />;
      case 'shifts':       return <ShiftScheduler />;
      case 'leaves':       return <LeaveApprovals />;
      case 'tasks':        return <TaskDispatch />;
      case 'gatepass':     return <IncidentLogger />;

      // ── Patrol & Security ──
      case 'patrol':       return <PatrolTourEngine />;
      case 'autoschedule': return <AutoShiftScheduler />;
      case 'geofence':     return <GeofenceManager />;
      case 'livemap':      return <LiveMapView />;

      // ── Logistics ──
      case 'gatelogistics': return <GateLogistics />;

      // ── Analytics ──
      case 'hodashboard':  return <HoExecutiveDashboard />;

      // ── Admin ──
      case 'usermanagement': return <UserManagement />;
      case 'tenants':      return <TenantOnboarding />;

      // ── Legacy ──
      case 'registry':     return <GuardRegistry />;
      case 'deployment':   return <GateDeployment />;

      default: return (
        <div className="p-6 text-center py-20">
          <p className="text-gray-500">Navigate using the sidebar.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-950 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 h-screen md:ml-60 relative z-10 overflow-hidden">
        <TopBar setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}
