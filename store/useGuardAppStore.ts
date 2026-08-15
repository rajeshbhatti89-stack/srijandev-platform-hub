import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GuardAppState {
  activeGuardId: string | null;
  login: (guardId: string) => void;
  logout: () => void;
  activeTab: 'home' | 'patrol' | 'tasks' | 'leave';
  setActiveTab: (tab: 'home' | 'patrol' | 'tasks' | 'leave') => void;
}

export const useGuardAppStore = create<GuardAppState>()(
  persist(
    (set) => ({
      activeGuardId: null,
      login: (guardId) => set({ activeGuardId: guardId }),
      logout: () => set({ activeGuardId: null }),
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    { name: 'srijandev-guardapp-v1' }
  )
);
