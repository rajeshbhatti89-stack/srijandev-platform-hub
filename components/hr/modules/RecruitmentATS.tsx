'use client';

import React, { useState } from 'react';
import { useHRStore, JobOpening, Candidate, CandidateStage } from '@/store/useHRStore';
import {
  Briefcase,
  Users,
  Plus,
  Filter,
  Search,
  Star,
  Calendar,
  Clock,
  Video,
  FileText,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building,
  MapPin
} from 'lucide-react';

export default function RecruitmentATS() {
  const {
    theme,
    jobs,
    addJob,
    updateJob,
    candidates,
    addCandidate,
    updateCandidateStage,
    addCandidateNote,
    scheduleInterview
  } = useHRStore();

  const isLight = theme === 'light';
  const [activeView, setActiveView] = useState<'pipeline' | 'jobs'>('pipeline');
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('All');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isNewCandidateModal, setIsNewCandidateModal] = useState(false);
  const [isScheduleModal, setIsScheduleModal] = useState(false);

  // New Candidate Form State
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candJobId, setCandJobId] = useState(jobs[0]?.id || 'JOB-001');
  const [candExp, setCandExp] = useState('4.5');
  const [candCtc, setCandCtc] = useState('₹28 LPA');

  // Interview Schedule Form State
  const [roundName, setRoundName] = useState('Technical Architecture & Live Coding');
  const [interviewTime, setInterviewTime] = useState('2026-09-08T15:00');
  const [interviewer, setInterviewer] = useState('Rajesh Bhatti');

  const STAGES: CandidateStage[] = [
    'Applied',
    'Screening',
    'Technical Round',
    'HR Interview',
    'Offered',
    'Hired'
  ];

  const filteredCandidates = candidates.filter((c) => {
    if (selectedJobFilter === 'All') return true;
    return c.jobId === selectedJobFilter;
  });

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName || !candEmail) return;
    const targetJob = jobs.find((j) => j.id === candJobId) || jobs[0];
    const newCand: Candidate = {
      id: `CAN-${Date.now().toString().slice(-3)}`,
      jobId: targetJob.id,
      jobTitle: targetJob.title,
      name: candName,
      email: candEmail,
      phone: candPhone || '+91 98000 12345',
      experienceYears: parseFloat(candExp) || 3.0,
      expectedCtc: candCtc,
      noticePeriod: '30 Days',
      stage: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      resumeFileName: `${candName.replace(/\s+/g, '_')}_Resume.pdf`,
      rating: 4,
      skills: ['TypeScript', 'React', 'Three.js'],
      notes: [{ id: 'n-init', author: 'Ananya Deshmukh', text: 'Candidate profile ingested via careers portal.', date: new Date().toISOString().split('T')[0] }],
    };
    addCandidate(newCand);
    setIsNewCandidateModal(false);
    setCandName('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !newNoteText.trim()) return;
    addCandidateNote(selectedCandidate.id, 'Priya Nair (HR)', newNoteText);
    setNewNoteText('');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    scheduleInterview(selectedCandidate.id, {
      roundName,
      dateTime: interviewTime,
      interviewer,
      meetLink: `https://meet.google.com/srj-${Math.random().toString(36).substring(7)}`,
    });
    setIsScheduleModal(false);
    alert('Interview scheduled! Calendar invites dispatched to candidate and interviewer.');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">Recruitment & Applicant Tracking (ATS)</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {candidates.length} Active Applicants
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Requisition pipeline, Kanban stage progression, scorecards, resume reviews & interview schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-xl border flex items-center ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-white/10'}`}>
            <button
              onClick={() => setActiveView('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'pipeline'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Kanban Pipeline
            </button>
            <button
              onClick={() => setActiveView('jobs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'jobs'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💼 Active Job Openings ({jobs.length})
            </button>
          </div>

          <button
            onClick={() => setIsNewCandidateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-md transition-all active:scale-95"
          >
            <Plus size={15} />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {activeView === 'pipeline' ? (
        <div className="space-y-4">
          {/* Job Filter Dropdown */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Filter by Vacancy:</span>
              <select
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                className={`text-xs px-3 py-1.5 rounded-xl border outline-none font-semibold ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/15'
                }`}
              >
                <option value="All">All Job Openings ({jobs.length})</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
                ))}
              </select>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {filteredCandidates.length} candidate profiles in funnel
            </span>
          </div>

          {/* Kanban Board Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-4 custom-scrollbar">
            {STAGES.map((stage) => {
              const stageCandidates = filteredCandidates.filter((c) => c.stage === stage);
              return (
                <div
                  key={stage}
                  className={`p-3 rounded-2xl border flex flex-col min-w-[220px] ${
                    isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/60 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-inherit">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-500">
                      {stage}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {stageCandidates.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {stageCandidates.map((cand) => (
                      <div
                        key={cand.id}
                        onClick={() => setSelectedCandidate(cand)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] shadow-sm group ${
                          isLight ? 'bg-white border-slate-200 hover:border-indigo-400' : 'bg-slate-900 border-white/10 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-bold truncate group-hover:text-amber-500 transition-colors">
                            {cand.name}
                          </p>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            <Star size={10} className="fill-amber-400" />
                            <span className="text-[9px] font-bold">{cand.rating}</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-400 font-medium truncate">{cand.jobTitle}</p>

                        <div className="mt-2 pt-2 border-t border-inherit flex items-center justify-between text-[9px] text-slate-400">
                          <span>{cand.experienceYears}y exp</span>
                          <span className="font-mono text-amber-400">{cand.expectedCtc}</span>
                        </div>

                        {/* Fast Move Next Stage Arrow */}
                        <div className="mt-2 flex items-center justify-between pt-1 border-t border-white/5">
                          <span className="text-[9px] font-mono opacity-60">{cand.id}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentIndex = STAGES.indexOf(cand.stage);
                              if (currentIndex < STAGES.length - 1) {
                                updateCandidateStage(cand.id, STAGES[currentIndex + 1]);
                              }
                            }}
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-0.5"
                            title="Advance to next stage"
                          >
                            Advance →
                          </button>
                        </div>
                      </div>
                    ))}

                    {stageCandidates.length === 0 && (
                      <div className="h-24 flex items-center justify-center text-[10px] text-slate-500 italic">
                        No candidates in this round
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Job Openings Manager View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`p-6 rounded-3xl border transition-all ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {job.department}
                  </span>
                  <h3 className="text-base font-bold mt-1.5">{job.title}</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {job.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs my-3">
                <div className="text-slate-400">Experience: <strong className="text-white">{job.experience}</strong></div>
                <div className="text-slate-400">Budget: <strong className="text-amber-400">{job.salaryRange}</strong></div>
                <div className="text-slate-400">Workplace: <strong className="text-white">{job.workplace}</strong></div>
                <div className="text-slate-400">Applicants: <strong className="text-indigo-400">{job.applicantsCount} In Funnel</strong></div>
              </div>

              <p className={`text-xs mt-2 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {job.description}
              </p>

              <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 font-mono">Posted: {job.postedDate}</span>
                <button
                  onClick={() => {
                    setSelectedJobFilter(job.id);
                    setActiveView('pipeline');
                  }}
                  className="font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1"
                >
                  View Pipeline Candidates →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Scorecard & Detail Drawer */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-xl h-full flex flex-col shadow-2xl ${
              isLight ? 'bg-white text-slate-900' : 'bg-[#0b0f19] text-white border-l border-white/10'
            }`}
          >
            {/* Drawer Header */}
            <div className={`p-6 border-b flex items-start justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-white/10'}`}>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black">{selectedCandidate.name}</h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                    {selectedCandidate.id}
                  </span>
                </div>
                <p className="text-xs font-semibold text-indigo-400">{selectedCandidate.jobTitle}</p>
                <p className="text-[11px] text-slate-400">{selectedCandidate.email} · {selectedCandidate.phone}</p>
              </div>

              <button onClick={() => setSelectedCandidate(null)}>
                <XCircle size={20} className="text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Stage Progression Selector */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-amber-500 block mb-1.5">
                  Current Recruitment Stage
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map((st) => (
                    <button
                      key={st}
                      onClick={() => updateCandidateStage(selectedCandidate.id, st)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        selectedCandidate.stage === st
                          ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md'
                          : isLight
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Candidate Quick Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-slate-400 text-[10px] block">Experience</span>
                  <span className="font-bold">{selectedCandidate.experienceYears} Years</span>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-slate-400 text-[10px] block">Expected CTC</span>
                  <span className="font-bold text-amber-400">{selectedCandidate.expectedCtc}</span>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-slate-400 text-[10px] block">Notice Period</span>
                  <span className="font-bold">{selectedCandidate.noticePeriod}</span>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <span className="text-slate-400 text-[10px] block">Resume Document</span>
                  <span className="font-bold text-indigo-400 flex items-center gap-1 cursor-pointer">
                    <FileText size={12} /> {selectedCandidate.resumeFileName}
                  </span>
                </div>
              </div>

              {/* Interview Schedule Box */}
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-indigo-50/50 border-indigo-200' : 'bg-indigo-950/20 border-indigo-500/30'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold flex items-center gap-1.5 text-indigo-400">
                    <Video size={14} /> Interview Schedule
                  </h4>
                  <button
                    onClick={() => setIsScheduleModal(true)}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {selectedCandidate.interviewSchedule ? 'Reschedule' : 'Schedule Round'}
                  </button>
                </div>

                {selectedCandidate.interviewSchedule ? (
                  <div className="text-xs space-y-1">
                    <p className="font-bold">{selectedCandidate.interviewSchedule.roundName}</p>
                    <p className="text-slate-400">Interviewer: {selectedCandidate.interviewSchedule.interviewer}</p>
                    <p className="text-slate-400 font-mono">Date: {selectedCandidate.interviewSchedule.dateTime}</p>
                    {selectedCandidate.interviewSchedule.meetLink && (
                      <a
                        href={selectedCandidate.interviewSchedule.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-amber-400 font-bold mt-1 hover:underline"
                      >
                        Join Google Meet Room →
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No interview scheduled yet for this candidate.</p>
                )}
              </div>

              {/* Interviewer Scorecard & Notes Thread */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                  <MessageSquare size={14} /> Evaluation Notes & Feedback
                </h4>

                <div className="space-y-2">
                  {selectedCandidate.notes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-xl border text-xs ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-amber-400">{note.author}</span>
                        <span className="text-[10px] font-mono text-slate-400">{note.date}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add interview feedback note..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className={`flex-1 text-xs p-2.5 rounded-xl border outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90"
                  >
                    Post Note
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {isScheduleModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0b0f19] border-white/10 text-white'
            }`}
          >
            <div className={`p-5 border-b flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-white/10'}`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Video size={16} className="text-indigo-400" />
                Schedule Interview for {selectedCandidate.name}
              </h3>
              <button onClick={() => setIsScheduleModal(false)}>✕</button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Round Title</label>
                <input
                  type="text"
                  required
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className={`w-full text-xs p-2 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Interviewer</label>
                <input
                  type="text"
                  required
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-lg"
                >
                  Confirm & Send Calendar Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Candidate Modal */}
      {isNewCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0b0f19] border-white/10 text-white'
            }`}
          >
            <div className={`p-5 border-b flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-white/10'}`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Briefcase size={16} className="text-amber-500" />
                Add Candidate Profile
              </h3>
              <button onClick={() => setIsNewCandidateModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddCandidate} className="p-6 space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Candidate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Iyer"
                  value={candName}
                  onChange={(e) => setCandName(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="maya@gmail.com"
                    value={candEmail}
                    onChange={(e) => setCandEmail(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98000 00000"
                    value={candPhone}
                    onChange={(e) => setCandPhone(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Target Requisition</label>
                <select
                  value={candJobId}
                  onChange={(e) => setCandJobId(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={candExp}
                    onChange={(e) => setCandExp(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Expected CTC</label>
                  <input
                    type="text"
                    value={candCtc}
                    onChange={(e) => setCandCtc(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCandidateModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-lg"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
