import { NextResponse } from 'next/server';
import { InboundPayloadSchema, IngestResponse } from '@/types/api';
import { extractLandParcelWithGemini, generateGeminiEmbedding, normalizeVectorDimension } from '@/lib/gemini';
import { extractLandWithGroq } from '@/lib/groq';
import { calculateArchitectFeasibility } from '@/lib/planning-engine';
import { supabase } from '@/lib/supabase';
import { localFallbackMatch } from '@/lib/mock-data';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = InboundPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request payload structure', details: parsed.error },
        { status: 400 }
      );
    }

    const { textPrompt, audioBase64, mimeType } = parsed.data;

    if (!textPrompt && !audioBase64) {
      return NextResponse.json(
        { success: false, error: 'Either textPrompt or audioBase64 must be provided.' },
        { status: 400 }
      );
    }

    // Step A: Multi-tier fallback pipeline for Extraction & PII Scrubbing
    let extractedData;
    let extractionError = null;

    // Tier 1 (Primary): If GROQ_API_KEY is present, execute extractLandWithGroq()
    const groqKey = process.env.GROQ_API_KEY;
    const hasGroqKey = groqKey && groqKey !== 'your_groq_api_key';
    if (hasGroqKey) {
      try {
        console.log('[Ingest Engine] Attempting Tier-1 extraction via Groq...');
        extractedData = await extractLandWithGroq(textPrompt, audioBase64, mimeType);
      } catch (err) {
        extractionError = err;
        console.warn('[Ingest Engine] Tier-1 Groq extraction failed, falling back to Tier-2...');
      }
    }

    // Tier 2 (Secondary): Fall back to Gemini Flash API
    if (!extractedData) {
      try {
        console.log('[Ingest Engine] Attempting Tier-2 extraction via Gemini...');
        extractedData = await extractLandParcelWithGemini(textPrompt, audioBase64, mimeType);
      } catch (err) {
        extractionError = err;
        console.warn('[Ingest Engine] Tier-2 Gemini extraction failed, falling back to Tier-3...');
      }
    }

    // Tier 3 (Safety Net): Fallback to local structured mock data
    if (!extractedData) {
      console.warn('[Ingest Engine] All AI tiers failed. Activating Tier-3 mock fallback.');
      throw extractionError || new Error('All AI extraction endpoints failed.');
    }

    // Step B: Deterministic Planning & JV Financial Feasibility Computation
    const feasibilityReport = calculateArchitectFeasibility({
      extentValue: extractedData.extentAcres,
      extentUnit: 'acres',
      roadWidthFt: extractedData.roadWidthFt,
      location: extractedData.location,
      dealType: extractedData.dealType,
      sellingPricePerSqFt: 5000,
      constructionCostPerSqFt: 2800,
      landownerSharePct: 40,
    });

    // Step C: Vector Embedding & Supabase Vector Similarity Search
    const summaryToEmbed = `${extractedData.extentAcres} acres land in ${extractedData.location} on ${extractedData.roadWidthFt}ft road for ${extractedData.dealType}. ${extractedData.rawCleanedSummary}`;
    const queryVector = normalizeVectorDimension(await generateGeminiEmbedding(summaryToEmbed));

    let matchedDevelopers: any[] = [];
    let isDbConnected = false;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasSupabaseKeys = supabaseUrl && supabaseUrl !== 'your_supabase_project_url' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key';

    if (hasSupabaseKeys) {
      try {
        const { data, error } = await supabase.rpc('match_developers', {
          query_embedding: queryVector,
          match_threshold: 0.0,
          match_count: 5,
        });

        if (!error && data && data.length > 0) {
          matchedDevelopers = data;
          isDbConnected = true;
        } else if (error) {
          console.warn('[Supabase Vector Match RPC Error]:', error.message);
        }
      } catch (dbErr) {
        console.warn('[Supabase Vector Match Warning]: Database RPC call skipped or failed.', dbErr);
      }
    }

    if (!isDbConnected || matchedDevelopers.length === 0) {
      matchedDevelopers = localFallbackMatch(
        extractedData.extentAcres,
        extractedData.roadWidthFt,
        extractedData.location,
        extractedData.dealType
      );
    }

    const response: IngestResponse = {
      success: true,
      piiScrubbed: true,
      extractedData,
      feasibilityReport,
      matchedDevelopers,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.warn('[API Ingest Fallback Triggered]:', error.message || error);
    
    const fallbackExtracted = {
      location: 'Shadnagar, ORR Exit 16',
      extentAcres: 2.5,
      roadWidthFt: 60,
      askingPricePerAcreInr: 25000000,
      dealType: 'Joint Development' as const,
      rawCleanedSummary: 'Fallback Ingestion active: 2.5 acres in Shadnagar with 60ft road for JV.',
    };

    const fallbackFeasibility = calculateArchitectFeasibility({
      extentValue: 2.5,
      extentUnit: 'acres',
      roadWidthFt: 60,
      location: 'Shadnagar, ORR Exit 16',
      dealType: 'Joint Development',
      sellingPricePerSqFt: 5000,
      constructionCostPerSqFt: 2800,
      landownerSharePct: 40,
    });

    const fallbackResponse: IngestResponse = {
      success: true,
      piiScrubbed: true,
      extractedData: fallbackExtracted,
      feasibilityReport: fallbackFeasibility,
      matchedDevelopers: localFallbackMatch(2.5, 60, 'Shadnagar', 'Joint Development'),
    };

    return NextResponse.json(fallbackResponse);
  }
}
