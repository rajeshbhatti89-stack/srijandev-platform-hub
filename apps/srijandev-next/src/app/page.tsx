'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortal } from '@/features/portal/PortalContext';
import { AuthProvider, useAuth } from '@/features/auth/AuthContext';

// Corporate Components
import { CorporateNavbar } from '@/components/common/CorporateNavbar';
import { Hero } from '@/components/corporate/Hero';
import { ServicesSection } from '@/components/corporate/ServicesSection';
import { PortfolioSection } from '@/components/corporate/PortfolioSection';
import { PricingSection } from '@/components/corporate/PricingSection';
import { BlogSection } from '@/components/corporate/BlogSection';
import { CareersSection } from '@/components/corporate/CareersSection';
import { ContactSection } from '@/components/corporate/ContactSection';
import { CompanyStory } from '@/components/corporate/CompanyStory';
import { TechStackSection } from '@/components/corporate/TechStackSection';
import { Footer } from '@/components/common/Footer';

// Platform Components
import { PlatformSidebar } from '@/components/common/PlatformSidebar';
import { PortalSwitcher } from '@/components/common/PortalSwitcher';
import { CommandPalette } from '@/components/common/CommandPalette';
import { AuthModal } from '@/components/common/AuthModal';
import { NotificationDrawer } from '@/components/platform/NotificationDrawer';

import { DashboardView } from '@/components/platform/DashboardView';
import { EmployeeView } from '@/components/platform/EmployeeView';
import { AttendanceView } from '@/components/platform/AttendanceView';
import { TaskBoardView } from '@/components/platform/TaskBoardView';
import { EnterpriseCRM } from '@/components/platform/EnterpriseCRM';
import { ProjectsView } from '@/components/platform/ProjectsView';
import { FinanceView } from '@/components/platform/FinanceView';
import { LeaveView } from '@/components/platform/LeaveView';
import { OrgChartView } from '@/components/platform/OrgChartView';
import { RecruitmentView } from '@/components/platform/RecruitmentView';
import { AssetInventoryView } from '@/components/platform/AssetInventoryView';
import { PerformanceView } from '@/components/platform/PerformanceView';
import { KnowledgeBaseView } from '@/components/platform/KnowledgeBaseView';
import { FileManagerView } from '@/components/platform/FileManagerView';
import { InternalChatView } from '@/components/platform/InternalChatView';
import { AnalyticsView } from '@/components/platform/AnalyticsView';
import { AdminView } from '@/components/platform/AdminView';
import { PermissionGuard } from '@/components/common/PermissionGuard';

// SrijanDev Pulse — Field Force Portal
import { PulseSidebar } from '@/components/pulse/PulseSidebar';
import { PulseDashboard } from '@/components/pulse/PulseDashboard';
import { PulseGPSView } from '@/components/pulse/PulseGPSView';
import { PulseAttendanceView, PulsePatrolView, PulseIncidentView, PulseLeaveView } from '@/components/pulse/PulseOperationsViews';

import { Bell, Search, ShieldCheck, User, Home, LogOut } from 'lucide-react';

