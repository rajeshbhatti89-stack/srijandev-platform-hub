'use client';

import { useState } from 'react';
import { useEnterpriseStore, Task } from '@/store/useEnterpriseStore';
import { CheckSquare, CheckCircle2, ChevronDown, Clock, ShieldAlert } from 'lucide-react';

export default function GuardTaskExecution({ guardId }: { guardId: string }) {
  const { tasks, updateTask } = useEnterpriseStore();
  
  // Filter tasks assigned to this guard that are not yet verified
  const myTasks = tasks.filter(t => t.assignedTo === guardId && t.status !== 'Verified');
  
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [completionNote, setCompletionNote] = useState('');

  const handleComplete = (taskId: string) => {
    updateTask(taskId, {
      status: 'Completed',
      completedAt: new Date().toISOString(),
      completionNote: completionNote || 'Completed without additional notes.',
    });
    setExpandedTaskId(null);
    setCompletionNote('');
  };

  if (myTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 mb-4">
          <CheckSquare size={32} className="text-blue-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">All Caught Up!</h3>
        <p className="text-sm text-gray-400">You have no pending tasks assigned for this shift.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
        <CheckSquare size={20} className="text-blue-400" /> My Tasks
      </h2>

      {myTasks.map(task => (
        <div key={task.id} className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
          <div 
            onClick={() => {
              setExpandedTaskId(expandedTaskId === task.id ? null : task.id);
              setCompletionNote('');
            }}
            className="p-4 flex items-start gap-4 cursor-pointer"
          >
            <div className={`mt-1 flex-shrink-0 ${task.status === 'Completed' ? 'text-emerald-500' : 'text-blue-500'}`}>
              {task.status === 'Completed' ? <CheckCircle2 size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-dashed animate-[spin_4s_linear_infinite]" />}
            </div>
            
            <div className="flex-1">
              <h4 className={`text-base font-bold mb-1 ${task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-white'}`}>
                {task.title}
              </h4>
              <p className="text-xs text-gray-400 line-clamp-1">{task.taskType}</p>
              
              {task.status === 'Dispatched' && (
                <span className="inline-flex items-center gap-1 mt-2 bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                  <Clock size={10} /> Pending
                </span>
              )}
            </div>

            <ChevronDown size={20} className={`text-gray-500 transition-transform ${expandedTaskId === task.id ? 'rotate-180' : ''}`} />
          </div>

          {/* Expanded Action Area */}
          {expandedTaskId === task.id && task.status !== 'Completed' && (
            <div className="px-4 pb-4 pt-2 border-t border-white/5 bg-gray-950/50">
              <p className="text-sm text-gray-300 mb-4 bg-gray-900 p-3 rounded-lg border border-white/5">
                {task.description}
              </p>
              
              <div className="space-y-3">
                <textarea
                  value={completionNote}
                  onChange={(e) => setCompletionNote(e.target.value)}
                  placeholder="Add completion notes or findings..."
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
                />
                
                <button
                  onClick={() => handleComplete(task.id)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> Mark as Completed
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
