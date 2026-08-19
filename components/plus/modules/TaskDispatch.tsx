'use client';

import { useState } from 'react';
import { useEnterpriseStore, Task } from '@/store/useEnterpriseStore';
import { exportTasks } from '@/lib/csvUtils';
import {
  ClipboardList, PlusCircle, Download, ChevronRight,
  CheckCircle2, Clock, Shield, Send, Play, X, FileText, Trash2
} from 'lucide-react';

type FilterStatus = 'All' | Task['status'];

const TASK_TYPES: Task['taskType'][] = [
  'Perimeter Inspection',
  'Weighbridge Audit',
  'Night Patrol',
  'CBM Vibration Check',
  'Access Control Check',
  'Custom',
];

const statusMeta: Record<Task['status'], { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  'Dispatched':  { label: 'Dispatched',  color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    icon: <Send size={12} />      },
  'In-Progress': { label: 'In Progress', color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   icon: <Play size={12} />      },
  'Completed':   { label: 'Completed',   color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/30',  icon: <CheckCircle2 size={12} /> },
  'Verified':    { label: 'Verified',    color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: <Shield size={12} />    },
};

const advanceLabel: Partial<Record<Task['status'], string>> = {
  'Dispatched':  'Start Task →',
  'In-Progress': 'Mark Completed →',
  'Completed':   'Verify (PSH) ✓',
};

const PIPELINE_STEPS: Task['status'][] = ['Dispatched', 'In-Progress', 'Completed', 'Verified'];

export default function TaskDispatch() {
  const { currentUser, guards, tasks, addTask, advanceTask, deleteTask } = useEnterpriseStore();

  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');

  // Completion note modal
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [completionNote, setCompletionNote] = useState('');

  // Form state
  const [fTitle, setFTitle] = useState('');
  const [fDesc, setFDesc] = useState('');
  const [fType, setFType] = useState<Task['taskType']>('Perimeter Inspection');
  const [fAssignee, setFAssignee] = useState('');
  const [fPost, setFPost] = useState('');

  const isGlobalAdmin = currentUser?.role === 'SrijanDev Admin';
  const isHO = currentUser?.role === 'Corporate HO Admin';
  const isSuperAdmin = isGlobalAdmin || isHO;

  const scopedTasks = tasks.filter(t => {
    const tenantOk = isGlobalAdmin || t.tenantId === currentUser?.tenantId;
    const siteOk = isSuperAdmin || t.siteId === currentUser?.assignedSiteId;
    return tenantOk && siteOk;
  });

  const filteredTasks = filterStatus === 'All'
    ? scopedTasks
    : scopedTasks.filter(t => t.status === filterStatus);

  const availableGuards = guards.filter(g =>
    (isGlobalAdmin || g.tenantId === currentUser?.tenantId) &&
    (isSuperAdmin || g.assignedSiteId === currentUser?.assignedSiteId) &&
    g.status === 'On Duty'
  );

  const countFor = (s: Task['status']) => scopedTasks.filter(t => t.status === s).length;

  const resetForm = () => {
    setFTitle(''); setFDesc(''); setFType('Perimeter Inspection'); setFAssignee(''); setFPost('');
    setShowForm(false);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fTitle || !fAssignee) return;
    const guard = guards.find(g => g.id === fAssignee);
    addTask({
      id: `TSK-${Date.now()}`,
      tenantId: currentUser?.tenantId || 'GLOBAL',
      siteId: isSuperAdmin ? (guard?.assignedSiteId || 'SITE-01') : (currentUser?.assignedSiteId || 'SITE-01'),
      title: fTitle,
      description: fDesc,
      assignedTo: fAssignee,
      assignedToName: guard?.name || '',
      post: fPost || guard?.assignedPost || '',
      taskType: fType,
      status: 'Dispatched',
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.name || 'PSH',
      creatorRole: isSuperAdmin ? 'Corporate HO Directive' : 'PSH Operational Task',
    });
    resetForm();
  };

  const handleAdvance = (task: Task) => {
    if (task.status === 'In-Progress') {
      // Need completion note
      setCompletingTaskId(task.id);
      setCompletionNote('');
    } else if (task.status !== 'Verified') {
      advanceTask(task.id);
    }
  };

  const handleCompleteConfirm = () => {
    if (completingTaskId) {
      advanceTask(completingTaskId, completionNote);
      setCompletingTaskId(null);
      setCompletionNote('');
    }
  };

  const formatTs = (ts?: string) => ts ? new Date(ts).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '—';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Task Allocation & Patrol Dispatch</h2>
          <p className="text-sm text-gray-400 mt-1">{scopedTasks.length} total tasks · Unolo lifecycle state machine</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
            <PlusCircle size={15} /> Dispatch Task
          </button>
          <button onClick={() => exportTasks(filteredTasks)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm border border-white/10 transition-colors">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PIPELINE_STEPS.map((s, i) => {
          const m = statusMeta[s];
          return (
            <div key={s} className={`relative bg-gray-900 border ${m.border} rounded-xl p-4 overflow-hidden`}>
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${m.bg}`} />
              <div className="flex items-center justify-between mb-1">
                <span className={`flex items-center gap-1 text-xs font-semibold ${m.color}`}>
                  {m.icon}{m.label}
                </span>
                {i < 3 && <ChevronRight size={14} className="text-gray-700" />}
              </div>
              <p className="text-2xl font-bold text-white">{countFor(s)}</p>
            </div>
          );
        })}
      </div>

      {/* Task Creation Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ClipboardList size={18} className="text-blue-400" /> Dispatch New Task
              </h3>
              <button onClick={resetForm} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Task Title *</label>
                <input type="text" value={fTitle} onChange={e => setFTitle(e.target.value)} placeholder="e.g. North Gate Perimeter Sweep" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Task Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {TASK_TYPES.map(t => (
                    <button key={t} type="button" onClick={() => setFType(t)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-left ${fType === t ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Assign To (Active Guard) *</label>
                <select value={fAssignee} onChange={e => { setFAssignee(e.target.value); const g = guards.find(g => g.id === e.target.value); if (g) setFPost(g.assignedPost); }} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" required>
                  <option value="">-- Select guard --</option>
                  {availableGuards.map(g => <option key={g.id} value={g.id}>{g.name} ({g.designation} · {g.assignedPost})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Reporting Post</label>
                <input type="text" value={fPost} onChange={e => setFPost(e.target.value)} placeholder="Auto-filled from guard's post" className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Description / Instructions</label>
                <textarea value={fDesc} onChange={e => setFDesc(e.target.value)} rows={3} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none resize-none" placeholder="Specific patrol instructions or audit checklist..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm} className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center justify-center gap-2">
                  <Send size={14} /> Dispatch Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Completion Note Modal */}
      {completingTaskId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-purple-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText size={18} className="text-purple-400" /> Completion Report
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Completion Note / Findings</label>
                <textarea value={completionNote} onChange={e => setCompletionNote(e.target.value)} rows={4} className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none resize-none" placeholder="Describe what was found, any anomalies, or confirmation of completion..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCompletingTaskId(null)} className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm">Cancel</button>
                <button onClick={handleCompleteConfirm} className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 size={14} /> Mark Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['All', ...PIPELINE_STEPS] as FilterStatus[]).map(s => {
          const m = s !== 'All' ? statusMeta[s as Task['status']] : null;
          return (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filterStatus === s
                  ? s === 'All' ? 'bg-white/10 border-white/20 text-white' : `${m!.bg} ${m!.border} ${m!.color}`
                  : 'bg-transparent border-white/10 text-gray-500 hover:text-gray-300'
              }`}>
              {s === 'All' ? 'All Tasks' : statusMeta[s as Task['status']].label}
              {s !== 'All' && <span className="ml-1.5 opacity-70">{countFor(s as Task['status'])}</span>}
            </button>
          );
        })}
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 border border-white/10 rounded-xl">
            <ClipboardList size={36} className="mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500 text-sm">No tasks in this category. Use "Dispatch Task" to assign work.</p>
          </div>
        ) : filteredTasks.map(task => {
          const m = statusMeta[task.status];
          const stepIdx = PIPELINE_STEPS.indexOf(task.status);
          return (
            <div key={task.id} className={`bg-gray-900 border ${m.border} rounded-xl p-5 transition-all hover:shadow-lg`}>

              {/* Progress bar */}
              <div className="flex items-center gap-1 mb-4">
                {PIPELINE_STEPS.map((step, i) => {
                  const sm = statusMeta[step];
                  const done = i <= stepIdx;
                  return (
                    <div key={step} className="flex items-center gap-1 flex-1">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border text-[10px] transition-all ${done ? `${sm.bg} ${sm.border} ${sm.color}` : 'bg-gray-800 border-gray-700 text-gray-600'}`}>
                        {done ? <CheckCircle2 size={12} /> : i + 1}
                      </div>
                      <span className={`text-[10px] font-medium hidden sm:inline ${done ? sm.color : 'text-gray-600'}`}>{sm.label}</span>
                      {i < 3 && <div className={`flex-1 h-px mx-1 ${i < stepIdx ? 'bg-emerald-500/40' : 'bg-gray-800'}`} />}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-bold text-white">{task.title}</span>
                    <span className="font-mono text-xs text-gray-500">{task.id}</span>
                    <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${m.bg} ${m.border} ${m.color}`}>
                      {m.icon} {m.label}
                    </span>
                    <span className="px-2 py-0.5 rounded border text-[11px] bg-white/5 border-white/10 text-gray-400">{task.taskType}</span>
                  </div>

                  {task.description && <p className="text-sm text-gray-400 mb-3">{task.description}</p>}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-500">
                    <span>Assigned: <span className="text-gray-300 font-medium">{task.assignedToName}</span></span>
                    <span>Post: <span className="text-gray-300">{task.post}</span></span>
                    <span>By: <span className="text-gray-300">{task.createdBy}</span></span>
                    <span>Created: <span className="text-gray-300">{formatTs(task.createdAt)}</span></span>
                  </div>

                  {/* Timestamps */}
                  <div className="flex flex-wrap gap-3 mt-2 text-xs">
                    {task.startedAt   && <span className="text-amber-400">▶ Started: {formatTs(task.startedAt)}</span>}
                    {task.completedAt && <span className="text-purple-400">✓ Completed: {formatTs(task.completedAt)}</span>}
                    {task.verifiedAt  && <span className="text-emerald-400">✅ Verified: {formatTs(task.verifiedAt)}</span>}
                  </div>

                  {task.completionNote && (
                    <div className="mt-3 p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg text-xs text-purple-300">
                      <span className="font-semibold text-purple-400">Completion Report: </span>{task.completionNote}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  {task.status !== 'Verified' && advanceLabel[task.status] && (
                    <button
                      onClick={() => handleAdvance(task)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                        task.status === 'Completed'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/0 shadow-lg shadow-emerald-500/20'
                          : task.status === 'In-Progress'
                          ? 'bg-purple-600 hover:bg-purple-500 text-white border-purple-500/0 shadow-lg shadow-purple-500/20'
                          : 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500/0 shadow-lg shadow-amber-500/20'
                      }`}
                    >
                      {advanceLabel[task.status]}
                    </button>
                  )}
                  {task.status === 'Verified' && (
                    <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <Shield size={14} /> Verified
                    </span>
                  )}
                  <button
                    onClick={() => { if (confirm(`Delete task "${task.title}"?`)) deleteTask(task.id); }}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
