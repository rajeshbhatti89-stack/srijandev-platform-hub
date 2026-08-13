'use client';

import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { Settings2, AlertTriangle, Truck, Gauge } from 'lucide-react';

export default function PlantAndFleet() {
  const { fleet, diagnostics } = useEnterpriseStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Standby': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Under Maintenance': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Breakdown': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Plant, Fleet & CBM Engine</h2>
          <p className="text-sm text-gray-400">Live equipment telemetry and Condition-Based Maintenance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {fleet.map(asset => {
          // Get the latest diagnostic log for this asset if it exists
          const latestLog = diagnostics.filter(d => d.assetId === asset.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
          
          return (
            <div key={asset.id} className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden flex flex-col md:flex-row">
              
              {/* Left: Asset Info */}
              <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 bg-gray-950/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-lg text-white font-bold">{asset.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{asset.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{asset.type}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Running Hours</p>
                    <p className="font-mono text-white text-lg">{asset.runningHours.toLocaleString()}h</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fuel Rate</p>
                    <p className="font-mono text-white text-lg">{asset.fuelRate} L/h</p>
                  </div>
                </div>
              </div>

              {/* Right: Live Gauges (Telemetry) */}
              <div className="p-6 md:w-2/3 flex flex-col justify-center">
                <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <Gauge size={16} className="text-blue-500" /> Live Telemetry
                </h4>
                
                {latestLog ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Vibration Gauge */}
                    <div className="bg-gray-950 border border-white/5 p-4 rounded-xl relative overflow-hidden">
                      {latestLog.vibrationLevel > 8.5 && <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />}
                      <div className="flex justify-between items-center mb-2 relative z-10">
                        <span className="text-xs text-gray-400 font-medium">Vibration Threshold</span>
                        <span className="text-xs font-mono text-red-500">&gt; 8.5 mm/s</span>
                      </div>
                      <div className="flex items-end gap-2 relative z-10">
                        <span className={`text-3xl font-bold font-mono ${latestLog.vibrationLevel > 8.5 ? 'text-red-500' : 'text-emerald-400'}`}>
                          {latestLog.vibrationLevel}
                        </span>
                        <span className="text-sm text-gray-500 mb-1">mm/s</span>
                      </div>
                      {/* Visual Bar */}
                      <div className="h-1.5 w-full bg-white/10 rounded-full mt-4 overflow-hidden relative z-10">
                        <div 
                          className={`h-full ${latestLog.vibrationLevel > 8.5 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${Math.min((latestLog.vibrationLevel / 12) * 100, 100)}%` }} 
                        />
                      </div>
                    </div>

                    {/* Oil Quality Gauge */}
                    <div className="bg-gray-950 border border-white/5 p-4 rounded-xl relative overflow-hidden">
                      {latestLog.oilQuality < 40 && <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />}
                      <div className="flex justify-between items-center mb-2 relative z-10">
                        <span className="text-xs text-gray-400 font-medium">Oil Quality Index</span>
                        <span className="text-xs font-mono text-red-500">&lt; 40%</span>
                      </div>
                      <div className="flex items-end gap-2 relative z-10">
                        <span className={`text-3xl font-bold font-mono ${latestLog.oilQuality < 40 ? 'text-red-500' : 'text-blue-400'}`}>
                          {latestLog.oilQuality}
                        </span>
                        <span className="text-sm text-gray-500 mb-1">%</span>
                      </div>
                      {/* Visual Bar */}
                      <div className="h-1.5 w-full bg-white/10 rounded-full mt-4 overflow-hidden relative z-10">
                        <div 
                          className={`h-full ${latestLog.oilQuality < 40 ? 'bg-red-500' : 'bg-blue-500'}`} 
                          style={{ width: `${latestLog.oilQuality}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-950 border border-white/5 p-8 rounded-xl flex flex-col items-center text-center text-gray-500">
                    <Settings2 size={32} className="mb-2 opacity-20" />
                    <p className="text-sm">No telemetry data available for this asset.</p>
                  </div>
                )}

                {latestLog && latestLog.alertTriggered && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-start gap-3 text-sm">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Automated Preventive Maintenance Alert</p>
                      <p className="opacity-80 mt-1">{latestLog.notes}</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
