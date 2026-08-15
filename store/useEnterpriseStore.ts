import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---------------------------------------------------------
// DATA MODELS
// ---------------------------------------------------------

export type Role = 'SrijanDev Admin' | 'Corporate HO Admin' | 'Plant Security Head';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId: string;       // 'GLOBAL' for SrijanDev Admin
  assignedSiteId: string; // 'GLOBAL' for Admin/HO Admin
  contactNo: string;
  isActive: boolean;
}

export type GuardDesignation =
  | 'Guard'
  | 'Armed Guard'
  | 'Gate Incharge'
  | 'Patrol Supervisor'
  | 'Female Guard';

export type GuardStatus = 'On Duty' | 'Standby' | 'On Leave' | 'Relieved';
export type GuardShift = 'Morning' | 'Evening' | 'Night';

export interface Guard {
  id: string;
  guardCode: string;    // human-readable e.g. GC-001
  personnelId: string;  // internal P-001
  name: string;
  phone: string;
  designation: GuardDesignation;
  assignedSiteId: string;
  assignedPost: string;
  shift: GuardShift;
  status: GuardStatus;
  lastCheckIn?: string;
}

export interface SecurityIncident {
  id: string;
  siteId: string;
  type: 'Visitor Pass' | 'Material Pass' | 'Security Breach' | 'Patrol Miss';
  direction?: 'Inward' | 'Outward';
  vehicleNo?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  reportedBy: string;
  timestamp: string;
  status: 'Open' | 'Resolved';
}

export interface Site {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
}

export interface LeaveRequest {
  id: string;
  guardId: string;
  guardName: string;
  siteId: string;
  leaveType: 'Sick' | 'Casual' | 'Emergency';
  fromDate: string;
  toDate: string;
  reason: string;
  substituteGuardId?: string;
  substituteGuardName?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
  decidedBy?: string;
  decidedAt?: string;
}

export type TaskCreatorRole =
  | 'Corporate HO Directive'
  | 'PSH Operational Task'
  | 'Supervisor Spot Task'
  | 'Auto-Scheduled Patrol';

export interface Task {
  id: string;
  siteId: string;
  title: string;
  description: string;
  creatorRole: TaskCreatorRole;
  assignedTo: string;
  assignedToName: string;
  post: string;
  taskType: 'Perimeter Inspection' | 'Weighbridge Audit' | 'Night Patrol' | 'CBM Vibration Check' | 'Access Control Check' | 'Custom';
  status: 'Dispatched' | 'In-Progress' | 'Completed' | 'Verified';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  verifiedAt?: string;
  completionNote?: string;
  createdBy: string;
}

export interface AttendanceLog {
  id: string;
  guardId: string;
  guardName: string;
  siteId: string;
  date: string;
  shift: GuardShift;
  status: 'Present' | 'Absent' | 'Late' | 'Relieved';
  loggedAt: string;
  loggedBy: string;
}

// ---------------------------------------------------------
// SEED DATA
// ---------------------------------------------------------

const SEED_SITES: Site[] = [
  { id: 'SITE-01', name: 'Darlaghat Cement Plant', status: 'Active' },
  { id: 'SITE-02', name: 'Bhatapara Cement Plant', status: 'Active' },
  { id: 'SITE-03', name: 'Chanda Cement Plant', status: 'Active' },
];

const SEED_USERS: UserAccount[] = [
  {
    id: 'SADMIN-001',
    name: 'Rajesh Bhatti',
    email: 'rajesh@srijandev.in',
    role: 'SrijanDev Admin',
    tenantId: 'GLOBAL',
    assignedSiteId: 'GLOBAL',
    contactNo: '+91 99999 00000',
    isActive: true,
  },
  {
    id: 'HO-001',
    name: 'Anand Mehta',
    email: 'anand.ho@adani.in',
    role: 'Corporate HO Admin',
    tenantId: 'TENANT-001',
    assignedSiteId: 'GLOBAL',
    contactNo: '+91 97771 00001',
    isActive: true,
  },
  {
    id: 'PSH-001',
    name: 'Vikram Singh',
    email: 'vikram.psh@srijandev.in',
    role: 'Plant Security Head',
    tenantId: 'TENANT-001',
    assignedSiteId: 'SITE-01',
    contactNo: '+91 98765 11111',
    isActive: true,
  },
  {
    id: 'PSH-002',
    name: 'Amit Patel',
    email: 'amit.psh@srijandev.in',
    role: 'Plant Security Head',
    tenantId: 'TENANT-001',
    assignedSiteId: 'SITE-02',
    contactNo: '+91 98765 22222',
    isActive: true,
  },
];

