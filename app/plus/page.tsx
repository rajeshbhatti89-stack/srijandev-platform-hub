'use client';

import { useState } from 'react';
import Sidebar from '@/components/plus/Sidebar';
import TopBar from '@/components/plus/TopBar';
import FleetRegistry from '@/components/plus/modules/FleetRegistry';
import WorkforceManager from '@/components/plus/modules/WorkforceManager';
import DiagnosticsLogger from '@/components/plus/modules/DiagnosticsLogger';

export default function PlusDashboard() {
  const [activeTab, setActiveTab] = useState('fleet');

  const renderModule = () => {
    switch (activeTab) {
      case 'fleet': return <FleetRegistry />;
      case 'workforce': return <WorkforceManager />;
      case 'diagnostics': return <DiagnosticsLogger />;
      case 'settings': return (
        <div className="p-6 max-w-7xl mx-auto text-center text-gray-500 py-20">
          <h2 className="text-2xl font-bold text-white mb-2">System Settings</h2>
          <p>Global OS configurations will be available here.</p>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-950 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen md:ml-64 relative z-10 overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}
