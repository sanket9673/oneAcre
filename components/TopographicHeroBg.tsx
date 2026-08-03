'use client';

import React from 'react';

export default function TopographicHeroBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#181512] -z-10">
      {/* Subtle Warm Gradient Mesh */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[80%] rounded-full bg-[#B8502B]/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[30%] -right-[10%] w-[50%] h-[70%] rounded-full bg-[#3E4A36]/15 blur-[140px] animate-pulse" style={{ animationDuration: '12s' }} />
      
      {/* Topographic Line SVG Overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 stroke-[#C5A059] fill-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern id="topo-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M0 40 Q 30 10, 60 40 T 120 40" strokeWidth="0.75" />
          <path d="M0 80 Q 30 50, 60 80 T 120 80" strokeWidth="0.75" />
          <path d="M0 120 Q 30 90, 60 120 T 120 120" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#topo-pattern)" />
      </svg>

      {/* Tactile Noise Overlay */}
      <div className="absolute inset-0 bg-grain pointer-events-none" />
    </div>
  );
}
