'use client';

import React from 'react';
import { MapPin, Navigation, Wifi, Battery, Clock } from 'lucide-react';

const agents = [
  { name: 'Arjun Sharma', zone: 'Sector 22, Noida', x: 62, y: 38, status: 'on-duty', battery: 84, signal: 4 },
  { name: 'Priya Verma', zone: 'MG Road, Gurugram', x: 28, y: 58, status: 'on-duty', battery: 62, signal: 3 },
  { name: 'Ravi Kumar', zone: 'Connaught Place', x: 48, y: 44, status: 'on-duty', battery: 91, signal: 4 },
  { name: 'Mohit Singh', zone: 'Rohini West', x: 35, y: 28, status: 'off-duty', battery: 23, signal: 2 },
  { name: 'Kavita Nair', zone: 'Sector 4, Dwarka', x: 22, y: 50, status: 'on-duty', battery: 77, signal: 4 },
  { name: 'Suresh Yadav', zone: 'Lajpat Nagar', x: 55, y: 55, status: 'on-duty', battery: 55, signal: 3 },
];

export const PulseGPSView: React.FC = () => {
  const [selected, setSelected] = React.useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-white">Live GPS Tracking</h2>
        <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>Real-time agent locations • Updates every 30s</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Area */}
        <div className="lg:col-span-2 rounded-2xl border border-emerald-900/30 overflow-hidden relative" style={{ background: '#020d0a', minHeight: '420px' }}>
          {/* Grid overlay to mimic map */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
          {/* Zone rings */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-emerald-500/10" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-emerald-500/5" />

          {/* Map label */}
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 text-[10px] text-emerald-400 font-mono border border-emerald-900/40">
            NCR REGION • 28.6°N 77.2°E
          </div>

          {/* Agent pins */}
          {agents.map((agent, i) => (
            <button
              key={i}
              onClick={() => setSelected(selected === i ? null : i)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
            >
              <div className="relative">
                {agent.status === 'on-duty' && (
                  <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping scale-150" />
                )}
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-white text-[10px] font-bold shadow-lg ${
                  agent.status === 'on-duty'
                    ? 'bg-emerald-500 border-emerald-300'
                    : 'bg-slate-700 border-slate-500'
                }`}>
                  {agent.name.charAt(0)}
                </div>
                {selected === i && (
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 p-2 rounded-xl bg-black/90 border border-emerald-500/30 text-left z-10 pointer-events-none">
                    <div className="text-white text-[11px] font-bold">{agent.name}</div>
                    <div className="text-emerald-400 text-[10px]">{agent.zone}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Battery className="w-3 h-3 text-slate-400" />
                      <span className="text-[9px] text-slate-400">{agent.battery}%</span>
                      <Wifi className="w-3 h-3 text-slate-400" />
                      <span className="text-[9px] text-slate-400">{agent.signal}/4</span>
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* Legend */}
          <div className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/70 border border-emerald-900/40 text-[9px] space-y-1">
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-emerald-400">On Duty</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-600" />
              <span className="text-slate-400">Off Duty</span>
            </div>
          </div>
        </div>

        {/* Agent list panel */}
        <div className="rounded-2xl border border-emerald-900/30 p-4 overflow-y-auto space-y-2" style={{ background: '#020d0a', maxHeight: '420px' }}>
          <h3 className="text-sm font-bold text-white mb-3">Agent Status</h3>
          {agents.map((agent, i) => (
            <button
              key={i}
              onClick={() => setSelected(selected === i ? null : i)}
              className={`w-full p-3 rounded-xl border text-left transition-all ${
                selected === i
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-white/5 hover:border-emerald-900/60 hover:bg-white/3'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                  agent.status === 'on-duty' ? 'bg-emerald-600' : 'bg-slate-700'
                }`}>
                  {agent.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{agent.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{agent.zone}</div>
                </div>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${agent.status === 'on-duty' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              </div>
              <div className="flex items-center space-x-3 mt-2 text-[9px] text-slate-600">
                <span className="flex items-center space-x-0.5">
                  <Battery className="w-3 h-3" /><span>{agent.battery}%</span>
                </span>
                <span className="flex items-center space-x-0.5">
                  <Navigation className="w-3 h-3" /><span>GPS Active</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
