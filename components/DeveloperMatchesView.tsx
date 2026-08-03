'use client';

import React, { useState } from 'react';
import { DeveloperMatch } from '@/types/api';
import { FeasibilityReport } from '@/types/planning';
import { Target, MapPin, ArrowRight } from 'lucide-react';
import { DealRoutingModal } from './DealRoutingModal';

interface DeveloperMatchesViewProps {
  matches: DeveloperMatch[];
  report: FeasibilityReport;
}

export function DeveloperMatchesView({ matches, report }: DeveloperMatchesViewProps) {
  const [selectedDev, setSelectedDev] = useState<DeveloperMatch | null>(null);

  if (!matches || matches.length === 0) {
    return (
      <div className="bg-[#24201C] border border-[#332D28] rounded-xl p-8 text-center text-[#A89F91]">
        <p>No direct pgvector matches found. Run an ingestion pipeline to query developer mandates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-serif-heading font-bold text-[#F7F4EE]">
          Matched Developer Mandates ({matches.length})
        </h3>
        <span className="text-xs text-[#C5A059] font-mono-data">pgvector Cosine Search</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((dev) => {
          const matchPct = Math.min(99, Math.round((dev.similarity ?? 0.85) * 100));

          return (
            <div
              key={dev.id || dev.developer_name}
              className="bg-[#24201C] border border-[#332D28] hover:border-[#C5A059]/40 transition duration-300 rounded-xl p-5 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle top indicator hover line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-serif-heading font-bold text-[#F7F4EE] text-base group-hover:text-[#C5A059] transition-colors">
                      {dev.developer_name}
                    </h4>
                    <span className="text-xs text-[#A89F91] font-medium">{dev.ideal_deal_type} Mandate</span>
                  </div>
                  <div className="bg-[#3E4A36]/40 border border-[#3E4A36] text-[#A8C39B] font-bold px-2.5 py-1 rounded-full text-xs">
                    {matchPct}% Match
                  </div>
                </div>

                <p className="text-xs text-[#F7F4EE]/90 mb-3 bg-[#181512] p-3 rounded-lg border border-[#332D28]/60 leading-relaxed font-sans-body">
                  {dev.requirement_summary}
                </p>

                <div className="space-y-1.5 text-xs text-[#A89F91] mb-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Extent Required: {dev.min_acres} - {dev.max_acres} Acres</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="truncate max-w-[280px]">Preferred: {dev.preferred_locations.join(', ')}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDev(dev)}
                className="w-full bg-[#181512] hover:bg-[#B8502B] border border-[#332D28] hover:border-transparent text-[#F7F4EE] hover:text-white font-bold text-xs py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <span>Route Deal to Developer</span>
                <ArrowRight className="w-3.5 h-3.5" />
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
