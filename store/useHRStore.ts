import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---------------------------------------------------------
// TYPES & DATA MODELS
// ---------------------------------------------------------

export type HRRole = 'HR Super Admin' | 'Department Manager' | 'Talent Recruiter' | 'Employee Self-Service (ESS)';
export type ThemeMode = 'light' | 'dark';

export interface EmployeeDocument {
  id: string;
  name: string;
  type: 'ID Proof' | 'Address Proof' | 'Tax PAN' | 'Appointment Letter' | 'Signed NDA' | 'Resume' | 'Degree Certificate' | 'Experience Certificate';
  fileUrl?: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending Review' | 'Rejected';
  size?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  panNumber: string;
  uanNumber?: string;
}

export interface Employee {
  id: string; // e.g. "SRJ-101"
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  designation: string;
  department: 'Engineering' | 'Design & UX' | 'Product' | 'People & HR' | 'Marketing & Sales' | 'Operations & Security' | 'Executive';
  employmentType: 'Full-time' | 'Contract' | 'Intern' | 'Part-time';
  workMode: 'Hybrid' | 'Remote' | 'On-site';
  location: string;
  joiningDate: string; // YYYY-MM-DD
  managerId?: string;
  managerName?: string;
  status: 'Active' | 'On Leave' | 'Probation' | 'Notice Period' | 'Terminated';
  compensation: {
    ctcAnnual: number;
    basicMonthly: number;
    hraMonthly: number;
    specialAllowance: number;
    currency: string;
  };
  gender: 'Female' | 'Male' | 'Non-Binary' | 'Prefer not to say';
  dob: string;
  address: string;
  emergencyContact: EmergencyContact;
  bankDetails: BankDetails;
  documents: EmployeeDocument[];
  leaveBalance: {
    casual: number; // e.g. 12
    casualUsed: number;
    sick: number; // e.g. 8
    sickUsed: number;
    earned: number; // e.g. 15
    earnedUsed: number;
    maternityPaternity: number;
    maternityPaternityUsed: number;
    compOff: number;
  };
  skills: { name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' }[];
}

export type LeaveType = 'Casual Leave (CL)' | 'Sick Leave (SL)' | 'Earned Leave (EL)' | 'Maternity / Paternity' | 'Compensatory Off' | 'Unpaid Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
  handoverTo?: string;
  attachmentName?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // YYYY-MM-DD
  shift: 'General (09:30 - 18:30)' | 'Morning (08:00 - 16:30)' | 'Evening (14:00 - 22:30)' | 'Night (22:00 - 06:30)';
  checkIn: string; // HH:mm:ss
  checkOut?: string;
  workingHours: number; // in hours
  breakMinutes: number;
  status: 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Absent';
  locationType: 'Office HQ (Geofenced)' | 'Client Site' | 'Remote WFH';
  ipAddress?: string;
  isOvertime?: boolean;
  overtimeHours?: number;
}

export interface ShiftSchedule {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  effectiveFrom: string;
}

export interface HolidayEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'Public Holiday' | 'Company Event' | 'Birthday' | 'Work Anniversary' | 'Hackathon';
  description?: string;
  isOptional?: boolean;
  employeeName?: string;
  department?: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Intern';
  workplace: 'Remote' | 'Hybrid' | 'On-site';
  experience: string; // e.g. "3-5 years"
  salaryRange: string; // e.g. "₹18 LPA - ₹26 LPA"
  status: 'Active' | 'Paused' | 'Closed';
  openingsCount: number;
  applicantsCount: number;
  postedDate: string;
  description: string;
  requirements: string[];
}

export type CandidateStage = 'Applied' | 'Screening' | 'Technical Round' | 'HR Interview' | 'Offered' | 'Hired' | 'Rejected';

export interface Candidate {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  currentCompany?: string;
  experienceYears: number;
  expectedCtc: string;
  noticePeriod: string;
  stage: CandidateStage;
  appliedDate: string;
  resumeFileName: string;
  rating: number; // 1-5
  skills: string[];
  notes: { id: string; author: string; text: string; date: string }[];
  interviewSchedule?: {
    roundName: string;
    dateTime: string;
    interviewer: string;
    meetLink?: string;
  };
}

export interface OnboardingItem {
  id: string;
  title: string;
  category: 'Documentation' | 'Statutory & Tax' | 'IT Provisioning' | 'Company Culture' | '30-Day Checkpoint';
  assignedToRole: 'Employee' | 'HR' | 'IT Admin' | 'Reporting Manager';
  isCompleted: boolean;
  completedAt?: string;
  dueDate: string;
  description: string;
}

export interface OnboardingChecklist {
  employeeId: string;
  employeeName: string;
  joiningDate: string;
  buddyName: string;
  progressPercentage: number;
  items: OnboardingItem[];
}

export interface OKRGoal {
  id: string;
  title: string;
  category: 'Company Objective' | 'Department Goal' | 'Individual KPI';
  ownerId: string;
  ownerName: string;
  department: string;
  quarter: 'Q1 2026' | 'Q2 2026' | 'Q3 2026' | 'Q4 2026';
  progress: number; // 0-100
  targetValue: string;
  currentValue: string;
  status: 'On Track' | 'At Risk' | 'Behind' | 'Completed';
  keyResults: { id: string; title: string; progress: number; weightage: number }[];
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  cycle: 'Annual 2025-26' | 'Mid-Year 2026' | 'Q1 2026 Review';
  reviewerName: string;
  selfRating: number; // 1-5
  managerRating: number; // 1-5
  calibratedRating: number; // 1-5
  potentialLevel: 'Low' | 'Medium' | 'High';
  performanceLevel: 'Low' | 'Medium' | 'High';
  boxClassification: 'Star' | 'High Performer' | 'Future Leader' | 'Core Contributor' | 'Effective' | 'Solid Performer' | 'Inconsistent' | 'Underperformer' | 'Potential Risk';
  strengths: string;
  improvements: string;
  status: 'Draft' | 'Self Submitted' | 'Manager Reviewed' | 'Calibrated & Closed';
  reviewedAt?: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  category: 'Engineering & Cloud' | 'UI/UX & 3D' | 'Security & Compliance' | 'Leadership & Soft Skills';
  instructor: string;
  duration: string;
  modulesCount: number;
  enrolledCount: number;
  description: string;
  skillsGained: string[];
  thumbnailGradient: string;
  enrolledEmployees: {
    employeeId: string;
    progress: number; // 0-100
    isCompleted: boolean;
    certificateId?: string;
    completedAt?: string;
  }[];
}

export type TicketCategory = 'IT Support' | 'HR & Policy' | 'Payroll & Tax' | 'Facilities & Admin' | 'Hardware Issue';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface HelpdeskTicket {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  description: string;
  status: TicketStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  comments: {
    id: string;
    authorName: string;
    authorRole: string;
    message: string;
    timestamp: string;
    isStaff: boolean;
  }[];
}

export interface CompanyAnnouncement {
  id: string;
  title: string;
  category: 'Company News' | 'Policy Update' | 'Leadership Message' | 'Event' | 'Holiday Notice';
  content: string;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  isPinned: boolean;
  likesCount: number;
  userLiked?: boolean;
}

export interface KudosPost {
  id: string;
  fromEmployeeId: string;
  fromEmployeeName: string;
  toEmployeeId: string;
  toEmployeeName: string;
  badge: 'Problem Solver' | 'Team Player' | 'Rockstar Dev' | 'Innovation Driver' | 'Customer Hero' | 'Culture Champion';
  message: string;
  likesCount: number;
  timestamp: string;
}

export interface ProfileChangeRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  field: string;
  oldValue: string;
  newValue: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  decisionRemarks?: string;
}

// ---------------------------------------------------------
// SEED DATA
// ---------------------------------------------------------

