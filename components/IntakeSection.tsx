'use client';

import React, { useState } from 'react';
import { FileText, Sparkles, Play, Send, RefreshCw } from 'lucide-react';

interface IntakeSectionProps {
  onSubmit: (text: string, isAudioDemo?: boolean) => void;
  isLoading: boolean;
}

const SAMPLE_DEMO_TEXT = `Hi bro, Ramesh here (+91 98765-43210). Parcel available near Shadnagar ORR Exit 16. Total extent 2.5 acres, blacktop road width 60 feet. Asking 2.5 Cr per acre. Landowner open for Joint Development (40/60 share) with a reputed builder. Aadhaar details available.`;

export function IntakeSection({ onSubmit, isLoading }: IntakeSectionProps) {
  const [textInput, setTextInput] = useState('');

  const handlePreFill = () => {
    setTextInput(SAMPLE_DEMO_TEXT);
  };

  const handleAudioDemoClick = () => {
    setTextInput(SAMPLE_DEMO_TEXT);
    onSubmit(SAMPLE_DEMO_TEXT, true);
  };

  return (
    <div className="bg-[#121417] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Top ambient hairline gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D96B27]/40 to-transparent" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#D96B27]" />
          <h2 className="text-sm font-semibold text-[#F7F4EE] tracking-tight">Vernacular WhatsApp / Audio Intake</h2>
        </div>
        <button
          onClick={handlePreFill}
          className="text-xs text-[#A8C39B] hover:text-white flex items-center space-x-1 bg-[#10B981]/10 border border-[#10B981]/20 hover:border-[#10B981]/50 px-3 py-1.5 rounded-lg transition duration-300"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Pre-fill Sample Deal</span>
        </button>
      </div>

      <textarea
        rows={4}
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Paste WhatsApp deal message or raw land voice text here... (e.g., 2.5 acres in Shadnagar, 60ft road, asking 2.5Cr/acre for JV)"
        className="w-full bg-[#090A0F] border border-white/10 rounded-xl p-4 text-sm text-[#F7F4EE] placeholder-[#A89F91]/30 focus:outline-none focus:border-[#D96B27] focus:ring-1 focus:ring-[#D96B27]/50 transition duration-300 resize-none font-mono text-xs leading-relaxed"
      />

      <div className="mt-4 flex flex-wrap gap-4 items-center justify-between">
        {/* Play voice note button with animated emerald pulse */}
        <button
          onClick={handleAudioDemoClick}
          disabled={isLoading}
          className="relative flex items-center space-x-2 bg-[#090A0F] hover:bg-[#121417] text-[#A89F91] hover:text-[#F7F4EE] text-xs px-5 py-3 rounded-xl border border-white/10 hover:border-[#10B981]/30 transition duration-300 group cursor-pointer"
        >
          <span className="absolute -inset-[1px] rounded-xl border border-[#10B981]/20 animate-pulse group-hover:border-[#10B981]/40 pointer-events-none" />
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10B981]"></span>
          </span>
          <Play className="w-3.5 h-3.5 text-[#10B981] fill-[#10B981]/10 group-hover:scale-110 transition duration-300" />
          <span>Play Vernacular Voice Note (Audio Demo)</span>
        </button>

        {/* Primary CTA Run Pipeline with terracotta gradient */}
        <button
          onClick={() => onSubmit(textInput)}
          disabled={isLoading || !textInput.trim()}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#D96B27] to-[#B8502B] hover:from-[#E07A38] hover:to-[#C55731] disabled:from-[#121417] disabled:to-[#121417] disabled:text-[#A89F91]/40 disabled:border-white/5 text-white font-semibold text-xs px-6 py-3 rounded-xl transition duration-300 hover:-translate-y-[1px] active:translate-y-[1px] shadow-lg shadow-[#D96B27]/10 ml-auto cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing Pipeline...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Run AI Agent Pipeline</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
