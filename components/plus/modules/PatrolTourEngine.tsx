'use client';

import { useState, useEffect, useRef } from 'react';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { useOperationsStore, PatrolRoute, PatrolLog, SOSAlert } from '@/store/useOperationsStore';
import {
  Shield, Play, CheckCircle2, AlertTriangle, QrCode,
  Clock, ChevronRight, Siren, X, MapPin, Route,
  User, Plus, AlertCircle
} from 'lucide-react';

// ---------- SOS Overlay ----------
function SOSOverlay({ alert, onAck }: { alert: SOSAlert; onAck: () => void }) {
  return (
    <div className="fixed inset-0 z-[999] bg-red-950/95 backdrop-blur-sm flex items-center justify-center p-4 animate-pulse-once">
      <div className="bg-gray-950 border-2 border-red-500 rounded-2xl p-8 max-w-lg w-full shadow-2xl shadow-red-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center animate-ping absolute" />
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center relative z-10">
            <Siren size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-red-400 uppercase tracking-wider">SOS PANIC ALERT</h2>
            <p className="text-red-300 text-sm font-mono">EMERGENCY RESPONSE REQUIRED</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {[
            { label: 'Guard', value: alert.guardName, color: 'text-white' },
            { label: 'Guard ID', value: alert.guardId, color: 'text-blue-400 font-mono' },
            { label: 'Post', value: alert.post, color: 'text-white' },
            { label: 'Coordinates', value: alert.coordinates, color: 'text-amber-400 font-mono' },
            { label: 'Alert Time', value: new Date(alert.timestamp).toLocaleString(), color: 'text-gray-300' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center border-b border-red-500/20 pb-2">
              <span className="text-red-400 text-sm font-medium">{label}</span>
              <span className={`text-sm ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onAck}
          className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-lg transition-all shadow-lg shadow-red-600/40 flex items-center justify-center gap-3"
        >
          <Shield size={22} /> Acknowledge & Dispatch Response
        </button>
        <p className="text-center text-xs text-red-500/60 mt-3">Alert will remain active until acknowledged by authorized personnel</p>
      </div>
    </div>
  );
}

// ---------- Active Patrol Card ----------
function ActivePatrolCard({ log, route, onScan }: {
  log: PatrolLog;
  route: PatrolRoute;
  onScan: (cpId: string) => void;
}) {
  const scannedIds = log.checkpointScans.map(s => s.checkpointId);
  const nextCp = route.checkpoints.find(cp => !scannedIds.includes(cp.id));
  const progress = scannedIds.length / route.checkpoints.length;

  return (
    <div className={`bg-gray-900 border rounded-xl p-5 ${log.status === 'Breached' ? 'border-red-500/50' : 'border-blue-500/30'}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-bold text-white">{log.routeName}</p>
          <p className="text-xs text-gray-400 mt-0.5">Guard: {log.guardName} · Started {new Date(log.startedAt).toLocaleTimeString()}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
          log.status === 'Active'    ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' :
          log.status === 'Breached'  ? 'text-red-400 bg-red-500/10 border-red-500/30 animate-pulse' :
          log.status === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
          'text-gray-400 bg-gray-500/10 border-gray-500/30'
        }`}>
          {log.status}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{scannedIds.length} / {route.checkpoints.length} checkpoints</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Checkpoint sequence */}
      <div className="space-y-2">
        {route.checkpoints.map((cp, i) => {
          const scanned = scannedIds.includes(cp.id);
          const isNext = cp.id === nextCp?.id;
          const scan = log.checkpointScans.find(s => s.checkpointId === cp.id);
          return (
            <div key={cp.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              scanned ? 'bg-emerald-500/5 border-emerald-500/20' :
              isNext   ? 'bg-blue-500/10 border-blue-500/30' :
              'bg-gray-800/50 border-white/5'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                scanned ? 'bg-emerald-500 text-white' : isNext ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                {scanned ? <CheckCircle2 size={14} /> : cp.sequence}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${scanned ? 'text-emerald-300' : isNext ? 'text-blue-300' : 'text-gray-400'}`}>
                  {cp.name}
                </p>
                <p className="text-[10px] text-gray-500">{cp.location}</p>
                {scan && (
                  <p className="text-[10px] text-emerald-500 font-mono mt-0.5">
                    ✓ Scanned {new Date(scan.scannedAt).toLocaleTimeString()}
                    {!scan.isOnTime && <span className="text-amber-400"> · +{scan.delayMinutes}m late</span>}
                  </p>
                )}
              </div>
              {isNext && log.status === 'Active' && (
                <button
                  onClick={() => onScan(cp.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-lg shadow-blue-500/20"
                >
                  <QrCode size={12} /> SCAN QR
                </button>
              )}
              {log.status === 'Breached' && cp.id === log.breachCheckpointId && (
                <span className="text-[10px] text-red-400 font-bold animate-pulse">BREACH</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Main Component ----------
export default function PatrolTourEngine() {
  const { currentUser, guards } = useEnterpriseStore();
  const {
    patrolRoutes, patrolLogs, addPatrolLog, scanCheckpoint,
    completePatrolLog, breachPatrolLog,
    sosAlerts, triggerSOS, acknowledgeSOS,
  } = useOperationsStore();

  const [showStartForm, setShowStartForm] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [selectedGuardId, setSelectedGuardId] = useState('');
  const [breachTimer, setBreachTimer] = useState<Record<string, NodeJS.Timeout>>({});

  const isSuperAdmin = currentUser?.role === 'SrijanDev Admin';
  const isHO = currentUser?.role === 'Corporate HO Admin';

  const scopedRoutes = patrolRoutes.filter(r =>
    isSuperAdmin || isHO || r.siteId === currentUser?.assignedSiteId
  );
  const scopedLogs = patrolLogs.filter(l =>
    isSuperAdmin || isHO || l.siteId === currentUser?.assignedSiteId
  );
  const activeLog = scopedLogs.find(l => l.status === 'Active');
  const activeSOSAlert = sosAlerts.find(a => a.status === 'Active');

  const scopedGuards = guards.filter(g =>
    (isSuperAdmin || isHO || g.assignedSiteId === currentUser?.assignedSiteId) && g.status === 'On Duty'
  );

  const handleStartPatrol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRouteId || !selectedGuardId) return;
    const route = patrolRoutes.find(r => r.id === selectedRouteId);
    const guard = guards.find(g => g.id === selectedGuardId);
    if (!route || !guard) return;

    addPatrolLog({
      id: `LOG-${Date.now()}`,
      routeId: route.id,
      routeName: route.name,
      siteId: route.siteId,
      guardId: guard.id,
      guardName: guard.name,
      checkpointScans: [],
      status: 'Active',
      startedAt: new Date().toISOString(),
    });
    setShowStartForm(false);
    setSelectedRouteId('');
    setSelectedGuardId('');
  };

  const handleScan = (logId: string, cpId: string) => {
    const log = patrolLogs.find(l => l.id === logId);
    const route = patrolRoutes.find(r => r.id === log?.routeId);
    const cp = route?.checkpoints.find(c => c.id === cpId);
    if (!log || !cp) return;

    // Calculate delay
    const prevScan = log.checkpointScans[log.checkpointScans.length - 1];
    const elapsedMs = prevScan
      ? Date.now() - new Date(prevScan.scannedAt).getTime()
      : Date.now() - new Date(log.startedAt).getTime();
    const elapsedMin = Math.floor(elapsedMs / 60000);
    const delay = Math.max(0, elapsedMin - cp.expectedMinutes);
    const isOnTime = delay === 0;

    scanCheckpoint(logId, cpId, isOnTime, delay);

    // Check if all done
    const newScannedCount = log.checkpointScans.length + 1;
    if (route && newScannedCount === route.checkpoints.length) {
      completePatrolLog(logId);
    }

    // Clear existing breach timer for this log
    if (breachTimer[logId]) clearTimeout(breachTimer[logId]);

    // Set next breach timer for next checkpoint
    const nextCp = route?.checkpoints[newScannedCount];
    if (nextCp && newScannedCount < (route?.checkpoints.length ?? 0)) {
      const timer = setTimeout(() => {
        breachPatrolLog(logId, nextCp.id);
      }, (nextCp.expectedMinutes + 5) * 60 * 1000); // grace: +5 mins
      setBreachTimer(prev => ({ ...prev, [logId]: timer }));
    }
  };

  const handleSOS = () => {
    const guard = currentUser ? guards.find(g => g.name === currentUser.name) : null;
    const guardId = guard?.id || currentUser?.id || 'GUARD-UNKNOWN';
    const guardName = currentUser?.name || 'Unknown';
    const post = guard?.assignedPost || 'Unknown Post';
    const siteId = currentUser?.assignedSiteId || 'SITE-01';

    // Random-ish coordinate near a plant
    const lat = (31.5204 + (Math.random() - 0.5) * 0.01).toFixed(6);
    const lng = (76.9254 + (Math.random() - 0.5) * 0.01).toFixed(6);

    triggerSOS({
      id: `SOS-${Date.now()}`,
      guardId,
      guardName,
      siteId,
      post,
      coordinates: `${lat}°N, ${lng}°E`,
      timestamp: new Date().toISOString(),
      status: 'Active',
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative">

      {/* SOS Full-Screen Overlay */}
      {activeSOSAlert && (
        <SOSOverlay
          alert={activeSOSAlert}
          onAck={() => acknowledgeSOS(activeSOSAlert.id, currentUser?.name || 'PSH')}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Route size={22} className="text-blue-400" /> Guard Tour & Patrol Engine
          </h2>
          <p className="text-sm text-gray-400 mt-1">TechnoPurple QR checkpoint verification · Real-time patrol tracking</p>
        </div>
        <div className="flex gap-2">
          {!activeLog && (
            <button
              onClick={() => setShowStartForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
            >
              <Play size={15} /> Start Patrol
            </button>
          )}
          <button
            onClick={handleSOS}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors shadow-lg shadow-red-500/30 animate-pulse"
          >
            <Siren size={15} /> SOS PANIC
          </button>
        </div>
      </div>

      {/* SOS History */}
      {sosAlerts.filter(a => a.status !== 'Active').slice(0, 3).length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">Recent SOS History</p>
          <div className="space-y-2">
            {sosAlerts.filter(a => a.status !== 'Active').slice(0, 3).map(alert => (
              <div key={alert.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{alert.guardName} · {alert.post}</span>
                <span className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</span>
                <span className={`text-xs font-bold ${alert.status === 'Acknowledged' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start Patrol Form */}
      {showStartForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Play size={18} className="text-blue-400" /> Start New Patrol</h3>
              <button onClick={() => setShowStartForm(false)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X size={18} /></button>
            </div>
            <form onSubmit={handleStartPatrol} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Patrol Route</label>
                <select value={selectedRouteId} onChange={e => setSelectedRouteId(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" required>
                  <option value="">-- Select route --</option>
                  {scopedRoutes.map(r => <option key={r.id} value={r.id}>{r.name} ({r.checkpoints.length} checkpoints)</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Assign Guard (On Duty)</label>
                <select value={selectedGuardId} onChange={e => setSelectedGuardId(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" required>
                  <option value="">-- Select guard --</option>
                  {scopedGuards.map(g => <option key={g.id} value={g.id}>{g.name} ({g.guardCode} · {g.assignedPost})</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowStartForm(false)} className="flex-1 py-2.5 rounded-lg bg-white/5 text-white text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold">Launch Patrol</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Patrol */}
      {activeLog && (
        <section>
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> Active Patrol In Progress
          </h3>
          {(() => {
            const route = patrolRoutes.find(r => r.id === activeLog.routeId);
            return route ? (
              <ActivePatrolCard log={activeLog} route={route} onScan={cpId => handleScan(activeLog.id, cpId)} />
            ) : null;
          })()}
        </section>
      )}

      {/* Patrol Routes */}
      <section>
        <h3 className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <MapPin size={16} className="text-emerald-400" /> Configured Patrol Routes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scopedRoutes.map(route => {
            const routeLogs = scopedLogs.filter(l => l.routeId === route.id);
            const completedRounds = routeLogs.filter(l => l.status === 'Completed').length;
            const breachedRounds = routeLogs.filter(l => l.status === 'Breached').length;
            return (
              <div key={route.id} className="bg-gray-900 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white">{route.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{route.siteId} · ~{route.estimatedMinutes} min</p>
                  </div>
                  <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">
                    {route.checkpoints.length} CPs
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">{route.description}</p>
                {/* Checkpoint preview */}
                <div className="flex items-center gap-1 mb-4 flex-wrap">
                  {route.checkpoints.map((cp, i) => (
                    <div key={cp.id} className="flex items-center gap-1">
                      <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">{cp.name}</span>
                      {i < route.checkpoints.length - 1 && <ChevronRight size={10} className="text-gray-600" />}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 text-xs text-gray-500 pt-3 border-t border-white/5">
                  <span className="text-emerald-400 font-semibold">{completedRounds} completed</span>
                  {breachedRounds > 0 && <span className="text-red-400 font-semibold">{breachedRounds} breached</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Patrol Logs */}
      <section>
        <h3 className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <Clock size={16} className="text-amber-400" /> Recent Patrol History
        </h3>
        <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="bg-gray-950/50 text-gray-500 text-xs uppercase border-b border-white/10">
                <tr>
                  <th className="px-5 py-3">Route</th>
                  <th className="px-5 py-3">Guard</th>
                  <th className="px-5 py-3">Progress</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {scopedLogs.slice(0, 10).map(log => {
                  const route = patrolRoutes.find(r => r.id === log.routeId);
                  const total = route?.checkpoints.length ?? 0;
                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02]">
                      <td className="px-5 py-3 font-medium text-white">{log.routeName}</td>
                      <td className="px-5 py-3 text-gray-300">{log.guardName}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${total ? (log.checkpointScans.length / total) * 100 : 0}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{log.checkpointScans.length}/{total}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                          log.status === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                          log.status === 'Breached'  ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                          log.status === 'Active'    ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                          'text-gray-400 bg-gray-500/10 border-gray-500/20'
                        }`}>{log.status}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{new Date(log.startedAt).toLocaleString()}</td>
                    </tr>
                  );
                })}
                {scopedLogs.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-500">No patrol history recorded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
