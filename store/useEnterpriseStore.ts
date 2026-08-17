import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---------------------------------------------------------
// DATA MODELS
// ---------------------------------------------------------

export type Role = 'SrijanDev Admin' | 'Corporate HO Admin' | 'Plant Security Head' | 'Supervisor';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  tenantId: string;       // 'GLOBAL' for SrijanDev Admin
  assignedSiteId: string; // 'GLOBAL' for Admin/HO Admin
  contactNo: string;
  isActive: boolean;
}

export type GuardDesignation = string;

export type GuardStatus = 'On Duty' | 'Standby' | 'On Leave' | 'Relieved';
export type GuardShift = 'Morning' | 'Evening' | 'Night' | 'A Shift' | 'B Shift' | 'C Shift' | 'G Shift' | 'General Shift';

export interface Guard {
  id: string;
  guardCode: string;    // human-readable e.g. GC-001
  personnelId: string;  // internal P-001
  name: string;
  phone: string;
  department?: string;
  company?: string;
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

const SEED_SITES: Site[] = [];

const SEED_USERS: UserAccount[] = [
  {
    id: 'SADMIN-001',
    name: 'Admin',
    email: 'admin@srijandev.in',
    password: 'Jaishreeram@123',
    role: 'SrijanDev Admin',
    tenantId: 'GLOBAL',
    assignedSiteId: 'GLOBAL',
    contactNo: '+91 99999 00000',
    isActive: true,
  },
];

const SEED_GUARDS: Guard[] = [];

const SEED_INCIDENTS: SecurityIncident[] = [];

const SEED_LEAVES: LeaveRequest[] = [];

const SEED_TASKS: Task[] = [];

const SEED_ATTENDANCE: AttendanceLog[] = [];

// ---------------------------------------------------------
// STORE DEFINITION
// ---------------------------------------------------------

interface EnterpriseState {
  currentUser: UserAccount | null;
  login: (email: string, password?: string) => boolean;
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

      login: (email, password) => {
        const user = get().users.find(u => u.email === email && u.isActive && u.password === password);
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
