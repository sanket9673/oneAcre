'use client';

import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { IntakeSection } from '@/components/IntakeSection';
import { StreamingExecutionLog, ExecutionStep } from '@/components/StreamingExecutionLog';
import { FeasibilityView } from '@/components/FeasibilityView';
import { DeveloperMatchesView } from '@/components/DeveloperMatchesView';
import TopographicHeroBg from '@/components/TopographicHeroBg';
import { IngestResponse } from '@/types/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('feasibility');
  const [response, setResponse] = useState<IngestResponse | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([
    { id: '1', label: '⚡ AcreGrid AI Engine Processing...', status: 'pending' },
    { id: '2', label: '⚡ Scrubbing PII (Phone numbers, Aadhaar, Landowner names)...', status: 'pending' },
    { id: '3', label: '⚡ Normalizing Land Units & Statutory Deductions (GO 168)...', status: 'pending' },
    { id: '4', label: '⚡ Computing Financial Yield & Developer Profit Margins...', status: 'pending' },
    { id: '5', label: '⚡ Generating Gemini Embedding & Searching pgvector DB...', status: 'pending' },
  ]);

  const handlePipelineSubmit = async (
    textInput: string, 
    isAudioDemo: boolean = false,
    audioBase64?: string,
    mimeType?: string
  ) => {
    setIsLoading(true);
    // When starting a new submission, we reset the response so the tabs hide
    setResponse(null);

    // Reset steps
    setExecutionSteps([
      { id: '1', label: '⚡ AcreGrid AI Engine Processing...', status: 'active', detail: isAudioDemo ? 'Audio voice note loaded' : 'Raw text message received' },
      { id: '2', label: '⚡ Scrubbing PII (Phone numbers, Aadhaar, Landowner names)...', status: 'pending' },
      { id: '3', label: '⚡ Normalizing Land Units & Statutory Deductions (GO 168)...', status: 'pending' },
      { id: '4', label: '⚡ Computing Financial Yield & Developer Profit Margins...', status: 'pending' },
      { id: '5', label: '⚡ Generating Gemini Embedding & Searching pgvector DB...', status: 'pending' },
    ]);

    try {
      // Step 1 complete -> Step 2
      await new Promise((r) => setTimeout(r, 600));
      setExecutionSteps((prev) =>
        prev.map((s) =>
          s.id === '1' ? { ...s, status: 'completed' } : s.id === '2' ? { ...s, status: 'active', detail: 'Gemini 3.5 Flash PII scrubbing applied' } : s
        )
      );

      // Execute API call
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          textPrompt: textInput,
          audioBase64,
          mimeType
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: IngestResponse = await res.json();

      // Step 2 & 3
      await new Promise((r) => setTimeout(r, 600));
      setExecutionSteps((prev) =>
        prev.map((s) =>
          s.id === '2' ? { ...s, status: 'completed' } : s.id === '3' ? { ...s, status: 'active', detail: '15% open space surrendered' } : s
        )
      );

      // Step 4
      await new Promise((r) => setTimeout(r, 600));
      setExecutionSteps((prev) =>
        prev.map((s) =>
          s.id === '3' ? { ...s, status: 'completed' } : s.id === '4' ? { ...s, status: 'active', detail: 'JV 40/60 matrix computed' } : s
        )
      );

      // Step 5
      await new Promise((r) => setTimeout(r, 600));
      setExecutionSteps((prev) =>
        prev.map((s) =>
          s.id === '4' ? { ...s, status: 'completed' } : s.id === '5' ? { ...s, status: 'active', detail: 'Supabase vector search completed' } : s
        )
      );

      await new Promise((r) => setTimeout(r, 400));
      setExecutionSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' })));

      setResponse(data);
      setActiveTab('feasibility');

      // Auto-scroll to results Ref with a smooth scroll action
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F7F4EE] flex flex-col font-sans-body relative overflow-x-hidden">
      {/* Topographic Contour Background */}
      <TopographicHeroBg />

      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:px-6 md:py-10 space-y-6 sm:space-y-8 z-10">
        {/* HERO SECTION */}
        <div className="text-center py-6 md:py-12 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/[0.03] border border-white/10 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-md">
            <span className="text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-[#D96B27] to-[#F59E0B] bg-clip-text text-transparent">
              🚀 AcreGrid Smart Deal Engine v2.0 • Multimodal AI Land Intelligence
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#F7F4EE] leading-tight max-w-3xl mx-auto tracking-tight font-serif-heading">
            Turn Unstructured WhatsApp Audio into{' '}
            <span className="bg-gradient-to-r from-[#D96B27] via-[#F59E0B] to-[#10B981] bg-clip-text text-transparent">
              High-Yield Land Deals
            </span>{' '}
            in 3 Seconds
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#A89F91] max-w-2xl mx-auto leading-relaxed">
            Automated vernacular intake, GO 168 statutory planning math, and vector-matched developer routing for India's land market.
          </p>

          {/* QUICK METRICS BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4 sm:pt-6">
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl text-center hover:border-[#D96B27]/40 transition duration-300">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#A89F91]">Max Permissible FSI</span>
              <p className="text-lg md:text-2xl font-black text-[#F59E0B] mt-1 font-mono-data">3.5x</p>
            </div>
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl text-center hover:border-[#D96B27]/40 transition duration-300">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#A89F91]">Statutory Surrender</span>
              <p className="text-lg md:text-2xl font-black text-[#D96B27] mt-1 font-mono-data">-15%</p>
            </div>
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl text-center hover:border-[#D96B27]/40 transition duration-300">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#A89F91]">Embedding Precision</span>
              <p className="text-lg md:text-2xl font-black text-[#10B981] mt-1 font-mono-data">768-Dim</p>
            </div>
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl text-center hover:border-[#D96B27]/40 transition duration-300">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#A89F91]">Processing Time</span>
              <p className="text-lg md:text-2xl font-black text-white mt-1 font-mono-data">&lt; 1.2s</p>
            </div>
          </div>
        </div>

        {/* INTAKE SECTION */}
        <IntakeSection onSubmit={handlePipelineSubmit} isLoading={isLoading} />

        {(isLoading || response) && <StreamingExecutionLog steps={executionSteps} />}

        {response && (
          <div ref={resultsRef} className="w-full pt-4 scroll-mt-20">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TabsList className="bg-[#121417] border border-white/10 p-1.5 rounded-xl flex w-full sm:w-auto sm:inline-flex gap-1.5 sm:gap-2">
                <TabsTrigger 
                  value="feasibility" 
                  className="flex-1 sm:flex-initial justify-center data-[state=active]:bg-[#D96B27]/20 data-[state=active]:border-[#D96B27] data-[state=active]:text-amber-300 data-[state=active]:shadow-lg data-[state=active]:shadow-[#D96B27]/10 font-bold border border-transparent bg-transparent text-zinc-400 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[11px] sm:text-xs transition-all duration-300 cursor-pointer flex items-center gap-1 sm:gap-1.5 min-w-0 select-none"
                >
                  <span className="shrink-0">📊</span>
                  <span className="truncate">Feasibility & Financials</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="developers" 
                  className="flex-1 sm:flex-initial justify-center data-[state=active]:bg-[#D96B27]/20 data-[state=active]:border-[#D96B27] data-[state=active]:text-amber-300 data-[state=active]:shadow-lg data-[state=active]:shadow-[#D96B27]/10 font-bold border border-transparent bg-transparent text-zinc-400 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[11px] sm:text-xs transition-all duration-300 cursor-pointer flex items-center gap-1 sm:gap-1.5 min-w-0 select-none"
                >
                  <span className="shrink-0">🎯</span>
                  <span className="truncate">Matched Mandates ({response.matchedDevelopers?.length || 0})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="feasibility" className="mt-0 outline-none">
                <FeasibilityView report={response.feasibilityReport} />
              </TabsContent>

              <TabsContent value="developers" className="mt-0 outline-none">
                <DeveloperMatchesView matches={response.matchedDevelopers} report={response.feasibilityReport} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