const SEED_EMPLOYEES: Employee[] = [
  {
    id: 'SRJ-001',
    name: 'Rajesh Bhatti',
    email: 'rajesh@srijandev.in',
    phone: '+91 98765 43210',
    avatarUrl: '',
    designation: 'Chief Technology Officer & Co-Founder',
    department: 'Executive',
    employmentType: 'Full-time',
    workMode: 'Hybrid',
    location: 'Gurugram HQ',
    joiningDate: '2022-01-15',
    status: 'Active',
    gender: 'Male',
    dob: '1989-11-22',
    address: 'DLF Cyber City, Phase 2, Gurugram, Haryana - 122002',
    compensation: {
      ctcAnnual: 4200000,
      basicMonthly: 180000,
      hraMonthly: 90000,
      specialAllowance: 80000,
      currency: 'INR',
    },
    emergencyContact: {
      name: 'Sunita Bhatti',
      relationship: 'Spouse',
      phone: '+91 98765 43299',
    },
    bankDetails: {
      accountNumber: '91802001928471',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      panNumber: 'ABCDE1234F',
      uanNumber: '100987654321',
    },
    documents: [
      { id: 'doc-1', name: 'Aadhaar Card.pdf', type: 'ID Proof', uploadedAt: '2022-01-15', status: 'Verified' },
      { id: 'doc-2', name: 'PAN Card.pdf', type: 'Tax PAN', uploadedAt: '2022-01-15', status: 'Verified' },
      { id: 'doc-3', name: 'Founder Agreement.pdf', type: 'Appointment Letter', uploadedAt: '2022-01-15', status: 'Verified' },
    ],
    leaveBalance: {
      casual: 12,
      casualUsed: 2,
      sick: 8,
      sickUsed: 1,
      earned: 18,
      earnedUsed: 4,
      maternityPaternity: 15,
      maternityPaternityUsed: 0,
      compOff: 3,
    },
    skills: [
      { name: 'Cloud Architecture', level: 'Expert' },
      { name: 'Three.js & WebGL', level: 'Expert' },
      { name: 'Enterprise Systems', level: 'Expert' },
      { name: 'System Security', level: 'Advanced' },
    ],
  },
  {
    id: 'SRJ-002',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@srijandev.in',
    phone: '+91 98111 22334',
    designation: 'Lead Frontend Engineer',
    department: 'Engineering',
    employmentType: 'Full-time',
    workMode: 'Hybrid',
    location: 'Gurugram HQ',
    joiningDate: '2023-03-01',
    managerId: 'SRJ-001',
    managerName: 'Rajesh Bhatti',
    status: 'Active',
    gender: 'Male',
    dob: '1994-06-14',
    address: 'Sector 56, Golf Course Road, Gurugram',
    compensation: {
      ctcAnnual: 2400000,
      basicMonthly: 100000,
      hraMonthly: 50000,
      specialAllowance: 50000,
      currency: 'INR',
    },
    emergencyContact: {
      name: 'Rohan Sharma',
      relationship: 'Brother',
      phone: '+91 98111 00000',
    },
    bankDetails: {
      accountNumber: '50100482910482',
      bankName: 'ICICI Bank',
      ifscCode: 'ICIC0000104',
      panNumber: 'FGHIJ5678K',
    },
    documents: [
      { id: 'doc-4', name: 'Aadhaar Card.pdf', type: 'ID Proof', uploadedAt: '2023-03-01', status: 'Verified' },
      { id: 'doc-5', name: 'Degree Certificate.pdf', type: 'Degree Certificate', uploadedAt: '2023-03-01', status: 'Verified' },
      { id: 'doc-6', name: 'Offer Letter Signed.pdf', type: 'Appointment Letter', uploadedAt: '2023-03-01', status: 'Verified' },
    ],
    leaveBalance: {
      casual: 12,
      casualUsed: 4,
      sick: 8,
      sickUsed: 2,
      earned: 15,
      earnedUsed: 5,
      maternityPaternity: 10,
      maternityPaternityUsed: 0,
      compOff: 1,
    },
    skills: [
      { name: 'React 19 & Next.js', level: 'Expert' },
      { name: 'TypeScript', level: 'Expert' },
      { name: 'Tailwind CSS', level: 'Expert' },
      { name: 'Three.js / Canvas', level: 'Intermediate' },
    ],
  },
  {
    id: 'SRJ-003',
    name: 'Priya Nair',
    email: 'priya.nair@srijandev.in',
    phone: '+91 98222 33445',
    designation: 'Head of People & Culture',
    department: 'People & HR',
    employmentType: 'Full-time',
    workMode: 'On-site',
    location: 'Gurugram HQ',
    joiningDate: '2023-05-10',
    managerId: 'SRJ-001',
    managerName: 'Rajesh Bhatti',
    status: 'Active',
    gender: 'Female',
    dob: '1992-09-08',
    address: 'Sushant Lok Phase 1, Gurugram',
    compensation: {
      ctcAnnual: 2200000,
      basicMonthly: 90000,
      hraMonthly: 45000,
      specialAllowance: 48333,
      currency: 'INR',
    },
    emergencyContact: {
      name: 'Dr. K. Nair',
      relationship: 'Father',
      phone: '+91 98222 99887',
    },
    bankDetails: {
      accountNumber: '60192837461928',
      bankName: 'Axis Bank',
      ifscCode: 'UTIB0000456',
      panNumber: 'KLMNO9012P',
    },
    documents: [
      { id: 'doc-7', name: 'Passport.pdf', type: 'ID Proof', uploadedAt: '2023-05-10', status: 'Verified' },
      { id: 'doc-8', name: 'MBA Certificate.pdf', type: 'Degree Certificate', uploadedAt: '2023-05-10', status: 'Verified' },
    ],
    leaveBalance: {
      casual: 12,
      casualUsed: 1,
      sick: 8,
      sickUsed: 0,
      earned: 15,
      earnedUsed: 2,
      maternityPaternity: 180,
      maternityPaternityUsed: 0,
      compOff: 2,
    },
    skills: [
      { name: 'Talent Acquisition', level: 'Expert' },
      { name: 'HR Statutory & Labor Law', level: 'Expert' },
      { name: 'Performance Calibration', level: 'Advanced' },
      { name: 'Employee Engagement', level: 'Expert' },
    ],
  },
  {
    id: 'SRJ-004',
    name: 'Vikramaditya Roy',
    email: 'vikram.roy@srijandev.in',
    phone: '+91 98333 44556',
    designation: 'Principal 3D & UI/UX Designer',
    department: 'Design & UX',
    employmentType: 'Full-time',
    workMode: 'Hybrid',
    location: 'Bengaluru Studio',
    joiningDate: '2023-08-01',
    managerId: 'SRJ-001',
    managerName: 'Rajesh Bhatti',
    status: 'Active',
    gender: 'Male',
    dob: '1993-03-29',
    address: 'Indiranagar 100 Feet Road, Bengaluru, Karnataka',
    compensation: {
      ctcAnnual: 2600000,
      basicMonthly: 110000,
      hraMonthly: 55000,
      specialAllowance: 51666,
      currency: 'INR',
    },
    emergencyContact: {
      name: 'Ananya Roy',
      relationship: 'Spouse',
      phone: '+91 98333 99999',
    },
    bankDetails: {
      accountNumber: '40192837461928',
      bankName: 'Kotak Mahindra Bank',
      ifscCode: 'KKBK0000890',
      panNumber: 'QRSTU3456V',
    },
    documents: [
      { id: 'doc-9', name: 'Aadhaar.pdf', type: 'ID Proof', uploadedAt: '2023-08-01', status: 'Verified' },
      { id: 'doc-10', name: 'Design Portfolio NDA.pdf', type: 'Signed NDA', uploadedAt: '2023-08-01', status: 'Verified' },
    ],
    leaveBalance: {
      casual: 12,
      casualUsed: 3,
      sick: 8,
      sickUsed: 1,
      earned: 15,
      earnedUsed: 3,
      maternityPaternity: 10,
      maternityPaternityUsed: 0,
      compOff: 0,
    },
    skills: [
      { name: 'Figma & Design Systems', level: 'Expert' },
      { name: 'Blender 3D Modeling', level: 'Expert' },
      { name: 'Motion Design (Spline/Lottie)', level: 'Advanced' },
      { name: 'Glassmorphic UI & Dark Mode', level: 'Expert' },
    ],
  },
  {
    id: 'SRJ-005',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@srijandev.in',
    phone: '+91 98444 55667',
    designation: 'Senior Backend & Cloud Architect',
    department: 'Engineering',
    employmentType: 'Full-time',
    workMode: 'Remote',
    location: 'Pune Tech Center',
    joiningDate: '2023-11-15',
    managerId: 'SRJ-001',
    managerName: 'Rajesh Bhatti',
    status: 'Active',
    gender: 'Female',
    dob: '1995-12-05',
    address: 'Kothrud, Pune, Maharashtra',
    compensation: {
      ctcAnnual: 2500000,
      basicMonthly: 105000,
      hraMonthly: 52500,
      specialAllowance: 50833,
      currency: 'INR',
    },
    emergencyContact: {
      name: 'Makarand Kulkarni',
      relationship: 'Father',
      phone: '+91 98444 11223',
    },
    bankDetails: {
      accountNumber: '30291827364512',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0001234',
      panNumber: 'WXYZB7890C',
    },
    documents: [
      { id: 'doc-11', name: 'National ID.pdf', type: 'ID Proof', uploadedAt: '2023-11-15', status: 'Verified' },
      { id: 'doc-12', name: 'B.Tech Degree.pdf', type: 'Degree Certificate', uploadedAt: '2023-11-15', status: 'Verified' },
    ],
    leaveBalance: {
      casual: 12,
      casualUsed: 2,
      sick: 8,
      sickUsed: 0,
      earned: 15,
      earnedUsed: 1,
      maternityPaternity: 180,
      maternityPaternityUsed: 0,
      compOff: 4,
    },
    skills: [
      { name: 'Cloudflare Workers & D1', level: 'Expert' },
      { name: 'Node.js & Go', level: 'Expert' },
      { name: 'PostgreSQL & Drizzle', level: 'Expert' },
      { name: 'Distributed Systems', level: 'Advanced' },
    ],
  },
  {
    id: 'SRJ-006',
    name: 'Devendra Patel',
    email: 'devendra.patel@srijandev.in',
    phone: '+91 98555 66778',
    designation: 'Product Manager - Enterprise OS',
    department: 'Product',
    employmentType: 'Full-time',
    workMode: 'Hybrid',
    location: 'Gurugram HQ',
    joiningDate: '2024-01-08',
    managerId: 'SRJ-001',
    managerName: 'Rajesh Bhatti',
    status: 'Active',
    gender: 'Male',
    dob: '1991-08-19',
    address: 'Nirvana Country, Sector 50, Gurugram',
    compensation: {
      ctcAnnual: 2800000,
      basicMonthly: 120000,
      hraMonthly: 60000,
      specialAllowance: 53333,
      currency: 'INR',
    },
    emergencyContact: {
      name: 'Varsha Patel',
      relationship: 'Spouse',
      phone: '+91 98555 99990',
    },
    bankDetails: {
      accountNumber: '70192837461928',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0000456',
      panNumber: 'PLMNO6789D',
    },
    documents: [
      { id: 'doc-13', name: 'Passport.pdf', type: 'ID Proof', uploadedAt: '2024-01-08', status: 'Verified' },
    ],
    leaveBalance: {
      casual: 12,
      casualUsed: 5,
      sick: 8,
      sickUsed: 2,
      earned: 15,
      earnedUsed: 6,
      maternityPaternity: 10,
      maternityPaternityUsed: 0,
      compOff: 0,
    },
    skills: [
      { name: 'Product Roadmapping', level: 'Expert' },
      { name: 'Enterprise SaaS Metrics', level: 'Expert' },
      { name: 'Agile & Scrum', level: 'Expert' },
      { name: 'User Experience Research', level: 'Advanced' },
    ],
  },
  {
    id: 'SRJ-007',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@srijandev.in',
    phone: '+91 98666 77889',
    designation: 'Talent Acquisition Specialist',
    department: 'People & HR',
    employmentType: 'Full-time',
    workMode: 'Hybrid',
    location: 'Gurugram HQ',
    joiningDate: '2024-02-01',
    managerId: 'SRJ-003',
    managerName: 'Priya Nair',
    status: 'Active',
    gender: 'Female',
    dob: '1996-04-12',
    address: 'Sohna Road, Sector 48, Gurugram',
    compensation: {
      ctcAnnual: 1400000,
      basicMonthly: 60000,
      hraMonthly: 30000,
      specialAllowance: 26666,
      currency: 'INR',
    },
    emergencyContact: {
      name: 'Ramesh Deshmukh',
      relationship: 'Father',
      phone: '+91 98666 00001',
    },
    bankDetails: {
      accountNumber: '89102938475612',
      bankName: 'ICICI Bank',
      ifscCode: 'ICIC0000899',
      panNumber: 'ZXCVB1234N',
    },
    documents: [
      { id: 'doc-14', name: 'Aadhaar.pdf', type: 'ID Proof', uploadedAt: '2024-02-01', status: 'Verified' },
      { id: 'doc-15', name: 'Degree.pdf', type: 'Degree Certificate', uploadedAt: '2024-02-01', status: 'Verified' },
    ],
    leaveBalance: {
      casual: 12,
      casualUsed: 1,
      sick: 8,
      sickUsed: 1,
      earned: 15,
      earnedUsed: 0,
      maternityPaternity: 180,
      maternityPaternityUsed: 0,
      compOff: 1,
    },
    skills: [
      { name: 'Technical Sourcing', level: 'Expert' },
      { name: 'ATS Management', level: 'Expert' },
      { name: 'Salary Benchmarking', level: 'Intermediate' },
      { name: 'Campus Hiring', level: 'Advanced' },
    ],
  },
  {
    id: 'SRJ-008',
    name: 'Kabir Singhania',
    email: 'kabir.s@srijandev.in',
    phone: '+91 98777 88990',
    designation: 'Junior Fullstack Engineer',
    department: 'Engineering',
    employmentType: 'Full-time',
    workMode: 'On-site',
    location: 'Gurugram HQ',
    joiningDate: '2024-07-01',
    managerId: 'SRJ-002',
    managerName: 'Aarav Sharma',
    status: 'Probation',
    gender: 'Male',
    dob: '2001-10-30',
    address: 'Sector 23, Gurugram',
    compensation: {
      ctcAnnual: 1200000,
      basicMonthly: 50000,
      hraMonthly: 25000,
      specialAllowance: 25000,
      currency: 'INR',
    },
    emergencyContact: {
      name: 'Sunita Singhania',
      relationship: 'Mother',
      phone: '+91 98777 11111',
    },
    bankDetails: {
      accountNumber: '11223344556677',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001928',
      panNumber: 'POIUY9876Q',
    },
    documents: [
      { id: 'doc-16', name: 'Aadhaar.pdf', type: 'ID Proof', uploadedAt: '2024-07-01', status: 'Verified' },
      { id: 'doc-17', name: 'College Transcript.pdf', type: 'Degree Certificate', uploadedAt: '2024-07-01', status: 'Verified' },
    ],
    leaveBalance: {
      casual: 6,
      casualUsed: 0,
      sick: 4,
      sickUsed: 0,
      earned: 7,
      earnedUsed: 0,
      maternityPaternity: 10,
      maternityPaternityUsed: 0,
      compOff: 0,
    },
    skills: [
      { name: 'React & JavaScript', level: 'Intermediate' },
      { name: 'Tailwind CSS', level: 'Intermediate' },
      { name: 'Git & GitHub', level: 'Advanced' },
      { name: 'REST APIs', level: 'Intermediate' },
    ],
  }
];

