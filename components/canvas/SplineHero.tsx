'use client';

import Spline from '@splinetool/react-spline';
import { useState } from 'react';

export default function SplineHero() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#030306] z-10">
          <div className="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* 
        Replace this placeholder URL with your own Spline scene export URL.
        Go to spline.design -> Export -> Viewer -> Copy URL 
      */}
      <Spline
        scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
        onLoad={() => setIsLoading(false)}
        className="w-full h-full"
      />
    </div>
  );
}
