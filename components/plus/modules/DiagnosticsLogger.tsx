'use client';

import { useState } from 'react';
import { useEnterpriseStore, DiagnosticLog } from '@/store/useEnterpriseStore';
import { exportToCSV } from '@/lib/csvUtils';
import { Download, AlertTriangle, Activity, PenTool } from 'lucide-react';

export default function DiagnosticsLogger() {
  const { diagnostics, fleet, addLog } = useEnterpriseStore();
  const [newLog, setNewLog] = useState<Partial<DiagnosticLog>>({
    vibrationLevel: 0,
    oilQuality: 100,
  });

  const handleExport = () => {
    exportToCSV('diagnostic_logs.csv', diagnostics);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.assetId) return;

    // Threshold logic
    const isAlert = (newLog.vibrationLevel || 0) > 8.5 || (newLog.oilQuality || 100) < 40;

    const logEntry: DiagnosticLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      assetId: newLog.assetId,
      timestamp: new Date().toISOString(),
      vibrationLevel: newLog.vibrationLevel || 0,
      oilQuality: newLog.oilQuality || 100,
      alertTriggered: isAlert,
      notes: newLog.notes || 'Routine check',
    };

    addLog(logEntry);
    setNewLog({ assetId: '', vibrationLevel: 0, oilQuality: 100, notes: '' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Condition-Based Maintenance (CBM)</h2>
          <p className="text-sm text-gray-400">Log diagnostics, monitor thresholds, and trigger alerts.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium transition-colors"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Col: Entry Form */}
        <div className="bg-gray-900 border border-white/10 rounded-xl p-6 h-fit">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg">
              <PenTool size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">New Reading</h3>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Target Asset</label>
              <select
                className="w-full bg-gray-950 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                value={newLog.assetId || ''}
                onChange={(e) => setNewLog({ ...newLog, assetId: e.target.value })}
                required
              >
                <option value="" disabled>Select Asset</option>
                {fleet.map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.id} - {asset.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Vibration Level (mm/s) <span className="text-orange-500 ml-1">Threshold: 8.5</span>
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full bg-gray-950 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                value={newLog.vibrationLevel}
                onChange={(e) => setNewLog({ ...newLog, vibrationLevel: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Oil Quality Index (%) <span className="text-orange-500 ml-1">Threshold: {'<'} 40</span>
              </label>
              <input
                type="number"
                min="0" max="100"
                className="w-full bg-gray-950 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                value={newLog.oilQuality}
                onChange={(e) => setNewLog({ ...newLog, oilQuality: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Diagnostic Notes</label>
              <textarea
                rows={3}
                className="w-full bg-gray-950 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 resize-none"
                placeholder="Observed conditions..."
                value={newLog.notes || ''}
                onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={fleet.length === 0}
              className="w-full mt-4 px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-medium shadow-lg shadow-orange-500/20 transition-all"
            >
              Log Diagnostic Reading
            </button>
            {fleet.length === 0 && (
              <p className="text-xs text-red-400 text-center mt-2">Add assets in Plant & Fleet first.</p>
            )}
          </form>
        </div>

        {/* Right Col: Timeline/Logs */}
        <div className="lg:col-span-2 bg-gray-900 border border-white/10 rounded-xl overflow-hidden flex flex-col h-fit max-h-[700px]">
          <div className="p-6 border-b border-white/10 bg-gray-950/50">
            <h3 className="text-lg font-semibold text-white">Diagnostic History</h3>
          </div>
          
          <div className="p-6 overflow-y-auto space-y-4">
            {diagnostics.length === 0 ? (
              <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                <Activity size={32} className="mb-3 opacity-20" />
                <p>No diagnostics logged yet.</p>
              </div>
            ) : (
              diagnostics.map((log) => (
                <div 
                  key={log.id} 
                  className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
                    log.alertTriggered 
                      ? 'bg-red-500/5 border-red-500/30' 
                      : 'bg-gray-950/50 border-white/5'
                  }`}
                >
                  {log.alertTriggered && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                  )}
                  <div className="flex justify-between items-start mb-2 pl-2">
                    <div>
                      <span className="text-xs font-mono text-gray-500 mr-2">{log.id}</span>
                      <span className="text-sm font-semibold text-white">{log.assetId}</span>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3 pl-2">
                    <div>
                      <p className="text-xs text-gray-500">Vibration</p>
                      <p className={`text-sm font-mono ${log.vibrationLevel > 8.5 ? 'text-red-400 font-bold' : 'text-gray-300'}`}>
                        {log.vibrationLevel} mm/s
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Oil Quality</p>
                      <p className={`text-sm font-mono ${log.oilQuality < 40 ? 'text-red-400 font-bold' : 'text-gray-300'}`}>
                        {log.oilQuality}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 pl-2">
                    <p className="text-sm text-gray-400">{log.notes}</p>
                  </div>
                  
                  {log.alertTriggered && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg w-fit ml-2">
                      <AlertTriangle size={14} /> Critical Threshold Exceeded
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