const SEED_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LR-2026-001',
    employeeId: 'SRJ-002',
    employeeName: 'Aarav Sharma',
    department: 'Engineering',
    leaveType: 'Casual Leave (CL)',
    startDate: '2026-09-10',
    endDate: '2026-09-12',
    daysCount: 3,
    reason: 'Family wedding celebration in Jaipur',
    status: 'Pending',
    appliedAt: '2026-09-05T10:30:00Z',
    handoverTo: 'Sneha Kulkarni',
  },
  {
    id: 'LR-2026-002',
    employeeId: 'SRJ-004',
    employeeName: 'Vikramaditya Roy',
    department: 'Design & UX',
    leaveType: 'Sick Leave (SL)',
    startDate: '2026-09-02',
    endDate: '2026-09-03',
    daysCount: 2,
    reason: 'Viral fever and prescribed medical rest',
    status: 'Approved',
    appliedAt: '2026-09-01T18:00:00Z',
    reviewedBy: 'Priya Nair',
    reviewedAt: '2026-09-02T09:15:00Z',
    reviewRemarks: 'Approved. Get well soon!',
  },
  {
    id: 'LR-2026-003',
    employeeId: 'SRJ-006',
    employeeName: 'Devendra Patel',
    department: 'Product',
    leaveType: 'Earned Leave (EL)',
    startDate: '2026-09-22',
    endDate: '2026-09-26',
    daysCount: 5,
    reason: 'Annual family holiday trip',
    status: 'Pending',
    appliedAt: '2026-09-04T14:20:00Z',
    handoverTo: 'Rajesh Bhatti',
  },
  {
    id: 'LR-2026-004',
    employeeId: 'SRJ-007',
    employeeName: 'Ananya Deshmukh',
    department: 'People & HR',
    leaveType: 'Compensatory Off',
    startDate: '2026-08-28',
    endDate: '2026-08-28',
    daysCount: 1,
    reason: 'Comp-off for Sunday campus hiring drive',
    status: 'Approved',
    appliedAt: '2026-08-25T11:00:00Z',
    reviewedBy: 'Priya Nair',
    reviewedAt: '2026-08-26T10:00:00Z',
    reviewRemarks: 'Approved for Sunday shift.',
  },
];

