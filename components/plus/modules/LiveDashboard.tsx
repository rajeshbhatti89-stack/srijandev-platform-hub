'use client';

import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { Users, Truck, AlertTriangle, Activity, MapPin } from 'lucide-react';

export default function LiveDashboard() {
  const { workforce, fleet, tasks, sites, diagnostics } = useEnterpriseStore();

  const activeWorkers = workforce.filter(w => w.isPresent).length;
  const activeFleet = fleet.filter(f => f.status === 'Active').length;
  const criticalLogs = diagnostics.filter(d => d.alertTriggered);
  const pendingTasks = tasks.filter(t => t.status === 'Created' || t.status === 'Dispatched').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Operations Dashboard</h2>
          <p className="text-sm text-gray-400">Real-time telemetry and field activity overview.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400">Live Sync Active</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-white/10 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Active Field Force</p>
            <p className="text-2xl font-bold text-white mt-1">{activeWorkers} / {workforce.length}</p>
          </div>
          <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-lg">
            <Users size={24} />
          </div>
        </div>
        
        <div className="bg-gray-900 border border-white/10 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Active Machinery</p>
            <p className="text-2xl font-bold text-white mt-1">{activeFleet} / {fleet.length}</p>
          </div>
          <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg">
            <Truck size={24} />
          </div>
        </div>

        <div className="bg-gray-900 border border-white/10 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Pending Tasks</p>
            <p className="text-2xl font-bold text-white mt-1">{pendingTasks}</p>
          </div>
          <div className="p-3 bg-amber-500/20 text-amber-500 rounded-lg">
            <Activity size={24} />
          </div>
        </div>

        <div className="bg-gray-900 border border-white/10 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Critical Alerts</p>
            <p className="text-2xl font-bold text-red-500 mt-1">{criticalLogs.length}</p>
          </div>
          <div className="p-3 bg-red-500/20 text-red-500 rounded-lg">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Simulated Map */}
        <div className="lg:col-span-2 bg-gray-900 border border-white/10 rounded-xl overflow-hidden flex flex-col h-[500px]">
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gray-950/50">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin size={18} className="text-blue-500" />
              Field Map Overview
            </h3>
          </div>
          <div className="flex-1 relative bg-[#0a0a0f] overflow-hidden">
            {/* Grid Overlay */}
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            
            {/* Render Sites on Map */}
            {sites.map((site, index) => (
              <div 
                key={site.id} 
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `${20 + (index * 25)}%`, 
                  top: `${30 + (index % 2 === 0 ? 10 : 30)}%` 
                }}
              >
                <div className={`w-32 h-32 rounded-full absolute -inset-16 opacity-10 ${site.status === 'Operational' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <div className={`w-32 h-32 rounded-full absolute -inset-16 opacity-20 border border-dashed ${site.status === 'Operational' ? 'border-emerald-500' : 'border-red-500'} animate-[spin_10s_linear_infinite]`} />
                
                <div className="relative bg-gray-950 border border-white/10 px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2 whitespace-nowrap z-10">
                  <div className={`w-2 h-2 rounded-full ${site.status === 'Operational' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                  <span className="text-xs font-semibold text-white">{site.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden flex flex-col h-[500px]">
          <div className="p-5 border-b border-white/10 bg-gray-950/50">
            <h3 className="text-lg font-semibold text-white">Live Activity Feed</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* We can construct a feed from tasks and logs */}
            {criticalLogs.map(log => (
              <div key={`log-${log.id}`} className="relative pl-4 border-l border-red-500/30">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-red-500" />
                <p className="text-xs font-mono text-gray-500 mb-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
                <p className="text-sm text-red-400 font-medium">Critical Alert on {log.assetId}</p>
                <p className="text-xs text-gray-400 mt-1">{log.notes}</p>
              </div>
            ))}
            
            {tasks.map(task => (
              <div key={`task-${task.id}`} className="relative pl-4 border-l border-blue-500/30">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-500" />
                <p className="text-xs font-mono text-gray-500 mb-1">{new Date(task.createdAt).toLocaleTimeString()}</p>
                <p className="text-sm text-white font-medium">Task {task.status}: {task.title}</p>
                <p className="text-xs text-gray-400 mt-1">Assigned to {task.assigneeId}</p>
              </div>
            ))}

            {workforce.filter(w => w.isPresent).map(worker => (
              <div key={`checkin-${worker.id}`} className="relative pl-4 border-l border-emerald-500/30">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-emerald-500" />
                <p className="text-xs font-mono text-gray-500 mb-1">{worker.lastCheckIn ? new Date(worker.lastCheckIn).toLocaleTimeString() : 'Unknown'}</p>
                <p className="text-sm text-emerald-400 font-medium">{worker.name} Checked In</p>
                <p className="text-xs text-gray-400 mt-1">Site: {worker.currentSiteId}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
