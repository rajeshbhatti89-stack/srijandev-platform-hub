import {
  ProjectItem,
  InvoiceItem,
  PayrollRecord,
  LeaveRequest,
  OrgNode,
  Applicant,
  AssetItem,
  TicketItem,
  NotificationItem,
  ChatMessage,
} from '@/types/phase2';

export const PHASE2_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-101',
    name: 'NexusPay Banking Portal Modernization',
    client: 'Nexus Financial Group',
    status: 'active',
    progress: 78,
    startDate: '2026-05-01',
    endDate: '2026-09-15',
    budget: 185000,
    spent: 124000,
    teamMembers: [
      { id: 'emp-1', name: 'Rajesh Bhatti', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', role: 'Architect' },
      { id: 'emp-2', name: 'Aisha Sharma', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', role: 'AI Lead' },
    ],
  },
  {
    id: 'proj-102',
    name: 'ApexMed Clinical RAG Document System',
    client: 'Apex Health Systems',
    status: 'active',
    progress: 62,
    startDate: '2026-06-10',
    endDate: '2026-10-30',
    budget: 120000,
    spent: 72000,
    teamMembers: [
      { id: 'emp-2', name: 'Aisha Sharma', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', role: 'AI Lead' },
    ],
  },
  {
    id: 'proj-103',
    name: 'Veloce Multi-Region Kubernetes Mesh',
    client: 'Veloce Telecom',
    status: 'in_review',
    progress: 95,
    startDate: '2026-04-15',
    endDate: '2026-08-10',
    budget: 95000,
    spent: 91000,
    teamMembers: [
      { id: 'emp-4', name: 'Priya Nair', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80', role: 'DevOps Manager' },
    ],
  },
];

export const PHASE2_INVOICES: InvoiceItem[] = [
  {
    id: 'inv-801',
    invoiceNo: 'SRJN-2026-0801',
    clientName: 'Nexus Financial Group',
    amount: 42500,
    status: 'paid',
    issueDate: '2026-07-01',
    dueDate: '2026-07-30',
    items: [
      { description: 'Sprint 5 Next.js SSR & Prisma Integration', hours: 120, rate: 175 },
      { description: 'Redis Connection Pool Optimization', hours: 40, rate: 200 },
    ],
  },
  {
    id: 'inv-802',
    invoiceNo: 'SRJN-2026-0802',
    clientName: 'Apex Health Systems',
    amount: 28000,
    status: 'pending',
    issueDate: '2026-07-15',
    dueDate: '2026-08-15',
    items: [
      { description: 'LangChain Clinical Document Extractor', hours: 80, rate: 225 },
    ],
  },
];

export const PHASE2_PAYROLL: PayrollRecord[] = [
  {
    id: 'pay-1',
    employeeName: 'Rajesh Bhatti',
    department: 'Engineering',
    baseSalary: 14500,
    bonus: 2500,
    deductions: 1200,
    netPay: 15800,
    payDate: '2026-07-31',
    status: 'processed',
  },
  {
    id: 'pay-2',
    employeeName: 'Aisha Sharma',
    department: 'AI & Data',
    baseSalary: 13000,
    bonus: 2000,
    deductions: 1000,
    netPay: 14000,
    payDate: '2026-07-31',
    status: 'processed',
  },
];

export const PHASE2_LEAVES: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeName: 'Michael Miller',
    type: 'Annual PTO',
    startDate: '2026-08-01',
    endDate: '2026-08-07',
    daysCount: 5,
    reason: 'Family Vacation',
    status: 'approved',
  },
  {
    id: 'leave-2',
    employeeName: 'David Chen',
    type: 'Sick Leave',
    startDate: '2026-08-10',
    endDate: '2026-08-11',
    daysCount: 2,
    reason: 'Medical checkup',
    status: 'pending',
  },
];

export const PHASE2_ORG: OrgNode = {
  id: 'org-1',
  name: 'Rajesh Bhatti',
  role: 'Chief Executive & Principal Architect',
  department: 'Executive Board',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  subordinates: [
    {
      id: 'org-2',
      name: 'Aisha Sharma',
      role: 'VP of AI & Data Engineering',
      department: 'AI & Data',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'org-3',
      name: 'Priya Nair',
      role: 'VP of Operations & Cloud SRE',
      department: 'Operations',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'org-4',
      name: 'David Chen',
      role: 'Head of Product UI/UX',
      department: 'Design',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
  ],
};

export const PHASE2_APPLICANTS: Applicant[] = [
  {
    id: 'app-1',
    candidateName: 'Vikram Seth',
    position: 'Senior Next.js 15 Architect',
    department: 'Engineering',
    stage: 'interview',
    appliedDate: '2026-07-28',
    rating: 4.8,
  },
  {
    id: 'app-2',
    candidateName: 'Elena Gilbert',
    position: 'Cloud DevOps Specialist',
    department: 'Operations',
    stage: 'screening',
    appliedDate: '2026-07-30',
    rating: 4.2,
  },
];

export const PHASE2_ASSETS: AssetItem[] = [
  {
    id: 'ast-101',
    assetTag: 'SRJN-MBP-01',
    name: 'MacBook Pro 16" M3 Max (64GB RAM)',
    category: 'laptop',
    assignedTo: 'Rajesh Bhatti',
    serialNo: 'C02GX99812',
    status: 'in_use',
  },
  {
    id: 'ast-102',
    assetTag: 'SRJN-MON-02',
    name: 'Dell UltraSharp 32" 4K USB-C Monitor',
    category: 'monitor',
    assignedTo: 'David Chen',
    serialNo: 'CN088712',
    status: 'in_use',
  },
];

export const PHASE2_TICKETS: TicketItem[] = [
  {
    id: 'tkt-901',
    ticketNo: 'SRJN-TKT-901',
    subject: 'Request API Rate Limit Upgrade for NexusPay',
    customer: 'Nexus Financial',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2026-08-02',
  },
  {
    id: 'tkt-902',
    ticketNo: 'SRJN-TKT-902',
    subject: 'SSO SAML Integration Inquiry',
    customer: 'Veloce Telecom',
    priority: 'medium',
    status: 'open',
    createdAt: '2026-08-03',
  },
];

export const PHASE2_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Proposal Request Received',
    message: 'Nexus Financial submitted a proposal request for Next.js 15 migration.',
    type: 'info',
    timestamp: '5 mins ago',
    isRead: false,
    category: 'Leads',
  },
  {
    id: 'notif-2',
    title: 'Shift Clock-In Verified',
    message: 'Rajesh Bhatti verified check-in at Bengaluru HQ Office.',
    type: 'success',
    timestamp: '15 mins ago',
    isRead: false,
    category: 'Attendance',
  },
  {
    id: 'notif-3',
    title: 'Sprint 6 Milestone Completed',
    message: 'Veloce Multi-Region Mesh achieved 95% completion rate.',
    type: 'success',
    timestamp: '1 hour ago',
    isRead: true,
    category: 'Projects',
  },
];

export const PHASE2_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'emp-2',
    senderName: 'Aisha Sharma',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    content: 'Rajesh, the LangChain document extraction pipeline is ready for review.',
    timestamp: '10:14 AM',
  },
  {
    id: 'msg-2',
    senderId: 'emp-1',
    senderName: 'Rajesh Bhatti',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    content: 'Awesome work Aisha! I will check the metrics on the Executive Dashboard.',
    timestamp: '10:16 AM',
  },
];
