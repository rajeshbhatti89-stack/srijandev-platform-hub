'use client';

import { useState } from 'react';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { useTenantStore } from '@/store/useTenantStore';
import { Users, PlusCircle, X, Edit2, Trash2, Power, ShieldCheck, Mail, Phone, Building2 } from 'lucide-react';

// Removed static ROLES constant

export default function UserManagement() {
  const { currentUser, users, addUser, updateUser, deleteUser } = useEnterpriseStore();
  const { tenants } = useTenantStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const isSuperAdmin = currentUser?.role === 'SrijanDev Admin';
  const isHO = currentUser?.role === 'Corporate HO Admin';
  const isPSH = currentUser?.role === 'Plant Security Head';

  const allowedRoles = isPSH 
    ? ['Supervisor'] 
    : ['SrijanDev Admin', 'Corporate HO Admin', 'Plant Security Head', 'Supervisor'];

  const [role, setRole] = useState(allowedRoles[0]);
  const [tenantId, setTenantId] = useState(isPSH ? (currentUser?.tenantId || 'GLOBAL') : 'GLOBAL');
  const [assignedSiteId, setAssignedSiteId] = useState(isPSH ? (currentUser?.assignedSiteId || 'GLOBAL') : 'GLOBAL');
  const [contactNo, setContactNo] = useState('');

  if (!isSuperAdmin && !isHO && !isPSH) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center py-20">
        <p className="text-gray-400">You do not have permission to manage users.</p>
      </div>
    );
  }

  const visibleUsers = users.filter(u => {
    if (isSuperAdmin) return true;
    if (isHO) return u.tenantId === currentUser?.tenantId;
    if (isPSH) return u.assignedSiteId === currentUser?.assignedSiteId && u.role === 'Supervisor';
    return false;
  });

  const selectedTenant = tenants.find(t => t.id === tenantId);
  const availableSites = selectedTenant ? selectedTenant.plantSites : [];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateUser(editingId, { name, email, role: role as any, tenantId, assignedSiteId, contactNo });
    } else {
      addUser({
        id: `USER-${Date.now()}`,
        name,
        email,
        role: role as any,
        tenantId,
        assignedSiteId,
        contactNo,
        isActive: true,
      });
    }
    closeForm();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName('');
    setEmail('');
    setRole(allowedRoles[0]);
    setTenantId(isPSH ? (currentUser?.tenantId || 'GLOBAL') : 'GLOBAL');
    setAssignedSiteId(isPSH ? (currentUser?.assignedSiteId || 'GLOBAL') : 'GLOBAL');
    setContactNo('');
  };

  const openEdit = (user: any) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setTenantId(user.tenantId);
    setAssignedSiteId(user.assignedSiteId);
    setContactNo(user.contactNo);
    setShowForm(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users size={22} className="text-blue-400" /> Access Management
          </h2>
          <p className="text-sm text-gray-400 mt-1">Provision and manage platform access</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
          <PlusCircle size={15} /> Provision User
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-400" />
                {editingId ? 'Edit User' : 'Provision New User'}
              </h3>
              <button onClick={closeForm} className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Role</label>
                  <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                    {allowedRoles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Contact No</label>
                  <input type="text" value={contactNo} onChange={e => setContactNo(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
                </div>
              </div>

              {(role === 'Corporate HO Admin' || role === 'Plant Security Head') && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Assign to Tenant</label>
                  <select value={tenantId} onChange={e => setTenantId(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                    <option value="GLOBAL">Select Tenant</option>
                    {tenants.map(t => <option key={t.id} value={t.id}>{t.companyName}</option>)}
                  </select>
                </div>
              )}

              {role === 'Plant Security Head' && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Assign to Plant Site</label>
                  <select value={assignedSiteId} onChange={e => setAssignedSiteId(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                    <option value="GLOBAL">Select Site</option>
                    {availableSites.map(s => <option key={s.id} value={s.id}>{s.name} ({s.location})</option>)}
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeForm} className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors">
                  {editingId ? 'Save Changes' : 'Provision User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-950 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-400">User</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400">Role</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400">Tenant / Site</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visibleUsers.map(u => {
                const tName = tenants.find(t => t.id === u.tenantId)?.companyName || 'Global';
                const sName = tenants.flatMap(t => t.plantSites).find(s => s.id === u.assignedSiteId)?.name || 'Global';

                return (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{u.name}</span>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Mail size={12} /> {u.email}</span>
                          <span className="flex items-center gap-1"><Phone size={12} /> {u.contactNo}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{u.role}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-gray-300 flex items-center gap-1.5"><Building2 size={12} className="text-blue-400" /> {tName}</span>
                        {u.assignedSiteId !== 'GLOBAL' && (
                          <span className="text-xs text-gray-500 mt-1">📍 {sName}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${u.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(u)} className="p-1.5 text-gray-400 hover:text-white rounded bg-white/5 hover:bg-white/10 transition-colors" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        {u.id !== currentUser?.id && (
                          <button onClick={() => updateUser(u.id, { isActive: !u.isActive })} className="p-1.5 text-gray-400 hover:text-amber-400 rounded bg-white/5 hover:bg-white/10 transition-colors" title={u.isActive ? "Deactivate" : "Activate"}>
                            <Power size={14} />
                          </button>
                        )}
                        {u.id !== currentUser?.id && (
                          <button onClick={() => { if (confirm('Delete this user?')) deleteUser(u.id); }} className="p-1.5 text-gray-400 hover:text-red-400 rounded bg-white/5 hover:bg-white/10 transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
