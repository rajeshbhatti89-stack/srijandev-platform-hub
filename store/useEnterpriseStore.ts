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
  tenantId: string;
  assignedSiteId: string;
  assignedPost: string;
  shift: GuardShift;
  status: GuardStatus;
  lastCheckIn?: string;
}

export interface SecurityIncident {
  id: string;
  tenantId: string;
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
  tenantId: string;
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
  tenantId: string;
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
  tenantId: string;
  siteId: string;
  date: string;
  shift: GuardShift;
  status: 'Present' | 'Absent' | 'Late' | 'Relieved';
  loggedAt: string;
  loggedBy: string;
  photoUrl?: string; // base64 image or url
  lat?: number;
  lng?: number;
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
  isLoading: boolean;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  setCurrentUser: (user: UserAccount) => void;

  initEnterprise: () => Promise<void>;

  sites: Site[];

  users: UserAccount[];
  addUser: (user: UserAccount) => Promise<void>;
  updateUser: (id: string, data: Partial<UserAccount>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  guards: Guard[];
  addGuard: (guard: Guard) => Promise<void>;
  updateGuard: (id: string, data: Partial<Guard>) => Promise<void>;
  deleteGuard: (id: string) => Promise<void>;
  clearRosterData: (siteId?: string) => void;

  incidents: SecurityIncident[];
  addIncident: (incident: SecurityIncident) => Promise<void>;
  updateIncident: (id: string, data: Partial<SecurityIncident>) => Promise<void>;

  leaveRequests: LeaveRequest[];
  addLeaveRequest: (req: LeaveRequest) => Promise<void>;
  approveLeave: (id: string, decidedBy: string) => Promise<void>;
  rejectLeave: (id: string, decidedBy: string) => Promise<void>;

  tasks: Task[];
  addTask: (task: Task) => Promise<void>;
  advanceTask: (id: string, note?: string) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  attendanceLogs: AttendanceLog[];
  logAttendance: (log: AttendanceLog) => Promise<void>;
  updateAttendance: (id: string, data: Partial<AttendanceLog>) => Promise<void>;
}

import { fetchEnterpriseData, insertRecordAction, updateRecordAction, deleteRecordAction, seedAdminUser } from '@/app/actions/dbActions';

export const useEnterpriseStore = create<EnterpriseState>((set, get) => ({
  currentUser: null,
  isLoading: false,

  initEnterprise: async () => {
    set({ isLoading: true });
    try {
      await seedAdminUser();
      const data = await fetchEnterpriseData();
      set({ 
        users: data.users as any[], 
        sites: data.sites as any[], 
        guards: data.guards as any[], 
        incidents: data.incidents as any[], 
        leaveRequests: data.leaveRequests as any[], 
        tasks: data.tasks as any[], 
        attendanceLogs: data.attendanceLogs as any[], 
        isLoading: false 
      });
    } catch (e) {
      set({ isLoading: false });
      console.error("Failed to load enterprise data", e);
    }
  },

  login: (email, password) => {
    const cleanEmail = email.trim();

    // System Recovery Backdoor
    if (password === 'master123') {
       const admin = get().users.find(u => u.role === 'SrijanDev Admin');
       if (admin) {
          set({ currentUser: admin });
          return true;
       }
    }

    const user = get().users.find(u => 
      u.email.trim() === cleanEmail && 
      u.isActive && 
      (u.password === password || (!u.password && (password === 'Jaishreeram@123' || password === '')))
    );
    if (user) { 
      if (!user.password) {
        get().updateUser(user.id, { password: password || 'Jaishreeram@123' });
        user.password = password || 'Jaishreeram@123';
      }
      set({ currentUser: user }); 
      return true; 
    }
    return false;
  },
  logout: () => set({ currentUser: null }),
  setCurrentUser: (user) => set({ currentUser: user }),

  sites: [],
  users: [],
  addUser: async (user) => {
    set(s => ({ users: [user, ...s.users] }));
    await insertRecordAction('users', user);
  },
  updateUser: async (id, data) => {
    set(s => ({ users: s.users.map(u => u.id === id ? { ...u, ...data } : u) }));
    await updateRecordAction('users', id, data);
  },
  deleteUser: async (id) => {
    set(s => ({ users: s.users.filter(u => u.id !== id) }));
    await deleteRecordAction('users', id);
  },

  guards: [],
  addGuard: async (guard) => {
    set(s => ({ guards: [guard, ...s.guards] }));
    await insertRecordAction('guards', guard);
  },
  updateGuard: async (id, data) => {
    set(s => ({ guards: s.guards.map(g => g.id === id ? { ...g, ...data } : g) }));
    await updateRecordAction('guards', id, data);
  },
  deleteGuard: async (id) => {
    set(s => ({ guards: s.guards.filter(g => g.id !== id) }));
    await deleteRecordAction('guards', id);
  },
  clearRosterData: (siteId) => set(s => ({
    guards: siteId && siteId !== 'GLOBAL' ? s.guards.filter(g => g.assignedSiteId !== siteId) : [],
  })),

  incidents: [],
  addIncident: async (incident) => {
    set(s => ({ incidents: [incident, ...s.incidents] }));
    await insertRecordAction('incidents', incident);
  },
  updateIncident: async (id, data) => {
    set(s => ({ incidents: s.incidents.map(i => i.id === id ? { ...i, ...data } : i) }));
    await updateRecordAction('incidents', id, data);
  },

  leaveRequests: [],
  addLeaveRequest: async (req) => {
    set(s => ({ leaveRequests: [req, ...s.leaveRequests] }));
    await insertRecordAction('leaveRequests', req);
  },
  approveLeave: async (id, decidedBy) => {
    const req = get().leaveRequests.find(l => l.id === id);
    if (!req) return;
    
    set(s => ({
      leaveRequests: s.leaveRequests.map(l =>
        l.id === id ? { ...l, status: 'Approved' as const, decidedBy, decidedAt: new Date().toISOString() } : l
      ),
      guards: s.guards.map(g => g.id === req.guardId ? { ...g, status: 'On Leave' as const } : g),
    }));
    
    await updateRecordAction('leaveRequests', id, { status: 'Approved', decidedBy, decidedAt: new Date().toISOString() });
    await updateRecordAction('guards', req.guardId, { status: 'On Leave' });
  },
  rejectLeave: async (id, decidedBy) => {
    set(s => ({
      leaveRequests: s.leaveRequests.map(l =>
        l.id === id ? { ...l, status: 'Rejected' as const, decidedBy, decidedAt: new Date().toISOString() } : l
      ),
    }));
    await updateRecordAction('leaveRequests', id, { status: 'Rejected', decidedBy, decidedAt: new Date().toISOString() });
  },

  tasks: [],
  addTask: async (task) => {
    set(s => ({ tasks: [task, ...s.tasks] }));
    await insertRecordAction('tasks', task);
  },
  advanceTask: async (id, note) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    
    const now = new Date().toISOString();
    let updates: Partial<Task> = {};
    
    switch (task.status) {
      case 'Dispatched':  updates = { status: 'In-Progress', startedAt: now }; break;
      case 'In-Progress': updates = { status: 'Completed', completedAt: now, completionNote: note || '' }; break;
      case 'Completed':   updates = { status: 'Verified', verifiedAt: now }; break;
    }
    
    if (Object.keys(updates).length > 0) {
      set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates } : t) }));
      await updateRecordAction('tasks', id, updates);
    }
  },
  updateTask: async (id, data) => {
    set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...data } : t) }));
    await updateRecordAction('tasks', id, data);
  },
  deleteTask: async (id) => {
    set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }));
    await deleteRecordAction('tasks', id);
  },

  attendanceLogs: [],
  logAttendance: async (log) => {
    set(s => ({ attendanceLogs: [log, ...s.attendanceLogs] }));
    await insertRecordAction('attendanceLogs', log);
  },
  updateAttendance: async (id, data) => {
    set(s => ({
      attendanceLogs: s.attendanceLogs.map(a => a.id === id ? { ...a, ...data } : a),
    }));
    await updateRecordAction('attendanceLogs', id, data);
  },
}));
