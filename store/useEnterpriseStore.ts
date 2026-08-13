import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---------------------------------------------------------
// DATA MODELS
// ---------------------------------------------------------

export interface FleetAsset {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Standby' | 'Under Maintenance' | 'Breakdown';
  runningHours: number;
  fuelRate: number;
}

export interface Worker {
  id: string;
  name: string;
  role: 'Operator' | 'Maintenance' | 'Supervision' | 'Technician';
  shift: 'Morning' | 'Evening' | 'Night';
  contact: string;
  isPresent: boolean;
  currentSiteId?: string;
  lastCheckIn?: string;
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

export interface Site {
  id: string;
  name: string;
  status: 'Operational' | 'Delayed' | 'Closed';
  geofenceRadius: number; // in meters
  activeWorkers: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  siteId: string;
  status: 'Created' | 'Dispatched' | 'In-Progress' | 'Completed' | 'Verified';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: string;
}

export interface Expense {
  id: string;
  workerId: string;
  amount: number;
  category: 'Fuel' | 'Spares' | 'Travel' | 'Meals' | 'Other';
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
  date: string;
  notes: string;
}

// ---------------------------------------------------------
// SEED DATA
// ---------------------------------------------------------

const SEED_SITES: Site[] = [
  { id: 'SITE-A', name: 'Alpha Quarry', status: 'Operational', geofenceRadius: 500, activeWorkers: 12 },
  { id: 'SITE-B', name: 'Bravo Refinery', status: 'Operational', geofenceRadius: 300, activeWorkers: 8 },
  { id: 'SITE-C', name: 'Delta Exploration', status: 'Delayed', geofenceRadius: 1000, activeWorkers: 0 },
  { id: 'SITE-D', name: 'Echo Assembly', status: 'Operational', geofenceRadius: 400, activeWorkers: 15 },
];

const SEED_FLEET: FleetAsset[] = [
  { id: 'EQ-001', name: 'Excavator Alpha', type: 'Heavy Digger', status: 'Active', runningHours: 4200, fuelRate: 25 },
  { id: 'EQ-002', name: 'Haul Truck 42', type: 'Transport', status: 'Active', runningHours: 3100, fuelRate: 40 },
  { id: 'EQ-003', name: 'Drill Rig Beta', type: 'Drill', status: 'Under Maintenance', runningHours: 5600, fuelRate: 35 },
  { id: 'EQ-004', name: 'Dozer Gamma', type: 'Bulldozer', status: 'Breakdown', runningHours: 8900, fuelRate: 50 },
];

const SEED_WORKERS: Worker[] = [
  { id: 'WK-101', name: 'Rajesh Kumar', role: 'Operator', shift: 'Morning', contact: '+91 98765 43210', isPresent: true, currentSiteId: 'SITE-A', lastCheckIn: new Date().toISOString() },
  { id: 'WK-102', name: 'Priya Sharma', role: 'Supervision', shift: 'Morning', contact: '+91 98765 43211', isPresent: true, currentSiteId: 'SITE-B', lastCheckIn: new Date(Date.now() - 3600000).toISOString() },
  { id: 'WK-103', name: 'Amit Patel', role: 'Maintenance', shift: 'Evening', contact: '+91 98765 43212', isPresent: false },
  { id: 'WK-104', name: 'Sneha Reddy', role: 'Technician', shift: 'Morning', contact: '+91 98765 43213', isPresent: true, currentSiteId: 'SITE-A', lastCheckIn: new Date(Date.now() - 7200000).toISOString() },
  { id: 'WK-105', name: 'Vikram Singh', role: 'Operator', shift: 'Night', contact: '+91 98765 43214', isPresent: false },
];

const SEED_TASKS: Task[] = [
  { id: 'TSK-1001', title: 'Replace Hydraulic Hoses', description: 'EQ-003 needs immediate hose replacement on boom.', assigneeId: 'WK-103', siteId: 'SITE-B', status: 'Created', priority: 'High', createdAt: new Date().toISOString() },
  { id: 'TSK-1002', title: 'Site A Perimeter Check', description: 'Inspect geofence sensors along northern ridge.', assigneeId: 'WK-104', siteId: 'SITE-A', status: 'In-Progress', priority: 'Medium', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'TSK-1003', title: 'Engine Diagnostics', description: 'Run full diagnostics on EQ-004.', assigneeId: 'WK-104', siteId: 'SITE-A', status: 'Dispatched', priority: 'Critical', createdAt: new Date(Date.now() - 4000000).toISOString() },
  { id: 'TSK-1004', title: 'Daily Report Submission', description: 'Submit shift report for Alpha Quarry.', assigneeId: 'WK-102', siteId: 'SITE-A', status: 'Completed', priority: 'Low', createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const SEED_EXPENSES: Expense[] = [
  { id: 'EXP-501', workerId: 'WK-101', amount: 2500, category: 'Fuel', status: 'Approved', date: new Date(Date.now() - 86400000).toISOString(), notes: 'Diesel for generator' },
  { id: 'EXP-502', workerId: 'WK-103', amount: 8500, category: 'Spares', status: 'Pending', date: new Date().toISOString(), notes: 'Hydraulic hoses for EQ-003' },
  { id: 'EXP-503', workerId: 'WK-102', amount: 1200, category: 'Travel', status: 'Paid', date: new Date(Date.now() - 172800000).toISOString(), notes: 'Site visit taxi fare' },
];

const SEED_LOGS: DiagnosticLog[] = [
  { id: 'LOG-001', assetId: 'EQ-001', timestamp: new Date().toISOString(), vibrationLevel: 4.2, oilQuality: 85, alertTriggered: false, notes: 'Normal operation' },
  { id: 'LOG-002', assetId: 'EQ-004', timestamp: new Date(Date.now() - 3600000).toISOString(), vibrationLevel: 9.8, oilQuality: 35, alertTriggered: true, notes: 'Critical vibration and low oil quality detected!' },
];


// ---------------------------------------------------------
// STORE DEFINITION
// ---------------------------------------------------------

interface EnterpriseState {
  isPlusMode: boolean;
  setIsPlusMode: (val: boolean) => void;
  
  fleet: FleetAsset[];
  addAsset: (asset: FleetAsset) => void;
  updateAsset: (id: string, data: Partial<FleetAsset>) => void;
  deleteAsset: (id: string) => void;
  
  workforce: Worker[];
  addWorker: (worker: Worker) => void;
  updateWorker: (id: string, data: Partial<Worker>) => void;
  deleteWorker: (id: string) => void;
  
  diagnostics: DiagnosticLog[];
  addLog: (log: DiagnosticLog) => void;

  sites: Site[];
  addSite: (site: Site) => void;
  updateSite: (id: string, data: Partial<Site>) => void;

  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
}

export const useEnterpriseStore = create<EnterpriseState>()(
  persist(
    (set) => ({
      isPlusMode: false,
      setIsPlusMode: (val) => set({ isPlusMode: val }),
      
      fleet: SEED_FLEET,
      addAsset: (asset) => set((state) => ({ fleet: [asset, ...state.fleet] })),
      updateAsset: (id, data) => set((state) => ({
        fleet: state.fleet.map(a => a.id === id ? { ...a, ...data } : a)
      })),
      deleteAsset: (id) => set((state) => ({ fleet: state.fleet.filter(a => a.id !== id) })),
      
      workforce: SEED_WORKERS,
      addWorker: (worker) => set((state) => ({ workforce: [worker, ...state.workforce] })),
      updateWorker: (id, data) => set((state) => ({
        workforce: state.workforce.map(w => w.id === id ? { ...w, ...data } : w)
      })),
      deleteWorker: (id) => set((state) => ({ workforce: state.workforce.filter(w => w.id !== id) })),
      
      diagnostics: SEED_LOGS,
      addLog: (log) => set((state) => ({ diagnostics: [log, ...state.diagnostics] })),

      sites: SEED_SITES,
      addSite: (site) => set((state) => ({ sites: [site, ...state.sites] })),
      updateSite: (id, data) => set((state) => ({
        sites: state.sites.map(s => s.id === id ? { ...s, ...data } : s)
      })),

      tasks: SEED_TASKS,
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
      updateTask: (id, data) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...data } : t)
      })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),

      expenses: SEED_EXPENSES,
      addExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] })),
      updateExpense: (id, data) => set((state) => ({
        expenses: state.expenses.map(e => e.id === id ? { ...e, ...data } : e)
      }))
    }),
    {
      name: 'srijandev-enterprise-storage-v2', // bumped version to clear old cache automatically
    }
  )
);
