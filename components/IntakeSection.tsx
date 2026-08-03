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
    <div className="bg-[#24201C] border border-[#332D28] rounded-xl p-6 shadow-2xl relative overflow-hidden">
      {/* Visual top indicator */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#C5A059]" />
          <h2 className="text-sm font-serif-heading font-semibold text-[#F7F4EE]">Vernacular WhatsApp / Audio Intake</h2>
        </div>
        <button
          onClick={handlePreFill}
          className="text-xs text-[#A8C39B] hover:text-[#c4e3b7] flex items-center space-x-1 bg-[#3E4A36]/40 border border-[#3E4A36] px-2.5 py-1.5 rounded-lg transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Pre-fill Sample Deal</span>
        </button>
      </div>

      <textarea
        rows={4}
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Paste WhatsApp deal message or raw land voice text here... (e.g., 2.5 acres in Shadnagar, 60ft road, asking 2.5Cr/acre for JV)"
        className="w-full bg-[#181512] border border-[#332D28] rounded-lg p-3 text-sm text-[#F7F4EE] placeholder-[#A89F91]/50 focus:outline-none focus:border-[#B8502B] transition resize-none font-sans-body leading-relaxed"
      />

      <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
        <button
          onClick={handleAudioDemoClick}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-[#181512] hover:bg-[#24201C] text-[#A89F91] text-xs px-4 py-2.5 rounded-xl border border-[#332D28] hover:border-[#C5A059]/40 transition"
        >
          <Play className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
          <span>▶️ Play Vernacular Voice Note (Audio Demo)</span>
        </button>

        <button
          onClick={() => onSubmit(textInput)}
          disabled={isLoading || !textInput.trim()}
          className="flex items-center space-x-2 bg-[#B8502B] hover:bg-[#9A3E1E] disabled:bg-[#181512] disabled:text-[#A89F91]/40 disabled:border-[#332D28] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-[#B8502B]/10 ml-auto cursor-pointer"
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
