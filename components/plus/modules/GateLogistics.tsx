'use client';

import { useState } from 'react';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { useOperationsStore, GatePass } from '@/store/useOperationsStore';
import { exportToCSV } from '@/lib/csvUtils';
import {
  Truck, User, Plus, CheckCircle2, Clock, Download,
  ArrowDownToLine, ArrowUpFromLine, X, Package, Eye
} from 'lucide-react';

type PassTab = 'Material' | 'Visitor';
type DirectionFilter = 'All' | 'Inward' | 'Outward';

export default function GateLogistics() {
  const { currentUser } = useEnterpriseStore();
  const { gatePasses, addGatePass, closeGatePass, deleteGatePass } = useOperationsStore();

  const [tab, setTab] = useState<PassTab>('Material');
  const [showForm, setShowForm] = useState(false);
  const [dirFilter, setDirFilter] = useState<DirectionFilter>('All');

  // Material form
  const [mVehicleNo, setMVehicleNo] = useState('');
  const [mTransporter, setMTransporter] = useState('');
  const [mGrossWeight, setMGrossWeight] = useState('');
  const [mNetWeight, setMNetWeight] = useState('');
  const [mDriverName, setMDriverName] = useState('');
  const [mDriverPhone, setMDriverPhone] = useState('');
  const [mMaterial, setMMaterial] = useState('');
  const [mDirection, setMDirection] = useState<'Inward' | 'Outward'>('Inward');

  // Visitor form
  const [vName, setVName] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vCompany, setVCompany] = useState('');
  const [vHost, setVHost] = useState('');
  const [vPurpose, setVPurpose] = useState('');
  const [vDirection] = useState<'Inward' | 'Outward'>('Inward');

  const isGlobalAdmin = currentUser?.role === 'SrijanDev Admin';
  const isHO = currentUser?.role === 'Corporate HO Admin';
  const isSuperAdmin = isGlobalAdmin || isHO;

  const scopedPasses = gatePasses.filter(p => {
    const tenantOk = isGlobalAdmin || p.tenantId === currentUser?.tenantId;
    const siteOk = isSuperAdmin || p.siteId === currentUser?.assignedSiteId;
    return tenantOk && siteOk;
  });

  const filteredPasses = scopedPasses
    .filter(p => p.passType === tab)
    .filter(p => dirFilter === 'All' || p.direction === dirFilter);

  const openCount = scopedPasses.filter(p => p.status === 'Open').length;
  const todayMaterial = scopedPasses.filter(p => p.passType === 'Material' && p.entryAt.startsWith(new Date().toISOString().split('T')[0])).length;
  const todayVisitor = scopedPasses.filter(p => p.passType === 'Visitor' && p.entryAt.startsWith(new Date().toISOString().split('T')[0])).length;

  const resetForms = () => {
    setMVehicleNo(''); setMTransporter(''); setMGrossWeight(''); setMNetWeight('');
    setMDriverName(''); setMDriverPhone(''); setMMaterial(''); setMDirection('Inward');
    setVName(''); setVPhone(''); setVCompany(''); setVHost(''); setVPurpose('');
    setShowForm(false);
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    addGatePass({
      id: `GP-${Date.now()}`,
      tenantId: currentUser?.tenantId || 'GLOBAL',
      siteId: isSuperAdmin ? 'SITE-01' : (currentUser?.assignedSiteId || 'SITE-01'),
      passType: 'Material',
      direction: mDirection,
      vehicleNo: mVehicleNo.toUpperCase(),
      transporterName: mTransporter,
      grossWeight: Number(mGrossWeight),
      netWeight: Number(mNetWeight),
      driverName: mDriverName,
      driverPhone: mDriverPhone,
      materialDescription: mMaterial,
      entryAt: new Date().toISOString(),
      status: 'Open',
      createdBy: currentUser?.name || 'System',
    });
    resetForms();
  };

  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    addGatePass({
      id: `GP-${Date.now()}`,
      tenantId: currentUser?.tenantId || 'GLOBAL',
      siteId: isSuperAdmin ? 'SITE-01' : (currentUser?.assignedSiteId || 'SITE-01'),
      passType: 'Visitor',
      direction: 'Inward',
      visitorName: vName,
      visitorPhone: vPhone,
      visitorCompany: vCompany,
      hostName: vHost,
      purpose: vPurpose,
      entryAt: new Date().toISOString(),
      status: 'Open',
      createdBy: currentUser?.name || 'System',
    });
    resetForms();
  };

  const exportPasses = () => {
    const rows = filteredPasses.map(p => ({
      'Pass ID': p.id,
      Type: p.passType,
      Direction: p.direction,
      'Vehicle No': p.vehicleNo || '',
      Transporter: p.transporterName || '',
      'Gross Weight': p.grossWeight || '',
      'Net Weight': p.netWeight || '',
      'Driver / Visitor': p.driverName || p.visitorName || '',
      Phone: p.driverPhone || p.visitorPhone || '',
      Host: p.hostName || '',
      Purpose: p.purpose || '',
      Material: p.materialDescription || '',
      'Entry At': new Date(p.entryAt).toLocaleString(),
      'Exit At': p.exitAt ? new Date(p.exitAt).toLocaleString() : '',
      Status: p.status,
      'Created By': p.createdBy,
    }));
    exportToCSV('gate_passes.csv', rows);
  };

  const dirColors = { Inward: 'text-green-400 bg-green-500/10 border-green-500/20', Outward: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package size={22} className="text-amber-400" /> Plant Gate Logistics
          </h2>
          <p className="text-sm text-gray-400 mt-1">Inward/Outward truck logs · Visitor gate passes · Real-time entry/exit tracking</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold transition-colors shadow-lg shadow-amber-500/20">
            <Plus size={15} /> New Pass
          </button>
          <button onClick={exportPasses} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm border border-white/10">
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Open Passes', value: openCount, color: 'text-amber-400' },
          { label: "Today's Trucks", value: todayMaterial, color: 'text-blue-400' },
          { label: "Today's Visitors", value: todayVisitor, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-white/10 rounded-xl px-4 py-3">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-amber-500/30 rounded-2xl p-6 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">New Gate Pass</h3>
              <button onClick={resetForms} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X size={18} /></button>
            </div>

            {/* Type tabs in form */}
            <div className="flex rounded-lg overflow-hidden border border-white/10 mb-5">
              {(['Material', 'Visitor'] as PassTab[]).map(t => (
                <button key={t} type="button" onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${tab === t ? 'bg-amber-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-white/5'}`}>
                  {t === 'Material' ? <Truck size={15} /> : <User size={15} />} {t}
                </button>
              ))}
            </div>

            {tab === 'Material' ? (
              <form onSubmit={handleCreateMaterial} className="space-y-4">
                {/* Direction */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Movement Direction</label>
                  <div className="flex rounded-lg overflow-hidden border border-white/10">
                    {(['Inward', 'Outward'] as const).map(d => (
                      <button key={d} type="button" onClick={() => setMDirection(d)}
                        className={`flex-1 py-2 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${mDirection === d ? 'bg-amber-600 text-white' : 'bg-gray-900 text-gray-400'}`}>
                        {d === 'Inward' ? <ArrowDownToLine size={14} /> : <ArrowUpFromLine size={14} />} {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Vehicle No. *</label>
                    <input value={mVehicleNo} onChange={e => setMVehicleNo(e.target.value)} placeholder="HP-65-C-0000" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white uppercase focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Transporter</label>
                    <input value={mTransporter} onChange={e => setMTransporter(e.target.value)} placeholder="Logistics Co. Name" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Gross Weight (MT)</label>
                    <input type="number" value={mGrossWeight} onChange={e => setMGrossWeight(e.target.value)} placeholder="42" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Net Weight (MT)</label>
                    <input type="number" value={mNetWeight} onChange={e => setMNetWeight(e.target.value)} placeholder="28" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Driver Name</label>
                    <input value={mDriverName} onChange={e => setMDriverName(e.target.value)} placeholder="Driver Full Name" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Driver Phone</label>
                    <input value={mDriverPhone} onChange={e => setMDriverPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Material Description</label>
                  <input value={mMaterial} onChange={e => setMMaterial(e.target.value)} placeholder="e.g. Limestone Grade A, Clinker 32MT" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={resetForms} className="flex-1 py-2.5 rounded-lg bg-white/5 text-white text-sm">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold">Log Material Pass</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateVisitor} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Visitor Name *</label>
                    <input value={vName} onChange={e => setVName(e.target.value)} placeholder="Full Name" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
                    <input value={vPhone} onChange={e => setVPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Company / Organization</label>
                    <input value={vCompany} onChange={e => setVCompany(e.target.value)} placeholder="Company Name" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Host Employee *</label>
                    <input value={vHost} onChange={e => setVHost(e.target.value)} placeholder="Host Name" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Purpose of Visit</label>
                  <textarea value={vPurpose} onChange={e => setVPurpose(e.target.value)} rows={2} placeholder="Equipment calibration, Audit, Meeting..." className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={resetForms} className="flex-1 py-2.5 rounded-lg bg-white/5 text-white text-sm">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold">Log Visitor Pass</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Tabs + Filter */}
      <div className="flex flex-wrap items-center gap-3">
        {(['Material', 'Visitor'] as PassTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${tab === t ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
            {t === 'Material' ? <Truck size={15} /> : <User size={15} />} {t} Passes
          </button>
        ))}
        <div className="flex gap-1 ml-auto">
          {(['All', 'Inward', 'Outward'] as DirectionFilter[]).map(d => (
            <button key={d} onClick={() => setDirFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${dirFilter === d ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-gray-500 hover:text-gray-300'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Gate Pass Table */}
      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-950/50 text-gray-500 text-xs uppercase border-b border-white/10">
              <tr>
                <th className="px-5 py-3">Pass ID</th>
                {tab === 'Material' ? (
                  <>
                    <th className="px-5 py-3">Vehicle No</th>
                    <th className="px-5 py-3">Transporter</th>
                    <th className="px-5 py-3">Material</th>
                    <th className="px-5 py-3">Weight (G/N)</th>
                  </>
                ) : (
                  <>
                    <th className="px-5 py-3">Visitor</th>
                    <th className="px-5 py-3">Company</th>
                    <th className="px-5 py-3">Host</th>
                    <th className="px-5 py-3">Purpose</th>
                  </>
                )}
                <th className="px-5 py-3">Direction</th>
                <th className="px-5 py-3">Entry</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPasses.map(pass => (
                <tr key={pass.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3 font-mono text-blue-400 text-xs">{pass.id}</td>
                  {tab === 'Material' ? (
                    <>
                      <td className="px-5 py-3 font-mono font-bold text-white">{pass.vehicleNo}</td>
                      <td className="px-5 py-3 text-gray-300">{pass.transporterName || '—'}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs max-w-[150px] truncate">{pass.materialDescription || '—'}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs font-mono">
                        {pass.grossWeight ? `${pass.grossWeight}/${pass.netWeight} MT` : '—'}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-3 text-white font-medium">{pass.visitorName}</td>
                      <td className="px-5 py-3 text-gray-400">{pass.visitorCompany || '—'}</td>
                      <td className="px-5 py-3 text-gray-400">{pass.hostName}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs max-w-[150px] truncate">{pass.purpose || '—'}</td>
                    </>
                  )}
                  <td className="px-5 py-3">
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded border ${dirColors[pass.direction]}`}>
                      {pass.direction === 'Inward' ? <ArrowDownToLine size={10} /> : <ArrowUpFromLine size={10} />}
                      {pass.direction}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">{new Date(pass.entryAt).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold ${pass.status === 'Open' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {pass.status}
                    </span>
                    {pass.exitAt && (
                      <p className="text-[10px] text-gray-600 mt-0.5">{new Date(pass.exitAt).toLocaleTimeString()}</p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      {pass.status === 'Open' && (
                        <button onClick={() => closeGatePass(pass.id)}
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                          title="Close Pass / Mark Exit">
                          <CheckCircle2 size={14} />
                        </button>
                      )}
                      <button onClick={() => { if (confirm(`Delete pass ${pass.id}?`)) deleteGatePass(pass.id); }}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                        title="Delete">
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPasses.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-500">No {tab.toLowerCase()} passes recorded.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
