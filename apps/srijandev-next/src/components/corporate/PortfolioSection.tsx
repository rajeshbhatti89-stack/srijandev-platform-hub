'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, CheckCircle, ArrowRight, Quote } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '@/lib/mockData';

export const PortfolioSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Showcase' },
    { id: 'web', label: 'Web Portals' },
    { id: 'ai', label: 'AI & Automation' },
    { id: 'cloud', label: 'Cloud Architecture' },
    { id: 'erp', label: 'ERP & SaaS Platform' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="portfolio" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
          <div>
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 mb-3">
              Proven Track Record
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Client Projects & Case Studies
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2 p-1.5 glass-panel rounded-2xl border border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-brand-600 text-white shadow-glow-purple'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-3xl overflow-hidden glass-card-hover border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  {/* Image Cover */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-dark-bg/80 text-cyan-300 backdrop-blur-md border border-cyan-500/30">
                        {project.client}
                      </span>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {project.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Results Metrics */}
                    <div className="space-y-2 mb-6">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Key Impact & Metrics
                      </div>
                      {project.results.map((res, rIdx) => (
                        <div key={rIdx} className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{res}</span>
                        </div>
                      ))}
                    </div>

                    {/* Testimonial if available */}
                    {project.testimonial && (
                      <div className="p-4 rounded-2xl bg-brand-950/40 border border-brand-500/20 italic text-slate-300 text-xs relative">
                        <Quote className="w-4 h-4 text-brand-400 mb-1" />
                        "{project.testimonial.quote}"
                        <div className="mt-2 not-italic font-bold text-white text-[11px]">
                          — {project.testimonial.author}, <span className="text-slate-400">{project.testimonial.role}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tech Badges Footer */}
                <div className="px-8 py-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-slate-800 text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