const SEED_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'ATT-001',
    employeeId: 'SRJ-001',
    employeeName: 'Rajesh Bhatti',
    department: 'Executive',
    date: '2026-09-05',
    shift: 'General (09:30 - 18:30)',
    checkIn: '09:15:22',
    checkOut: '19:10:00',
    workingHours: 9.9,
    breakMinutes: 45,
    status: 'Present',
    locationType: 'Office HQ (Geofenced)',
    ipAddress: '192.168.1.100',
    isOvertime: true,
    overtimeHours: 0.9,
  },
  {
    id: 'ATT-002',
    employeeId: 'SRJ-002',
    employeeName: 'Aarav Sharma',
    department: 'Engineering',
    date: '2026-09-05',
    shift: 'General (09:30 - 18:30)',
    checkIn: '09:28:44',
    checkOut: '18:45:10',
    workingHours: 9.3,
    breakMinutes: 60,
    status: 'Present',
    locationType: 'Office HQ (Geofenced)',
    ipAddress: '192.168.1.104',
  },
  {
    id: 'ATT-003',
    employeeId: 'SRJ-003',
    employeeName: 'Priya Nair',
    department: 'People & HR',
    date: '2026-09-05',
    shift: 'General (09:30 - 18:30)',
    checkIn: '09:20:10',
    checkOut: '18:30:00',
    workingHours: 9.2,
    breakMinutes: 50,
    status: 'Present',
    locationType: 'Office HQ (Geofenced)',
    ipAddress: '192.168.1.110',
  },
  {
    id: 'ATT-004',
    employeeId: 'SRJ-004',
    employeeName: 'Vikramaditya Roy',
    department: 'Design & UX',
    date: '2026-09-05',
    shift: 'General (09:30 - 18:30)',
    checkIn: '09:55:00',
    checkOut: '19:30:00',
    workingHours: 9.6,
    breakMinutes: 45,
    status: 'Late',
    locationType: 'Office HQ (Geofenced)',
    ipAddress: '192.168.1.125',
  },
  {
    id: 'ATT-005',
    employeeId: 'SRJ-005',
    employeeName: 'Sneha Kulkarni',
    department: 'Engineering',
    date: '2026-09-05',
    shift: 'General (09:30 - 18:30)',
    checkIn: '09:30:00',
    checkOut: '18:30:00',
    workingHours: 9.0,
    breakMinutes: 60,
    status: 'Present',
    locationType: 'Remote WFH',
    ipAddress: '49.36.12.88',
  },
  {
    id: 'ATT-006',
    employeeId: 'SRJ-006',
    employeeName: 'Devendra Patel',
    department: 'Product',
    date: '2026-09-05',
    shift: 'General (09:30 - 18:30)',
    checkIn: '09:10:00',
    checkOut: '18:40:00',
    workingHours: 9.5,
    breakMinutes: 55,
    status: 'Present',
    locationType: 'Office HQ (Geofenced)',
    ipAddress: '192.168.1.118',
  },
  {
    id: 'ATT-007',
    employeeId: 'SRJ-007',
    employeeName: 'Ananya Deshmukh',
    department: 'People & HR',
    date: '2026-09-05',
    shift: 'General (09:30 - 18:30)',
    checkIn: '09:25:00',
    checkOut: '18:35:00',
    workingHours: 9.2,
    breakMinutes: 45,
    status: 'Present',
    locationType: 'Office HQ (Geofenced)',
    ipAddress: '192.168.1.112',
  },
  {
    id: 'ATT-008',
    employeeId: 'SRJ-008',
    employeeName: 'Kabir Singhania',
    department: 'Engineering',
    date: '2026-09-05',
    shift: 'General (09:30 - 18:30)',
    checkIn: '09:18:00',
    checkOut: '18:30:00',
    workingHours: 9.2,
    breakMinutes: 60,
    status: 'Present',
    locationType: 'Office HQ (Geofenced)',
    ipAddress: '192.168.1.130',
  },
];

const SEED_HOLIDAYS: HolidayEvent[] = [
  { id: 'HOL-01', title: 'Mahatma Gandhi Jayanti', date: '2026-10-02', type: 'Public Holiday', description: 'National Holiday' },
  { id: 'HOL-02', title: 'Dussehra / Vijayadashami', date: '2026-10-20', type: 'Public Holiday', description: 'Festive Holiday' },
  { id: 'HOL-03', title: 'Diwali / Deepavali', date: '2026-11-08', type: 'Public Holiday', description: 'Festival of Lights' },
  { id: 'HOL-04', title: 'Guru Nanak Jayanti', date: '2026-11-24', type: 'Public Holiday', description: 'Gazetted Holiday' },
  { id: 'HOL-05', title: 'Christmas Day', date: '2026-12-25', type: 'Public Holiday', description: 'Winter Holiday' },
  { id: 'HOL-06', title: 'SrijanDev Annual Tech Summit & Hackathon', date: '2026-10-15', type: 'Hackathon', description: '48-hour 3D & AI Hackathon with ₹5 Lakhs in prizes' },
  { id: 'HOL-07', title: 'Rajesh Bhatti Birthday', date: '2026-11-22', type: 'Birthday', employeeName: 'Rajesh Bhatti', department: 'Executive' },
  { id: 'HOL-08', title: 'Sneha Kulkarni Birthday', date: '2026-12-05', type: 'Birthday', employeeName: 'Sneha Kulkarni', department: 'Engineering' },
  { id: 'HOL-09', title: 'Aarav Sharma 3-Year Work Anniversary', date: '2026-03-01', type: 'Work Anniversary', employeeName: 'Aarav Sharma', department: 'Engineering' },
];

const SEED_JOBS: JobOpening[] = [
  {
    id: 'JOB-001',
    title: 'Senior 3D WebGL / Three.js Engineer',
    department: 'Engineering',
    location: 'Gurugram / Remote',
    type: 'Full-time',
    workplace: 'Hybrid',
    experience: '4-7 Years',
    salaryRange: '₹28 LPA - ₹40 LPA',
    status: 'Active',
    openingsCount: 2,
    applicantsCount: 38,
    postedDate: '2026-08-20',
    description: 'We are seeking an elite Three.js / WebGL Developer to build ultra-high-fidelity interactive 3D web applications, digital twins, and shader-driven graphical experiences for Fortune 500 enterprises.',
    requirements: [
      'Deep mastery of Three.js, WebGL, GLSL Shaders, and React Three Fiber (@react-three/fiber).',
      'Solid foundations in linear algebra, 3D math, quaternions, and raycasting.',
      'Proficiency in React 19, TypeScript, Vite/Next.js, and performance profiling.',
      'Portfolio showcasing live, lag-free 60FPS 3D web applications.',
    ],
  },
  {
    id: 'JOB-002',
    title: 'Lead Android Native Architect (Kotlin / Jetpack Compose)',
    department: 'Engineering',
    location: 'Bengaluru / Hybrid',
    type: 'Full-time',
    workplace: 'Hybrid',
    experience: '5-9 Years',
    salaryRange: '₹32 LPA - ₹45 LPA',
    status: 'Active',
    openingsCount: 1,
    applicantsCount: 24,
    postedDate: '2026-08-25',
    description: 'Lead the architecture of mission-critical native Android applications for real-time security, biometric authentication, offline-first SQLite sync, and BLE beacon sensors.',
    requirements: [
      'Extensive experience with Kotlin, Jetpack Compose, Coroutines, Flow, and Room DB.',
      'Experience in Background Services, Foreground notifications, and battery optimization.',
      'Knowledge of Geofencing, GPS tracking, and QR/NFC scanning hardware integration.',
    ],
  },
  {
    id: 'JOB-003',
    title: 'Staff UI/UX & Motion Designer',
    department: 'Design & UX',
    location: 'Gurugram HQ',
    type: 'Full-time',
    workplace: 'On-site',
    experience: '3-6 Years',
    salaryRange: '₹18 LPA - ₹26 LPA',
    status: 'Active',
    openingsCount: 1,
    applicantsCount: 42,
    postedDate: '2026-08-30',
    description: 'Craft world-class dark & light mode interfaces, micro-interactions, custom design tokens, and sleek component libraries for our enterprise platform.',
    requirements: [
      'Mastery of Figma, Auto-layout, Variants, and design token management.',
      'Proficiency in Spline, Blender, or Cinema4D for 3D asset generation.',
      'Understanding of modern web constraints and Tailwind CSS color tokens.',
    ],
  },
  {
    id: 'JOB-004',
    title: 'Enterprise Technical Sales Executive',
    department: 'Marketing & Sales',
    location: 'Mumbai / Gurugram',
    type: 'Full-time',
    workplace: 'Hybrid',
    experience: '4-8 Years',
    salaryRange: '₹20 LPA - ₹30 LPA + Incentives',
    status: 'Active',
    openingsCount: 2,
    applicantsCount: 19,
    postedDate: '2026-09-01',
    description: 'Drive high-ticket enterprise SaaS and custom digital engineering sales to manufacturing conglomerates, smart cities, and Fortune 500 brands.',
    requirements: [
      'Proven track record in B2B enterprise software or tech services sales.',
      'Excellent presentation, negotiation, and RFP proposal skills.',
    ],
  },
];

