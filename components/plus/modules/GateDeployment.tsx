'use client';

import { useEnterpriseStore, Guard } from '@/store/useEnterpriseStore';
import { MapPin, CheckCircle2, Clock, Map, UserMinus, ShieldCheck } from 'lucide-react';

export default function GateDeployment() {
  const { currentUser, guards, updateGuard } = useEnterpriseStore();

  const isGlobalAdmin = currentUser?.role === 'SrijanDev Admin';
  const isHO = currentUser?.role === 'Corporate HO Admin';
  const isSuperAdmin = isGlobalAdmin || isHO;
  const targetTenantId = currentUser?.tenantId || 'GLOBAL';

  const visibleGuards = guards.filter(g => {
    const tenantOk = isGlobalAdmin || g.tenantId === targetTenantId;
    const siteOk = isSuperAdmin || g.assignedSiteId === currentUser?.assignedSiteId;
    return tenantOk && siteOk;
  });

  const simulateCheckIn = (guardId: string) => {
    updateGuard(guardId, { status: 'On Duty', lastCheckIn: new Date().toISOString() });
  };

  const simulateCheckOut = (guardId: string) => {
    updateGuard(guardId, { status: 'Relieved' });
  };

  const markLeave = (guardId: string) => {
    updateGuard(guardId, { status: 'On Leave' });
  };

  // Group by post
  const posts = Array.from(new Set(visibleGuards.map(g => g.assignedPost)));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gate Deployment & Check-ins</h2>
          <p className="text-sm text-gray-400">Live geofenced attendance and shift tracking by post.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {posts.map(post => {
          const postGuards = visibleGuards.filter(g => g.assignedPost === post);
          const activeCount = postGuards.filter(g => g.status === 'On Duty').length;

          return (
            <div key={post} className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-gray-950/50 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MapPin size={18} className="text-blue-500" />
                  {post}
                </h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Deployed: {postGuards.length}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${activeCount > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    Active: {activeCount}
                  </span>
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-950/30">
                {postGuards.map(guard => (
                  <div key={guard.id} className="p-4 rounded-xl border border-white/5 bg-gray-900 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-white">{guard.name}</span>
                        {guard.status === 'On Duty'   && <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"><CheckCircle2 size={10}/> On Duty</span>}
                        {guard.status === 'Relieved' && <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-500/10 px-2 py-0.5 rounded border border-gray-500/20"><Clock size={10}/> Relieved</span>}
                        {guard.status === 'On Leave' && <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20"><UserMinus size={10}/> On Leave</span>}
                      </div>
                      <p className="text-xs text-gray-500 font-mono mb-3">{guard.id} • {guard.designation}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock size={14} className="text-blue-500" /> Shift: {guard.shift}
                      </div>
                      {guard.lastCheckIn && (
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <Map size={14} className="text-emerald-500" /> Geofence Ping: {new Date(guard.lastCheckIn).toLocaleTimeString()}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
                      {guard.status !== 'On Duty' ? (
                        <button onClick={() => simulateCheckIn(guard.id)} className="w-full py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors">
                          Force Check-in
                        </button>
                      ) : (
                        <button onClick={() => simulateCheckOut(guard.id)} className="w-full py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-medium transition-colors">
                          Check-out
                        </button>
                      )}
                      <button onClick={() => markLeave(guard.id)} disabled={guard.status === 'On Leave'} className="w-full py-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Mark Leave
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {posts.length === 0 && (
          <div className="text-center py-20 bg-gray-900 border border-white/10 rounded-xl">
            <ShieldCheck size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No posts currently allocated. Register guards to allocate gates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
