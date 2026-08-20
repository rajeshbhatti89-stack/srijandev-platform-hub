import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GuardShift } from './useEnterpriseStore';

// ---------------------------------------------------------
// DATA MODELS
// ---------------------------------------------------------

export interface Checkpoint {
  id: string;
  sequence: number;
  name: string;
  qrCode: string; // simulated QR payload
  location: string;
  expectedMinutes: number; // expected time from previous checkpoint
}

export interface CheckpointScan {
  checkpointId: string;
  scannedAt: string;
  isOnTime: boolean;
  delayMinutes: number;
}

export interface PatrolRoute {
  id: string;
  tenantId: string;
  siteId: string;
  name: string;
  description: string;
  checkpoints: Checkpoint[];
  estimatedMinutes: number;
}

export interface PatrolLog {
  id: string;
  tenantId: string;
  routeId: string;
  routeName: string;
  siteId: string;
  guardId: string;
  guardName: string;
  checkpointScans: CheckpointScan[];
  status: 'Active' | 'Completed' | 'Breached' | 'Abandoned';
  startedAt: string;
  completedAt?: string;
  breachCheckpointId?: string;
}

export interface SOSAlert {
  id: string;
  tenantId: string;
  guardId: string;
  guardName: string;
  siteId: string;
  post: string;
  coordinates: string; // "lat, lng" string
  timestamp: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface RosterSlot {
  id: string;
  tenantId: string;
  date: string; // YYYY-MM-DD
  post: string;
  shift: GuardShift;
  guardId: string;
  guardName: string;
  siteId: string;
}

export interface GeofencePost {
  id: string;
  tenantId: string;
  siteId: string;
  postName: string;
  radiusMeters: number;
  centerLat: number;
  centerLng: number;
}

export interface GeofenceCheckIn {
  id: string;
  tenantId: string;
  postId: string;
  postName: string;
  guardId: string;
  guardName: string;
  siteId: string;
  timestamp: string;
  status: 'Verified In-Fence' | 'Breach / Out-of-Fence';
  simulatedDistance: number; // metres from center
}

export interface GatePass {
  id: string;
  tenantId: string;
  siteId: string;
  passType: 'Material' | 'Visitor';
  direction: 'Inward' | 'Outward';
  // Material fields
  vehicleNo?: string;
  transporterName?: string;
  grossWeight?: number;
  netWeight?: number;
  driverName?: string;
  driverPhone?: string;
  materialDescription?: string;
  // Visitor fields
  visitorName?: string;
  visitorPhone?: string;
  visitorCompany?: string;
  hostName?: string;
  purpose?: string;
  // Common
  entryAt: string;
  exitAt?: string;
  status: 'Open' | 'Closed';
  createdBy: string;
}

// ---------------------------------------------------------
// SEED DATA
// ---------------------------------------------------------

const SEED_PATROL_ROUTES: PatrolRoute[] = [];

const SEED_PATROL_LOGS: PatrolLog[] = [];

const SEED_SOS_ALERTS: SOSAlert[] = [];

const SEED_GEOFENCE_POSTS: GeofencePost[] = [];

const SEED_GEOFENCE_CHECKINS: GeofenceCheckIn[] = [];

const SEED_GATE_PASSES: GatePass[] = [];

const SEED_ROSTER_SLOTS: RosterSlot[] = [];

// ---------------------------------------------------------
// STORE DEFINITION
// ---------------------------------------------------------

interface OperationsState {
  isLoading: boolean;
  initOperations: () => Promise<void>;

  // Patrol
  patrolRoutes: PatrolRoute[];
  addPatrolRoute: (route: PatrolRoute) => Promise<void>;
  updatePatrolRoute: (id: string, data: Partial<PatrolRoute>) => Promise<void>;
  deletePatrolRoute: (id: string) => Promise<void>;

