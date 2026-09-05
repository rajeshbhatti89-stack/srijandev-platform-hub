'use client';

import React, { useState } from 'react';
import { useHRStore, CompanyAnnouncement, KudosPost } from '@/store/useHRStore';
import {
  Megaphone,
  Award,
  Heart,
  Sparkles,
  Pin,
  Send,
  Plus,
  Flame,
  Trophy,
  MessageCircle,
  Share2,
  CheckCircle2
} from 'lucide-react';

export default function AnnouncementRecognition() {
  const {
    theme,
    announcements,
    addAnnouncement,
    likeAnnouncement,
    kudos,
    giveKudos,
    likeKudos,
    employees
  } = useHRStore();

  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'feed' | 'kudos'>('feed');
  const [isBroadcastModal, setIsBroadcastModal] = useState(false);
  const [isKudosModal, setIsKudosModal] = useState(false);

  // New Broadcast Form State
  const [broadTitle, setBroadTitle] = useState('');
  const [broadCategory, setBroadCategory] = useState<any>('Company News');
  const [broadContent, setBroadContent] = useState('');
  const [broadPinned, setBroadPinned] = useState(true);

  // New Kudos Form State
  const [kudosRecipientId, setKudosRecipientId] = useState(employees[1]?.id || 'SRJ-002');
  const [kudosBadge, setKudosBadge] = useState<any>('Rockstar Dev');
  const [kudosMessage, setKudosMessage] = useState('');

  const BADGE_ICONS: Record<string, string> = {
    'Rockstar Dev': '⚡',
    'Innovation Driver': '🚀',
    'Problem Solver': '🧠',
    'Team Player': '🤝',
    'Customer Hero': '🌟',
    'Culture Champion': '🏆',
  };

  const handlePublishBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadTitle || !broadContent) return;
    const newAnn: CompanyAnnouncement = {
      id: `ANN-${Date.now().toString().slice(-4)}`,
      title: broadTitle,
      category: broadCategory,
      content: broadContent,
      authorName: 'Rajesh Bhatti',
      authorRole: 'Chief Technology Officer',
      publishedAt: new Date().toISOString(),
      isPinned: broadPinned,
      likesCount: 1,
    };
    addAnnouncement(newAnn);
    setIsBroadcastModal(false);
    setBroadTitle('');
    setBroadContent('');
  };

  const handleGiveKudos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kudosMessage) return;
    const sender = employees[0];
    const receiver = employees.find((e) => e.id === kudosRecipientId) || employees[1];
    const newK: KudosPost = {
      id: `KUD-${Date.now()}`,
      fromEmployeeId: sender.id,
      fromEmployeeName: sender.name,
      toEmployeeId: receiver.id,
      toEmployeeName: receiver.name,
      badge: kudosBadge,
      message: kudosMessage,
      likesCount: 1,
      timestamp: new Date().toISOString(),
    };
    giveKudos(newK);
    setIsKudosModal(false);
    setKudosMessage('');
  };

  // Kudos Leaderboard aggregation
  const leaderboardCounts: Record<string, number> = {};
  kudos.forEach((k) => {
    leaderboardCounts[k.toEmployeeName] = (leaderboardCounts[k.toEmployeeName] || 0) + 1;
  });
  const leaderboard = Object.entries(leaderboardCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">Announcements & Kudos Recognition</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm">
              Culture & Engagement
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Company-wide executive broadcasts, official newsfeed, and peer-to-peer Kudos recognition wall.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-xl border flex items-center ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-white/10'}`}>
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'feed'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📢 Newsfeed
            </button>
            <button
              onClick={() => setActiveTab('kudos')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'kudos'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏆 Kudos Wall ({kudos.length})
            </button>
          </div>

          {activeTab === 'feed' ? (
            <button
              onClick={() => setIsBroadcastModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-md"
            >
              <Plus size={15} /> Post Broadcast
            </button>
          ) : (
            <button
              onClick={() => setIsKudosModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-md"
            >
              <Award size={15} /> Award Kudos
            </button>
          )}
        </div>
      </div>

      {activeTab === 'feed' ? (
        <div className="space-y-4 max-w-4xl">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-6 rounded-3xl border transition-all ${
                ann.isPinned
                  ? isLight
                    ? 'bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border-indigo-300 shadow-md'
                    : 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-900/30 border-amber-500/40 shadow-lg'
                  : isLight
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-slate-900/80 border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  {ann.isPinned && (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono shadow-sm">
                      <Pin size={10} className="fill-slate-950" /> Pinned
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                    {ann.category}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(ann.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{ann.title}</h3>
              <p className={`text-xs mt-2 leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {ann.content}
              </p>

              <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[10px]">
                    {ann.authorName.charAt(0)}
                  </div>
                  <span className="text-slate-400">
                    Posted by <strong className="text-white">{ann.authorName}</strong> ({ann.authorRole})
                  </span>
                </div>

                <button
                  onClick={() => likeAnnouncement(ann.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    ann.userLiked
                      ? 'bg-rose-500 text-white'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <Heart size={13} className={ann.userLiked ? 'fill-white' : ''} />
                  <span>{ann.likesCount}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Kudos Wall & Leaderboard Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Kudos Wall Posts */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kudos.map((k) => (
                <div
                  key={k.id}
                  className={`p-5 rounded-3xl border flex flex-col justify-between transition-all hover:scale-[1.01] ${
                    isLight
                      ? 'bg-white border-slate-200 shadow-sm'
                      : 'bg-slate-900/80 border-white/10 shadow-lg'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-indigo-600/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <span>{BADGE_ICONS[k.badge] || '🏆'}</span>
                        <span>{k.badge}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(k.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-400">Awarded to</span>
                      <strong className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-indigo-600">
                        {k.toEmployeeName}
                      </strong>
                    </div>

                    <p className={`text-xs italic leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      "{k.message}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">
                      From: <strong className="text-white">{k.fromEmployeeName}</strong>
                    </span>
                    <button
                      onClick={() => likeKudos(k.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-500 font-bold hover:bg-amber-500/20"
                    >
                      <Sparkles size={12} /> {k.likesCount} High Fives
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: Kudos Leaderboard */}
          <div className="space-y-4">
            <div className={`p-6 rounded-3xl border ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10 shadow-lg'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={18} className="text-amber-500" />
                <h3 className="text-sm font-black uppercase tracking-wider">Kudos Leaderboard</h3>
              </div>

              <div className="space-y-3">
                {leaderboard.map((item, idx) => (
                  <div
                    key={item.name}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                      idx === 0
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 font-bold'
                        : isLight
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        idx === 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        #{idx + 1}
                      </span>
                      <span className="font-bold">{item.name}</span>
                    </div>

                    <span className="font-mono font-black text-amber-400">
                      {item.count} {item.count === 1 ? 'Badge' : 'Badges'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {isBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0b0f19] border-white/10 text-white'
            }`}
          >
            <div className={`p-5 border-b flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-white/10'}`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Megaphone size={16} className="text-amber-500" />
                Publish Company Broadcast
              </h3>
              <button onClick={() => setIsBroadcastModal(false)}>✕</button>
            </div>

            <form onSubmit={handlePublishBroadcast} className="p-6 space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Townhall & Product Demo"
                  value={broadTitle}
                  onChange={(e) => setBroadTitle(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Category</label>
                <select
                  value={broadCategory}
                  onChange={(e) => setBroadCategory(e.target.value as any)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                >
                  <option value="Company News">Company News</option>
                  <option value="Policy Update">Policy Update</option>
                  <option value="Leadership Message">Leadership Message</option>
                  <option value="Event">Event Notice</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details with entire organization..."
                  value={broadContent}
                  onChange={(e) => setBroadContent(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-lg"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kudos Modal */}
      {isKudosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0b0f19] border-white/10 text-white'
            }`}
          >
            <div className={`p-5 border-b flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-white/10'}`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Award size={16} className="text-indigo-400" />
                Award Peer Kudos
              </h3>
              <button onClick={() => setIsKudosModal(false)}>✕</button>
            </div>

            <form onSubmit={handleGiveKudos} className="p-6 space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Select Teammate</label>
                <select
                  value={kudosRecipientId}
                  onChange={(e) => setKudosRecipientId(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.name} ({e.designation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Badge</label>
                <select
                  value={kudosBadge}
                  onChange={(e) => setKudosBadge(e.target.value as any)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                >
                  <option value="Rockstar Dev">⚡ Rockstar Dev</option>
                  <option value="Innovation Driver">🚀 Innovation Driver</option>
                  <option value="Problem Solver">🧠 Problem Solver</option>
                  <option value="Team Player">🤝 Team Player</option>
                  <option value="Customer Hero">🌟 Customer Hero</option>
                  <option value="Culture Champion">🏆 Culture Champion</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Appreciation Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Express your gratitude..."
                  value={kudosMessage}
                  onChange={(e) => setKudosMessage(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsKudosModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-lg"
                >
                  Post to Wall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
