'use client';

import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { Camera, MapPin, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function AttendanceManager() {
  const { workforce, sites, updateWorker } = useEnterpriseStore();

  const handleSimulateCheckIn = (workerId: string) => {
    updateWorker(workerId, { 
      isPresent: true, 
      lastCheckIn: new Date().toISOString(),
      currentSiteId: sites[Math.floor(Math.random() * sites.length)].id 
    });
  };

  const handleSimulateCheckOut = (workerId: string) => {
    updateWorker(workerId, { 
      isPresent: false, 
      currentSiteId: undefined 
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Attendance & Geofencing</h2>
          <p className="text-sm text-gray-400">Monitor shift rosters, biometric logs, and site boundary breaches.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium transition-colors">
          <Camera size={16} /> Force Bio-Scan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Roster & Check-ins */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-white/10 bg-gray-950/50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Live Shift Roster</h3>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md">Present: {workforce.filter(w => w.isPresent).length}</span>
                <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md">Absent: {workforce.filter(w => !w.isPresent).length}</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-950/30 text-gray-400 border-b border-white/5 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3">Worker</th>
                    <th className="px-5 py-3">Shift</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Current Site</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {workforce.map(worker => (
                    <tr key={worker.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-400 text-xs">
                            {worker.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{worker.name}</p>
                            <p className="text-xs text-gray-500 font-mono">{worker.id} - {worker.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">{worker.shift}</td>
                      <td className="px-5 py-4">
                        {worker.isPresent ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 size={12} /> On-Site
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                            <XCircle size={12} /> Absent
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-400">
                        {worker.currentSiteId || '--'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {worker.isPresent ? (
                          <button onClick={() => handleSimulateCheckOut(worker.id)} className="text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors">
                            Check Out
                          </button>
                        ) : (
                          <button onClick={() => handleSimulateCheckIn(worker.id)} className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">
                            Check In
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Geofence Zones */}
        <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden flex flex-col h-fit">
          <div className="p-5 border-b border-white/10 bg-gray-950/50">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin size={18} className="text-blue-500" />
              Geofenced Sites
            </h3>
          </div>
          <div className="p-5 space-y-4">
            {sites.map(site => (
              <div key={site.id} className="p-4 rounded-xl border border-white/5 bg-gray-950/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-white">{site.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${site.status === 'Operational' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {site.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Radius</p>
                    <p className="font-mono text-gray-300">{site.geofenceRadius}m</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Active Workers</p>
                    <p className="font-mono text-gray-300">{workforce.filter(w => w.currentSiteId === site.id).length}</p>
                  </div>
                </div>
                {site.status === 'Delayed' && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-400">
                    <AlertTriangle size={14} /> Boundary breach detected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
