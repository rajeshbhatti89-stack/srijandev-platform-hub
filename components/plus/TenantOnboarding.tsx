'use client';

import { useState } from 'react';
import { useTenantStore, Tenant, TenantModule, PlantSite } from '@/store/useTenantStore';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import {
  Building2, PlusCircle, X, Edit2, Power, Trash2,
  Globe, CheckCircle2, AlertCircle, Settings, Link2
} from 'lucide-react';

const ALL_MODULES: { id: TenantModule; label: string }[] = [
  { id: 'staff',        label: 'Staff Directory'    },
  { id: 'patrol',       label: 'Patrol Tour Engine' },
  { id: 'shifts',       label: 'Shift Scheduler'    },
  { id: 'leaves',       label: 'Leave Approvals'    },
  { id: 'tasks',        label: 'Task Dispatch'       },
  { id: 'gatepass',     label: 'Gate Pass / Incidents' },
  { id: 'geofence',     label: 'Geofence Manager'   },
  { id: 'gatelogistics',label: 'Gate Logistics'     },
  { id: 'hodashboard',  label: 'HO Dashboard'       },
];

const emptyTenant = (): Omit<Tenant, 'id' | 'createdAt'> => ({
  companyName: '',
  subdomain: '',
  logoUrl: '',
  primaryColor: '#3b82f6',
  assignedModules: ['staff', 'leaves', 'tasks'],
  plantSites: [],
  isActive: true,
});

