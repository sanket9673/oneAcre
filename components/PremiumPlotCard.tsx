'use client';

import React from 'react';
import { MapPin, ArrowUpRight, ShieldCheck, Compass } from 'lucide-react';

interface PlotCardProps {
  title: string;
  location: string;
  extentAcres: number;
  roadWidthFt: number;
  fsi: number;
  gdvCr: number;
  marginPercent: number;
  dealType: string;
  onSelect: () => void;
}

export default function PremiumPlotCard({
  title,
  location,
  extentAcres,
  roadWidthFt,
  fsi,
  gdvCr,
  marginPercent,
  dealType,
  onSelect,
}: PlotCardProps) {
  return (
    <div className="group relative bg-[#24201C] border border-[#332D28] hover:border-[#C5A059]/60 rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#C5A059]/5">
      {/* Top Gold Hairline Indicator on Hover */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#3E4A36]/40 text-[#A8C39B] border border-[#3E4A36] mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            {dealType}
          </span>
          <h3 className="font-serif-heading text-xl text-[#F7F4EE] group-hover:text-[#C5A059] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-[#A89F91] flex items-center gap-1 mt-1 font-sans-body">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
            {location}
          </p>
        </div>
        <button
          onClick={onSelect}
          className="p-2.5 rounded-full bg-[#181512] text-[#F7F4EE] group-hover:bg-[#B8502B] group-hover:text-white transition-all"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 my-5 p-3 rounded-lg bg-[#181512]/60 border border-[#332D28]/60">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#A89F91] block">Extent</span>
          <span className="font-mono-data text-base font-bold text-[#F7F4EE]">{extentAcres} Ac</span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#A89F91] block">FSI Yield</span>
          <span className="font-mono-data text-base font-bold text-[#C5A059]">{fsi}x</span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#A89F91] block">Net Margin</span>
          <span className="font-mono-data text-base font-bold text-[#A8C39B]">{marginPercent}%</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-xs text-[#A89F91] pt-3 border-t border-[#332D28]">
        <span className="flex items-center gap-1 font-sans-body">
          <Compass className="w-3.5 h-3.5 text-[#C5A059]" /> {roadWidthFt}ft Road Access
        </span>
        <span className="font-mono-data font-semibold text-[#F7F4EE]">Est. GDV ₹{gdvCr} Cr</span>
      </div>
    </div>
  );
}
