'use client';

import React, { useState, useEffect } from 'react';
import { useHRStore } from '@/store/useHRStore';
import HRSidebar from '@/components/hr/HRSidebar';
import HRTopBar from '@/components/hr/HRTopBar';
import QuickActionsModal from '@/components/hr/QuickActionsModal';

// Module Imports
import EmployeeDirectory from '@/components/hr/modules/EmployeeDirectory';
import OrgChart from '@/components/hr/modules/OrgChart';
import DocumentRepository from '@/components/hr/modules/DocumentRepository';
import LeaveManagement from '@/components/hr/modules/LeaveManagement';
import AttendanceTracker from '@/components/hr/modules/AttendanceTracker';
import HolidayEventsCalendar from '@/components/hr/modules/HolidayEventsCalendar';
import RecruitmentATS from '@/components/hr/modules/RecruitmentATS';
import DigitalOnboarding from '@/components/hr/modules/DigitalOnboarding';
import PerformanceTalent from '@/components/hr/modules/PerformanceTalent';
import TrainingDevelopment from '@/components/hr/modules/TrainingDevelopment';
import EmployeeSelfService from '@/components/hr/modules/EmployeeSelfService';
import HelpdeskTicketing from '@/components/hr/modules/HelpdeskTicketing';
import AnnouncementRecognition from '@/components/hr/modules/AnnouncementRecognition';
import AnalyticsReports from '@/components/hr/modules/AnalyticsReports';

export default function HRDashboardPage() {
  const { theme, activeTab, setActiveTab } = useHRStore();
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center space-y-3 font-sans">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-indigo-600 animate-spin p-0.5 shadow-xl">
          <div className="w-full h-full bg-[#030712] rounded-[14px]" />
        </div>
        <p className="text-xs font-bold tracking-widest uppercase text-amber-400 font-mono">
          Loading SrijanDev HR OS...
        </p>
      </div>
    );
  }

  const isLight = theme === 'light';

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'directory':
        return <EmployeeDirectory />;
      case 'orgchart':
        return <OrgChart />;
      case 'documents':
        return <DocumentRepository />;
      case 'leaves':
        return <LeaveManagement />;
      case 'attendance':
        return <AttendanceTracker />;
      case 'calendar':
        return <HolidayEventsCalendar />;
      case 'recruitment':
        return <RecruitmentATS />;
      case 'onboarding':
        return <DigitalOnboarding />;
      case 'performance':
        return <PerformanceTalent />;
      case 'training':
        return <TrainingDevelopment />;
      case 'ess':
        return <EmployeeSelfService />;
      case 'helpdesk':
        return <HelpdeskTicketing />;
      case 'announcements':
        return <AnnouncementRecognition />;
      case 'analytics':
        return <AnalyticsReports />;
      default:
        return <EmployeeDirectory />;
    }
  };

  return (
    <div
      className={`min-h-screen flex w-full transition-colors duration-200 font-['Outfit',sans-serif] ${
        isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#030712] text-slate-100'
      }`}
    >
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Sidebar */}
      <HRSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <HRTopBar
          onOpenQuickAction={() => setIsQuickActionOpen(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {renderActiveModule()}
        </main>
      </div>

      {/* Universal Quick Action Modal */}
      <QuickActionsModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
      />
    </div>
  );
}
