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

const SEED_PATROL_ROUTES: PatrolRoute[] = [
  {
    id: 'ROUTE-001',
    siteId: 'SITE-01',
    name: 'Main Security Perimeter Round',
    description: 'Complete perimeter patrol covering all gates and critical assets.',
    estimatedMinutes: 45,
    checkpoints: [
      { id: 'CP-001', sequence: 1, name: 'Main Gate 1', qrCode: 'QR::SITE01::MG1::001', location: 'North Entrance', expectedMinutes: 0 },
      { id: 'CP-002', sequence: 2, name: 'Weighbridge Post', qrCode: 'QR::SITE01::WB::002', location: 'East Wing', expectedMinutes: 8 },
      { id: 'CP-003', sequence: 3, name: 'Fuel Yard Checkpoint', qrCode: 'QR::SITE01::FY::003', location: 'South Storage', expectedMinutes: 10 },
      { id: 'CP-004', sequence: 4, name: 'Clinker Shed Inspection', qrCode: 'QR::SITE01::CS::004', location: 'West Production', expectedMinutes: 12 },
      { id: 'CP-005', sequence: 5, name: 'Explosive Magazine', qrCode: 'QR::SITE01::EM::005', location: 'Secure Zone A', expectedMinutes: 15 },
    ],
  },
  {
    id: 'ROUTE-002',
    siteId: 'SITE-01',
    name: 'Night Patrol — Production Zone',
    description: 'Night shift patrol for production and machinery zones.',
    estimatedMinutes: 30,
    checkpoints: [
      { id: 'CP-006', sequence: 1, name: 'Control Room', qrCode: 'QR::SITE01::CR::006', location: 'Admin Block', expectedMinutes: 0 },
      { id: 'CP-007', sequence: 2, name: 'Kiln Area', qrCode: 'QR::SITE01::KA::007', location: 'Production Zone', expectedMinutes: 10 },
      { id: 'CP-008', sequence: 3, name: 'Material Gate', qrCode: 'QR::SITE01::MG::008', location: 'South Gate', expectedMinutes: 10 },
    ],
  },
  {
    id: 'ROUTE-003',
    siteId: 'SITE-02',
    name: 'Bhatapara — Perimeter & Logistics',
    description: 'Full logistics hub perimeter patrol.',
    estimatedMinutes: 35,
    checkpoints: [
      { id: 'CP-009', sequence: 1, name: 'Gate Alpha', qrCode: 'QR::SITE02::GA::009', location: 'North Entrance', expectedMinutes: 0 },
      { id: 'CP-010', sequence: 2, name: 'Truck Bay 1', qrCode: 'QR::SITE02::TB1::010', location: 'East Bay', expectedMinutes: 10 },
      { id: 'CP-011', sequence: 3, name: 'Warehouse Zone', qrCode: 'QR::SITE02::WZ::011', location: 'Storage', expectedMinutes: 10 },
      { id: 'CP-012', sequence: 4, name: 'Admin Perimeter', qrCode: 'QR::SITE02::AP::012', location: 'Admin Block', expectedMinutes: 15 },
    ],
  },
];

