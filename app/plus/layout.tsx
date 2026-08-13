import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SrijanDev Plus - Enterprise OS',
  description: 'Enterprise Workforce & Plant Operating System',
};

export default function PlusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden font-sans">
      {children}
    </div>
  );
}
