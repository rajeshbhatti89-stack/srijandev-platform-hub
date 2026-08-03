'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Kanban, MessageSquare, Clock, User, CheckCircle2, X } from 'lucide-react';
import { PLATFORM_TASKS } from '@/lib/mockData';
import { Task } from '@/types/platform';

export const TaskBoardView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(PLATFORM_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Engineering');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');

  const columns = [
    { id: 'todo', label: 'To Do', color: 'bg-slate-500/20 text-slate-300 border-slate-700' },
    { id: 'in_progress', label: 'In Progress', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    { id: 'review', label: 'In Review', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'completed', label: 'Completed', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  ];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle,
      description: 'Newly assigned enterprise operations item.',
      status: 'todo',
      priority: newPriority,
      assignee: {
        id: 'emp-1',
        name: 'Rajesh Bhatti',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
      dueDate: '2026-08-12',
      category: newCategory,
      commentsCount: 0,
    };
    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setIsModalOpen(false);
  };

  const moveStatus = (taskId: string, currentStatus: string) => {
    const statusOrder: Task['status'][] = ['todo', 'in_progress', 'review', 'completed'];
    const idx = statusOrder.indexOf(currentStatus as any);
    const nextStatus = statusOrder[(idx + 1) % statusOrder.length];

    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Kanban className="w-6 h-6 text-brand-400" />
            <span>Task & Project Kanban Board</span>
          </h1>
          <p className="text-xs text-slate-400">Manage sprint tasks, assignees, priorities, and column status progression</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-glow-purple text-xs font-semibold flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div key={col.id} className="glass-card p-4 rounded-3xl border border-slate-800 flex flex-col h-[650px]">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">{colTasks.length}</span>
              </div>

              {/* Column Tasks */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {colTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    onClick={() => moveStatus(task.id, task.status)}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-brand-500/40 cursor-pointer shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-cyan-400">
                        {task.category}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-extrabold rounded ${
                        task.priority === 'urgent'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : task.priority === 'high'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <div className="flex items-center space-x-2">
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-6 h-6 rounded-full border border-slate-700 object-cover"
                        />
                        <span className="truncate max-w-[90px] text-slate-300">{task.assignee.name}</span>
                      </div>

                      <div className="flex items-center space-x-2 font-mono text-[10px]">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span>{task.commentsCount}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-xs text-slate-500">
                    No tasks in {col.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel w-full max-w-md p-6 rounded-3xl border border-brand-500/30 relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-4">Create New Task</h3>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Implement Supabase Auth Strategy"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-brand-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="AI Pipeline">AI Pipeline</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Architecture">Architecture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-brand-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow-purple"
                >
                  Create Task
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
