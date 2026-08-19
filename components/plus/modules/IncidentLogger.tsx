'use client';

import { useState } from 'react';
import { useEnterpriseStore, SecurityIncident } from '@/store/useEnterpriseStore';
import { exportToCSV } from '@/lib/csvUtils';
import {
  AlertTriangle, PlusCircle, CheckCircle2, FileText,
  Truck, ShieldAlert, X, Download, ArrowDownToLine, ArrowUpFromLine
} from 'lucide-react';

const SEVERITY_CONFIG: Record<SecurityIncident['severity'], { label: string; color: string; bg: string; border: string }> = {
  Low:      { label: 'Low',      color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30'   },
  Medium:   { label: 'Medium',   color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30'  },
  High:     { label: 'High',     color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  Critical: { label: 'Critical', color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30'    },
};

export default function IncidentLogger() {
  const { currentUser, incidents, addIncident, updateIncident } = useEnterpriseStore();

  const [isAdding, setIsAdding] = useState(false);
  const [type, setType] = useState<SecurityIncident['type']>('Visitor Pass');
  const [direction, setDirection] = useState<'Inward' | 'Outward'>('Inward');
  const [vehicleNo, setVehicleNo] = useState('');
  const [severity, setSeverity] = useState<SecurityIncident['severity']>('Low');
  const [description, setDescription] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');

  const isGlobalAdmin = currentUser?.role === 'SrijanDev Admin';
  const isHO = currentUser?.role === 'Corporate HO Admin';
  const isSuperAdmin = isGlobalAdmin || isHO;

  const visibleIncidents = incidents.filter(i => {
    const tenantOk = isGlobalAdmin || i.tenantId === currentUser?.tenantId;
    const siteOk = isSuperAdmin || i.siteId === currentUser?.assignedSiteId;
    const typeOk = !filterType || i.type === filterType;
    const sevOk = !filterSeverity || i.severity === filterSeverity;
    return tenantOk && siteOk && typeOk && sevOk;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    addIncident({
      id: `INC-${Math.floor(Math.random() * 90000) + 10000}`,
      tenantId: currentUser?.tenantId || 'GLOBAL',
      siteId: isSuperAdmin ? 'SITE-01' : (currentUser?.assignedSiteId || 'SITE-01'),
      type,
      direction: type === 'Material Pass' ? direction : undefined,
      vehicleNo: type === 'Material Pass' ? vehicleNo : undefined,
      severity,
      description,
      reportedBy: currentUser?.name || 'System',
      timestamp: new Date().toISOString(),
      status: 'Open',
    });

    setDescription('');
    setVehicleNo('');
    setSeverity('Low');
    setDirection('Inward');
    setIsAdding(false);
  };

  const handleExport = () => {
    const rows = visibleIncidents.map(i => ({
      'Incident ID': i.id,
      'Site ID': i.siteId,
      'Type': i.type,
      'Direction': i.direction || '',
      'Vehicle No': i.vehicleNo || '',
      'Severity': i.severity,
      'Description': i.description,
      'Reported By': i.reportedBy,
      'Timestamp': new Date(i.timestamp).toLocaleString(),
      'Status': i.status,
    }));
    exportToCSV('incident_gate_log.csv', rows);
  };

  const getIcon = (t: string) => {
    switch (t) {
      case 'Visitor Pass': return <FileText size={18} className="text-blue-400" />;
      case 'Material Pass': return <Truck size={18} className="text-amber-400" />;
      case 'Security Breach': return <ShieldAlert size={18} className="text-red-500" />;
      case 'Patrol Miss': return <AlertTriangle size={18} className="text-orange-500" />;
      default: return <FileText size={18} />;
    }
  };

  const openCount = visibleIncidents.filter(i => i.status === 'Open').length;
  const criticalCount = visibleIncidents.filter(i => i.severity === 'Critical' && i.status === 'Open').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gate Pass & Incident Logger</h2>
          <p className="text-sm text-gray-400 mt-1">
            <span className="text-amber-400 font-semibold">{openCount} Open</span>
            {criticalCount > 0 && <span className="ml-3 text-red-400 font-semibold animate-pulse">⚠ {criticalCount} Critical</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors shadow-lg shadow-red-500/20"
          >
            <PlusCircle size={15} /> Log Entry
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm border border-white/10 transition-colors">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Severity Stats */}
      <div className="grid grid-cols-4 gap-3">
        {(['Low', 'Medium', 'High', 'Critical'] as SecurityIncident['severity'][]).map(sev => {
          const cfg = SEVERITY_CONFIG[sev];
          const cnt = visibleIncidents.filter(i => i.severity === sev && i.status === 'Open').length;
          return (
            <div key={sev} className={`bg-gray-900 border ${cfg.border} rounded-xl p-4`}>
              <p className={`text-2xl font-bold ${cfg.color}`}>{cnt}</p>
              <p className="text-xs text-gray-500 mt-0.5">{sev} Open</p>
            </div>
          );
        })}
      </div>

      {/* New Entry Form Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">New Entry / Incident Log</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">

              {/* Log Type */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Log Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Visitor Pass', 'Material Pass', 'Security Breach', 'Patrol Miss'] as SecurityIncident['type'][]).map(t => (
                    <button key={t} type="button" onClick={() => setType(t)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-all ${type === t ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                      <span className="mr-1">{t === 'Visitor Pass' ? '👤' : t === 'Material Pass' ? '🚛' : t === 'Security Breach' ? '🚨' : '⚠️'}</span>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Pass fields */}
              {type === 'Material Pass' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Direction</label>
                    <div className="flex rounded-lg overflow-hidden border border-white/10">
                      {(['Inward', 'Outward'] as const).map(d => (
                        <button key={d} type="button" onClick={() => setDirection(d)}
                          className={`flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-medium transition-colors ${direction === d ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400'}`}>
                          {d === 'Inward' ? <ArrowDownToLine size={12} /> : <ArrowUpFromLine size={12} />}
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Vehicle Number</label>
                    <input type="text" value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} placeholder="MH-04-XX-0000" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none uppercase" />
                  </div>
                </div>
              )}

              {/* Severity */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Severity Level</label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High', 'Critical'] as SecurityIncident['severity'][]).map(s => {
                    const cfg = SEVERITY_CONFIG[s];
                    return (
                      <button key={s} type="button" onClick={() => setSeverity(s)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${severity === s ? `${cfg.bg} ${cfg.border} ${cfg.color}` : 'bg-white/5 border-white/10 text-gray-500'}`}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reporter */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Reporting Personnel</label>
                <input type="text" value={currentUser?.name || ''} disabled className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-500 opacity-70 cursor-not-allowed" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Description / Details *</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none resize-none" placeholder="Enter vehicle numbers, visitor names, or incident details..." required />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium">Submit Log</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none">
          <option value="">All Types</option>
          <option>Visitor Pass</option><option>Material Pass</option><option>Security Breach</option><option>Patrol Miss</option>
        </select>
        <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none">
          <option value="">All Severities</option>
          <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
        </select>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {visibleIncidents.map(incident => {
          const sevCfg = SEVERITY_CONFIG[incident.severity];
          return (
            <div key={incident.id} className={`bg-gray-900 border rounded-xl p-5 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${incident.severity === 'Critical' && incident.status === 'Open' ? 'border-red-500/40 shadow-lg shadow-red-500/5' : 'border-white/10'}`}>

              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-gray-950 border border-white/5 rounded-xl shrink-0">
                  {getIcon(incident.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-blue-500 font-semibold">{incident.id}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded border border-white/10 bg-white/5 text-gray-300 uppercase tracking-wider">{incident.type}</span>
                    {incident.direction && (
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium ${incident.direction === 'Inward' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-orange-400 bg-orange-500/10 border-orange-500/20'}`}>
                        {incident.direction === 'Inward' ? <ArrowDownToLine size={10} /> : <ArrowUpFromLine size={10} />}
                        {incident.direction}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded border text-xs font-bold ${sevCfg.bg} ${sevCfg.border} ${sevCfg.color}`}>
                      {sevCfg.label}
                    </span>
                    {isSuperAdmin && <span className="text-xs text-gray-500 font-mono bg-gray-950 px-2 py-0.5 rounded border border-white/5">{incident.siteId}</span>}
                  </div>
                  <p className="text-sm text-white">{incident.description}</p>
                  {incident.vehicleNo && (
                    <p className="text-xs text-amber-400 font-mono mt-1 flex items-center gap-1">
                      <Truck size={11} /> {incident.vehicleNo}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>By: <span className="text-gray-300 font-medium">{incident.reportedBy}</span></span>
                    <span>{new Date(incident.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-950 px-4 py-3 rounded-xl border border-white/5 min-w-[150px] justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${incident.status === 'Resolved' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {incident.status}
                </span>
                {incident.status === 'Open' && (
                  <button
                    onClick={() => updateIncident(incident.id, { status: 'Resolved' })}
                    className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors"
                    title="Mark Resolved"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {visibleIncidents.length === 0 && (
          <div className="text-center py-16 bg-gray-900 border border-white/10 rounded-xl">
            <ShieldAlert size={36} className="mx-auto text-gray-700 mb-3" />
            <p className="text-gray-500 text-sm">No incidents or passes match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
