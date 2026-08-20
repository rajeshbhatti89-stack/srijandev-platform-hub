'use client';

import { useState } from 'react';
import { useOperationsStore, PatrolRoute, PatrolLog } from '@/store/useOperationsStore';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { Map, ScanLine, CheckCircle2, Clock } from 'lucide-react';

interface GuardPatrolExecutionProps {
  guardId: string;
  siteId: string;
}

export default function GuardPatrolExecution({ guardId, siteId }: GuardPatrolExecutionProps) {
  const routes = useOperationsStore(s => s.patrolRoutes.filter(r => r.siteId === siteId));
  const logs = useOperationsStore(s => s.patrolLogs.filter(l => l.guardId === guardId && l.status === 'Active'));
  
  const addPatrolLog = useOperationsStore(s => s.addPatrolLog);
  const scanCheckpoint = useOperationsStore(s => s.scanCheckpoint);
  const completePatrolLog = useOperationsStore(s => s.completePatrolLog);

  const activeLog = logs[0];
  const [selectedRouteId, setSelectedRouteId] = useState('');

  const users = useEnterpriseStore(s => s.users);
  const guards = useEnterpriseStore(s => s.guards);

  const handleStartPatrol = () => {
    if (!selectedRouteId) return;
    const route = routes.find(r => r.id === selectedRouteId);
    if (!route) return;

    const tenantId = users.find(u => u.id === guardId)?.tenantId || 'GLOBAL';
    const activeGuard = guards.find(g => g.id === guardId);

    addPatrolLog({
      id: `LOG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      tenantId,
      routeId: route.id,
      routeName: route.name,
      siteId,
      guardId,
      guardName: activeGuard?.name || 'Unknown',
      checkpointScans: [],
      status: 'Active',
      startedAt: new Date().toISOString(),
    });
  };

  const handleScan = (checkpointId: string, expectedMinutes: number) => {
    if (!activeLog) return;
    
    // Simulate scanning logic and delay calculation
    const delayMinutes = Math.floor(Math.random() * 5); // Simulated slight delay
    const isOnTime = delayMinutes <= expectedMinutes + 5; // 5 min grace period

    scanCheckpoint(activeLog.id, checkpointId, isOnTime, delayMinutes);

    // Check if patrol is complete
    const route = routes.find(r => r.id === activeLog.routeId);
    if (route && activeLog.checkpointScans.length + 1 === route.checkpoints.length) {
      completePatrolLog(activeLog.id);
      alert('Patrol Route Completed Successfully!');
    }
  };

  if (!activeLog) {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30 mx-auto mb-4">
            <Map className="text-blue-400" size={24} />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Start a New Patrol</h2>
          <p className="text-xs text-gray-400 mb-6">Select a route assigned to your site and begin your round.</p>
          
          <select 
            value={selectedRouteId}
            onChange={e => setSelectedRouteId(e.target.value)}
            className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none mb-4"
          >
            <option value="" disabled>-- Select Route --</option>
            {routes.map(r => (
              <option key={r.id} value={r.id}>{r.name} ({r.estimatedMinutes} mins)</option>
            ))}
          </select>

          <button 
            onClick={handleStartPatrol}
            disabled={!selectedRouteId}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            Begin Patrol Execution
          </button>
        </div>
      </div>
    );
  }

  const activeRoute = routes.find(r => r.id === activeLog.routeId);
  if (!activeRoute) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white">{activeRoute.name}</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Status: In Progress</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-blue-400">{activeLog.checkpointScans.length}/{activeRoute.checkpoints.length}</div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Scanned</p>
          </div>
        </div>

        <div className="space-y-4">
          {activeRoute.checkpoints.sort((a, b) => a.sequence - b.sequence).map(cp => {
            const scan = activeLog.checkpointScans.find(s => s.checkpointId === cp.id);
            const isScanned = !!scan;
            // Next checkpoint to scan
            const isNext = !isScanned && activeLog.checkpointScans.length === cp.sequence - 1;

            return (
              <div key={cp.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${isScanned ? 'bg-emerald-500/10 border-emerald-500/20' : isNext ? 'bg-blue-500/10 border-blue-500/30' : 'bg-gray-950 border-white/5 opacity-50'}`}>
                <div className="mt-0.5 shrink-0">
                  {isScanned ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Clock size={18} className={isNext ? "text-blue-400" : "text-gray-600"} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${isScanned ? 'text-emerald-400' : isNext ? 'text-blue-300' : 'text-gray-400'}`}>{cp.sequence}. {cp.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{cp.location}</p>
                  
                  {isNext && (
                    <button 
                      onClick={() => handleScan(cp.id, cp.expectedMinutes)}
                      className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2"
                    >
                      <ScanLine size={14} /> Scan QR Code
                    </button>
                  )}

                  {isScanned && scan && (
                    <p className="text-[10px] text-emerald-500/70 mt-1">
                      Scanned at {new Date(scan.scannedAt).toLocaleTimeString()} {scan.isOnTime ? '(On Time)' : '(Delayed)'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
