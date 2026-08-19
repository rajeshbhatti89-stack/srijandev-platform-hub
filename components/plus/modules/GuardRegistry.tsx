'use client';

import { useState } from 'react';
import { useEnterpriseStore, Guard } from '@/store/useEnterpriseStore';
import { Users, Trash2, Edit2, UserPlus, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function GuardRegistry() {
  const { currentUser, guards, deleteGuard, clearRosterData, addGuard, updateGuard } = useEnterpriseStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState<Guard['designation']>('Guard');
  const [assignedPost, setAssignedPost] = useState('');
  const [shift, setShift] = useState<Guard['shift']>('Morning');

  const isGlobalAdmin = currentUser?.role === 'SrijanDev Admin';
  const isHO = currentUser?.role === 'Corporate HO Admin';
  const isSuperAdmin = isGlobalAdmin || isHO;

  // Filter guards by the current user's site, unless it's Super Admin
  const visibleGuards = guards.filter(g => {
    const tenantOk = isGlobalAdmin || g.tenantId === currentUser?.tenantId;
    const siteOk = isSuperAdmin || g.assignedSiteId === currentUser?.assignedSiteId;
    return tenantOk && siteOk;
  });

  const handleClearAll = () => {
    if (confirm('CRITICAL WARNING: Are you sure you want to nuke the entire roster? This cannot be undone.')) {
      clearRosterData(currentUser?.assignedSiteId);
    }
  };

  const resetForm = () => {
    setName('');
    setDesignation('Guard');
    setAssignedPost('');
    setShift('Morning');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !assignedPost) return;

    if (editingId) {
      updateGuard(editingId, { name, designation, assignedPost, shift });
    } else {
      addGuard({
        id: `GRD-${Math.floor(Math.random() * 9000) + 1000}`,
        personnelId: `P-${Math.floor(Math.random() * 900) + 100}`,
        guardCode: `GC-${Math.floor(Math.random() * 900) + 100}`,
        name,
        phone: '',
        designation,
        tenantId: currentUser?.tenantId || 'GLOBAL',
        assignedSiteId: isSuperAdmin ? 'SITE-01' : (currentUser?.assignedSiteId || 'SITE-01'),
        assignedPost,
        shift,
        status: 'On Duty'
      });
    }
    resetForm();
  };

  const handleEdit = (guard: Guard) => {
    setName(guard.name);
    setDesignation(guard.designation);
    setAssignedPost(guard.assignedPost);
    setShift(guard.shift);
    setEditingId(guard.id);
    setIsAdding(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Guard & Supervisor Registry</h2>
          <p className="text-sm text-gray-400">Master database of all security personnel deployed at the plant.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            <UserPlus size={16} /> Register Guard
          </button>
          
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-colors"
          >
            <AlertTriangle size={16} /> CLEAR ALL ROSTER DATA
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-gray-900 border border-blue-500/30 rounded-xl p-5 mb-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-4">{editingId ? 'Edit Guard Profile' : 'Register New Guard'}</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Designation</label>
              <select value={designation} onChange={e => setDesignation(e.target.value as Guard['designation'])} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                <option value="Guard">Guard</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Armed Guard">Armed Guard</option>
                <option value="Patrol Officer">Patrol Officer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Assigned Post/Gate</label>
              <input type="text" value={assignedPost} onChange={e => setAssignedPost(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="e.g. Main Gate 1" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Standard Shift</label>
              <select value={shift} onChange={e => setShift(e.target.value as Guard['shift'])} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                <option value="Morning">Morning (06:00 - 14:00)</option>
                <option value="Evening">Evening (14:00 - 22:00)</option>
                <option value="Night">Night (22:00 - 06:00)</option>
              </select>
            </div>
            <div className="md:col-span-4 flex justify-end gap-3 mt-2">
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">Save Guard Record</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-950/50 text-gray-400 border-b border-white/10 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Guard ID</th>
                <th className="px-6 py-4">Personnel Details</th>
                <th className="px-6 py-4">Current Deployment</th>
                <th className="px-6 py-4">Shift</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visibleGuards.map(guard => (
                <tr key={guard.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-blue-400 font-semibold">{guard.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-400 text-xs">
                        {guard.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{guard.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          {guard.designation === 'Armed Guard' && <ShieldAlert size={12} className="text-red-400" />}
                          <p className="text-xs text-gray-500 font-mono tracking-wide">{guard.designation}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-300">{guard.assignedPost}</p>
                    {(currentUser?.role === 'SrijanDev Admin' || currentUser?.role === 'Corporate HO Admin') && (
                      <p className="text-xs text-gray-500 font-mono mt-1">{guard.assignedSiteId}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/5 border border-white/10">
                      {guard.shift}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(guard)}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" 
                        title="Edit Record"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm(`Delete guard ${guard.name}?`)) deleteGuard(guard.id);
                        }}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" 
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleGuards.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Users size={32} className="mx-auto mb-3 opacity-20" />
                    <p>No security personnel found in the roster.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