const SEED_CANDIDATES: Candidate[] = [
  {
    id: 'CAN-001',
    jobId: 'JOB-001',
    jobTitle: 'Senior 3D WebGL / Three.js Engineer',
    name: 'Rohan Mehra',
    email: 'rohan.mehra@gmail.com',
    phone: '+91 98199 88776',
    currentCompany: 'Autodesk India',
    experienceYears: 5.5,
    expectedCtc: '₹34 LPA',
    noticePeriod: '30 Days',
    stage: 'Technical Round',
    appliedDate: '2026-08-22',
    resumeFileName: 'Rohan_Mehra_Resume_3D.pdf',
    rating: 5,
    skills: ['Three.js', 'GLSL', 'React Three Fiber', 'WebGL', 'TypeScript'],
    notes: [
      { id: 'n1', author: 'Ananya Deshmukh', text: 'Excellent candidate, built custom shader demo in screening call.', date: '2026-08-23' },
      { id: 'n2', author: 'Rajesh Bhatti', text: 'Cleared round 1 with top marks. Technical task scheduled for Friday.', date: '2026-08-28' },
    ],
    interviewSchedule: {
      roundName: 'Live Coding: Custom PBR Shaders',
      dateTime: '2026-09-08T15:00:00',
      interviewer: 'Rajesh Bhatti',
      meetLink: 'https://meet.google.com/srj-3d-tech',
    },
  },
  {
    id: 'CAN-002',
    jobId: 'JOB-001',
    jobTitle: 'Senior 3D WebGL / Three.js Engineer',
    name: 'Tanvi Agarwal',
    email: 'tanvi.agarwal@outlook.com',
    phone: '+91 98200 11223',
    currentCompany: 'Infosys Metaverse Lab',
    experienceYears: 4.2,
    expectedCtc: '₹30 LPA',
    noticePeriod: '15 Days (Serving Notice)',
    stage: 'HR Interview',
    appliedDate: '2026-08-24',
    resumeFileName: 'Tanvi_Agarwal_Resume.pdf',
    rating: 4,
    skills: ['Three.js', 'Blender', 'TypeScript', 'Next.js'],
    notes: [
      { id: 'n3', author: 'Aarav Sharma', text: 'Good understanding of 3D asset optimization and DRACO compression.', date: '2026-08-30' },
    ],
  },
  {
    id: 'CAN-003',
    jobId: 'JOB-002',
    jobTitle: 'Lead Android Native Architect',
    name: 'Siddharth Varma',
    email: 'sid.varma@gmail.com',
    phone: '+91 98311 22334',
    currentCompany: 'Swiggy',
    experienceYears: 7.0,
    expectedCtc: '₹38 LPA',
    noticePeriod: 'Immediate',
    stage: 'Offered',
    appliedDate: '2026-08-26',
    resumeFileName: 'Siddharth_Varma_Android.pdf',
    rating: 5,
    skills: ['Kotlin', 'Jetpack Compose', 'Coroutines', 'Foreground Services', 'Room DB'],
    notes: [
      { id: 'n4', author: 'Priya Nair', text: 'Offer rolled out at ₹36 LPA + Joining Bonus. Awaiting acceptance.', date: '2026-09-04' },
    ],
  },
  {
    id: 'CAN-004',
    jobId: 'JOB-003',
    jobTitle: 'Staff UI/UX & Motion Designer',
    name: 'Meera Sen',
    email: 'meera.sen@behance.net',
    phone: '+91 98400 99887',
    currentCompany: 'Razorpay Design',
    experienceYears: 4.5,
    expectedCtc: '₹22 LPA',
    noticePeriod: '30 Days',
    stage: 'Screening',
    appliedDate: '2026-09-02',
    resumeFileName: 'Meera_Sen_Portfolio.pdf',
    rating: 4,
    skills: ['Figma', 'Spline 3D', 'Micro-interactions', 'Design Systems'],
    notes: [
      { id: 'n5', author: 'Ananya Deshmukh', text: 'Portfolio looks sensational. Dark mode work aligns 100% with SrijanDev OS.', date: '2026-09-03' },
    ],
  },
];

const SEED_ONBOARDING: OnboardingChecklist[] = [
  {
    employeeId: 'SRJ-008',
    employeeName: 'Kabir Singhania',
    joiningDate: '2024-07-01',
    buddyName: 'Aarav Sharma',
    progressPercentage: 80,
    items: [
      { id: 'ob-1', title: 'Submit Aadhaar & PAN Copies', category: 'Documentation', assignedToRole: 'Employee', isCompleted: true, completedAt: '2024-07-01', dueDate: '2024-07-02', description: 'Upload government IDs for background check.' },
      { id: 'ob-2', title: 'Bank Account & Salary Credit Details', category: 'Statutory & Tax', assignedToRole: 'Employee', isCompleted: true, completedAt: '2024-07-01', dueDate: '2024-07-03', description: 'Submit cancelled cheque and IFSC code.' },
      { id: 'ob-3', title: 'Sign SrijanDev Code of Conduct & NDA', category: 'Documentation', assignedToRole: 'Employee', isCompleted: true, completedAt: '2024-07-02', dueDate: '2024-07-03', description: 'E-sign company handbook and intellectual property agreement.' },
      { id: 'ob-4', title: 'IT Asset Provisioning: MacBook Pro 16" M3 & Cloudflare Access', category: 'IT Provisioning', assignedToRole: 'IT Admin', isCompleted: true, completedAt: '2024-07-02', dueDate: '2024-07-02', description: 'Issue hardware, Google Workspace, GitHub Org invite.' },
      { id: 'ob-5', title: 'Meet Welcome Buddy & Architecture Walkthrough', category: 'Company Culture', assignedToRole: 'Reporting Manager', isCompleted: true, completedAt: '2024-07-05', dueDate: '2024-07-07', description: '1-on-1 session with Aarav Sharma to understand SrijanDev Hub.' },
      { id: 'ob-6', title: '30-Day Probation & Goals Checkpoint', category: '30-Day Checkpoint', assignedToRole: 'HR', isCompleted: false, dueDate: '2024-08-01', description: 'Performance and culture review after first month.' },
    ],
  },
];

const SEED_OKRS: OKRGoal[] = [
  {
    id: 'OKR-01',
    title: 'Deliver Next-Gen 3D Enterprise Experience to 5 Conglomerates',
    category: 'Company Objective',
    ownerId: 'SRJ-001',
    ownerName: 'Rajesh Bhatti',
    department: 'Executive',
    quarter: 'Q3 2026',
    progress: 78,
    targetValue: '5 Clients',
    currentValue: '4 Clients',
    status: 'On Track',
    keyResults: [
      { id: 'kr-1', title: 'Deploy SrijanDev Plus multi-tenant system to Adani & Tata Sites', progress: 90, weightage: 40 },
      { id: 'kr-2', title: 'Achieve sub-50ms D1 database response latency on edge', progress: 85, weightage: 30 },
      { id: 'kr-3', title: 'Complete ISO 27001 SOC-2 Type II audit readiness', progress: 60, weightage: 30 },
    ],
  },
  {
    id: 'OKR-02',
    title: 'Build Complete SrijanDev HR Management Suite & ESS Portal',
    category: 'Department Goal',
    ownerId: 'SRJ-003',
    ownerName: 'Priya Nair',
    department: 'People & HR',
    quarter: 'Q3 2026',
    progress: 92,
    targetValue: '100% Modules Live',
    currentValue: '95% Modules Ready',
    status: 'On Track',
    keyResults: [
      { id: 'kr-4', title: 'Digitize employee records, documents and automated LMS balance ledger', progress: 100, weightage: 35 },
      { id: 'kr-5', title: 'Implement full 7-stage ATS candidate pipeline with Kanban board', progress: 95, weightage: 35 },
      { id: 'kr-6', title: 'Launch dynamic Experience Letter, Payslip, and Certificate generators', progress: 85, weightage: 30 },
    ],
  },
  {
    id: 'OKR-03',
    title: 'Zero-Lag 60 FPS 3D Rendering & Mobile Responsiveness on WebGL',
    category: 'Individual KPI',
    ownerId: 'SRJ-002',
    ownerName: 'Aarav Sharma',
    department: 'Engineering',
    quarter: 'Q3 2026',
    progress: 84,
    targetValue: '60 FPS on 95% Devices',
    currentValue: '58 FPS average',
    status: 'On Track',
    keyResults: [
      { id: 'kr-7', title: 'Optimize shaders and reduce draw calls under 40 per frame', progress: 90, weightage: 50 },
      { id: 'kr-8', title: 'Ensure instant hydration and zero CLS layout shifts on Next.js 16', progress: 80, weightage: 50 },
    ],
  },
];

