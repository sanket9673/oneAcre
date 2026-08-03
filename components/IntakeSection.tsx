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
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-zinc-200">Vernacular WhatsApp / Audio Intake</h2>
        </div>
        <button
          onClick={handlePreFill}
          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-md transition"
        >
          <Sparkles className="w-3 h-3" />
          <span>Pre-fill Sample Deal</span>
        </button>
      </div>

      <textarea
        rows={4}
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Paste WhatsApp deal message or raw land voice text here... (e.g., 2.5 acres in Shadnagar, 60ft road, asking 2.5Cr/acre for JV)"
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition resize-none"
      />

      <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
        <button
          onClick={handleAudioDemoClick}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3.5 py-2.5 rounded-lg border border-zinc-700 transition"
        >
          <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <span>▶️ Play Vernacular Voice Note (Audio Demo)</span>
        </button>

        <button
          onClick={() => onSubmit(textInput)}
          disabled={isLoading || !textInput.trim()}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-bold text-xs px-5 py-2.5 rounded-lg transition shadow-lg shadow-emerald-900/30 ml-auto"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
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
