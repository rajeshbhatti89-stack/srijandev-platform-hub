'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Hash, User, Search, Smile, Paperclip } from 'lucide-react';
import { PHASE2_MESSAGES } from '@/lib/mockDataPhase2';
import { ChatMessage } from '@/types/phase2';

export const InternalChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(PHASE2_MESSAGES);
  const [inputMsg, setInputMsg] = useState('');
  const [activeChannel, setActiveChannel] = useState('#engineering');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'emp-1',
      senderName: 'Rajesh Bhatti',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      content: inputMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setInputMsg('');
  };

  const channels = ['#engineering', '#ai-research', '#operations', '#design'];

  return (
    <div className="h-[700px] glass-card rounded-3xl border border-slate-800 flex overflow-hidden">
      
      {/* Channels & DM Sidebar */}
      <div className="w-64 border-r border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-4">Channels</h3>
          <div className="space-y-1 mb-6">
            {channels.map((ch) => (
              <button
                key={ch}
                onClick={() => setActiveChannel(ch)}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeChannel === ch ? 'bg-brand-600 text-white shadow-glow-purple' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>{ch.replace('#', '')}</span>
              </button>
            ))}
          </div>

          <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">Direct Messages</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2 p-2 rounded-xl hover:bg-slate-800 cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300 font-bold">Aisha Sharma</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-xl hover:bg-slate-800 cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300 font-bold">Priya Nair</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono">
          Status: <span className="text-emerald-400 font-bold">Connected to Socket</span>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 flex flex-col justify-between">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hash className="w-5 h-5 text-brand-400" />
            <h3 className="text-sm font-bold text-white">{activeChannel.replace('#', '')} Channel</h3>
          </div>
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>4 Team Members Online</span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-3">
              <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
              <div>
                <div className="flex items-center space-x-2 text-xs mb-1">
                  <span className="font-bold text-white">{msg.senderName}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 inline-block max-w-lg">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Typing Indicator */}
        <div className="px-6 py-1 text-[11px] text-slate-400 italic">
          Aisha Sharma is typing...
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 flex items-center space-x-3">
          <input
            type="text"
            placeholder={`Message ${activeChannel}...`}
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
          />
          <button type="submit" className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-glow-purple">
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
