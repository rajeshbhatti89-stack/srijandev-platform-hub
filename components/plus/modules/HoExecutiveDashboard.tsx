'use client';

import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { useOperationsStore } from '@/store/useOperationsStore';
import { useTenantStore } from '@/store/useTenantStore';
import {
  BarChart3, Users, AlertTriangle, CheckCircle2,
  Shield, Clock, TrendingUp, ShieldAlert, Building2
} from 'lucide-react';

interface PlantCard {
  siteId: string;
  siteName: string;
  sanctioned: number;
  onDuty: number;
  onLeave: number;
  standby: number;
  relieved: number;
  openIncidents: number;
  criticalIncidents: number;
}

export default function HoExecutiveDashboard() {
  const { currentUser, guards, sites, incidents, tasks } = useEnterpriseStore();
  const { patrolLogs, gatePasses, geofenceCheckIns } = useOperationsStore();
  const { getActiveTenant, tenants } = useTenantStore();

  const isSuperAdmin = currentUser?.role === 'SrijanDev Admin';
  const isHO = currentUser?.role === 'Corporate HO Admin';

  const tenant = isSuperAdmin ? getActiveTenant() : tenants.find(t => t.id === currentUser?.tenantId);

  if (!isSuperAdmin && !isHO) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-20 bg-gray-900 border border-white/10 rounded-xl">
          <Shield size={48} className="mx-auto text-gray-700 mb-4" />
          <h3 className="text-gray-400 font-semibold">Access Restricted</h3>
          <p className="text-gray-600 text-sm mt-2">HO Dashboard is only accessible to Corporate HO Admin and SrijanDev Admin roles.</p>
        </div>
      </div>
    );
  }

  // Build plant cards from real data
  const plantCards: PlantCard[] = sites.map(site => {
    const plantSite = tenant?.plantSites.find(ps => ps.id === site.id);
    const siteGuards = guards.filter(g => g.assignedSiteId === site.id);
    const siteIncidents = incidents.filter(i => i.siteId === site.id);
    return {
      siteId: site.id,
      siteName: plantSite?.name || site.name,
      sanctioned: plantSite?.guardStrength || siteGuards.length,
      onDuty: siteGuards.filter(g => g.status === 'On Duty').length,
      onLeave: siteGuards.filter(g => g.status === 'On Leave').length,
      standby: siteGuards.filter(g => g.status === 'Standby').length,
      relieved: siteGuards.filter(g => g.status === 'Relieved').length,
      openIncidents: siteIncidents.filter(i => i.status === 'Open').length,
      criticalIncidents: siteIncidents.filter(i => i.status === 'Open' && i.severity === 'Critical').length,
    };
  });

  const tenantGuards = guards.filter(g => isSuperAdmin || g.tenantId === currentUser?.tenantId);
  const tenantIncidents = incidents.filter(i => isSuperAdmin || i.tenantId === currentUser?.tenantId);

  // Consolidated stats
  const totalGuards = tenantGuards.length;
  const totalOnDuty = tenantGuards.filter(g => g.status === 'On Duty').length;
  const totalOnLeave = tenantGuards.filter(g => g.status === 'On Leave').length;
  const totalOpenIncidents = tenantIncidents.filter(i => i.status === 'Open').length;
  const totalCritical = tenantIncidents.filter(i => i.status === 'Open' && i.severity === 'Critical').length;
  const totalPatrols = patrolLogs.length; // Can be filtered by tenantId if patrolLogs has it
  const completedPatrols = patrolLogs.filter(l => l.status === 'Completed').length;
  const openPasses = gatePasses.filter(p => p.status === 'Open').length; // Can be filtered if gatePasses has it

  // OT Calculator: Guards who checked in > 8 hours ago and are still On Duty
  const eightHoursAgo = Date.now() - 8 * 60 * 60 * 1000;
  const overtimeGuards = tenantGuards.filter(g =>
    g.status === 'On Duty' && g.lastCheckIn && new Date(g.lastCheckIn).getTime() < eightHoursAgo
  );

  // Recent global alerts
  const recentAlerts = [...tenantIncidents]
    .filter(i => i.status === 'Open')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  const severityColors = {
    Low: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    High: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    Critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 size={22} className="text-blue-400" /> Corporate HO Executive Dashboard
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {tenant?.companyName || 'Enterprise'} · Consolidated multi-plant security overview
          </p>
        </div>
        {tenant && (
          <div className="hidden md:flex items-center gap-2 bg-gray-900 border border-white/10 rounded-xl px-4 py-2">
            <Building2 size={16} className="text-gray-400" />
            <span className="text-sm font-semibold text-white">{tenant.companyName}</span>
            <span className="text-xs text-gray-500">{tenant.plantSites.length} plants</span>
          </div>
        )}
      </div>

      {/* Consolidated Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Guards', value: totalGuards, sub: `${totalOnDuty} On Duty`, color: 'text-blue-400', icon: <Users size={18} /> },
          { label: 'Open Incidents', value: totalOpenIncidents, sub: totalCritical > 0 ? `${totalCritical} CRITICAL` : 'All manageable', color: totalCritical > 0 ? 'text-red-400' : 'text-amber-400', icon: <AlertTriangle size={18} /> },
          { label: 'Patrol Coverage', value: `${completedPatrols}/${totalPatrols}`, sub: 'Completed rounds', color: 'text-emerald-400', icon: <Shield size={18} /> },
          { label: 'Open Gate Passes', value: openPasses, sub: 'Awaiting exit', color: 'text-purple-400', icon: <Clock size={18} /> },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-white/10 rounded-xl p-4 flex items-start gap-3">
            <div className={`p-2.5 rounded-lg bg-gray-950 border border-white/5 ${s.color} shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Plant Status Cards */}
      <section>
        <h3 className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <Building2 size={16} className="text-amber-400" /> Plant-by-Plant Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plantCards.map(plant => {
            const coveragePercent = plant.sanctioned > 0 ? Math.round((plant.onDuty / plant.sanctioned) * 100) : 0;
            return (
              <div key={plant.siteId} className={`bg-gray-900 border rounded-xl p-5 ${plant.criticalIncidents > 0 ? 'border-red-500/40' : 'border-white/10'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-white">{plant.siteName}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{plant.siteId}</p>
                  </div>
                  {plant.criticalIncidents > 0 && (
                    <span className="px-2 py-0.5 rounded border text-[10px] font-bold text-red-400 bg-red-500/10 border-red-500/20 animate-pulse">
                      {plant.criticalIncidents} CRITICAL
                    </span>
                  )}
                </div>

                {/* Guard strength indicator */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Guard Strength</span>
                    <span className={`font-bold ${coveragePercent >= 80 ? 'text-emerald-400' : coveragePercent >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {plant.onDuty}/{plant.sanctioned} ({coveragePercent}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${coveragePercent >= 80 ? 'bg-emerald-500' : coveragePercent >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${coveragePercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'On Duty', value: plant.onDuty, color: 'text-emerald-400' },
                    { label: 'On Leave', value: plant.onLeave, color: 'text-amber-400' },
                    { label: 'Standby', value: plant.standby, color: 'text-blue-400' },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-950/50 rounded-lg p-2">
                      <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-[10px] text-gray-600">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-xs">
                  <span className="text-gray-500">{plant.openIncidents} open incidents</span>
                  <span className={plant.openIncidents > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                    {plant.openIncidents > 0 ? '⚠ Active alerts' : '✓ All clear'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Alert Feed */}
        <section>
          <h3 className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <ShieldAlert size={16} className="text-red-400" /> Live Security Alert Feed
          </h3>
          <div className="bg-gray-900 border border-white/10 rounded-xl divide-y divide-white/5">
            {recentAlerts.map(alert => (
              <div key={alert.id} className="p-4 hover:bg-white/[0.02]">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${severityColors[alert.severity]}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-gray-600">{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-white mt-1">{alert.description}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>{alert.siteId}</span>
                  <span>{alert.type}</span>
                  <span>By: {alert.reportedBy}</span>
                </div>
              </div>
            ))}
            {recentAlerts.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">
                <CheckCircle2 size={28} className="mx-auto text-emerald-500/40 mb-2" />
                All clear — No open security alerts.
              </div>
            )}
          </div>
        </section>

        {/* OT Calculator */}
        <section>
          <h3 className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-amber-400" /> Overtime (OT) Tracker
            {overtimeGuards.length > 0 && (
              <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {overtimeGuards.length} on OT
              </span>
            )}
          </h3>
          <div className="bg-gray-900 border border-white/10 rounded-xl divide-y divide-white/5">
            {overtimeGuards.map(guard => {
              const checkInTime = guard.lastCheckIn ? new Date(guard.lastCheckIn) : new Date();
              const hoursOnDuty = ((Date.now() - checkInTime.getTime()) / 3600000);
              const otHours = Math.max(0, hoursOnDuty - 8).toFixed(1);
              return (
                <div key={guard.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{guard.name}</p>
                    <p className="text-xs text-gray-500">{guard.guardCode} · {guard.assignedPost}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-bold text-sm">+{otHours}h OT</p>
                    <p className="text-[10px] text-gray-600">{hoursOnDuty.toFixed(1)}h total</p>
                  </div>
                </div>
              );
            })}
            {overtimeGuards.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">
                <Clock size={28} className="mx-auto text-gray-700 mb-2" />
                No guards currently on overtime.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
