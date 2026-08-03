'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PortalType, PortalContextType } from '@/types/portal';

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePortal, setActivePortal] = useState<PortalType>('corporate');
  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Read local storage on initial mount
    const savedPortal = localStorage.getItem('srijandev_active_portal') as PortalType;
    if (savedPortal === 'corporate' || savedPortal === 'platform') {
      setActivePortal(savedPortal);
    }
  }, []);

  const switchPortal = (portal: PortalType) => {
    if (portal === activePortal) return;
    setIsSwitching(true);
    setActivePortal(portal);
    localStorage.setItem('srijandev_active_portal', portal);
    
    // Brief smooth animation timeout
    setTimeout(() => {
      setIsSwitching(false);
    }, 300);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Keyboard shortcut Alt+S to toggle portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        const next = activePortal === 'corporate' ? 'platform' : 'corporate';
        switchPortal(next);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePortal]);

  return (
    <PortalContext.Provider
      value={{
        activePortal,
        switchPortal,
        isSwitching,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextType => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
