'use client';

import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/ui/HeroSection';
import ClientArea from '@/components/ui/ClientArea';
import ServicesSection from '@/components/ui/ServicesSection';
import ContactSection from '@/components/ui/ContactSection';

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://srijandev.in/#organization',
      name: 'Srijandev Technologies',
      alternateName: ['SrijanDev', 'SrijanDev Studio', 'srijandev.in'],
      legalName: 'Srijandev Technologies',
      identifier: 'UDYAM-HP-11-0048514',
      taxID: 'UDYAM-HP-11-0048514',
      url: 'https://srijandev.in',
      logo: 'https://srijandev.in/logo.png',
      image: 'https://srijandev.in/logo.png',
      description:
        'Srijandev Technologies (SrijanDev, MSME: UDYAM-HP-11-0048514) is an elite digital engineering studio and enterprise software lab in India. Specializing in 3D WebGL experiences, native Android applications, Plus OS workforce platforms, and enterprise portals.',
      email: 'Contact@srijandev.in',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'Himachal Pradesh',
        addressCountry: 'IN',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Digital Engineering Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: '3D Web Design & WebGL Experiences',
              description: 'Custom Three.js environments, GLSL shaders, and interactive spatial 3D web applications.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Native Android Application Development',
              description: 'High-performance native Android apps built for enterprise field operations and consumer scale.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Enterprise Security & Plus OS',
              description: 'Real-time workforce operations, GPS guard touring, and multi-tenant plant facility control systems.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Custom Payroll & Corporate Email Portals',
              description: 'Workforce shift attendance, automated wage computation engines, and corporate email portals.',
            },
          },
        ],
      },
      sameAs: [
        'https://srijandev.in',
        'https://github.com/rajeshbhatti89-stack/srijandev-platform-hub',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://srijandev.in/#website',
      url: 'https://srijandev.in',
      name: 'SrijanDev — Srijandev Technologies',
      description: '3D Web, Native Android & Enterprise Application Engineering',
      publisher: {
        '@id': 'https://srijandev.in/#organization',
      },
      inLanguage: 'en-US',
    },
  ],
};

export default function HomePage() {
  return (
    <main>
      {/* Schema.org Structured Data for Google Rich Snippets & Knowledge Graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <Navbar />
      <HeroSection />
      <ClientArea />
      <ServicesSection />
      <ContactSection />

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#0c0d12] py-10 relative overflow-hidden">
        {/* Top 1px bevel sheen */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1c1e26] to-[#0f1015] border border-white/10 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#00ff87" strokeWidth="1.5" fill="none" />
                <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="#00ff87" opacity="0.8" />
              </svg>
            </div>
            <span className="text-[#8e95a5] text-sm font-medium">
              <span className="text-white font-bold tracking-wide">Srijandev Technologies</span> © {new Date().getFullYear()} • MSME: <span className="text-[#00ff87] font-mono font-semibold">UDYAM-HP-11-0048514</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            <a
              href="#clients"
              className="text-[#8e95a5] hover:text-[#00ff87] text-sm font-medium transition-colors"
            >
              Clients
            </a>
            <a
              href="/about"
              className="text-[#8e95a5] hover:text-[#00e5ff] text-sm font-medium transition-colors"
            >
              About
            </a>
            <a
              href="/hr"
              className="text-[#8e95a5] hover:text-[#f5d061] text-sm font-medium transition-colors"
            >
              HR Portal
            </a>
            <a
              href="/plus"
              className="text-[#8e95a5] hover:text-[#00e5ff] text-sm font-medium transition-colors"
            >
              Plus OS
            </a>
            <a
              href="mailto:Contact@srijandev.in"
              className="text-[#8e95a5] hover:text-[#00ff87] text-sm font-medium transition-colors"
              id="footer-email"
            >
              Contact@srijandev.in
            </a>
            <span className="flex items-center gap-2 text-xs font-mono text-gray-400 px-3 py-1 rounded-full border border-white/[0.06] bg-[#121318]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse shadow-[0_0_8px_#00ff87]" />
              Core Systems Active
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
