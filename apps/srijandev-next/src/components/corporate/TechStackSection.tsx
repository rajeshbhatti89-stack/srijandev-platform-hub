'use client';

import React from 'react';
import { Code2, Cpu, Cloud, Database, Layers, ShieldCheck, Zap } from 'lucide-react';

export const TechStackSection: React.FC = () => {
  const stacks = [
    { category: 'Frontend & UI', items: ['Next.js 15', 'React 19', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Lucide Icons'] },
    { category: 'Backend & Data', items: ['Node.js', 'Prisma ORM', 'PostgreSQL', 'Supabase', 'Redis', 'GraphQL'] },
    { category: 'AI & Machine Learning', items: ['Python', 'TensorFlow', 'PyTorch', 'LangChain', 'OpenAI Vertex', 'Vector DB'] },
    { category: 'Cloud Infrastructure', items: ['AWS', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Datadog'] },
  ];

  return (
    <section id="tech-stack" className="py-20 relative bg-dark-bg/60 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 mb-3">Enterprise Tech Stack</h2>
          <p className="text-3xl font-extrabold text-white tracking-tight">Built with Modern Battle-Tested Technologies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stacks.map((stack, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl border border-slate-800">
              <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">{stack.category}</h3>
              <div className="flex flex-wrap gap-2">
                {stack.items.map((item, iIdx) => (
                  <span key={iIdx} className="px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
