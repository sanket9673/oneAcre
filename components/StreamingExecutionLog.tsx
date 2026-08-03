'use client';

import React from 'react';
import { CheckCircle2, Loader2, Cpu } from 'lucide-react';

export interface ExecutionStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
  detail?: string;
}

interface StreamingExecutionLogProps {
  steps: ExecutionStep[];
}

export function StreamingExecutionLog({ steps }: StreamingExecutionLogProps) {
  return (
    <div className="bg-[#181512] border border-[#C5A059]/20 rounded-xl p-4 my-4 font-mono-data text-xs">
      <div className="flex items-center justify-between border-b border-[#332D28] pb-2 mb-3">
        <div className="flex items-center space-x-2 text-[#C5A059]">
          <Cpu className="w-4 h-4 animate-pulse" />
          <span className="font-bold tracking-wide uppercase">AI Execution Stream</span>
        </div>
        <span className="text-[10px] text-[#A89F91]/50">Multimodal Agent Engine v1.0</span>
      </div>

      <div className="space-y-2.5">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start space-x-3">
            <div className="mt-0.5">
              {step.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-[#A8C39B]" />}
              {step.status === 'active' && <Loader2 className="w-4 h-4 text-[#B8502B] animate-spin" />}
              {step.status === 'pending' && <div className="w-4 h-4 rounded-full border border-[#332D28]" />}
            </div>
            <div className="flex-1">
              <p
                className={`font-medium ${
                  step.status === 'completed'
                    ? 'text-[#F7F4EE]'
                    : step.status === 'active'
                    ? 'text-[#C5A059]'
                    : 'text-[#A89F91]/40'
                }`}
              >
                {step.label}
              </p>
              {step.detail && <p className="text-[11px] text-[#A89F91] mt-0.5 leading-relaxed">{step.detail}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