  patrolLogs: PatrolLog[];
  addPatrolLog: (log: PatrolLog) => Promise<void>;
  scanCheckpoint: (logId: string, checkpointId: string, isOnTime: boolean, delayMinutes: number) => Promise<void>;
  completePatrolLog: (logId: string) => Promise<void>;
  breachPatrolLog: (logId: string, checkpointId: string) => Promise<void>;

  // SOS
  sosAlerts: SOSAlert[];
  triggerSOS: (alert: SOSAlert) => Promise<void>;
  acknowledgeSOS: (id: string, by: string) => Promise<void>;
  resolveSOS: (id: string) => Promise<void>;

  // Roster
  rosterSlots: RosterSlot[];
  setRosterSlots: (slots: RosterSlot[]) => Promise<void>;
  updateRosterSlot: (id: string, data: Partial<RosterSlot>) => Promise<void>;
  clearRoster: (siteId: string) => void; // local only

  // Geofence
  geofencePosts: GeofencePost[];
  addGeofencePost: (post: GeofencePost) => Promise<void>;
  updateGeofencePost: (id: string, data: Partial<GeofencePost>) => Promise<void>;
  deleteGeofencePost: (id: string) => Promise<void>;

  geofenceCheckIns: GeofenceCheckIn[];
  logGeofenceCheckIn: (checkIn: GeofenceCheckIn) => Promise<void>;

