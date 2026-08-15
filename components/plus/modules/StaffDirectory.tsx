'use client';

import { useState, useRef } from 'react';
import { useEnterpriseStore, Guard } from '@/store/useEnterpriseStore';
import { exportGuards, parseCSV } from '@/lib/csvUtils';
import {
  Users, Trash2, Edit2, UserPlus, ShieldAlert, AlertTriangle,
  Download, Upload, X, CheckCircle, Phone, MapPin, RotateCcw
} from 'lucide-react';

const POSTS = ['Main Gate 1', 'Main Gate 2', 'Weighbridge', 'Admin Block', 'Material Gate', 'Control Room', 'Perimeter', 'Pump House', 'Material Yard', 'Cash Room'];

const statusConfig: Record<Guard['status'], { label: string; color: string; dot: string }> = {
  'On Duty':  { label: 'On Duty',   color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
  'Standby':  { label: 'Standby',   color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',        dot: 'bg-blue-400' },
  'On Leave': { label: 'On Leave',  color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',     dot: 'bg-amber-400'  },
  'Relieved': { label: 'Relieved',  color: 'text-red-400 bg-red-500/10 border-red-500/20',           dot: 'bg-red-400'    },
};

const desigColors: Record<string, string> = {
  'Guard':          'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Armed Guard':    'text-red-400 bg-red-500/10 border-red-500/20',
  'Supervisor':     'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Patrol Officer': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

type FormData = {
  name: string;
  phone: string;
  designation: Guard['designation'];
  assignedPost: string;
  shift: Guard['shift'];
  assignedSiteId: string;
  status: Guard['status'];
};

const EMPTY_FORM: FormData = {
  name: '', phone: '', designation: 'Guard',
  assignedPost: '', shift: 'Morning', assignedSiteId: 'SITE-01', status: 'On Duty',
};

export default function StaffDirectory() {
  const { currentUser, guards, sites, deleteGuard, clearRosterData, addGuard, updateGuard } = useEnterpriseStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [searchQ, setSearchQ] = useState('');
  const [filterDesig, setFilterDesig] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [importMsg, setImportMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const isSuperAdmin = currentUser?.role === 'SrijanDev Admin' || currentUser?.role === 'Corporate HO Admin';

  const visibleGuards = guards.filter(g => {
    const siteOk = isSuperAdmin || g.assignedSiteId === currentUser?.assignedSiteId;
    const searchOk = !searchQ || g.name.toLowerCase().includes(searchQ.toLowerCase()) || g.personnelId.toLowerCase().includes(searchQ.toLowerCase()) || g.assignedPost.toLowerCase().includes(searchQ.toLowerCase());
    const desigOk = !filterDesig || g.designation === filterDesig;
    const statusOk = !filterStatus || g.status === filterStatus;
    return siteOk && searchOk && desigOk && statusOk;
  });

  const resetForm = () => { setForm(EMPTY_FORM); setShowForm(false); setEditingId(null); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.assignedPost.trim()) return;
    if (editingId) {
      updateGuard(editingId, { ...form });
    } else {
      const newId = `GRD-${Math.floor(Math.random() * 9000) + 1000}`;
      const newPId = `P-${Math.floor(Math.random() * 900) + 100}`;
      const newGCode = `GC-${Math.floor(Math.random() * 900) + 100}`;
      addGuard({ id: newId, personnelId: newPId, guardCode: newGCode, ...form, lastCheckIn: undefined });
    }
    resetForm();
  };

  const handleEdit = (g: Guard) => {
    setForm({ name: g.name, phone: g.phone, designation: g.designation, assignedPost: g.assignedPost, shift: g.shift, assignedSiteId: g.assignedSiteId, status: g.status });
    setEditingId(g.id);
    setShowForm(true);
  };

  const handleTerminate = (g: Guard) => {
    if (confirm(`⚠️ Terminate ${g.name} (${g.personnelId})?\n\nThis will remove them from all active rosters immediately.`)) {
      deleteGuard(g.id);
    }
  };

  const handleClearAll = () => {
    const scope = isSuperAdmin ? 'GLOBAL' : currentUser?.assignedSiteId;
    if (confirm(`🚨 CRITICAL: Clear ALL roster data for ${isSuperAdmin ? 'ALL SITES' : scope}?\n\nThis cannot be undone.`)) {
      clearRosterData(scope);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseCSV(file);
      let imported = 0;
      rows.forEach((row: any) => {
        if (!row['Full Name']) return;
        addGuard({
          id: `GRD-${Math.floor(Math.random() * 9000) + 1000}`,
          personnelId: row['Personnel ID'] || `P-${Math.floor(Math.random() * 900) + 100}`,
          guardCode: `GC-${Math.floor(Math.random() * 900) + 100}`,
          name: row['Full Name'] || '',
          phone: row['Phone'] || '',
          designation: (['Guard', 'Armed Guard', 'Supervisor', 'Patrol Officer'].includes(row['Designation']) ? row['Designation'] : 'Guard') as Guard['designation'],
          assignedSiteId: row['Site ID'] || currentUser?.assignedSiteId || 'SITE-01',
          assignedPost: row['Assigned Post'] || '',
          shift: (['Morning', 'Evening', 'Night'].includes(row['Shift']) ? row['Shift'] : 'Morning') as Guard['shift'],
          status: (['On Duty', 'Standby', 'On Leave', 'Relieved'].includes(row['Status']) ? row['Status'] : 'On Duty') as Guard['status'],
        });
        imported++;
      });
      setImportMsg(`✓ Imported ${imported} personnel records.`);
      setTimeout(() => setImportMsg(''), 4000);
    } catch {
      setImportMsg('✗ Import failed. Check CSV format.');
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Staff Directory & Personnel Master</h2>
          <p className="text-sm text-gray-400 mt-1">
            {visibleGuards.length} of {guards.length} personnel shown
            {currentUser?.role === 'Plant Security Head' && ` · ${currentUser.assignedSiteId}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
            <UserPlus size={15} /> Add Personnel
          </button>
          <button onClick={() => exportGuards(visibleGuards)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm border border-white/10 transition-colors">
            <Download size={15} /> Export CSV
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm border border-white/10 transition-colors">
            <Upload size={15} /> Import CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
          <button onClick={handleClearAll} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm transition-colors">
            <RotateCcw size={15} /> Clear Roster
          </button>
        </div>
      </div>

      {importMsg && (
        <div className={`px-4 py-3 rounded-lg text-sm border ${importMsg.startsWith('✓') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {importMsg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name, ID, post..."
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          className="flex-1 min-w-[200px] bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
        />
        <select value={filterDesig} onChange={e => setFilterDesig(e.target.value)} className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none">
          <option value="">All Designations</option>
          <option>Guard</option><option>Armed Guard</option><option>Supervisor</option><option>Patrol Officer</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none">
          <option value="">All Statuses</option>
          <option>Active</option><option>On Leave</option><option>Relieved</option>
        </select>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-6 w-full max-w-2xl shadow-2xl shadow-blue-500/10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus size={18} className="text-blue-400" />
                {editingId ? 'Edit Personnel Record' : 'Register New Personnel'}
              </h3>
              <button onClick={resetForm} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'e.g. Rajesh Kumar' },
                { label: 'Phone Number', key: 'phone', type: 'text', placeholder: '+91 9XXXXXXXXX' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
                    required={f.label.includes('*')}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Designation</label>
                <select value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value as Guard['designation'] }))} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none">
                  <option>Guard</option><option>Armed Guard</option><option>Supervisor</option><option>Patrol Officer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Assigned Post / Gate *</label>
                <select value={form.assignedPost} onChange={e => setForm(p => ({ ...p, assignedPost: e.target.value }))} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" required>
                  <option value="">Select post...</option>
                  {POSTS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Standard Shift</label>
                <select value={form.shift} onChange={e => setForm(p => ({ ...p, shift: e.target.value as Guard['shift'] }))} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none">
                  <option value="Morning">Morning (06:00 – 14:00)</option>
                  <option value="Evening">Evening (14:00 – 22:00)</option>
                  <option value="Night">Night  (22:00 – 06:00)</option>
                </select>
              </div>
              {isSuperAdmin && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Assign Plant/Site</label>
                  <select value={form.assignedSiteId} onChange={e => setForm(p => ({ ...p, assignedSiteId: e.target.value }))} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none">
                    {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}
              {editingId && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Guard['status'] }))} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none">
                    <option>Active</option><option>On Leave</option><option>Relieved</option>
                  </select>
                </div>
              )}
              <div className="md:col-span-2 flex justify-end gap-3 pt-2 border-t border-white/5 mt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors flex items-center gap-2">
                  <CheckCircle size={15} /> {editingId ? 'Update Record' : 'Save Personnel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-950/60 text-gray-500 border-b border-white/10 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Personnel</th>
                <th className="px-5 py-3.5">Designation</th>
                <th className="px-5 py-3.5">Deployment</th>
                <th className="px-5 py-3.5">Shift</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visibleGuards.map(guard => {
                const sc = statusConfig[guard.status];
                return (
                  <tr key={guard.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-bold text-white text-sm shrink-0">
                          {guard.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{guard.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-blue-400">{guard.personnelId}</span>
                            {guard.phone && (
                              <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                <Phone size={9} />{guard.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${desigColors[guard.designation]}`}>
                        {guard.designation === 'Armed Guard' && <ShieldAlert size={10} />}
                        {guard.designation}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <MapPin size={13} className="text-gray-500 shrink-0" />
                        <span>{guard.assignedPost}</span>
                      </div>
                      {isSuperAdmin && <p className="text-[10px] font-mono text-gray-600 mt-0.5 ml-5">{guard.assignedSiteId}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-gray-300">
                        {guard.shift}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(guard)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors" title="Edit Record">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleTerminate(guard)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors" title="Terminate / Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {visibleGuards.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Users size={36} className="mx-auto mb-3 text-gray-700" />
                    <p className="text-gray-500 text-sm">No personnel match your filters.</p>
                    <button onClick={() => { setSearchQ(''); setFilterDesig(''); setFilterStatus(''); }} className="mt-3 text-xs text-blue-400 hover:text-blue-300 underline">Clear filters</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(['Active', 'On Leave', 'Relieved'] as Guard['status'][]).map(s => {
          const count = visibleGuards.filter(g => g.status === s).length;
          const sc = statusConfig[s];
          return (
            <div key={s} className="bg-gray-900 border border-white/10 rounded-xl p-4 flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${sc.dot}`} />
              <div>
                <p className="text-xl font-bold text-white">{count}</p>
                <p className="text-xs text-gray-500">{s}</p>
              </div>
            </div>
          );
        })}
        <div className="bg-gray-900 border border-white/10 rounded-xl p-4 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
          <div>
            <p className="text-xl font-bold text-white">{visibleGuards.length}</p>
            <p className="text-xs text-gray-500">Total Visible</p>
          </div>
        </div>
      </div>
    </div>
  );
}
