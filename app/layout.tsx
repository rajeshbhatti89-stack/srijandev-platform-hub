import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SrijanDev — 3D Web, Android & Enterprise Application Engineering',
  description:
    'SrijanDev builds high-performance 3D web experiences, native Android applications, and enterprise workforce management systems. Architected for precision and scale.',
  keywords: ['3D web design', 'WebGL', 'Android development', 'enterprise web app', 'workforce management', 'Three.js'],
  authors: [{ name: 'SrijanDev' }],
  metadataBase: new URL('https://srijandev.in'),
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Guard App',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  openGraph: {
    type: 'website',
    url: 'https://srijandev.in',
    title: 'SrijanDev — High-Performance Digital Engineering',
    description: '3D Web Experiences, Android Applications & Enterprise Web Systems.',
    siteName: 'SrijanDev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SrijanDev — High-Performance Digital Engineering',
    description: '3D Web Experiences, Android Applications & Enterprise Web Systems.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#050508',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

import { GlobalStoreInitializer } from '@/components/GlobalStoreInitializer';
import MobileAppPopup from '@/components/ui/MobileAppPopup';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">
        <GlobalStoreInitializer />
        {children}
        <MobileAppPopup />
      </body>
    </html>
  );
}
