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
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
        <div className="flex items-center space-x-2 text-emerald-400">
          <Cpu className="w-4 h-4 animate-pulse" />
          <span className="font-bold tracking-wide uppercase">AI Execution Stream</span>
        </div>
        <span className="text-[10px] text-zinc-500">Multimodal Agent Engine v1.0</span>
      </div>

      <div className="space-y-2.5">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start space-x-3">
            <div className="mt-0.5">
              {step.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {step.status === 'active' && <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />}
              {step.status === 'pending' && <div className="w-4 h-4 rounded-full border border-zinc-700" />}
            </div>
            <div className="flex-1">
              <p
                className={`font-medium ${
                  step.status === 'completed'
                    ? 'text-zinc-200'
                    : step.status === 'active'
                    ? 'text-amber-300'
                    : 'text-zinc-500'
                }`}
              >
                {step.label}
              </p>
              {step.detail && <p className="text-[11px] text-zinc-400 mt-0.5">{step.detail}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
