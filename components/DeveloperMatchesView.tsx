'use client';

import React from 'react';
import { DeveloperMatch } from '@/types/api';
import { Target, MapPin, ArrowRight } from 'lucide-react';

interface DeveloperMatchesViewProps {
  matches: DeveloperMatch[];
}

export function DeveloperMatchesView({ matches }: DeveloperMatchesViewProps) {
  if (!matches || matches.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-400">
        <p>No direct pgvector matches found. Run an ingestion pipeline to query developer mandates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200">
          Matched Developer Mandates ({matches.length})
        </h3>
        <span className="text-xs text-emerald-400 font-mono">pgvector Cosine Search</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((dev) => {
          const matchPct = Math.min(99, Math.round((dev.similarity ?? 0.85) * 100));

          return (
            <div
              key={dev.id || dev.developer_name}
              className="bg-zinc-900 border border-zinc-800 hover:border-emerald-700/60 transition rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-zinc-100 text-base">{dev.developer_name}</h4>
                    <span className="text-xs text-zinc-400 font-medium">{dev.ideal_deal_type} Mandate</span>
                  </div>
                  <div className="bg-emerald-950 border border-emerald-700/60 text-emerald-400 font-bold px-2.5 py-1 rounded-full text-xs">
                    {matchPct}% Match
                  </div>
                </div>

                <p className="text-xs text-zinc-300 mb-3 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/60">
                  {dev.requirement_summary}
                </p>

                <div className="space-y-1.5 text-xs text-zinc-400 mb-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Extent Required: {dev.min_acres} - {dev.max_acres} Acres</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Preferred: {dev.preferred_locations.join(', ')}</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-zinc-800 hover:bg-emerald-600 hover:text-zinc-950 text-zinc-200 font-semibold text-xs py-2 rounded-lg transition flex items-center justify-center space-x-1.5">
                <span>Route Deal to Developer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