  // Gate Passes
  gatePasses: GatePass[];
  addGatePass: (pass: GatePass) => Promise<void>;
  closeGatePass: (id: string) => Promise<void>;
  deleteGatePass: (id: string) => Promise<void>;
}

import { fetchOperationsData, insertRecordAction, updateRecordAction, deleteRecordAction } from '@/app/actions/dbActions';

export const useOperationsStore = create<OperationsState>((set, get) => ({
  isLoading: false,

  initOperations: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchOperationsData();
      set({
        patrolRoutes: data.patrolRoutes as any[],
        patrolLogs: data.patrolLogs as any[],
        sosAlerts: data.sosAlerts as any[],
        rosterSlots: data.rosterSlots as any[],
        geofencePosts: data.geofencePosts as any[],
        geofenceCheckIns: data.geofenceCheckIns as any[],
        gatePasses: data.gatePasses as any[],
        isLoading: false,
      });
    } catch (e) {
      set({ isLoading: false });
      console.error("Failed to load operations data", e);
    }
  },

  // Patrol Routes
  patrolRoutes: [],
  addPatrolRoute: async (route) => {
    set(s => ({ patrolRoutes: [route, ...s.patrolRoutes] }));
    await insertRecordAction('patrolRoutes', route);
  },
  updatePatrolRoute: async (id, data) => {
    set(s => ({ patrolRoutes: s.patrolRoutes.map(r => r.id === id ? { ...r, ...data } : r) }));
    await updateRecordAction('patrolRoutes', id, data);
  },
  deletePatrolRoute: async (id) => {
    set(s => ({ patrolRoutes: s.patrolRoutes.filter(r => r.id !== id) }));
    await deleteRecordAction('patrolRoutes', id);
  },

  // Patrol Logs
  patrolLogs: [],
  addPatrolLog: async (log) => {
    set(s => ({ patrolLogs: [log, ...s.patrolLogs] }));
    await insertRecordAction('patrolLogs', log);
  },
  scanCheckpoint: async (logId, checkpointId, isOnTime, delayMinutes) => {
    const log = get().patrolLogs.find(l => l.id === logId);
    if (!log) return;
    const scan: CheckpointScan = { checkpointId, scannedAt: new Date().toISOString(), isOnTime, delayMinutes };
    const newScans = [...log.checkpointScans, scan];
    set(s => ({
      patrolLogs: s.patrolLogs.map(l => l.id === logId ? { ...l, checkpointScans: newScans } : l),
    }));
    await updateRecordAction('patrolLogs', logId, { checkpointScans: newScans });
  },
  completePatrolLog: async (logId) => {
    set(s => ({
      patrolLogs: s.patrolLogs.map(l => l.id === logId ? { ...l, status: 'Completed' as const, completedAt: new Date().toISOString() } : l),
    }));
    await updateRecordAction('patrolLogs', logId, { status: 'Completed', completedAt: new Date().toISOString() });
  },
  breachPatrolLog: async (logId, checkpointId) => {
    set(s => ({
      patrolLogs: s.patrolLogs.map(l => l.id === logId ? { ...l, status: 'Breached' as const, breachCheckpointId: checkpointId } : l),
    }));
    await updateRecordAction('patrolLogs', logId, { status: 'Breached', breachCheckpointId: checkpointId });
  },

  // SOS
  sosAlerts: [],
  triggerSOS: async (alert) => {
    set(s => ({ sosAlerts: [alert, ...s.sosAlerts] }));
    await insertRecordAction('sosAlerts', alert);
  },
  acknowledgeSOS: async (id, by) => {
    set(s => ({
      sosAlerts: s.sosAlerts.map(a =>
        a.id === id ? { ...a, status: 'Acknowledged' as const, acknowledgedBy: by, acknowledgedAt: new Date().toISOString() } : a
      ),
    }));
    await updateRecordAction('sosAlerts', id, { status: 'Acknowledged', acknowledgedBy: by, acknowledgedAt: new Date().toISOString() });
  },
  resolveSOS: async (id) => {
    set(s => ({ sosAlerts: s.sosAlerts.map(a => a.id === id ? { ...a, status: 'Resolved' as const } : a) }));
    await updateRecordAction('sosAlerts', id, { status: 'Resolved' });
  },

  // Roster
  rosterSlots: [],
  setRosterSlots: async (slots) => {
    // Overwrite the whole array in UI
    set({ rosterSlots: slots });
    // In a real app we'd batch update, but for this POC we insert one by one or batch
    for (const slot of slots) {
      await insertRecordAction('rosterSlots', slot);
    }
  },
  updateRosterSlot: async (id, data) => {
    set(s => ({ rosterSlots: s.rosterSlots.map(r => r.id === id ? { ...r, ...data } : r) }));
    await updateRecordAction('rosterSlots', id, data);
  },
  clearRoster: (siteId) => set(s => ({ rosterSlots: s.rosterSlots.filter(r => r.siteId !== siteId) })),

  // Geofence Posts
  geofencePosts: [],
  addGeofencePost: async (post) => {
    set(s => ({ geofencePosts: [post, ...s.geofencePosts] }));
    await insertRecordAction('geofencePosts', post);
  },
  updateGeofencePost: async (id, data) => {
    set(s => ({ geofencePosts: s.geofencePosts.map(p => p.id === id ? { ...p, ...data } : p) }));
    await updateRecordAction('geofencePosts', id, data);
  },
  deleteGeofencePost: async (id) => {
    set(s => ({ geofencePosts: s.geofencePosts.filter(p => p.id !== id) }));
    await deleteRecordAction('geofencePosts', id);
  },

  // Geofence Check-ins
  geofenceCheckIns: [],
  logGeofenceCheckIn: async (checkIn) => {
    set(s => ({ geofenceCheckIns: [checkIn, ...s.geofenceCheckIns] }));
    await insertRecordAction('geofenceCheckIns', checkIn);
  },

  // Gate Passes
  gatePasses: [],
  addGatePass: async (pass) => {
    set(s => ({ gatePasses: [pass, ...s.gatePasses] }));
    await insertRecordAction('gatePasses', pass);
  },
  closeGatePass: async (id) => {
    set(s => ({
      gatePasses: s.gatePasses.map(p => p.id === id ? { ...p, status: 'Closed' as const, exitAt: new Date().toISOString() } : p),
    }));
    await updateRecordAction('gatePasses', id, { status: 'Closed', exitAt: new Date().toISOString() });
  },
  deleteGatePass: async (id) => {
    set(s => ({ gatePasses: s.gatePasses.filter(p => p.id !== id) }));
    await deleteRecordAction('gatePasses', id);
  },
}));
