'use client';

import React from 'react';
import { Cpu, CheckCircle2, Loader2 } from 'lucide-react';

export interface ExecutionStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
  detail?: string;
}

interface StreamingExecutionLogProps {
  steps: ExecutionStep[];
}

const stepInfo: Record<string, { label: string; time: string }> = {
  '1': { label: 'Ingesting WhatsApp Audio...', time: '0.2s' },
  '2': { label: 'Scrubbing PII & Normalizing Land Units...', time: '0.5s' },
  '3': { label: 'Applying Telangana GO 168 Statutory Deductions (-15% NDA)...', time: '0.8s' },
  '4': { label: 'Calculating BUA & GDV Financial Margins...', time: '1.1s' },
  '5': { label: 'Querying Supabase pgvector DB — 5 Developer Matches Found', time: '1.4s' },
};

export function StreamingExecutionLog({ steps }: StreamingExecutionLogProps) {
  return (
    <div className="bg-[#050608] border border-[#10B981]/25 rounded-2xl p-4 sm:p-5 my-4 sm:my-6 font-mono text-[11px] leading-relaxed shadow-2xl relative overflow-hidden">
      {/* Background scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />

      <div className="flex flex-col xs:flex-row xs:items-center justify-between border-b border-white/5 pb-2.5 mb-4 gap-2">
        <div className="flex items-center space-x-2 text-[#10B981] min-w-0">
          <Cpu className="w-4 h-4 animate-pulse shrink-0" />
          <span className="font-bold tracking-wider uppercase text-xs truncate">AI Execution Stream Logs</span>
        </div>
        <span className="text-[8px] sm:text-[9px] text-[#A89F91]/40 uppercase tracking-widest font-semibold shrink-0">
          Multimodal Agent Engine v2.0
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((step) => {
          const info = stepInfo[step.id] || { label: step.label, time: '0.0s' };
          
          return (
            <div key={step.id} className="flex items-start space-x-2 sm:space-x-3">
              <div className="mt-0.5 shrink-0">
                {step.status === 'completed' && (
                  <span className="text-[#10B981] font-bold">✅</span>
                )}
                {step.status === 'active' && (
                  <Loader2 className="w-3.5 h-3.5 text-[#D96B27] animate-spin" />
                )}
                {step.status === 'pending' && (
                  <span className="text-white/20">⬡</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap sm:flex-nowrap">
                  <span className="text-[#A89F91]/40 text-[10px] sm:text-[11px] shrink-0">[{info.time}]</span>
                  <span
                    className={`font-medium break-words ${
                      step.status === 'completed'
                        ? 'text-white/90'
                        : step.status === 'active'
                        ? 'text-[#F59E0B]'
                        : 'text-white/20'
                    }`}
                  >
                    {info.label}
                  </span>
                </div>
                {step.detail && step.status === 'active' && (
                  <p className="text-[10px] text-[#A89F91] mt-1 pl-6 sm:pl-12 border-l border-white/10 italic break-words">
                    ↳ {step.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