const SEED_PATROL_LOGS: PatrolLog[] = [
  {
    id: 'LOG-001',
    routeId: 'ROUTE-001',
    routeName: 'Main Security Perimeter Round',
    siteId: 'SITE-01',
    guardId: 'GRD-106',
    guardName: 'Deepak Verma',
    checkpointScans: [
      { checkpointId: 'CP-001', scannedAt: new Date(Date.now() - 3600000).toISOString(), isOnTime: true, delayMinutes: 0 },
      { checkpointId: 'CP-002', scannedAt: new Date(Date.now() - 3100000).toISOString(), isOnTime: true, delayMinutes: 0 },
    ],
    status: 'Active',
    startedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const SEED_SOS_ALERTS: SOSAlert[] = [];

const SEED_GEOFENCE_POSTS: GeofencePost[] = [
  { id: 'GF-001', siteId: 'SITE-01', postName: 'Main Gate 1', radiusMeters: 75, centerLat: 31.5204, centerLng: 76.9254 },
  { id: 'GF-002', siteId: 'SITE-01', postName: 'Weighbridge', radiusMeters: 50, centerLat: 31.5218, centerLng: 76.9270 },
  { id: 'GF-003', siteId: 'SITE-01', postName: 'Fuel Yard', radiusMeters: 100, centerLat: 31.5195, centerLng: 76.9240 },
  { id: 'GF-004', siteId: 'SITE-02', postName: 'Gate Alpha', radiusMeters: 75, centerLat: 21.7298, centerLng: 81.7905 },
  { id: 'GF-005', siteId: 'SITE-02', postName: 'Truck Bay 1', radiusMeters: 60, centerLat: 21.7310, centerLng: 81.7920 },
];

const SEED_GEOFENCE_CHECKINS: GeofenceCheckIn[] = [
  { id: 'GCI-001', postId: 'GF-001', postName: 'Main Gate 1', guardId: 'GRD-101', guardName: 'Ram Kumar', siteId: 'SITE-01', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'Verified In-Fence', simulatedDistance: 23 },
  { id: 'GCI-002', postId: 'GF-002', postName: 'Weighbridge', guardId: 'GRD-102', guardName: 'Suresh Yadav', siteId: 'SITE-01', timestamp: new Date(Date.now() - 1800000).toISOString(), status: 'Breach / Out-of-Fence', simulatedDistance: 87 },
];

const SEED_GATE_PASSES: GatePass[] = [
  {
    id: 'GP-001', siteId: 'SITE-01', passType: 'Material', direction: 'Inward',
    vehicleNo: 'HP-65-C-4521', transporterName: 'Jai Bharat Logistics', grossWeight: 42, netWeight: 28,
    driverName: 'Ramesh Chauhan', driverPhone: '+91 98761 00001', materialDescription: 'Limestone (Grade A)',
    entryAt: new Date(Date.now() - 7200000).toISOString(), status: 'Closed',
    exitAt: new Date(Date.now() - 3600000).toISOString(), createdBy: 'Ram Kumar',
  },
  {
    id: 'GP-002', siteId: 'SITE-01', passType: 'Visitor', direction: 'Inward',
    visitorName: 'Manish Agarwal', visitorPhone: '+91 99887 00001', visitorCompany: 'ABB India Ltd.',
    hostName: 'Priya Sharma', purpose: 'Equipment calibration and service',
    entryAt: new Date(Date.now() - 1800000).toISOString(), status: 'Open',
    createdBy: 'Ram Kumar',
  },
  {
    id: 'GP-003', siteId: 'SITE-01', passType: 'Material', direction: 'Outward',
    vehicleNo: 'MH-04-AK-1234', transporterName: 'Shree Cement Movers', grossWeight: 35, netWeight: 32,
    driverName: 'Sunil Patil', driverPhone: '+91 98765 00002', materialDescription: 'Clinker — 32 MT',
    entryAt: new Date(Date.now() - 5400000).toISOString(), exitAt: new Date(Date.now() - 3000000).toISOString(),
    status: 'Closed', createdBy: 'Suresh Yadav',
  },
];

const SEED_ROSTER_SLOTS: RosterSlot[] = (() => {
  const posts = ['Main Gate 1', 'Weighbridge', 'Material Gate', 'Admin Block', 'Control Room'];
  const shifts: RosterSlot['shift'][] = ['Morning', 'Evening', 'Night'];
  const guards = [
    { id: 'GRD-101', name: 'Ram Kumar' },
    { id: 'GRD-102', name: 'Suresh Yadav' },
    { id: 'GRD-103', name: 'Priya Sharma' },
    { id: 'GRD-106', name: 'Deepak Verma' },
    { id: 'GRD-105', name: 'Manoj Tiwari' },
  ];
  const slots: RosterSlot[] = [];
  const today = new Date();
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    posts.forEach((post, pi) => {
      shifts.forEach((shift, si) => {
        const guardIdx = (d * 3 + pi + si) % guards.length;
        const g = guards[guardIdx];
        slots.push({
          id: `RS-${dateStr}-${pi}-${si}`,
          date: dateStr,
          post,
          shift,
          guardId: g.id,
          guardName: g.name,
          siteId: 'SITE-01',
        });
      });
    });
  }
  return slots;
})();

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
