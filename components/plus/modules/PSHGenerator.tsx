'use client';

import { useState } from 'react';
import { useEnterpriseStore, UserAccount, Site } from '@/store/useEnterpriseStore';
import { KeyRound, UserPlus, ShieldAlert, CheckCircle2 } from 'lucide-react';

import { useTenantStore } from '@/store/useTenantStore';

export default function PSHGenerator() {
  const { users, addUser, updateUser, deleteUser } = useEnterpriseStore();
  const { tenants } = useTenantStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [assignedSiteId, setAssignedSiteId] = useState('');

  const pshAccounts = users.filter(u => u.role === 'Plant Security Head');
  
  const selectedTenant = tenants.find(t => t.id === tenantId);
  const availableSites = selectedTenant ? selectedTenant.plantSites : [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !contactNo || !assignedSiteId || !tenantId) return;

    const newPSH: UserAccount = {
      id: `PSH-${Math.floor(Math.random() * 1000)}`,
      name,
      email,
      role: 'Plant Security Head',
      tenantId,
      assignedSiteId,
      contactNo,
      isActive: true,
    };

    addUser(newPSH);
    setName('');
    setEmail('');
    setContactNo('');
    setTenantId('');
    setAssignedSiteId('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">PSH Account Generator</h2>
          <p className="text-sm text-gray-400">Super Admin access. Provision and manage Plant Security Heads.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Form */}
        <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <UserPlus size={18} className="text-blue-500" />
            Provision New PSH
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Contact Number</label>
              <input type="text" value={contactNo} onChange={e => setContactNo(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Assign to Tenant / Client</label>
              <select value={tenantId} onChange={e => { setTenantId(e.target.value); setAssignedSiteId(''); }} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" required>
                <option value="" disabled>Select a tenant...</option>
                {tenants.map(t => <option key={t.id} value={t.id}>{t.companyName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Assign Plant/Site</label>
              <select value={assignedSiteId} onChange={e => setAssignedSiteId(e.target.value)} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" required disabled={!tenantId}>
                <option value="" disabled>Select a site...</option>
                {availableSites.map(s => <option key={s.id} value={s.id}>{s.name} ({s.location})</option>)}
              </select>
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors mt-2">
              Generate PSH Credentials
            </button>
          </form>
        </div>

        {/* PSH Registry */}
        <div className="lg:col-span-2 bg-gray-900 border border-white/10 rounded-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/10 bg-gray-950/50">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <KeyRound size={18} className="text-emerald-500" />
              Active PSH Registry
            </h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-950/30 text-gray-400 border-b border-white/5 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3">PSH Account</th>
                  <th className="px-5 py-3">Assigned Site</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pshAccounts.map(psh => {
                  const t = tenants.find(t => t.id === psh.tenantId);
                  const site = t?.plantSites.find(s => s.id === psh.assignedSiteId);
                  return (
                    <tr key={psh.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-white">{psh.name}</p>
                        <p className="text-xs text-gray-500">{psh.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-400 mb-1">{t?.companyName}</p>
                        <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">{psh.assignedSiteId}</span>
                        <p className="text-xs text-gray-500 mt-1">{site?.name}</p>
                      </td>
                      <td className="px-5 py-4">
                        {psh.isActive ? (
                          <span className="flex items-center gap-1.5 text-xs text-emerald-400"><CheckCircle2 size={14}/> Active</span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-red-400"><ShieldAlert size={14}/> Suspended</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        <button 
                          onClick={() => updateUser(psh.id, { isActive: !psh.isActive })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${psh.isActive ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'}`}
                        >
                          {psh.isActive ? 'Suspend' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => deleteUser(psh.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {pshAccounts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-gray-500">No PSH accounts exist.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