const SEED_REVIEWS: PerformanceReview[] = [
  {
    id: 'REV-001',
    employeeId: 'SRJ-002',
    employeeName: 'Aarav Sharma',
    designation: 'Lead Frontend Engineer',
    department: 'Engineering',
    cycle: 'Annual 2025-26',
    reviewerName: 'Rajesh Bhatti',
    selfRating: 4.8,
    managerRating: 4.9,
    calibratedRating: 4.9,
    potentialLevel: 'High',
    performanceLevel: 'High',
    boxClassification: 'Star',
    strengths: 'Exceptional engineering velocity, deep Three.js expertise, consistently mentors juniors, delivers production-grade code without regressions.',
    improvements: 'Can take more public tech talks and author whitepapers representing SrijanDev architecture.',
    status: 'Calibrated & Closed',
    reviewedAt: '2026-04-10',
  },
  {
    id: 'REV-002',
    employeeId: 'SRJ-004',
    employeeName: 'Vikramaditya Roy',
    designation: 'Principal 3D & UI/UX Designer',
    department: 'Design & UX',
    cycle: 'Annual 2025-26',
    reviewerName: 'Rajesh Bhatti',
    selfRating: 4.7,
    managerRating: 4.8,
    calibratedRating: 4.8,
    potentialLevel: 'High',
    performanceLevel: 'High',
    boxClassification: 'Star',
    strengths: 'World-class aesthetic vision, converts abstract ideas into stunning glassmorphic UI, impeccable attention to typography and lighting.',
    improvements: 'Collaborate more closely with mobile native teams during design handoffs.',
    status: 'Calibrated & Closed',
    reviewedAt: '2026-04-12',
  },
  {
    id: 'REV-003',
    employeeId: 'SRJ-005',
    employeeName: 'Sneha Kulkarni',
    designation: 'Senior Backend & Cloud Architect',
    department: 'Engineering',
    cycle: 'Mid-Year 2026',
    reviewerName: 'Rajesh Bhatti',
    selfRating: 4.6,
    managerRating: 4.7,
    calibratedRating: 4.7,
    potentialLevel: 'High',
    performanceLevel: 'High',
    boxClassification: 'High Performer',
    strengths: 'Rock-solid database design, D1 migration mastery, high reliability in edge deployment.',
    improvements: 'Expand technical documentation for new hires.',
    status: 'Manager Reviewed',
    reviewedAt: '2026-08-15',
  },
];

const SEED_COURSES: TrainingCourse[] = [
  {
    id: 'CRS-001',
    title: 'Advanced 3D WebGL, Three.js & GLSL Shader Architecture',
    category: 'Engineering & Cloud',
    instructor: 'Rajesh Bhatti',
    duration: '14 Hours (8 Modules)',
    modulesCount: 8,
    enrolledCount: 18,
    description: 'Master raymarching, post-processing blooms, DRACO geometry streaming, and custom physically based rendering (PBR) pipelines.',
    skillsGained: ['GLSL Shaders', 'Three.js Matrix Math', 'Performance Profiling', 'WebGPU Future-Proofing'],
    thumbnailGradient: 'from-amber-500 via-orange-500 to-indigo-600',
    enrolledEmployees: [
      { employeeId: 'SRJ-002', progress: 100, isCompleted: true, certificateId: 'CERT-SRJ-3D-8821', completedAt: '2026-05-12' },
      { employeeId: 'SRJ-008', progress: 65, isCompleted: false },
    ],
  },
  {
    id: 'CRS-002',
    title: 'ISO 27001 & SOC-2 Enterprise Data Security Compliance',
    category: 'Security & Compliance',
    instructor: 'Priya Nair & External Auditor',
    duration: '6 Hours (4 Modules)',
    modulesCount: 4,
    enrolledCount: 32,
    description: 'Mandatory annual enterprise training on data privacy, credential protection, POSH guidelines, and secure engineering practices.',
    skillsGained: ['SOC-2 Compliance', 'Data Privacy', 'Incident Reporting', 'POSH Guidelines'],
    thumbnailGradient: 'from-indigo-600 via-purple-600 to-pink-500',
    enrolledEmployees: [
      { employeeId: 'SRJ-001', progress: 100, isCompleted: true, certificateId: 'CERT-SRJ-SEC-1001', completedAt: '2026-02-10' },
      { employeeId: 'SRJ-002', progress: 100, isCompleted: true, certificateId: 'CERT-SRJ-SEC-1002', completedAt: '2026-02-11' },
      { employeeId: 'SRJ-003', progress: 100, isCompleted: true, certificateId: 'CERT-SRJ-SEC-1003', completedAt: '2026-02-11' },
      { employeeId: 'SRJ-004', progress: 100, isCompleted: true, certificateId: 'CERT-SRJ-SEC-1004', completedAt: '2026-02-12' },
    ],
  },
  {
    id: 'CRS-003',
    title: 'Design Systems, Tokens & Dark Mode Glassmorphism Mastery',
    category: 'UI/UX & 3D',
    instructor: 'Vikramaditya Roy',
    duration: '8 Hours (6 Modules)',
    modulesCount: 6,
    enrolledCount: 12,
    description: 'Learn how to construct multi-brand design systems in Figma and export them dynamically to Tailwind CSS and Framer Motion.',
    skillsGained: ['Figma Variables', 'Design Tokens', 'Framer Motion', 'Micro-Interactions'],
    thumbnailGradient: 'from-blue-600 via-cyan-500 to-teal-400',
    enrolledEmployees: [
      { employeeId: 'SRJ-004', progress: 100, isCompleted: true, certificateId: 'CERT-SRJ-UI-2022', completedAt: '2026-04-18' },
    ],
  },
];

const SEED_TICKETS: HelpdeskTicket[] = [
  {
    id: 'TICK-101',
    employeeId: 'SRJ-008',
    employeeName: 'Kabir Singhania',
    department: 'Engineering',
    category: 'IT Support',
    priority: 'High',
    subject: 'Request GitHub Enterprise Org invite & NPM private registry token',
    description: 'Need access to @srijandev/ui-core repository to pull the latest 3D component tokens for local testing.',
    status: 'Resolved',
    assignedTo: 'Rajesh Bhatti',
    createdAt: '2026-09-02T11:00:00Z',
    updatedAt: '2026-09-02T12:30:00Z',
    slaDeadline: '2026-09-02T15:00:00Z',
    comments: [
      { id: 'c1', authorName: 'Kabir Singhania', authorRole: 'Employee', message: 'Submitted access request with manager Aarav Sharma approval.', timestamp: '2026-09-02T11:00:00Z', isStaff: false },
      { id: 'c2', authorName: 'Rajesh Bhatti', authorRole: 'IT Admin', message: 'Invite dispatched to kabir.s@srijandev.in with 2FA requirement. Token generated.', timestamp: '2026-09-02T12:30:00Z', isStaff: true },
    ],
  },
  {
    id: 'TICK-102',
    employeeId: 'SRJ-004',
    employeeName: 'Vikramaditya Roy',
    department: 'Design & UX',
    category: 'Hardware Issue',
    priority: 'Medium',
    subject: 'Request 4K Color-Accurate Calibrated Monitor for Bengaluru Studio',
    description: 'Require a Dell UltraSharp 32" 4K HDR monitor for 3D shader color grading and studio rendering.',
    status: 'In Progress',
    assignedTo: 'Priya Nair',
    createdAt: '2026-09-03T16:15:00Z',
    updatedAt: '2026-09-04T10:00:00Z',
    slaDeadline: '2026-09-06T18:00:00Z',
    comments: [
      { id: 'c3', authorName: 'Priya Nair', authorRole: 'HR & Facilities', message: 'PO approved with IT procurement. Delivery scheduled for Monday.', timestamp: '2026-09-04T10:00:00Z', isStaff: true },
    ],
  },
  {
    id: 'TICK-103',
    employeeId: 'SRJ-002',
    employeeName: 'Aarav Sharma',
    department: 'Engineering',
    category: 'Payroll & Tax',
    priority: 'Low',
    subject: 'Form 16 Part A & B digital copy for tax filing',
    description: 'Kindly provide the digitally signed Form 16 PDF for FY 2025-26 assessment year.',
    status: 'Open',
    createdAt: '2026-09-05T09:40:00Z',
    updatedAt: '2026-09-05T09:40:00Z',
    slaDeadline: '2026-09-08T18:00:00Z',
    comments: [],
  },
];