function PageContent() {
  const { activePortal } = usePortal();
  const { user, logout } = useAuth();
  const [platformTab, setPlatformTab] = useState<string>('dashboard');
  const [pulseTab, setPulseTab] = useState<string>('pulse-dashboard');
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const { switchPortal } = usePortal();
  const [mounted, setMounted] = useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-dark-bg" />;
  }

  return (
    <main className="min-h-screen bg-dark-bg text-slate-100 relative">
      
      {/* Global Modals & Drawers */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectTab={(tab) => setPlatformTab(tab)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
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
              <CompanyStory />
              <TechStackSection />
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
            {user ? <PlatformSidebar activeTab={platformTab} setActiveTab={setPlatformTab} /> : null}

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

                {/* Right Header Controls */}
                <div className="flex items-center space-x-3 ml-auto">
                  <button
                    onClick={() => setIsNotificationOpen(true)}
                    className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-white relative"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  </button>

                  <button
                    onClick={() => switchPortal('corporate')}
                    className="px-3 py-1.5 rounded-xl glass-panel text-xs text-slate-300 hover:text-white font-semibold flex items-center space-x-2 border border-slate-700"
                  >
                    <Home className="w-3.5 h-3.5 text-brand-400" />
                    <span>Website</span>
                  </button>

                  <button
                    onClick={() => user ? logout() : setIsAuthModalOpen(true)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition-colors ${
                      user ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300' 
                           : 'glass-panel text-slate-300 hover:text-white border-slate-700'
                    }`}
                  >
                    {user ? <LogOut className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5 text-purple-400" />}
                    <span>{user ? 'Logout' : 'Sign In'}</span>
                  </button>

                  <PortalSwitcher variant="header" />
                </div>
              </header>

              {/* Dynamic Platform Views */}
              <div className="p-6 md:p-8 flex-1 max-w-7xl mx-auto w-full">
                {!user ? (
                  <div className="flex flex-col items-center justify-center h-full pt-20">
                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-glow-purple">
                      <ShieldCheck className="w-10 h-10 text-brand-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Authentication Required</h2>
                    <p className="text-slate-400 max-w-md text-center mb-8">
                      You must be signed in to access the SrijanDev Nexus Enterprise Platform. Please authenticate to continue.
                    </p>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-500/30 transition-all"
                    >
                      Sign In to Platform
                    </button>
                  </div>
                ) : (
                  <>
                    {platformTab === 'dashboard' && <DashboardView setActiveTab={setPlatformTab} />}
                    {platformTab === 'projects' && <ProjectsView />}
                    {platformTab === 'employees' && <EmployeeView />}
                    {platformTab === 'attendance' && <AttendanceView />}
                    {platformTab === 'leaves' && <LeaveView />}
                    {platformTab === 'tasks' && <TaskBoardView />}
                    {platformTab === 'crm' && <EnterpriseCRM />}
                    {platformTab === 'finance' && <FinanceView />}
                    {platformTab === 'chat' && <InternalChatView />}
                    {platformTab === 'files' && <FileManagerView />}
                    {platformTab === 'org' && <OrgChartView />}
                    {platformTab === 'recruitment' && <RecruitmentView />}
                    {platformTab === 'assets' && <AssetInventoryView />}
                    {platformTab === 'performance' && <PerformanceView />}
                    {platformTab === 'knowledge' && <KnowledgeBaseView />}
                    {platformTab === 'analytics' && <AnalyticsView />}
                    {platformTab === 'admin' && (
                      <PermissionGuard requiredRole="ADMIN">
                        <AdminView />
                      </PermissionGuard>
                    )}
                  </>
                )}
              </div>

            </div>
          </motion.div>
        )}

        {/* PORTAL 3: SRIJANDEV PULSE — FIELD FORCE PLATFORM */}
        {activePortal === 'pulse' && (
          <motion.div
            key="pulse-portal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-screen"
            style={{ background: '#030f08' }}
          >
            {/* Pulse Sidebar */}
            {user ? <PulseSidebar activeTab={pulseTab} setActiveTab={setPulseTab} /> : null}

            {/* Pulse Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              
              {/* Pulse Top Header */}
              <header className="h-16 sticky top-0 z-20 px-6 flex items-center justify-between border-b border-emerald-900/40 backdrop-blur-xl" style={{ background: 'rgba(2,13,10,0.9)' }}>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-emerald-500 font-mono font-semibold">LIVE</span>
                    <span>•</span>
                    <span>SrijanDev Pulse Field Operations</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <PortalSwitcher variant="header" />
                  
                  <button
                    onClick={() => switchPortal('corporate')}
                    className="px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white font-semibold flex items-center space-x-2 border border-emerald-900/40"
                    style={{ background: 'rgba(16,185,129,0.05)' }}
                  >
                    <Home className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Website</span>
                  </button>

                  <button
                    onClick={() => user ? logout() : setIsAuthModalOpen(true)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition-colors ${
                      user ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
                           : 'text-slate-300 hover:text-white border-emerald-900/40'
                    }`}
                    style={user ? {} : { background: 'rgba(16,185,129,0.05)' }}
                  >
                    {user ? <LogOut className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{user ? 'Logout' : 'Sign In'}</span>
                  </button>
                </div>
              </header>

              {/* Pulse Views */}
              <div className="p-6 md:p-8 flex-1 max-w-7xl mx-auto w-full">
                {!user ? (
                  <div className="flex flex-col items-center justify-center h-full pt-20">
                    <div className="w-20 h-20 bg-emerald-950 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                      <ShieldCheck className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Field Agent Login</h2>
                    <p className="text-emerald-200/60 max-w-md text-center mb-8">
                      You must be signed in to access the SrijanDev Pulse Field Force Dashboard. Please authenticate to continue.
                    </p>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 transition-all"
                    >
                      Authenticate Agent
                    </button>
                  </div>
                ) : (
                  <>
                    {pulseTab === 'pulse-dashboard' && <PulseDashboard setActiveTab={setPulseTab} />}
                    {pulseTab === 'pulse-gps' && <PulseGPSView />}
                    {pulseTab === 'pulse-attendance' && <PulseAttendanceView />}
                    {pulseTab === 'pulse-patrol' && <PulsePatrolView />}
                    {pulseTab === 'pulse-incidents' && <PulseIncidentView />}
                    {pulseTab === 'pulse-leaves' && <PulseLeaveView />}
                    {pulseTab === 'pulse-analytics' && <AnalyticsView />}
                    {pulseTab === 'pulse-agents' && <EmployeeView />}
                    {pulseTab === 'pulse-admin' && <PermissionGuard requiredRole="ADMIN"><AdminView /></PermissionGuard>}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}

export default function MainPage() {
  return (
    <AuthProvider>
      <PageContent />
    </AuthProvider>
  );
}
