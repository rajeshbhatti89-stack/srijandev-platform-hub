import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  siteId: string;
  name: string;
  description: string;
  checkpoints: Checkpoint[];
  estimatedMinutes: number;
}

export interface PatrolLog {
  id: string;
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
  date: string; // YYYY-MM-DD
  post: string;
  shift: 'Morning' | 'Evening' | 'Night';
  guardId: string;
  guardName: string;
  siteId: string;
}

export interface GeofencePost {
  id: string;
  siteId: string;
  postName: string;
  radiusMeters: number;
  centerLat: number;
  centerLng: number;
}

export interface GeofenceCheckIn {
  id: string;
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
  // Patrol
  patrolRoutes: PatrolRoute[];
  addPatrolRoute: (route: PatrolRoute) => void;
  updatePatrolRoute: (id: string, data: Partial<PatrolRoute>) => void;
  deletePatrolRoute: (id: string) => void;

  patrolLogs: PatrolLog[];
  addPatrolLog: (log: PatrolLog) => void;
  scanCheckpoint: (logId: string, checkpointId: string, isOnTime: boolean, delayMinutes: number) => void;
  completePatrolLog: (logId: string) => void;
  breachPatrolLog: (logId: string, checkpointId: string) => void;

  // SOS
  sosAlerts: SOSAlert[];
  triggerSOS: (alert: SOSAlert) => void;
  acknowledgeSOS: (id: string, by: string) => void;
  resolveSOS: (id: string) => void;

  // Roster
  rosterSlots: RosterSlot[];
  setRosterSlots: (slots: RosterSlot[]) => void;
  updateRosterSlot: (id: string, data: Partial<RosterSlot>) => void;
  clearRoster: (siteId: string) => void;

  // Geofence
  geofencePosts: GeofencePost[];
  addGeofencePost: (post: GeofencePost) => void;
  updateGeofencePost: (id: string, data: Partial<GeofencePost>) => void;
  deleteGeofencePost: (id: string) => void;

  geofenceCheckIns: GeofenceCheckIn[];
  logGeofenceCheckIn: (checkIn: GeofenceCheckIn) => void;

  // Gate Passes
  gatePasses: GatePass[];
  addGatePass: (pass: GatePass) => void;
  closeGatePass: (id: string) => void;
  deleteGatePass: (id: string) => void;
}

export const useOperationsStore = create<OperationsState>()(
  persist(
    (set) => ({
      // Patrol Routes
      patrolRoutes: SEED_PATROL_ROUTES,
      addPatrolRoute: (route) => set(s => ({ patrolRoutes: [route, ...s.patrolRoutes] })),
      updatePatrolRoute: (id, data) => set(s => ({
        patrolRoutes: s.patrolRoutes.map(r => r.id === id ? { ...r, ...data } : r),
      })),
      deletePatrolRoute: (id) => set(s => ({ patrolRoutes: s.patrolRoutes.filter(r => r.id !== id) })),

      // Patrol Logs
      patrolLogs: SEED_PATROL_LOGS,
      addPatrolLog: (log) => set(s => ({ patrolLogs: [log, ...s.patrolLogs] })),
      scanCheckpoint: (logId, checkpointId, isOnTime, delayMinutes) => set(s => ({
        patrolLogs: s.patrolLogs.map(l => {
          if (l.id !== logId) return l;
          const scan: CheckpointScan = { checkpointId, scannedAt: new Date().toISOString(), isOnTime, delayMinutes };
          return { ...l, checkpointScans: [...l.checkpointScans, scan] };
        }),
      })),
      completePatrolLog: (logId) => set(s => ({
        patrolLogs: s.patrolLogs.map(l =>
          l.id === logId ? { ...l, status: 'Completed' as const, completedAt: new Date().toISOString() } : l
        ),
      })),
      breachPatrolLog: (logId, checkpointId) => set(s => ({
        patrolLogs: s.patrolLogs.map(l =>
          l.id === logId ? { ...l, status: 'Breached' as const, breachCheckpointId: checkpointId } : l
        ),
      })),

      // SOS
      sosAlerts: SEED_SOS_ALERTS,
      triggerSOS: (alert) => set(s => ({ sosAlerts: [alert, ...s.sosAlerts] })),
      acknowledgeSOS: (id, by) => set(s => ({
        sosAlerts: s.sosAlerts.map(a =>
          a.id === id
            ? { ...a, status: 'Acknowledged' as const, acknowledgedBy: by, acknowledgedAt: new Date().toISOString() }
            : a
        ),
      })),
      resolveSOS: (id) => set(s => ({
        sosAlerts: s.sosAlerts.map(a => a.id === id ? { ...a, status: 'Resolved' as const } : a),
      })),

      // Roster
      rosterSlots: SEED_ROSTER_SLOTS,
      setRosterSlots: (slots) => set({ rosterSlots: slots }),
      updateRosterSlot: (id, data) => set(s => ({
        rosterSlots: s.rosterSlots.map(r => r.id === id ? { ...r, ...data } : r),
      })),
      clearRoster: (siteId) => set(s => ({
        rosterSlots: s.rosterSlots.filter(r => r.siteId !== siteId),
      })),

      // Geofence Posts
      geofencePosts: SEED_GEOFENCE_POSTS,
      addGeofencePost: (post) => set(s => ({ geofencePosts: [post, ...s.geofencePosts] })),
      updateGeofencePost: (id, data) => set(s => ({
        geofencePosts: s.geofencePosts.map(p => p.id === id ? { ...p, ...data } : p),
      })),
      deleteGeofencePost: (id) => set(s => ({ geofencePosts: s.geofencePosts.filter(p => p.id !== id) })),

      // Geofence Check-ins
      geofenceCheckIns: SEED_GEOFENCE_CHECKINS,
      logGeofenceCheckIn: (checkIn) => set(s => ({ geofenceCheckIns: [checkIn, ...s.geofenceCheckIns] })),

      // Gate Passes
      gatePasses: SEED_GATE_PASSES,
      addGatePass: (pass) => set(s => ({ gatePasses: [pass, ...s.gatePasses] })),
      closeGatePass: (id) => set(s => ({
        gatePasses: s.gatePasses.map(p =>
          p.id === id ? { ...p, status: 'Closed' as const, exitAt: new Date().toISOString() } : p
        ),
      })),
      deleteGatePass: (id) => set(s => ({ gatePasses: s.gatePasses.filter(p => p.id !== id) })),
    }),
    { name: 'srijandev-ops-v1' }
  )
);