const SEED_ANNOUNCEMENTS: CompanyAnnouncement[] = [
  {
    id: 'ANN-01',
    title: '🚀 SrijanDev Platform Hub v4.0 Goes Live with Multi-Tenant Architecture',
    category: 'Leadership Message',
    content: 'We are thrilled to announce the successful release of our next-generation enterprise platform. Kudos to the entire engineering, design, and product team for delivering ahead of schedule with 99.99% uptime!',
    authorName: 'Rajesh Bhatti',
    authorRole: 'Chief Technology Officer',
    publishedAt: '2026-09-01T09:00:00Z',
    isPinned: true,
    likesCount: 28,
  },
  {
    id: 'ANN-02',
    title: '🎉 Annual SrijanDev 48-Hour Hackathon Announced (Oct 15-16)',
    category: 'Event',
    content: 'Mark your calendars! The theme for this year is "Hyper-Speed 3D Digital Twins & Autonomous AI Agents". Grand prize of ₹5,00,000 + cloud credits for all participants. Team registrations open next Monday!',
    authorName: 'Priya Nair',
    authorRole: 'Head of People & Culture',
    publishedAt: '2026-09-03T11:30:00Z',
    isPinned: true,
    likesCount: 35,
  },
  {
    id: 'ANN-03',
    title: '📋 Comprehensive Health & Wellness Insurance Policy Revision',
    category: 'Policy Update',
    content: 'We have upgraded our group medical coverage to ₹10 Lakhs per family with zero co-pay and free OPD consultations on Practo. Please review the updated handbook in Document Repository.',
    authorName: 'Priya Nair',
    authorRole: 'Head of People & Culture',
    publishedAt: '2026-08-28T14:00:00Z',
    isPinned: false,
    likesCount: 22,
  },
];

const SEED_KUDOS: KudosPost[] = [
  {
    id: 'KUD-01',
    fromEmployeeId: 'SRJ-001',
    fromEmployeeName: 'Rajesh Bhatti',
    toEmployeeId: 'SRJ-002',
    toEmployeeName: 'Aarav Sharma',
    badge: 'Rockstar Dev',
    message: 'Insane work optimizing the Three.js shader rendering pipeline! Dropped frame render time from 18ms to 7ms.',
    likesCount: 14,
    timestamp: '2026-09-04T17:30:00Z',
  },
  {
    id: 'KUD-02',
    fromEmployeeId: 'SRJ-006',
    fromEmployeeName: 'Devendra Patel',
    toEmployeeId: 'SRJ-004',
    toEmployeeName: 'Vikramaditya Roy',
    badge: 'Innovation Driver',
    message: 'The new glassmorphic theme and micro-interactions blew the enterprise clients away during our live demo!',
    likesCount: 19,
    timestamp: '2026-09-03T15:00:00Z',
  },
  {
    id: 'KUD-03',
    fromEmployeeId: 'SRJ-002',
    fromEmployeeName: 'Aarav Sharma',
    toEmployeeId: 'SRJ-005',
    toEmployeeName: 'Sneha Kulkarni',
    badge: 'Problem Solver',
    message: 'Huge thanks for debugging the D1 schema synchronization at midnight. Flawless release!',
    likesCount: 11,
    timestamp: '2026-09-02T19:20:00Z',
  },
];

// ---------------------------------------------------------
// HR STORE INTERFACE
// ---------------------------------------------------------

interface HRState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  currentUserRole: HRRole;
  setCurrentUserRole: (role: HRRole) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Punch Clock status
  isPunchedIn: boolean;
  punchInTime: string | null;
  punchOutTime: string | null;
  activeBreak: 'Lunch' | 'Tea' | 'Bio' | null;
  punchIn: () => void;
  punchOut: () => void;
  startBreak: (type: 'Lunch' | 'Tea' | 'Bio') => void;
  endBreak: () => void;

  // Employees
  employees: Employee[];
  addEmployee: (emp: Employee) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addEmployeeDocument: (employeeId: string, doc: EmployeeDocument) => void;

  // Profile change requests
  profileRequests: ProfileChangeRequest[];
  submitProfileRequest: (req: ProfileChangeRequest) => void;
  reviewProfileRequest: (id: string, status: 'Approved' | 'Rejected', remarks?: string) => void;

  // Leaves
  leaveRequests: LeaveRequest[];
  applyLeave: (req: LeaveRequest) => void;
  approveLeave: (id: string, reviewerName: string, remarks?: string) => void;
  rejectLeave: (id: string, reviewerName: string, remarks?: string) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  logAttendance: (rec: AttendanceRecord) => void;

  // Holidays
  holidays: HolidayEvent[];
  addHoliday: (event: HolidayEvent) => void;
  deleteHoliday: (id: string) => void;

  // Recruitment
  jobs: JobOpening[];
  addJob: (job: JobOpening) => void;
  updateJob: (id: string, data: Partial<JobOpening>) => void;
  deleteJob: (id: string) => void;

  candidates: Candidate[];
  addCandidate: (cand: Candidate) => void;
  updateCandidateStage: (id: string, stage: CandidateStage) => void;
  addCandidateNote: (id: string, author: string, note: string) => void;
  scheduleInterview: (id: string, interview: { roundName: string; dateTime: string; interviewer: string; meetLink?: string }) => void;

  // Onboarding
  onboardingList: OnboardingChecklist[];
  toggleOnboardingItem: (employeeId: string, itemId: string) => void;
  addOnboardingItem: (employeeId: string, item: OnboardingItem) => void;

  // Performance & OKRs
  okrs: OKRGoal[];
  addOKR: (okr: OKRGoal) => void;
  updateOKRProgress: (id: string, progress: number) => void;

  reviews: PerformanceReview[];
  addReview: (rev: PerformanceReview) => void;
  updateReview: (id: string, data: Partial<PerformanceReview>) => void;

  // Training
  courses: TrainingCourse[];
  enrollInCourse: (courseId: string, employeeId: string) => void;
  updateCourseProgress: (courseId: string, employeeId: string, progress: number) => void;

  // Helpdesk
  tickets: HelpdeskTicket[];
  createTicket: (ticket: HelpdeskTicket) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  addTicketComment: (ticketId: string, comment: { authorName: string; authorRole: string; message: string; isStaff: boolean }) => void;

  // Announcements & Kudos
  announcements: CompanyAnnouncement[];
  addAnnouncement: (ann: CompanyAnnouncement) => void;
  likeAnnouncement: (id: string) => void;

  kudos: KudosPost[];
  giveKudos: (kudos: KudosPost) => void;
  likeKudos: (id: string) => void;
}

