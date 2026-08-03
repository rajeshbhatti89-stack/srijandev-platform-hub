'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortal } from '@/features/portal/PortalContext';

// Corporate Components
import { CorporateNavbar } from '@/components/common/CorporateNavbar';
import { Hero } from '@/components/corporate/Hero';
import { ServicesSection } from '@/components/corporate/ServicesSection';
import { PortfolioSection } from '@/components/corporate/PortfolioSection';
import { PricingSection } from '@/components/corporate/PricingSection';
import { BlogSection } from '@/components/corporate/BlogSection';
import { CareersSection } from '@/components/corporate/CareersSection';
import { ContactSection } from '@/components/corporate/ContactSection';
import { Footer } from '@/components/common/Footer';

// Platform Components
import { PlatformSidebar } from '@/components/common/PlatformSidebar';
import { PortalSwitcher } from '@/components/common/PortalSwitcher';
import { CommandPalette } from '@/components/common/CommandPalette';
import { DashboardView } from '@/components/platform/DashboardView';
import { EmployeeView } from '@/components/platform/EmployeeView';
import { AttendanceView } from '@/components/platform/AttendanceView';
import { TaskBoardView } from '@/components/platform/TaskBoardView';
import { CRMView } from '@/components/platform/CRMView';
import { DocumentView } from '@/components/platform/DocumentView';
import { AnalyticsView } from '@/components/platform/AnalyticsView';
import { AdminView } from '@/components/platform/AdminView';

import { Bell, Search, ShieldCheck } from 'lucide-react';

export default function MainPage() {
  const { activePortal } = usePortal();
  const [platformTab, setPlatformTab] = useState<string>('dashboard');
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);

  return (
    <main className="min-h-screen bg-dark-bg text-slate-100 relative">
      
      {/* Global Command Palette Modal (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectTab={(tab) => setPlatformTab(tab)}
      />

      <AnimatePresence mode="wait">
        
        {/* PORTAL 1: CORPORATE WEBSITE */}
        {activePortal === 'corporate' && (
          <motion.div
            key="corporate-portal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen"
          >
            <CorporateNavbar />
            <div className="flex-1">
              <Hero />
              <ServicesSection />
              <PortfolioSection />
              <PricingSection />
              <BlogSection />
              <CareersSection />
              <ContactSection />
            </div>
            <Footer />
          </motion.div>
        )}

        {/* PORTAL 2: BUSINESS SAAS PLATFORM */}
        {activePortal === 'platform' && (
          <motion.div
            key="platform-portal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-screen bg-dark-bg"
          >
            {/* Platform Sidebar */}
            <PlatformSidebar activeTab={platformTab} setActiveTab={setPlatformTab} />

            {/* Platform Main Workspace Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              
              {/* Platform Top Header Bar */}
              <header className="h-20 sticky top-0 z-20 px-6 glass-panel border-b border-slate-800 flex items-center justify-between backdrop-blur-xl">
                
                {/* Search Bar / Command Palette Trigger */}
                <button
                  onClick={() => setIsCommandOpen(true)}
                  className="relative max-w-md w-full hidden md:flex items-center space-x-3 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-400 text-xs text-left hover:border-brand-500 transition-colors"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="flex-1">Search employees, tasks, leads, docs...</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 rounded border border-slate-700 font-mono text-slate-300">
                    Ctrl+K
                  </kbd>
                </button>

                {/* Right Header: Notifications & Portal Switcher */}
                <div className="flex items-center space-x-4 ml-auto">
                  <button className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-white relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
                  </button>

                  <PortalSwitcher variant="header" />
                </div>
              </header>

              {/* Dynamic Platform View Content */}
              <div className="p-6 md:p-8 flex-1 max-w-7xl mx-auto w-full">
                {platformTab === 'dashboard' && <DashboardView setActiveTab={setPlatformTab} />}
                {platformTab === 'employees' && <EmployeeView />}
                {platformTab === 'attendance' && <AttendanceView />}
                {platformTab === 'tasks' && <TaskBoardView />}
                {platformTab === 'crm' && <CRMView />}
                {platformTab === 'documents' && <DocumentView />}
                {platformTab === 'analytics' && <AnalyticsView />}
                {platformTab === 'admin' && <AdminView />}
                {platformTab === 'settings' && (
                  <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-4">
                    <h2 className="text-xl font-bold text-white">System Settings & Role-Based Access</h2>
                    <p className="text-xs text-slate-400">Configure Supabase Auth credentials, Prisma connection string, and Webhook integrations.</p>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}
