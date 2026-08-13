'use client';

import { useState } from 'react';
import { useEnterpriseStore, FleetAsset } from '@/store/useEnterpriseStore';
import { exportToCSV } from '@/lib/csvUtils';
import { Plus, Download, Edit2, Trash2 } from 'lucide-react';

export default function FleetRegistry() {
  const { fleet, addAsset, updateAsset, deleteAsset } = useEnterpriseStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<FleetAsset>>({ status: 'Active' });

  const handleExport = () => {
    exportToCSV('fleet_registry.csv', fleet);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.id || !newAsset.name) return;
    addAsset(newAsset as FleetAsset);
    setIsAdding(false);
    setNewAsset({ status: 'Active' });
  };

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
          <h2 className="text-2xl font-bold text-white">Plant & Fleet Registry</h2>
          <p className="text-sm text-gray-400">Manage heavy machinery, telemetry, and status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors shadow-lg shadow-amber-500/20"
          >
            <Plus size={16} /> Add Asset
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-gray-900 border border-white/10 rounded-xl p-5 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-amber-500">Register New Asset</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Telemetry ID (e.g. EQ-003)"
              className="bg-gray-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              value={newAsset.id || ''}
              onChange={(e) => setNewAsset({ ...newAsset, id: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Asset Name"
              className="bg-gray-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              value={newAsset.name || ''}
              onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Type (e.g. Dozer)"
              className="bg-gray-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              value={newAsset.type || ''}
              onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
              required
            />
            <select
              className="bg-gray-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              value={newAsset.status || 'Active'}
              onChange={(e) => setNewAsset({ ...newAsset, status: e.target.value as FleetAsset['status'] })}
            >
              <option value="Active">Active</option>
              <option value="Standby">Standby</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Breakdown">Breakdown</option>
            </select>
            <input
              type="number"
              placeholder="Running Hours"
              className="bg-gray-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              value={newAsset.runningHours || ''}
              onChange={(e) => setNewAsset({ ...newAsset, runningHours: Number(e.target.value) })}
              required
            />
            <input
              type="number"
              placeholder="Fuel Rate (L/hr)"
              className="bg-gray-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              value={newAsset.fuelRate || ''}
              onChange={(e) => setNewAsset({ ...newAsset, fuelRate: Number(e.target.value) })}
              required
            />
            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-lg bg-transparent text-gray-400 hover:text-white text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium"
              >
                Save Asset
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-gray-900/50">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="text-xs uppercase bg-gray-950/50 text-gray-400 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Asset Name</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Running Hrs</th>
              <th className="px-6 py-4 font-semibold">Fuel (L/hr)</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fleet.map((asset) => (
              <tr key={asset.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-amber-500">{asset.id}</td>
                <td className="px-6 py-4 font-medium text-white">{asset.name}</td>
                <td className="px-6 py-4">{asset.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono">{asset.runningHours.toLocaleString()} h</td>
                <td className="px-6 py-4 font-mono">{asset.fuelRate}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-gray-400 hover:text-white transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => deleteAsset(asset.id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 transition-colors ml-2" 
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {fleet.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No assets registered. Add an asset to begin tracking.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
