'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Database } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full border-b border-[#332D28]/60 bg-[#181512]/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-lg bg-[#B8502B] flex items-center justify-center font-serif-heading font-black text-[#F7F4EE] text-xl shadow-lg shadow-[#B8502B]/20">
          1a
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif-heading font-bold text-[#F7F4EE] text-lg tracking-tight">1acre.in AI Engine</h1>
            <span className="bg-[#3E4A36]/40 text-[#A8C39B] text-xs px-2.5 py-0.5 rounded-full border border-[#3E4A36]/60 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C5A059]" /> Multimodal
            </span>
          </div>
          <p className="text-xs text-[#A89F91] font-sans-body">Developer JV Feasibility & Vector Matching Engine</p>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-4 text-xs text-[#A89F91] font-sans-body">
        <div className="flex items-center space-x-1.5 bg-[#24201C] px-3 py-1.5 rounded-md border border-[#332D28]">
          <Database className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>pgvector Enabled</span>
        </div>
        <div className="flex items-center space-x-1.5 bg-[#24201C] px-3 py-1.5 rounded-md border border-[#332D28]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Auto PII Scrubbing</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8502B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B8502B]"></span>
          </span>
          <span className="text-[#F7F4EE] font-semibold">Gemini API Active</span>
        </div>
      </div>
    </header>
  );
}