const SEED_GUARDS: Guard[] = [
  { id: 'GRD-101', guardCode: 'GC-001', personnelId: 'P-001', name: 'Ram Kumar',      phone: '+91 90001 00001', designation: 'Guard',           assignedSiteId: 'SITE-01', assignedPost: 'Main Gate 1',  shift: 'Morning', status: 'On Duty',  lastCheckIn: new Date().toISOString() },
  { id: 'GRD-102', guardCode: 'GC-002', personnelId: 'P-002', name: 'Suresh Yadav',   phone: '+91 90001 00002', designation: 'Armed Guard',      assignedSiteId: 'SITE-01', assignedPost: 'Weighbridge',  shift: 'Morning', status: 'On Duty',  lastCheckIn: new Date(Date.now() - 3600000).toISOString() },
  { id: 'GRD-103', guardCode: 'GC-003', personnelId: 'P-003', name: 'Priya Sharma',   phone: '+91 90001 00003', designation: 'Patrol Supervisor',assignedSiteId: 'SITE-01', assignedPost: 'Control Room', shift: 'Morning', status: 'On Duty' },
  { id: 'GRD-104', guardCode: 'GC-004', personnelId: 'P-004', name: 'Arun Singh',     phone: '+91 90001 00004', designation: 'Guard',           assignedSiteId: 'SITE-02', assignedPost: 'Perimeter',   shift: 'Night',   status: 'On Duty' },
  { id: 'GRD-105', guardCode: 'GC-005', personnelId: 'P-005', name: 'Manoj Tiwari',   phone: '+91 90001 00005', designation: 'Guard',           assignedSiteId: 'SITE-01', assignedPost: 'Material Gate',shift: 'Evening', status: 'On Leave' },
  { id: 'GRD-106', guardCode: 'GC-006', personnelId: 'P-006', name: 'Deepak Verma',   phone: '+91 90001 00006', designation: 'Guard',           assignedSiteId: 'SITE-01', assignedPost: 'Admin Block',  shift: 'Night',   status: 'On Duty' },
  { id: 'GRD-107', guardCode: 'GC-007', personnelId: 'P-007', name: 'Kavita Raje',    phone: '+91 90001 00007', designation: 'Gate Incharge',   assignedSiteId: 'SITE-02', assignedPost: 'Material Gate',shift: 'Morning', status: 'On Duty' },
  { id: 'GRD-108', guardCode: 'GC-008', personnelId: 'P-008', name: 'Sunita Devi',    phone: '+91 90001 00008', designation: 'Female Guard',     assignedSiteId: 'SITE-01', assignedPost: 'Admin Block',  shift: 'Morning', status: 'Standby' },
  { id: 'GRD-109', guardCode: 'GC-009', personnelId: 'P-009', name: 'Rajan Mishra',   phone: '+91 90001 00009', designation: 'Guard',           assignedSiteId: 'SITE-01', assignedPost: 'Main Gate 1',  shift: 'Evening', status: 'On Duty' },
  { id: 'GRD-110', guardCode: 'GC-010', personnelId: 'P-010', name: 'Balveer Thakur', phone: '+91 90001 00010', designation: 'Armed Guard',      assignedSiteId: 'SITE-03', assignedPost: 'Main Gate 1',  shift: 'Morning', status: 'On Duty' },
];

const SEED_INCIDENTS: SecurityIncident[] = [
  { id: 'INC-1001', siteId: 'SITE-01', type: 'Visitor Pass', severity: 'Low', description: 'Vendor maintenance team entry for kiln inspection.', reportedBy: 'Priya Sharma', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'Resolved' },
  { id: 'INC-1002', siteId: 'SITE-02', type: 'Security Breach', severity: 'High', description: 'Unauthorized vehicle near west perimeter fence.', reportedBy: 'System Geofence', timestamp: new Date().toISOString(), status: 'Open' },
  { id: 'INC-1003', siteId: 'SITE-01', type: 'Material Pass', direction: 'Outward', vehicleNo: 'MH-04-AK-1234', severity: 'Low', description: 'Scrap material outward movement. Approved by Vikram Singh.', reportedBy: 'Ram Kumar', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'Resolved' },
  { id: 'INC-1004', siteId: 'SITE-03', type: 'Patrol Miss', severity: 'Medium', description: 'Scheduled checkpoint at Kiln Area missed — guard did not scan within 20-minute window.', reportedBy: 'Auto-Patrol System', timestamp: new Date(Date.now() - 1800000).toISOString(), status: 'Open' },
];

