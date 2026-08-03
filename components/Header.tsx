'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Database } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full border-b border-emerald-900/40 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-zinc-950 text-xl shadow-lg shadow-emerald-900/40">
          1a
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-zinc-100 text-lg tracking-tight">1acre.in AI Engine</h1>
            <span className="bg-emerald-950 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-700/50 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Multimodal
            </span>
          </div>
          <p className="text-xs text-zinc-400">Developer JV Feasibility & Vector Matching Engine</p>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-4 text-xs text-zinc-400">
        <div className="flex items-center space-x-1.5 bg-zinc-900 px-3 py-1.5 rounded-md border border-zinc-800">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>pgvector Enabled</span>
        </div>
        <div className="flex items-center space-x-1.5 bg-zinc-900 px-3 py-1.5 rounded-md border border-zinc-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Auto PII Scrubbing</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-300 font-medium">Gemini 1.5/2.5 Active</span>
        </div>
      </div>
    </header>
  );
}
