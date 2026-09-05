import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'SrijanDev HR Management — Core HR, Time & Attendance, ATS, LMS & ESS',
  description:
    'Production-grade Enterprise Human Resource Management Suite by SrijanDev. Featuring digital employee profiles, visual org chart hierarchy, automated LMS leave balances, geofenced attendance punch, 7-stage ATS recruitment pipeline, 9-box talent matrix, and employee self-service.',
  keywords: [
    'SrijanDev HR',
    'HRMS',
    'Human Resource Management',
    'ATS',
    'Leave Management System',
    'Attendance Tracking',
    'Employee Self Service',
    'Performance 9-Box Matrix',
    'Enterprise OS',
  ],
  openGraph: {
    title: 'SrijanDev HR Management System',
    description: 'Enterprise HR, Payroll, ATS & Performance Operations.',
    url: 'https://srijandev.in/hr',
    siteName: 'SrijanDev HR',
  },
};

export const viewport: Viewport = {
  themeColor: '#050508',
  width: 'device-width',
  initialScale: 1,
};

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return <div className="w-full min-h-screen">{children}</div>;
}
