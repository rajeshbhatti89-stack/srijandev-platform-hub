'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ExternalLink, QrCode, CheckCircle2, X } from 'lucide-react';

interface GoogleReviewBadgeProps {
  variant?: 'card' | 'compact' | 'hero';
  className?: string;
}

const GOOGLE_REVIEW_URL =
  'https://local.google.com/place?placeid=ChIJe1RxSDxvBTkRnAN6IJspM8E&utm_medium=noren&utm_source=gbp&utm_campaign=2026';

export default function GoogleReviewBadge({
  variant = 'card',
  className = '',
}: GoogleReviewBadgeProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className={`rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#181a24] via-[#13141b] to-[#0d0e12] p-6 sm:p-7 shadow-[8px_8px_24px_rgba(0,0,0,0.65),-3px_-3px_12px_rgba(255,255,255,0.025),inset_0_1px_0_rgba(255,255,255,0.12)] relative overflow-hidden ${className}`}
      >
        {/* Top 1px bevel sheen */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        {/* Header Header Status */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4285F4] animate-pulse shadow-[0_0_8px_#4285F4]" />
            <span className="text-xs font-bold tracking-widest text-[#4285F4] uppercase font-mono">
              Google Verified
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full text-xs text-amber-400 font-semibold shadow-sm">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-white text-[11px] font-bold ml-1">5.0</span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
          <span>Review Us on Google</span>
        </h3>
        <p className="text-[#8e95a5] text-xs sm:text-sm mb-5 leading-relaxed">
          Scan the official QR code to view our Google Business Profile, read verified client feedback, or leave a review for Srijandev Technologies.
        </p>

        {/* The Cropped Cutting-Area QR Badge */}
        <div className="relative group cursor-pointer" onClick={() => setModalOpen(true)}>
          <div className="relative mx-auto max-w-[260px] sm:max-w-[280px] rounded-2xl overflow-hidden bg-white p-3 sm:p-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-white/20 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_12px_32px_rgba(66,133,244,0.25)]">
            <div className="relative w-full aspect-[1200/1336]">
              <Image
                src="/google-review-qr.webp"
                alt="Google Business Profile Review QR Code - Srijandev Technologies"
                fill
                sizes="(max-width: 768px) 260px, 280px"
                className="object-contain"
                priority
              />
            </div>

            {/* Click to zoom badge overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-center pb-2 pointer-events-none">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-gray-800 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                Click to Enlarge
              </span>
            </div>
          </div>
        </div>

        {/* Instructions & Buttons */}
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 font-mono">
            <QrCode size={13} className="text-[#00ff87]" />
            <span>Scan with mobile camera or click below</span>
          </div>

          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="google-review-link-btn"
            className="flex items-center justify-center gap-2.5 w-full px-5 py-3 rounded-xl bg-gradient-to-r from-[#4285F4] to-[#2B6CB0] hover:from-[#3367D6] hover:to-[#1A569D] text-white font-bold text-xs tracking-wide uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(66,133,244,0.3)] hover:shadow-[0_6px_20px_rgba(66,133,244,0.5)] hover:scale-[1.01] active:scale-[0.98]"
          >
            <span>Open Google Profile &amp; Reviews</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Footer info strip */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-400">
          <span className="font-mono text-gray-400">Srijandev Technologies</span>
          <span className="text-[#00ff87] font-mono flex items-center gap-1">
            <CheckCircle2 size={12} />
            Verified Profile
          </span>
        </div>
      </div>

      {/* Enlarged QR Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-md w-full rounded-2xl bg-[#121319] border border-white/10 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4285F4]/10 border border-[#4285F4]/30 text-[#4285F4] text-xs font-mono font-bold mb-2">
                <span>Google Business Profile QR</span>
              </div>
              <h4 className="text-white font-bold text-lg">Srijandev Technologies</h4>
              <p className="text-gray-400 text-xs mt-1">
                Scan with your smartphone camera to visit our Google page
              </p>
            </div>

            <div className="relative w-full max-w-[320px] mx-auto aspect-[1200/1336] rounded-xl overflow-hidden bg-white p-4 shadow-lg">
              <Image
                src="/google-review-qr.png"
                alt="Google Business Profile Review QR Code"
                fill
                sizes="320px"
                className="object-contain"
              />
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Visit Review Page Directly</span>
                <ExternalLink size={14} />
              </a>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-full py-2.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
