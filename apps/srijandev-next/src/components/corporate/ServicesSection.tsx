'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Cpu, Cloud, Briefcase, Smartphone, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { CORPORATE_SERVICES } from '@/lib/mockData';

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-7 h-7 text-brand-400" />,
  Cpu: <Cpu className="w-7 h-7 text-cyan-400" />,
  Cloud: <Cloud className="w-7 h-7 text-purple-400" />,
  Briefcase: <Briefcase className="w-7 h-7 text-emerald-400" />,
  Smartphone: <Smartphone className="w-7 h-7 text-amber-400" />,
};

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-24 relative bg-dark-bg/60 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-400 mb-3">
            Core Enterprise Offerings
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Next-Gen Services Built for Industry Leaders
          </p>
          <p className="text-slate-400 text-base leading-relaxed">
            From modern web portals and high-scale cloud DevOps to autonomous AI agents, SrijanDev delivers full-lifecycle technology solutions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CORPORATE_SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 rounded-3xl glass-card-hover flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                {/* Service Icon */}
                <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {iconMap[service.icon] || <Code2 className="w-7 h-7 text-brand-400" />}
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {service.shortDesc}
                </p>

                {/* Feature Bullet Points */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies Badges & Price */}
              <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-xs text-slate-400 font-mono">
                  Starting <span className="text-white font-bold text-sm">{service.startingPrice}</span>
                </div>
                <a
                  href="#contact"
                  className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-slate-300 group-hover:bg-brand-600 group-hover:text-white transition-colors"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