const SEED_LEAVES: LeaveRequest[] = [
  {
    id: 'LV-001', guardId: 'GRD-105', guardName: 'Manoj Tiwari', siteId: 'SITE-01',
    leaveType: 'Sick', fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    reason: 'High fever and medical rest advised by doctor.',
    substituteGuardId: 'GRD-108', substituteGuardName: 'Sunita Devi',
    status: 'Approved', appliedAt: new Date(Date.now() - 86400000).toISOString(),
    decidedBy: 'Vikram Singh', decidedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'LV-002', guardId: 'GRD-103', guardName: 'Priya Sharma', siteId: 'SITE-01',
    leaveType: 'Casual',
    fromDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    toDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    reason: 'Family function.', status: 'Pending',
    appliedAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

const SEED_TASKS: Task[] = [
  {
    id: 'TSK-001', siteId: 'SITE-01',
    title: 'North Perimeter Fence Inspection',
    description: 'Check all fence lines and report any damage or breach points.',
    creatorRole: 'PSH Operational Task',
    assignedTo: 'GRD-106', assignedToName: 'Deepak Verma', post: 'Perimeter',
    taskType: 'Perimeter Inspection', status: 'In-Progress',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    startedAt: new Date(Date.now() - 3600000).toISOString(), createdBy: 'Vikram Singh',
  },
  {
    id: 'TSK-002', siteId: 'SITE-01',
    title: 'Weighbridge Morning Audit',
    description: 'Cross-check inward truck weights with GRN records.',
    creatorRole: 'Corporate HO Directive',
    assignedTo: 'GRD-102', assignedToName: 'Suresh Yadav', post: 'Weighbridge',
    taskType: 'Weighbridge Audit', status: 'Dispatched',
    createdAt: new Date(Date.now() - 1800000).toISOString(), createdBy: 'Anand Mehta',
  },
  {
    id: 'TSK-003', siteId: 'SITE-02',
    title: 'CBM Pump House Vibration Check',
    description: 'Inspect P-301 & P-302 pumps for abnormal vibration.',
    creatorRole: 'PSH Operational Task',
    assignedTo: 'GRD-104', assignedToName: 'Arun Singh', post: 'Pump House',
    taskType: 'CBM Vibration Check', status: 'Completed',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    startedAt: new Date(Date.now() - 10800000).toISOString(),
    completedAt: new Date(Date.now() - 3600000).toISOString(),
    completionNote: 'Both pumps nominal. No anomalies detected.', createdBy: 'Amit Patel',
  },
];

const SEED_ATTENDANCE: AttendanceLog[] = [
  { id: 'ATT-001', guardId: 'GRD-101', guardName: 'Ram Kumar',    siteId: 'SITE-01', date: new Date().toISOString().split('T')[0], shift: 'Morning', status: 'Present', loggedAt: new Date().toISOString(), loggedBy: 'Vikram Singh' },
  { id: 'ATT-002', guardId: 'GRD-102', guardName: 'Suresh Yadav', siteId: 'SITE-01', date: new Date().toISOString().split('T')[0], shift: 'Morning', status: 'Late',    loggedAt: new Date().toISOString(), loggedBy: 'Vikram Singh' },
  { id: 'ATT-003', guardId: 'GRD-103', guardName: 'Priya Sharma', siteId: 'SITE-01', date: new Date().toISOString().split('T')[0], shift: 'Morning', status: 'Present', loggedAt: new Date().toISOString(), loggedBy: 'Vikram Singh' },
  { id: 'ATT-004', guardId: 'GRD-105', guardName: 'Manoj Tiwari', siteId: 'SITE-01', date: new Date().toISOString().split('T')[0], shift: 'Evening', status: 'Absent',  loggedAt: new Date().toISOString(), loggedBy: 'Vikram Singh' },
];

// ---------------------------------------------------------
// STORE DEFINITION
// ---------------------------------------------------------

interface EnterpriseState {
  currentUser: UserAccount | null;
  login: (email: string) => boolean;
  logout: () => void;
  setCurrentUser: (user: UserAccount) => void;

  sites: Site[];

  users: UserAccount[];
  addUser: (user: UserAccount) => void;
  updateUser: (id: string, data: Partial<UserAccount>) => void;
  deleteUser: (id: string) => void;

  guards: Guard[];
  addGuard: (guard: Guard) => void;
  updateGuard: (id: string, data: Partial<Guard>) => void;
  deleteGuard: (id: string) => void;
  clearRosterData: (siteId?: string) => void;

  incidents: SecurityIncident[];
  addIncident: (incident: SecurityIncident) => void;
  updateIncident: (id: string, data: Partial<SecurityIncident>) => void;

  leaveRequests: LeaveRequest[];
  addLeaveRequest: (req: LeaveRequest) => void;
  approveLeave: (id: string, decidedBy: string) => void;
  rejectLeave: (id: string, decidedBy: string) => void;

  tasks: Task[];
  addTask: (task: Task) => void;
  advanceTask: (id: string, note?: string) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  attendanceLogs: AttendanceLog[];
  logAttendance: (log: AttendanceLog) => void;
  updateAttendance: (id: string, data: Partial<AttendanceLog>) => void;
}

export const useEnterpriseStore = create<EnterpriseState>()(
  persist(
    (set, get) => ({
      currentUser: null,

      login: (email) => {
        const user = get().users.find(u => u.email === email && u.isActive);
        if (user) { set({ currentUser: user }); return true; }
        return false;
      },
      logout: () => set({ currentUser: null }),
      setCurrentUser: (user) => set({ currentUser: user }),

      sites: SEED_SITES,

      users: SEED_USERS,
      addUser: (user) => set(s => ({ users: [user, ...s.users] })),
      updateUser: (id, data) => set(s => ({ users: s.users.map(u => u.id === id ? { ...u, ...data } : u) })),
      deleteUser: (id) => set(s => ({ users: s.users.filter(u => u.id !== id) })),

      guards: SEED_GUARDS,
      addGuard: (guard) => set(s => ({ guards: [guard, ...s.guards] })),
      updateGuard: (id, data) => set(s => ({ guards: s.guards.map(g => g.id === id ? { ...g, ...data } : g) })),
      deleteGuard: (id) => set(s => ({ guards: s.guards.filter(g => g.id !== id) })),
      clearRosterData: (siteId) => set(s => ({
        guards: siteId && siteId !== 'GLOBAL' ? s.guards.filter(g => g.assignedSiteId !== siteId) : [],
      })),

      incidents: SEED_INCIDENTS,
      addIncident: (incident) => set(s => ({ incidents: [incident, ...s.incidents] })),
      updateIncident: (id, data) => set(s => ({ incidents: s.incidents.map(i => i.id === id ? { ...i, ...data } : i) })),

      leaveRequests: SEED_LEAVES,
      addLeaveRequest: (req) => set(s => ({ leaveRequests: [req, ...s.leaveRequests] })),
      approveLeave: (id, decidedBy) => set(s => {
        const req = s.leaveRequests.find(l => l.id === id);
        if (!req) return {};
        return {
          leaveRequests: s.leaveRequests.map(l =>
            l.id === id ? { ...l, status: 'Approved' as const, decidedBy, decidedAt: new Date().toISOString() } : l
          ),
          guards: s.guards.map(g => g.id === req.guardId ? { ...g, status: 'On Leave' as const } : g),
        };
      }),
      rejectLeave: (id, decidedBy) => set(s => ({
        leaveRequests: s.leaveRequests.map(l =>
          l.id === id ? { ...l, status: 'Rejected' as const, decidedBy, decidedAt: new Date().toISOString() } : l
        ),
      })),

      tasks: SEED_TASKS,
      addTask: (task) => set(s => ({ tasks: [task, ...s.tasks] })),
      advanceTask: (id, note) => set(s => ({
        tasks: s.tasks.map(t => {
          if (t.id !== id) return t;
          const now = new Date().toISOString();
          switch (t.status) {
            case 'Dispatched':  return { ...t, status: 'In-Progress' as const, startedAt: now };
            case 'In-Progress': return { ...t, status: 'Completed' as const, completedAt: now, completionNote: note || '' };
            case 'Completed':   return { ...t, status: 'Verified' as const, verifiedAt: now };
            default: return t;
          }
        }),
      })),
      updateTask: (id, data) => set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...data } : t) })),
      deleteTask: (id) => set(s => ({ tasks: s.tasks.filter(t => t.id !== id) })),

      attendanceLogs: SEED_ATTENDANCE,
      logAttendance: (log) => set(s => ({ attendanceLogs: [log, ...s.attendanceLogs] })),
      updateAttendance: (id, data) => set(s => ({
        attendanceLogs: s.attendanceLogs.map(a => a.id === id ? { ...a, ...data } : a),
      })),
    }),
    { name: 'srijandev-security-os-v4' }
  )
);
