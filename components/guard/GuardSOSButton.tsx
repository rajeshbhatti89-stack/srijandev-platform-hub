'use client';

import { useState, useEffect } from 'react';
import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import { ShieldAlert, Info } from 'lucide-react';

interface GuardSOSButtonProps {
  siteId: string;
  reporter: string;
}

export default function GuardSOSButton({ siteId, reporter }: GuardSOSButtonProps) {
  const addIncident = useEnterpriseStore(s => s.addIncident);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const handleSOS = () => {
      if (countdown === null) {
        setCountdown(3); // Start 3-second countdown
      }
    };

    window.addEventListener('TRIGGER_SOS', handleSOS as EventListener);
    return () => window.removeEventListener('TRIGGER_SOS', handleSOS as EventListener);
  }, [countdown]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Trigger actual SOS
      const incidentId = `SOS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      addIncident({
        id: incidentId,
        siteId,
        type: 'Security Breach',
        severity: 'Critical',
        description: '🚨 SOS PANIC ALERT TRIGGERED FROM GUARD COMPANION APP',
        reportedBy: reporter,
        timestamp: new Date().toISOString(),
        status: 'Open',
      });
      alert('SOS ALERT TRANSMITTED TO HQ!');
      setCountdown(null);
    }
  }, [countdown, siteId, reporter, addIncident]);

  return (
    <div className="bg-red-950/30 border border-red-500/20 rounded-2xl p-5 mt-4">
      <div className="flex items-start gap-3">
        <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="text-sm font-bold text-red-400 mb-1">Emergency Panic Response</h3>
          <p className="text-xs text-red-400/70 mb-3">Press the red button in the navigation bar to trigger a site-wide lockdown and notify HQ.</p>
          
          {countdown !== null && (
            <div className="bg-red-600 text-white font-black text-2xl py-3 rounded-xl text-center animate-pulse">
              TRANSMITTING IN {countdown}...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
