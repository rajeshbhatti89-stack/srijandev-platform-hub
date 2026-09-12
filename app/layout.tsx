import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'SrijanDev — 3D Web, Android & Enterprise Engineering | Srijandev Technologies',
    template: '%s | SrijanDev',
  },
  description:
    'Srijandev Technologies (SrijanDev, MSME: UDYAM-HP-11-0048514) is an elite digital engineering studio in India. We engineer immersive 3D WebGL experiences, native Android applications, Plus OS workforce systems, and enterprise portals.',
  keywords: [
    'SrijanDev',
    'Srijandev Technologies',
    'srijandev.in',
    'UDYAM-HP-11-0048514',
    'Srijandev Himachal Pradesh',
    'SrijanDev India',
    '3D Web Design India',
    'WebGL Three.js development',
    'Native Android app development company',
    'Plus OS workforce operations',
    'SrijanDev HR management system',
    'custom payroll portal development',
    'enterprise web application',
    'corporate email setup India',
    'Govt registered MSME software company',
  ],
  authors: [{ name: 'Srijandev Technologies', url: 'https://srijandev.in' }],
  creator: 'Srijandev Technologies',
  publisher: 'Srijandev Technologies',
  metadataBase: new URL('https://srijandev.in'),
  alternates: {
    canonical: 'https://srijandev.in',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'SrijanDev',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://srijandev.in',
    title: 'SrijanDev — 3D Web, Android & Enterprise Engineering | Srijandev Technologies',
    description:
      'Srijandev Technologies (SrijanDev, MSME: UDYAM-HP-11-0048514) builds high-performance 3D web experiences, native Android applications, and enterprise platforms.',
    siteName: 'Srijandev Technologies',
    images: [
      {
        url: 'https://srijandev.in/logo.png',
        width: 1200,
        height: 630,
        alt: 'Srijandev Technologies - SrijanDev Official Brand Emblem',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SrijanDev — 3D Web, Android & Enterprise Engineering | Srijandev Technologies',
    description:
      'Srijandev Technologies (MSME: UDYAM-HP-11-0048514) architects high-performance 3D spatial web experiences, native Android apps, and enterprise systems.',
    images: ['https://srijandev.in/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'IN-HP',
    'geo.placename': 'Himachal Pradesh, India',
    'enterprise:udyam': 'UDYAM-HP-11-0048514',
    'legal-name': 'Srijandev Technologies',
  },
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
