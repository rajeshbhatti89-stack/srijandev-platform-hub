export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  userRole: UserRole;
  department: string;
  avatar: string;
  status: 'active' | 'on_leave' | 'remote' | 'offline';
  joinedDate: string;
  phone: string;
  location: string;
  taskCount: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'late' | 'absent' | 'half_day';
  hoursWorked: number;
  location: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
  dueDate: string;
  category: string;
  commentsCount: number;
}

export interface CRMLead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  value: number;
  stage: 'new' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost';
  assignedTo: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: 'policy' | 'project' | 'financial' | 'hr';
  size: string;
  updatedAt: string;
  author: string;
  downloadUrl: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'danger';
}

export interface DashboardMetrics {
  totalEmployees: number;
  presentToday: number;
  activeProjects: number;
  monthlyRevenue: number;
  openTasks: number;
  pendingLeaves: number;
  conversionRate: number;
}
