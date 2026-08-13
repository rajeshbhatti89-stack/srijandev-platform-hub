'use client';

import { useEnterpriseStore, Task } from '@/store/useEnterpriseStore';
import { ClipboardList, Clock, ArrowRightCircle, CheckCircle2, ShieldCheck, UserCircle2 } from 'lucide-react';

export default function TaskDispatch() {
  const { tasks, updateTask, workforce } = useEnterpriseStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Created': return <ClipboardList size={16} />;
      case 'Dispatched': return <ArrowRightCircle size={16} />;
      case 'In-Progress': return <Clock size={16} />;
      case 'Completed': return <CheckCircle2 size={16} />;
      case 'Verified': return <ShieldCheck size={16} />;
      default: return <ClipboardList size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Medium': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Low': return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const advanceTask = (taskId: string, currentStatus: string) => {
    const sequence: Task['status'][] = ['Created', 'Dispatched', 'In-Progress', 'Completed', 'Verified'];
    const currentIndex = sequence.indexOf(currentStatus as Task['status']);
    if (currentIndex > -1 && currentIndex < sequence.length - 1) {
      updateTask(taskId, { status: sequence[currentIndex + 1] });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Field Force Task Dispatch</h2>
          <p className="text-sm text-gray-400">Allocate and track work orders across the task lifecycle.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map(task => {
          const assignee = workforce.find(w => w.id === task.assigneeId);
          
          return (
            <div key={task.id} className="bg-gray-900 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-blue-500 font-semibold">{task.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border tracking-wider ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-950 px-2 py-0.5 rounded-md border border-white/5">Site: {task.siteId}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                <p className="text-sm text-gray-400 max-w-2xl">{task.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <UserCircle2 size={16} className="text-gray-500" />
                  <span className="text-xs font-medium text-gray-300">
                    {assignee ? `${assignee.name} (${assignee.role})` : 'Unassigned'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-gray-950 p-4 rounded-xl border border-white/5">
                <div className="flex flex-col items-center justify-center min-w-[100px]">
                  <div className={`p-2 rounded-full mb-1 ${task.status === 'Verified' ? 'text-emerald-400 bg-emerald-500/10' : 'text-blue-400 bg-blue-500/10'}`}>
                    {getStatusIcon(task.status)}
                  </div>
                  <span className="text-xs font-semibold text-gray-300">{task.status}</span>
                </div>

                {task.status !== 'Verified' && (
                  <button 
                    onClick={() => advanceTask(task.id, task.status)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors"
                  >
                    Advance
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