export const useHRStore = create<HRState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      currentUserRole: 'HR Super Admin',
      setCurrentUserRole: (role) => set({ currentUserRole: role }),

      activeTab: 'directory',
      setActiveTab: (tab) => set({ activeTab: tab }),

      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      // Punch Clock
      isPunchedIn: true,
      punchInTime: '09:15 AM',
      punchOutTime: null,
      activeBreak: null,
      punchIn: () => {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        set({ isPunchedIn: true, punchInTime: timeStr, punchOutTime: null });
      },
      punchOut: () => {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        set({ isPunchedIn: false, punchOutTime: timeStr, activeBreak: null });
      },
      startBreak: (type) => set({ activeBreak: type }),
      endBreak: () => set({ activeBreak: null }),

      // Employees
      employees: SEED_EMPLOYEES,
      addEmployee: (emp) => set((s) => ({ employees: [emp, ...s.employees] })),
      updateEmployee: (id, data) =>
        set((s) => ({
          employees: s.employees.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),
      deleteEmployee: (id) =>
        set((s) => ({
          employees: s.employees.filter((e) => e.id !== id),
        })),
      addEmployeeDocument: (employeeId, doc) =>
        set((s) => ({
          employees: s.employees.map((e) =>
            e.id === employeeId ? { ...e, documents: [doc, ...e.documents] } : e
          ),
        })),

      // Profile Requests
      profileRequests: [],
      submitProfileRequest: (req) => set((s) => ({ profileRequests: [req, ...s.profileRequests] })),
      reviewProfileRequest: (id, status, remarks) =>
        set((s) => ({
          profileRequests: s.profileRequests.map((r) =>
            r.id === id ? { ...r, status, decisionRemarks: remarks } : r
          ),
        })),

      // Leaves
      leaveRequests: SEED_LEAVE_REQUESTS,
      applyLeave: (req) => set((s) => ({ leaveRequests: [req, ...s.leaveRequests] })),
      approveLeave: (id, reviewerName, remarks) => {
        const req = get().leaveRequests.find((l) => l.id === id);
        if (req) {
          set((s) => ({
            leaveRequests: s.leaveRequests.map((l) =>
              l.id === id
                ? {
                    ...l,
                    status: 'Approved',
                    reviewedBy: reviewerName,
                    reviewedAt: new Date().toISOString(),
                    reviewRemarks: remarks || 'Approved by Manager',
                  }
                : l
            ),
            employees: s.employees.map((e) => {
              if (e.id === req.employeeId) {
                const bal = { ...e.leaveBalance };
                if (req.leaveType.includes('Casual')) bal.casualUsed += req.daysCount;
                else if (req.leaveType.includes('Sick')) bal.sickUsed += req.daysCount;
                else if (req.leaveType.includes('Earned')) bal.earnedUsed += req.daysCount;
                return { ...e, leaveBalance: bal, status: 'On Leave' };
              }
              return e;
            }),
          }));
        }
      },
      rejectLeave: (id, reviewerName, remarks) =>
        set((s) => ({
          leaveRequests: s.leaveRequests.map((l) =>
            l.id === id
              ? {
                  ...l,
                  status: 'Rejected',
                  reviewedBy: reviewerName,
                  reviewedAt: new Date().toISOString(),
                  reviewRemarks: remarks || 'Declined',
                }
              : l
          ),
        })),

      // Attendance
      attendanceRecords: SEED_ATTENDANCE,
      logAttendance: (rec) => set((s) => ({ attendanceRecords: [rec, ...s.attendanceRecords] })),

      // Holidays
      holidays: SEED_HOLIDAYS,
      addHoliday: (event) => set((s) => ({ holidays: [...s.holidays, event] })),
      deleteHoliday: (id) => set((s) => ({ holidays: s.holidays.filter((h) => h.id !== id) })),

      // Recruitment
      jobs: SEED_JOBS,
      addJob: (job) => set((s) => ({ jobs: [job, ...s.jobs] })),
      updateJob: (id, data) =>
        set((s) => ({
          jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...data } : j)),
        })),
      deleteJob: (id) => set((s) => ({ jobs: s.jobs.filter((j) => j.id !== id) })),

      candidates: SEED_CANDIDATES,
      addCandidate: (cand) => set((s) => ({ candidates: [cand, ...s.candidates] })),
      updateCandidateStage: (id, stage) =>
        set((s) => ({
          candidates: s.candidates.map((c) => (c.id === id ? { ...c, stage } : c)),
        })),
      addCandidateNote: (id, author, text) =>
        set((s) => ({
          candidates: s.candidates.map((c) =>
            c.id === id
              ? {
                  ...c,
                  notes: [
                    ...c.notes,
                    { id: `note-${Date.now()}`, author, text, date: new Date().toISOString().split('T')[0] },
                  ],
                }
              : c
          ),
        })),
      scheduleInterview: (id, interview) =>
        set((s) => ({
          candidates: s.candidates.map((c) => (c.id === id ? { ...c, interviewSchedule: interview } : c)),
        })),

      // Onboarding
      onboardingList: SEED_ONBOARDING,
      toggleOnboardingItem: (employeeId, itemId) =>
        set((s) => ({
          onboardingList: s.onboardingList.map((ob) => {
            if (ob.employeeId === employeeId) {
              const updatedItems = ob.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      isCompleted: !item.isCompleted,
                      completedAt: !item.isCompleted ? new Date().toISOString() : undefined,
                    }
                  : item
              );
              const completedCount = updatedItems.filter((i) => i.isCompleted).length;
              const progressPercentage = Math.round((completedCount / updatedItems.length) * 100);
              return { ...ob, items: updatedItems, progressPercentage };
            }
            return ob;
          }),
        })),
      addOnboardingItem: (employeeId, item) =>
        set((s) => ({
          onboardingList: s.onboardingList.map((ob) =>
            ob.employeeId === employeeId ? { ...ob, items: [...ob.items, item] } : ob
          ),
        })),

      // Performance
      okrs: SEED_OKRS,
      addOKR: (okr) => set((s) => ({ okrs: [okr, ...s.okrs] })),
      updateOKRProgress: (id, progress) =>
        set((s) => ({
          okrs: s.okrs.map((o) =>
            o.id === id
              ? {
                  ...o,
                  progress,
                  status: progress >= 100 ? 'Completed' : progress >= 70 ? 'On Track' : progress >= 40 ? 'At Risk' : 'Behind',
                }
              : o
          ),
        })),

      reviews: SEED_REVIEWS,
      addReview: (rev) => set((s) => ({ reviews: [rev, ...s.reviews] })),
      updateReview: (id, data) =>
        set((s) => ({
          reviews: s.reviews.map((r) => (r.id === id ? { ...r, ...data } : r)),
        })),

      // Training
      courses: SEED_COURSES,
      enrollInCourse: (courseId, employeeId) =>
        set((s) => ({
          courses: s.courses.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  enrolledCount: c.enrolledCount + 1,
                  enrolledEmployees: [...c.enrolledEmployees, { employeeId, progress: 0, isCompleted: false }],
                }
              : c
          ),
        })),
      updateCourseProgress: (courseId, employeeId, progress) =>
        set((s) => ({
          courses: s.courses.map((c) => {
            if (c.id === courseId) {
              const isComp = progress >= 100;
              const certId = isComp ? `CERT-SRJ-${Math.floor(1000 + Math.random() * 9000)}` : undefined;
              return {
                ...c,
                enrolledEmployees: c.enrolledEmployees.map((e) =>
                  e.employeeId === employeeId
                    ? {
                        ...e,
                        progress,
                        isCompleted: isComp,
                        certificateId: certId || e.certificateId,
                        completedAt: isComp ? new Date().toISOString().split('T')[0] : e.completedAt,
                      }
                    : e
                ),
              };
            }
            return c;
          }),
        })),

      // Tickets
      tickets: SEED_TICKETS,
      createTicket: (ticket) => set((s) => ({ tickets: [ticket, ...s.tickets] })),
      updateTicketStatus: (id, status) =>
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
          ),
        })),
      addTicketComment: (ticketId, comment) =>
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  updatedAt: new Date().toISOString(),
                  comments: [
                    ...t.comments,
                    {
                      id: `comm-${Date.now()}`,
                      ...comment,
                      timestamp: new Date().toISOString(),
                    },
                  ],
                }
              : t
          ),
        })),

      // Announcements
      announcements: SEED_ANNOUNCEMENTS,
      addAnnouncement: (ann) => set((s) => ({ announcements: [ann, ...s.announcements] })),
      likeAnnouncement: (id) =>
        set((s) => ({
          announcements: s.announcements.map((a) =>
            a.id === id
              ? {
                  ...a,
                  likesCount: a.userLiked ? a.likesCount - 1 : a.likesCount + 1,
                  userLiked: !a.userLiked,
                }
              : a
          ),
        })),

      // Kudos
      kudos: SEED_KUDOS,
      giveKudos: (k) => set((s) => ({ kudos: [k, ...s.kudos] })),
      likeKudos: (id) =>
        set((s) => ({
          kudos: s.kudos.map((k) => (k.id === id ? { ...k, likesCount: k.likesCount + 1 } : k)),
        })),
    }),
    {
      name: 'srijandev-hr-storage-v1',
    }
  )
);
