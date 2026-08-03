import type { Metadata } from 'next';
import '@/styles/globals.css';
import { PortalProvider } from '@/features/portal/PortalContext';

export const metadata: Metadata = {
  title: 'SrijanDev | Next Generation Multi-Portal Platform',
  description: 'Enterprise corporate web portal, autonomous AI automation networks, and unified workforce operational SaaS platform.',
  keywords: ['SrijanDev', 'Web Development', 'AI Engineering', 'Workforce SaaS', 'ERP', 'CRM', 'Next.js 15'],
  openGraph: {
    title: 'SrijanDev | Next Generation Multi-Portal Platform',
    description: 'Enterprise corporate web portal and workforce SaaS operations.',
    url: 'https://srijandev.com',
    siteName: 'SrijanDev',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-dark-bg text-slate-100 min-h-screen font-sans antialiased selection:bg-brand-500 selection:text-white">
        <PortalProvider>
          {children}
        </PortalProvider>
      </body>
    </html>
  );
}
