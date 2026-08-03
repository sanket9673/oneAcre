'use client';

import React, { useState } from 'react';
import { DeveloperMatch } from '@/types/api';
import { FeasibilityReport } from '@/types/planning';
import { Target, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { DealRoutingModal } from './DealRoutingModal';

interface DeveloperMatchesViewProps {
  matches: DeveloperMatch[];
  report: FeasibilityReport;
}

export function DeveloperMatchesView({ matches, report }: DeveloperMatchesViewProps) {
  const [selectedDev, setSelectedDev] = useState<DeveloperMatch | null>(null);

  if (!matches || matches.length === 0) {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center text-[#A89F91]">
        <p className="text-xs">No direct pgvector matches found. Run an ingestion pipeline to query developer mandates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <h3 className="text-sm font-semibold text-[#F7F4EE] tracking-tight">
          Matched Developer Mandates ({matches.length})
        </h3>
        <span className="flex items-center justify-center space-x-1 bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-[#F59E0B] font-mono-data self-start sm:self-auto">
          <Sparkles className="w-3 h-3 text-[#F59E0B]" />
          <span>pgvector Cosine Search</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {matches.map((dev) => {
          const matchPct = Math.min(99, Math.round((dev.similarity ?? 0.85) * 100));
          const radius = 14;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (matchPct / 100) * circumference;

          return (
            <div
              key={dev.id || dev.developer_name}
              className="bg-white/[0.03] border border-white/10 hover:border-[#D96B27]/40 transition duration-300 rounded-2xl p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top ambient highlight on hover */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D96B27]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white text-sm group-hover:text-[#D96B27] transition-colors leading-tight truncate">
                      {dev.developer_name}
                    </h4>
                    <span className="text-[10px] text-[#A89F91] font-medium tracking-wide mt-1 block uppercase truncate">
                      {dev.ideal_deal_type} Mandate
                    </span>
                  </div>

                  {/* SVG percentage ring */}
                  <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="18" cy="18" r={radius} stroke="rgba(16, 185, 129, 0.05)" strokeWidth="3.5" fill="transparent" />
                      <circle
                        cx="18"
                        cy="18"
                        r={radius}
                        stroke="#10B981"
                        strokeWidth="3.5"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-[#10B981] font-mono-data">
                      {matchPct}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#F7F4EE]/80 mb-4 bg-[#090A0F]/60 p-3.5 rounded-xl border border-white/5 leading-relaxed font-sans-body min-h-[64px] break-words">
                  {dev.requirement_summary}
                </p>

                <div className="space-y-2 text-[10px] text-[#A89F91] mb-5 border-t border-white/5 pt-3">
                  <div className="flex items-center space-x-2">
                    <Target className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                    <span>Extent Required: {dev.min_acres} - {dev.max_acres} Acres</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-[#D96B27] shrink-0" />
                    <span className="truncate max-w-full" title={dev.preferred_locations.join(', ')}>
                      Preferred Hubs: {dev.preferred_locations.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDev(dev)}
                className="w-full bg-[#090A0F] hover:bg-[#D96B27] border border-white/10 hover:border-transparent text-white font-semibold text-xs py-3 rounded-xl transition duration-300 flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <span>Route Deal to Developer</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition duration-300" />
              </button>
            </div>
          );
        })}
      </div>

      {selectedDev && (
        <DealRoutingModal
          dev={selectedDev}
          report={report}
          onClose={() => setSelectedDev(null)}
        />
      )}
    </div>
  );
}
