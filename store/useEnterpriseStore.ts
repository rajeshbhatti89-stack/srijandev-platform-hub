import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FleetAsset {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Under Maintenance' | 'Standby' | 'Breakdown';
  runningHours: number;
  fuelRate: number;
  lastMaintenance: string;
}

export interface Worker {
  id: string;
  name: string;
  role: 'Operator' | 'Maintenance' | 'Supervision';
  shift: 'Morning' | 'Evening' | 'Night';
  contact: string;
  isPresent: boolean;
}

export interface DiagnosticLog {
  id: string;
  assetId: string;
  timestamp: string;
  vibrationLevel: number;
  oilQuality: number;
  alertTriggered: boolean;
  notes: string;
}

interface EnterpriseState {
  isPlusMode: boolean;
  setIsPlusMode: (mode: boolean) => void;
  
  fleet: FleetAsset[];
  addAsset: (asset: FleetAsset) => void;
  updateAsset: (id: string, asset: Partial<FleetAsset>) => void;
  deleteAsset: (id: string) => void;

  workforce: Worker[];
  addWorker: (worker: Worker) => void;
  updateWorker: (id: string, worker: Partial<Worker>) => void;
  deleteWorker: (id: string) => void;
  
  diagnostics: DiagnosticLog[];
  addLog: (log: DiagnosticLog) => void;
}

export const useEnterpriseStore = create<EnterpriseState>()(
  persist(
    (set) => ({
      isPlusMode: false,
      setIsPlusMode: (mode) => set({ isPlusMode: mode }),

      fleet: [
        { id: 'EQ-001', name: 'CAT 320 Excavator', type: 'Heavy Machinery', status: 'Active', runningHours: 12050, fuelRate: 22.5, lastMaintenance: '2023-10-01' },
        { id: 'EQ-002', name: 'Komatsu D155 Dozer', type: 'Heavy Machinery', status: 'Standby', runningHours: 8400, fuelRate: 35.0, lastMaintenance: '2023-11-15' },
      ],
      addAsset: (asset) => set((state) => ({ fleet: [...state.fleet, asset] })),
      updateAsset: (id, asset) => set((state) => ({
        fleet: state.fleet.map((a) => a.id === id ? { ...a, ...asset } : a)
      })),
      deleteAsset: (id) => set((state) => ({
        fleet: state.fleet.filter((a) => a.id !== id)
      })),

      workforce: [
        { id: 'WK-101', name: 'Amit Sharma', role: 'Operator', shift: 'Morning', contact: '+91 98765 43210', isPresent: true },
        { id: 'WK-102', name: 'Rajesh Kumar', role: 'Supervision', shift: 'Morning', contact: '+91 98765 12345', isPresent: true },
      ],
      addWorker: (worker) => set((state) => ({ workforce: [...state.workforce, worker] })),
      updateWorker: (id, worker) => set((state) => ({
        workforce: state.workforce.map((w) => w.id === id ? { ...w, ...worker } : w)
      })),
      deleteWorker: (id) => set((state) => ({
        workforce: state.workforce.filter((w) => w.id !== id)
      })),

      diagnostics: [],
      addLog: (log) => set((state) => ({ diagnostics: [log, ...state.diagnostics] })),
    }),
    {
      name: 'srijandev-enterprise-storage',
    }
  )
);
