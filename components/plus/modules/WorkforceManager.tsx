'use client';

import { useState } from 'react';
import { useEnterpriseStore, Worker } from '@/store/useEnterpriseStore';
import { exportToCSV } from '@/lib/csvUtils';
import { Plus, Download, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export default function WorkforceManager() {
  const { workforce, addWorker, updateWorker, deleteWorker } = useEnterpriseStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newWorker, setNewWorker] = useState<Partial<Worker>>({ role: 'Operator', shift: 'Morning', isPresent: true });

  const handleExport = () => {
    exportToCSV('workforce_roster.csv', workforce);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorker.id || !newWorker.name) return;
    addWorker(newWorker as Worker);
    setIsAdding(false);
    setNewWorker({ role: 'Operator', shift: 'Morning', isPresent: true });
  };

  const toggleAttendance = (id: string, current: boolean) => {
    updateWorker(id, { isPresent: !current });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Workforce & Attendance</h2>
          <p className="text-sm text-gray-400">Manage shift rosters, roles, and real-time site attendance.</p>
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Plus size={16} /> Add Personnel
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-gray-900 border border-white/10 rounded-xl p-5 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-emerald-500">Register New Personnel</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Worker ID (e.g. WK-105)"
              className="bg-gray-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              value={newWorker.id || ''}
              onChange={(e) => setNewWorker({ ...newWorker, id: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Full Name"
              className="bg-gray-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              value={newWorker.name || ''}
              onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
              required
            />
            <select
              className="bg-gray-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              value={newWorker.role || 'Operator'}
              onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value as Worker['role'] })}
            >
              <option value="Operator">Operator</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Supervision">Supervision</option>
            </select>
            <select
              className="bg-gray-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              value={newWorker.shift || 'Morning'}
              onChange={(e) => setNewWorker({ ...newWorker, shift: e.target.value as Worker['shift'] })}
            >
              <option value="Morning">Morning Shift</option>
              <option value="Evening">Evening Shift</option>
              <option value="Night">Night Shift</option>
            </select>
            <input
              type="text"
              placeholder="Contact Number"
              className="bg-gray-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 lg:col-span-2"
              value={newWorker.contact || ''}
              onChange={(e) => setNewWorker({ ...newWorker, contact: e.target.value })}
              required
            />
            
            <div className="lg:col-span-4 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-lg bg-transparent text-gray-400 hover:text-white text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium"
              >
                Save Personnel
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
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Shift</th>
              <th className="px-6 py-4 font-semibold">Contact</th>
              <th className="px-6 py-4 font-semibold">Attendance</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workforce.map((worker) => (
              <tr key={worker.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-emerald-500">{worker.id}</td>
                <td className="px-6 py-4 font-medium text-white">{worker.name}</td>
                <td className="px-6 py-4">{worker.role}</td>
                <td className="px-6 py-4">{worker.shift}</td>
                <td className="px-6 py-4 font-mono text-gray-400">{worker.contact}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleAttendance(worker.id, worker.isPresent)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                      worker.isPresent 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30'
                    }`}
                  >
                    {worker.isPresent ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {worker.isPresent ? 'Present' : 'Absent'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => deleteWorker(worker.id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 transition-colors" 
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {workforce.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No personnel found. Add personnel to manage shifts.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
