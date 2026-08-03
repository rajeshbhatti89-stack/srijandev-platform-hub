import { UserRole } from './platform';

export type ExtendedRole = 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'TEAM_LEAD' | 'EMPLOYEE' | 'CLIENT' | 'GUEST';

export type PermissionCategory =
  | 'dashboard'
  | 'projects'
  | 'crm'
  | 'employees'
  | 'attendance'
  | 'reports'
  | 'invoices'
  | 'settings'
  | 'users'
  | 'notifications'
  | 'media'
  | 'blog'
  | 'services'
  | 'careers'
  | 'audit';

export interface ProjectItem {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'active' | 'in_review' | 'completed' | 'on_hold';
  progress: number; // 0-100
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  teamMembers: { id: string; name: string; avatar: string; role: string }[];
}

export interface InvoiceItem {
  id: string;
  invoiceNo: string;
  clientName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  issueDate: string;
  dueDate: string;
  items: { description: string; hours: number; rate: number }[];
}

export interface PayrollRecord {
  id: string;
  employeeName: string;
  department: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  payDate: string;
  status: 'processed' | 'pending';
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  type: 'Annual PTO' | 'Sick Leave' | 'Maternity' | 'Unpaid';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  reportsTo?: string;
  subordinates?: OrgNode[];
}

export interface Applicant {
  id: string;
  candidateName: string;
  position: string;
  department: string;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: string;
  rating: number; // 1-5
}

export interface AssetItem {
  id: string;
  assetTag: string;
  name: string;
  category: 'laptop' | 'monitor' | 'phone' | 'license';
  assignedTo: string;
  serialNo: string;
  status: 'in_use' | 'available' | 'maintenance';
}

export interface TicketItem {
  id: string;
  ticketNo: string;
  subject: string;
  customer: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  category: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isDirect?: boolean;
}
