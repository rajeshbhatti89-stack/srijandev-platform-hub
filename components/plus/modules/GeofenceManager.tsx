'use client';

import { useState } from 'react';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { useOperationsStore, GeofencePost } from '@/store/useOperationsStore';
import { exportToCSV } from '@/lib/csvUtils';
import {
  MapPin, Radio, CheckCircle2, AlertTriangle, Sliders,
  Download, Plus, X, Wifi, WifiOff, Activity
} from 'lucide-react';

export default function GeofenceManager() {
  const { currentUser, guards } = useEnterpriseStore();
  const {
    geofencePosts, geofenceCheckIns,
    addGeofencePost, updateGeofencePost, deleteGeofencePost,
    logGeofenceCheckIn,
  } = useOperationsStore();

  const [showAddPost, setShowAddPost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedGuardId, setSelectedGuardId] = useState('');
  const [editingRadius, setEditingRadius] = useState<string | null>(null);
  const [newPostName, setNewPostName] = useState('');
  const [newPostRadius, setNewPostRadius] = useState(75);

  const isSuperAdmin = currentUser?.role === 'SrijanDev Admin';
  const isHO = currentUser?.role === 'Corporate HO Admin';

  const scopedPosts = geofencePosts.filter(p =>
    isSuperAdmin || isHO || p.siteId === currentUser?.assignedSiteId
  );
  const scopedCheckins = geofenceCheckIns.filter(c =>
    isSuperAdmin || isHO || c.siteId === currentUser?.assignedSiteId
  );
  const scopedGuards = guards.filter(g =>
    (isSuperAdmin || isHO || g.assignedSiteId === currentUser?.assignedSiteId) && g.status === 'On Duty'
  );

  const selectedPost = scopedPosts.find(p => p.id === selectedPostId);

  const handleSimulateCheckIn = () => {
    if (!selectedPostId || !selectedGuardId) return;
    const guard = guards.find(g => g.id === selectedGuardId);
    const post = geofencePosts.find(p => p.id === selectedPostId);
    if (!guard || !post) return;

    // Simulate distance — 70% chance of in-fence
    const inFence = Math.random() > 0.3;
    const distance = inFence
      ? Math.floor(Math.random() * post.radiusMeters * 0.9) + 1
      : Math.floor(post.radiusMeters + Math.random() * 80) + 1;

    const status: 'Verified In-Fence' | 'Breach / Out-of-Fence' = inFence
      ? 'Verified In-Fence'
      : 'Breach / Out-of-Fence';

    logGeofenceCheckIn({
      id: `GCI-${Date.now()}`,
      postId: selectedPostId,
      postName: post.postName,
      guardId: guard.id,
      guardName: guard.name,
      siteId: post.siteId,
      timestamp: new Date().toISOString(),
      status,
      simulatedDistance: distance,
    });

    setSelectedGuardId('');
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostName) return;
    addGeofencePost({
      id: `GF-${Date.now()}`,
      siteId: isSuperAdmin || isHO ? 'SITE-01' : (currentUser?.assignedSiteId || 'SITE-01'),
      postName: newPostName,
      radiusMeters: newPostRadius,
      centerLat: 31.52 + (Math.random() - 0.5) * 0.05,
      centerLng: 76.92 + (Math.random() - 0.5) * 0.05,
    });
    setNewPostName('');
    setNewPostRadius(75);
    setShowAddPost(false);
  };

  const exportCheckins = () => {
    const rows = scopedCheckins.map(c => ({
      'Check-in ID': c.id,
      Post: c.postName,
      Guard: c.guardName,
      'Guard ID': c.guardId,
      Status: c.status,
      'Distance (m)': c.simulatedDistance,
      Timestamp: new Date(c.timestamp).toLocaleString(),
    }));
    exportToCSV('geofence_checkins.csv', rows);
  };

  // Stats
  const verifiedToday = scopedCheckins.filter(c =>
    c.timestamp.startsWith(new Date().toISOString().split('T')[0]) && c.status === 'Verified In-Fence'
  ).length;
  const breachesToday = scopedCheckins.filter(c =>
    c.timestamp.startsWith(new Date().toISOString().split('T')[0]) && c.status === 'Breach / Out-of-Fence'
  ).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Radio size={22} className="text-blue-400" /> Geofence Post Manager
          </h2>
          <p className="text-sm text-gray-400 mt-1">GPS boundary check-in validation · Verified In-Fence / Breach detection</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddPost(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
            <Plus size={15} /> Add Post
          </button>
          <button onClick={exportCheckins} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm border border-white/10">
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Geofence Posts', value: scopedPosts.length, color: 'text-blue-400', icon: <MapPin size={18} /> },
          { label: "Today's Verified", value: verifiedToday, color: 'text-emerald-400', icon: <CheckCircle2 size={18} /> },
          { label: "Today's Breaches", value: breachesToday, color: breachesToday > 0 ? 'text-red-400' : 'text-gray-600', icon: <AlertTriangle size={18} /> },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-white/10 rounded-xl p-4 flex items-center gap-3">
            <span className={s.color}>{s.icon}</span>
            <div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Post Modal */}
      {showAddPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Configure New Geofence Post</h3>
              <button onClick={() => setShowAddPost(false)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddPost} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Post Name</label>
                <input type="text" value={newPostName} onChange={e => setNewPostName(e.target.value)} placeholder="e.g. Main Gate 3" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Geofence Radius: <span className="text-blue-400 font-bold">{newPostRadius}m</span>
                </label>
                <input type="range" min={25} max={200} step={5} value={newPostRadius} onChange={e => setNewPostRadius(Number(e.target.value))}
                  className="w-full accent-blue-500" />
                <div className="flex justify-between text-[10px] text-gray-600 mt-1"><span>25m</span><span>200m</span></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddPost(false)} className="flex-1 py-2.5 rounded-lg bg-white/5 text-white text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium">Add Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scopedPosts.map(post => {
          const postCheckins = scopedCheckins.filter(c => c.postId === post.id);
          const verified = postCheckins.filter(c => c.status === 'Verified In-Fence').length;
          const breaches = postCheckins.filter(c => c.status === 'Breach / Out-of-Fence').length;
          const isEditing = editingRadius === post.id;

          return (
            <div key={post.id} className={`bg-gray-900 border rounded-xl p-5 transition-all ${selectedPostId === post.id ? 'border-blue-500/50' : 'border-white/10 hover:border-white/20'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-white">{post.postName}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{post.siteId}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingRadius(isEditing ? null : post.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"
                    title="Adjust radius">
                    <Sliders size={14} />
                  </button>
                  <button
                    onClick={() => { if (confirm(`Delete ${post.postName}?`)) deleteGeofencePost(post.id); }}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    title="Delete post">
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Radius Visual */}
              <div className="relative flex items-center justify-center my-4">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center relative">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <MapPin size={20} className="text-blue-400" />
                  </div>
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-blue-400">{post.radiusMeters}m radius</span>
                </div>
              </div>

              {isEditing && (
                <div className="mb-3">
                  <input type="range" min={25} max={200} step={5} value={post.radiusMeters}
                    onChange={e => updateGeofencePost(post.id, { radiusMeters: Number(e.target.value) })}
                    className="w-full accent-blue-500" />
                  <div className="flex justify-between text-[10px] text-gray-600"><span>25m</span><span>200m</span></div>
                </div>
              )}

              <div className="flex gap-3 text-xs mb-4">
                <span className="text-emerald-400 font-semibold flex items-center gap-1"><Wifi size={11} /> {verified} verified</span>
                {breaches > 0 && <span className="text-red-400 font-semibold flex items-center gap-1"><WifiOff size={11} /> {breaches} breaches</span>}
              </div>

              {/* Simulate Check-in */}
              <div className="space-y-2">
                <select
                  value={selectedPostId === post.id ? selectedGuardId : ''}
                  onChange={e => { setSelectedPostId(post.id); setSelectedGuardId(e.target.value); }}
                  className="w-full bg-gray-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-gray-300 focus:outline-none"
                >
                  <option value="">-- Select guard for check-in --</option>
                  {scopedGuards.map(g => <option key={g.id} value={g.id}>{g.name} ({g.guardCode})</option>)}
                </select>
                <button
                  onClick={() => { setSelectedPostId(post.id); handleSimulateCheckIn(); }}
                  disabled={!selectedGuardId || selectedPostId !== post.id}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  <Activity size={13} /> Simulate GPS Check-in
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Check-in Log */}
      <div>
        <h3 className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <Activity size={16} className="text-blue-400" /> Recent Check-in Log
        </h3>
        <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-950/50 text-gray-500 text-xs uppercase border-b border-white/10">
                <tr>
                  <th className="px-5 py-3">Guard</th>
                  <th className="px-5 py-3">Post</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Distance</th>
                  <th className="px-5 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {scopedCheckins.slice(0, 20).map(c => (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-white font-medium">{c.guardName}</td>
                    <td className="px-5 py-3 text-gray-400">{c.postName}</td>
                    <td className="px-5 py-3">
                      <span className={`flex items-center gap-1.5 text-xs font-bold ${
                        c.status === 'Verified In-Fence' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {c.status === 'Verified In-Fence' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-400">{c.simulatedDistance}m</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{new Date(c.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
                {scopedCheckins.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-500">No check-ins logged. Use "Simulate GPS Check-in" on any post.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
