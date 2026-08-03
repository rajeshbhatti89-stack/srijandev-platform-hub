'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Send, X } from 'lucide-react';
import { CAREER_OPENINGS } from '@/lib/mockData';

export const CareersSection: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applied, setApplied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      setSelectedJob(null);
    }, 2500);
  };

  return (
    <section id="careers" className="py-24 relative bg-dark-bg/60 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 mb-3">
            Join Our Global Team
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Build the Future of Multi-Portal Software
          </p>
          <p className="text-slate-400 text-base">
            Work alongside principal architects, AI researchers, and UI experts in an innovative, high-impact culture.
          </p>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {CAREER_OPENINGS.map((job) => (
            <div
              key={job.id}
              className="glass-card p-8 rounded-3xl glass-card-hover border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {job.department}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{job.experience}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{job.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{job.description}</p>

                <div className="flex items-center space-x-4 text-xs text-slate-300 mb-6">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{job.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-brand-400" />
                    <span>{job.type}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedJob(job)}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-glow-purple transition-all flex items-center justify-center space-x-2"
              >
                <span>Apply for Position</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Application Modal */}
        <AnimatePresence>
          {selectedJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel w-full max-w-xl p-8 rounded-3xl border border-brand-500/30 relative"
              >
                <button
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white glass-panel"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-2xl font-bold text-white mb-2">Apply: {selectedJob.title}</h3>
                <p className="text-xs text-slate-400 mb-6">{selectedJob.department} • {selectedJob.location}</p>

                {applied ? (
                  <div className="p-8 text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h4 className="text-xl font-bold text-white">Application Received!</h4>
                    <p className="text-sm text-slate-300">Our HR team will reach out to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Bhatti"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="rajesh@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn / Portfolio URL</label>
                      <input
                        type="url"
                        required
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-glow-purple flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
