'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { IntakeSection } from '@/components/IntakeSection';
import { StreamingExecutionLog, ExecutionStep } from '@/components/StreamingExecutionLog';
import { FeasibilityView } from '@/components/FeasibilityView';
import { DeveloperMatchesView } from '@/components/DeveloperMatchesView';
import { IngestResponse } from '@/types/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('feasibility');
  const [response, setResponse] = useState<IngestResponse | null>(null);

  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([
    { id: '1', label: '⚡ Ingesting Audio / Vernacular Text Payload...', status: 'pending' },
    { id: '2', label: '⚡ Scrubbing PII (Phone numbers, Aadhaar, Landowner names)...', status: 'pending' },
    { id: '3', label: '⚡ Normalizing Land Units & Statutory Deductions (GO 168)...', status: 'pending' },
    { id: '4', label: '⚡ Computing Financial Yield & Developer Profit Margins...', status: 'pending' },
    { id: '5', label: '⚡ Generating Gemini Embedding & Searching pgvector DB...', status: 'pending' },
  ]);

  const handlePipelineSubmit = async (textInput: string, isAudioDemo: boolean = false) => {
    setIsLoading(true);
    // When starting a new submission, we reset the response so the tabs hide
    setResponse(null);

    // Reset steps
    setExecutionSteps([
      { id: '1', label: '⚡ Ingesting Audio / Vernacular Text Payload...', status: 'active', detail: isAudioDemo ? 'Audio voice note loaded' : 'Raw text message received' },
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
          s.id === '1' ? { ...s, status: 'completed' } : s.id === '2' ? { ...s, status: 'active', detail: 'Gemini 1.5 Flash PII scrubbing applied' } : s
        )
      );

      // Execute API call
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textPrompt: textInput }),
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 space-y-6">
        <IntakeSection onSubmit={handlePipelineSubmit} isLoading={isLoading} />

        {isLoading || response ? <StreamingExecutionLog steps={executionSteps} /> : null}

        {response && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="feasibility" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-zinc-950">
                Feasibility & Financials
              </TabsTrigger>
              <TabsTrigger value="developers" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-zinc-950">
                Matched Developer Mandates ({response.matchedDevelopers?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feasibility" className="mt-4">
              <FeasibilityView report={response.feasibilityReport} />
            </TabsContent>

            <TabsContent value="developers" className="mt-4">
              <DeveloperMatchesView matches={response.matchedDevelopers} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
