'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/mockData';

export const PricingSection: React.FC = () => {
  const [annualBilling, setAnnualBilling] = useState<boolean>(true);

  return (
    <section id="pricing" className="py-24 relative bg-dark-bg/80 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-400 mb-3">
            Transparent Enterprise Pricing
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Invest in High-Performing Digital Systems
          </p>
          <p className="text-slate-400 text-base">
            Choose the ideal scale for your enterprise. All plans include 24/7 SRE support and zero lock-in contracts.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <span className={`text-sm font-medium ${!annualBilling ? 'text-white font-bold' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className="w-14 h-8 rounded-full bg-slate-800 p-1 relative border border-slate-700 focus:outline-none"
            >
              <motion.div
                layout
                className="w-6 h-6 rounded-full bg-brand-500 shadow-glow-purple"
                animate={{ x: annualBilling ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium flex items-center space-x-1 ${annualBilling ? 'text-white font-bold' : 'text-slate-400'}`}>
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan, index) => {
            const price = annualBilling ? plan.annualPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden ${
                  plan.popular
                    ? 'border-2 border-brand-500 shadow-glow-purple bg-gradient-to-b from-brand-950/40 to-slate-900/80 scale-105 z-10'
                    : 'border border-slate-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-brand-600 to-purple-600 px-4 py-1 rounded-bl-2xl text-[10px] font-extrabold uppercase tracking-widest text-white flex items-center space-x-1 shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-extrabold text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mb-6 h-10">{plan.tagline}</p>

                  <div className="flex items-baseline space-x-1 mb-8">
                    <span className="text-4xl font-extrabold text-white">${price.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-mono">/ month</span>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-3 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#contact"
                  className={`w-full py-3.5 rounded-xl font-bold text-sm text-center flex items-center justify-center space-x-2 transition-all ${
                    plan.popular
                      ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-glow-purple'
                      : 'glass-panel hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
