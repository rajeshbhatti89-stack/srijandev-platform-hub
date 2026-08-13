'use client';

import { useEnterpriseStore } from '@/store/useEnterpriseStore';
import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/ui/HeroSection';
import ServicesSection from '@/components/ui/ServicesSection';
import ContactSection from '@/components/ui/ContactSection';

export default function HomePage() {
  const { isPlusMode, setIsPlusMode } = useEnterpriseStore();

  return (
    <main>
      <Navbar isPlusMode={isPlusMode} setIsPlusMode={setIsPlusMode} />
      <HeroSection isPlusMode={isPlusMode} />
      <ServicesSection />
      <ContactSection />

      {/* Footer */}
      <footer className="border-t border-white/5 bg-gray-950 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none" />
                <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" opacity="0.8" />
              </svg>
            </div>
            <span className="text-gray-400 text-sm font-medium">
              <span className="text-white font-bold">SrijanDev</span> © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="mailto:Contact@srijandev.in"
              className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
              id="footer-email"
            >
              Contact@srijandev.in
            </a>
            <span className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Systems Online
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
