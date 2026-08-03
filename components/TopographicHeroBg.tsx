'use client';

import React from 'react';

export default function TopographicHeroBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#090A0F] -z-10">
      {/* Subtle Warm Terracotta Gradient Mesh */}
      <div 
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[60%] rounded-full bg-[#D96B27]/8 blur-[120px] animate-pulse" 
        style={{ animationDuration: '8s' }} 
      />
      {/* Subtle Emerald Green Gradient Mesh */}
      <div 
        className="absolute top-[20%] -right-[10%] w-[45%] h-[55%] rounded-full bg-[#10B981]/6 blur-[140px] animate-pulse" 
        style={{ animationDuration: '12s' }} 
      />
      
      {/* Topographic Line SVG Overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03] stroke-white fill-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern id="topo-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M0 40 Q 30 10, 60 40 T 120 40" strokeWidth="0.5" />
          <path d="M0 80 Q 30 50, 60 80 T 120 80" strokeWidth="0.5" />
          <path d="M0 120 Q 30 90, 60 120 T 120 120" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#topo-pattern)" />
      </svg>

      {/* Tactile Noise Overlay */}
      <div className="absolute inset-0 bg-grain pointer-events-none" />
    </div>
  );
}