export default function TenantOnboarding() {
  const { currentUser } = useEnterpriseStore();
  const { tenants, addTenant, updateTenant, deleteTenant } = useTenantStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyTenant());
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteLocation, setNewSiteLocation] = useState('');
  const [newSiteStrength, setNewSiteStrength] = useState('100');

  if (currentUser?.role !== 'SrijanDev Admin') {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center py-20">
        <AlertCircle size={48} className="mx-auto text-red-500/40 mb-4" />
        <p className="text-gray-400">Only SrijanDev Admin can access Tenant Onboarding.</p>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateTenant(editingId, form);
    } else {
      addTenant({
        ...form,
        id: `TENANT-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
    }
    setForm(emptyTenant());
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (t: Tenant) => {
    setForm({
      companyName: t.companyName,
      subdomain: t.subdomain,
      logoUrl: t.logoUrl,
      primaryColor: t.primaryColor,
      assignedModules: t.assignedModules,
      plantSites: t.plantSites,
      isActive: t.isActive,
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  const toggleModule = (modId: TenantModule) => {
    setForm(f => ({
      ...f,
      assignedModules: f.assignedModules.includes(modId)
        ? f.assignedModules.filter(m => m !== modId)
        : [...f.assignedModules, modId],
    }));
  };

  const addSite = () => {
    if (!newSiteName) return;
    const site: PlantSite = {
      id: `SITE-${Date.now()}`,
      name: newSiteName,
      location: newSiteLocation,
      guardStrength: Number(newSiteStrength) || 100,
    };
    setForm(f => ({ ...f, plantSites: [...f.plantSites, site] }));
    setNewSiteName('');
    setNewSiteLocation('');
    setNewSiteStrength('100');
  };

  const removeSite = (siteId: string) => {
    setForm(f => ({ ...f, plantSites: f.plantSites.filter(s => s.id !== siteId) }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe size={22} className="text-blue-400" /> Client Tenant Provisioning
          </h2>
          <p className="text-sm text-gray-400 mt-1">SrijanDev Master Console · White-label enterprise client management</p>
        </div>
        <button
          onClick={() => { setForm(emptyTenant()); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors shadow-lg shadow-blue-500/20"
        >
          <PlusCircle size={15} /> Onboard New Client
        </button>
      </div>

      {/* Onboarding Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 size={18} className="text-blue-400" />
                {editingId ? 'Edit Tenant' : 'Onboard New Enterprise Client'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X size={18} /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Company Name *</label>
                  <input type="text" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                    placeholder="e.g. Adani Cement Ltd." className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Subdomain *</label>
                  <div className="flex items-center bg-gray-950 border border-white/10 rounded-lg overflow-hidden">
                    <input type="text" value={form.subdomain} onChange={e => setForm(f => ({ ...f, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') }))}
                      placeholder="adani" className="flex-1 px-3 py-2.5 bg-transparent text-sm text-white focus:outline-none" required />
                    <span className="text-xs text-gray-500 px-3 bg-gray-900/50 h-full flex items-center border-l border-white/10 py-2.5">.srijandev.in</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Logo URL (optional)</label>
                  <input type="url" value={form.logoUrl} onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
                    placeholder="https://cdn.company.com/logo.png" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Brand Color
                    <span className="ml-2 inline-block w-4 h-4 rounded-full border border-white/20 align-middle" style={{ backgroundColor: form.primaryColor }} />
                  </label>
                  <input type="color" value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                    className="w-full h-10 bg-gray-950 border border-white/10 rounded-lg px-1 py-1 cursor-pointer" />
                </div>
              </div>

              {/* Module Licensing */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Licensed Modules</label>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_MODULES.map(mod => {
                    const active = form.assignedModules.includes(mod.id);
                    return (
                      <button key={mod.id} type="button" onClick={() => toggleModule(mod.id)}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-all ${active ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                        <span className="mr-1">{active ? '✓' : '○'}</span>{mod.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Plant Sites */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Plant Sites</label>
                <div className="space-y-2 mb-3">
                  {form.plantSites.map(site => (
                    <div key={site.id} className="flex items-center justify-between bg-gray-950/50 border border-white/5 rounded-lg px-3 py-2">
                      <div>
                        <span className="text-sm text-white font-medium">{site.name}</span>
                        <span className="text-xs text-gray-500 ml-2">{site.location} · {site.guardStrength} guards</span>
                      </div>
                      <button type="button" onClick={() => removeSite(site.id)} className="text-red-400 hover:text-red-300 p-1"><X size={14} /></button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <input value={newSiteName} onChange={e => setNewSiteName(e.target.value)} placeholder="Site Name" className="col-span-4 bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none" />
                  <input value={newSiteLocation} onChange={e => setNewSiteLocation(e.target.value)} placeholder="Location, State" className="col-span-4 bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none" />
                  <input type="number" value={newSiteStrength} onChange={e => setNewSiteStrength(e.target.value)} placeholder="Guards" className="col-span-2 bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none" />
                  <button type="button" onClick={addSite} className="col-span-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium">+ Add</button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg bg-white/5 text-white text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold">
                  {editingId ? 'Save Changes' : 'Create Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tenant List */}
      <div className="space-y-4">
        {tenants.map(tenant => (
          <div key={tenant.id} className={`bg-gray-900 border rounded-xl p-5 ${!tenant.isActive ? 'opacity-60 border-white/5' : 'border-white/10'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Color indicator */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 shrink-0"
                  style={{ backgroundColor: tenant.primaryColor + '20', borderColor: tenant.primaryColor + '40' }}>
                  <Building2 size={22} style={{ color: tenant.primaryColor }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white">{tenant.companyName}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tenant.isActive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                      {tenant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Link2 size={12} className="text-gray-500" />
                    <span className="text-xs text-blue-400 font-mono">{tenant.subdomain}.srijandev.in</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-xs text-gray-500">{tenant.plantSites.length} plant{tenant.plantSites.length !== 1 ? 's' : ''}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-xs text-gray-500">{tenant.assignedModules.length} modules</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(tenant)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs border border-white/10">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => updateTenant(tenant.id, { isActive: !tenant.isActive })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${tenant.isActive ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'}`}>
                  <Power size={12} /> {tenant.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => { if (confirm(`Delete tenant "${tenant.companyName}"?`)) deleteTenant(tenant.id); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs border border-red-500/20">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>

            {/* Module badges */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
              {tenant.assignedModules.map(m => {
                const mod = ALL_MODULES.find(x => x.id === m);
                return (
                  <span key={m} className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                    {mod?.label || m}
                  </span>
                );
              })}
            </div>

            {/* Plant sites */}
            {tenant.plantSites.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tenant.plantSites.map(site => (
                  <span key={site.id} className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-white/5">
                    📍 {site.name} ({site.guardStrength} guards)
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
