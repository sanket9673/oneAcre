'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Cpu, ExternalLink } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export function Header() {
  return (
    <header className="w-full border-b border-white/10 bg-[#090A0F]/80 backdrop-blur-xl sticky top-0 z-50 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Brand Logo & Status */}
      <div className="flex items-center space-x-4">
        <div className="h-9 w-9 rounded-lg bg-[#D96B27] flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-[#D96B27]/20 select-none">
          1a
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif-heading font-extrabold text-[#F7F4EE] text-base tracking-tight">1acre.in</h1>
            <span className="flex items-center space-x-1.5 bg-[#10B981]/10 text-[#10B981] text-[10px] px-2.5 py-0.5 rounded-full border border-[#10B981]/20 font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10B981]"></span>
              </span>
              <span>System Live | Supabase pgvector Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Center: System Status Pill */}
      <div className="hidden lg:flex items-center space-x-2 text-xs">
        <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/10 px-3.5 py-1.5 rounded-full text-[#A89F91]">
          <Cpu className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Groq LPU Enabled</span>
          <span className="text-white/20">•</span>
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>GO 168 Rules Integrated</span>
          <span className="text-white/20">•</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D96B27]" />
          <span>PII Redactor Active</span>
        </div>
      </div>

      {/* Right: GitHub & Demo CTA */}
      <div className="flex items-center space-x-4">
        <a
          href="https://github.com/sanket9673/oneAcre"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#A89F91] hover:text-[#F7F4EE] flex items-center space-x-1.5 transition-colors"
        >
          <GithubIcon className="w-4 h-4" />
          <span className="hidden sm:inline">View Source</span>
          <ExternalLink className="w-3 h-3 opacity-50" />
        </a>

        <a
          href="https://linkedin.com/in/sanket-kisan-chavhan-930042273"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-semibold rounded-xl group bg-gradient-to-br from-[#D96B27]/40 to-transparent hover:from-[#D96B27] hover:to-[#F59E0B] transition-all cursor-pointer animate-none"
        >
          <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-[#090A0F] rounded-[10px] group-hover:bg-opacity-0 text-[#F7F4EE] group-hover:text-white">
            Book Founder Demo
          </span>
        </a>
      </div>
    </header>
  );
}
