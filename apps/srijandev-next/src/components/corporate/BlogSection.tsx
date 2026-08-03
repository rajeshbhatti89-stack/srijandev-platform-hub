'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/mockData';

export const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-400 mb-3">
              Engineering Insights
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Latest Technical Publications & AI Trends
            </p>
          </div>

          <a
            href="#"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-3xl overflow-hidden glass-card-hover border border-slate-800 flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-brand-600/90 text-white backdrop-blur-md">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center space-x-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-brand-400" />
                      <span>{post.readTime}</span>
                    </span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 hover:text-brand-300 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {post.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Author Footer */}
              <div className="px-8 py-4 bg-slate-900/60 border-t border-slate-800 flex items-center space-x-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full border border-brand-500/40 object-cover"
                />
                <div className="text-xs">
                  <div className="font-semibold text-white">{post.author.name}</div>
                  <div className="text-slate-400">{post.author.role}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
};
