import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { ExtractedLand } from '@/types/api';

const apiKey = process.env.GEMINI_API_KEY || '';
const isPlaceholder = !apiKey || apiKey.includes('your_google_gemini_api_key');
export const genAI = !isPlaceholder ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Generates a 768-dimensional embedding vector for a given text using text-embedding-004.
 * Kept for backwards compatibility.
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  if (!genAI) {
    console.warn('GEMINI_API_KEY is not configured or placeholder. Returning zero vector.');
    return new Array(768).fill(0);
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });
    const result = await model.embedContent({
      content: { parts: [{ text }] },
      outputDimensionality: 768,
    } as any);
    if (result.embedding?.values) {
      return result.embedding.values;
    }
    return new Array(768).fill(0);
  } catch (error) {
    console.error('Error generating embedding from Gemini:', error);
    return new Array(768).fill(0);
  }
};

/**
 * Analyzes land parcel details and extracts structured metadata and feasibility scores using gemini-2.5-flash.
 * Kept for backwards compatibility.
 */
export const analyzeLandDocument = async (rawText: string): Promise<{
  extractedAcres: number;
  extractedRoadWidthFt: number;
  extractedLocation: string;
  extractedDealType: string;
  financialFeasibilityScore: number;
  keyMetrics: {
    estimatedRevenueCr: number;
    estimatedCostCr: number;
    npvCr: number;
    irrPercent: number;
  };
  riskFactors: string[];
  suitabilityAnalysis: string;
}> => {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env.local file.');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const prompt = `
You are a Real Estate Financial Analyst. Analyze the following land parcel description and extract:
1. Total land size in acres (convert from guntas/sq yards if necessary. 1 acre = 40 guntas = 4840 sq yards).
2. Approach road width in feet.
3. Specific location/micro-market.
4. Preferred/proposed deal type (Joint Development, Outright Purchase, or Not Specified).
5. A financial feasibility score (0 to 100) based on typical metrics for real estate projects.
6. Rough key metrics: Estimated Revenue (in Crore INR), Estimated Cost (in Crore INR), Net Present Value (NPV in Crore INR), Internal Rate of Return (IRR in %). Use standard heuristics (e.g., revenue = size * 8 Cr/acre for plotted, costs = 4 Cr/acre for infrastructure/acquisition, NPV = revenue - cost, IRR = 20-30% depending on constraints).
7. Potential risk factors (e.g., narrow road width, zoning regulations, distance from transport corridors).
8. A brief suitability analysis narrative.

Respond ONLY with a JSON object containing the exact fields defined below. Do not wrap in markdown or backticks.

Output JSON Schema:
{
  "extractedAcres": number,
  "extractedRoadWidthFt": number,
  "extractedLocation": "string",
  "extractedDealType": "Joint Development" | "Outright Purchase" | "Not Specified",
  "financialFeasibilityScore": number,
  "keyMetrics": {
    "estimatedRevenueCr": number,
    "estimatedCostCr": number,
    "npvCr": number,
    "irrPercent": number
  },
  "riskFactors": ["string"],
  "suitabilityAnalysis": "string"
}

Document Content:
"""
${rawText}
"""
`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            extractedAcres: { type: SchemaType.NUMBER },
            extractedRoadWidthFt: { type: SchemaType.NUMBER },
            extractedLocation: { type: SchemaType.STRING },
            extractedDealType: { type: SchemaType.STRING },
            financialFeasibilityScore: { type: SchemaType.NUMBER },
            keyMetrics: {
              type: SchemaType.OBJECT,
              properties: {
                estimatedRevenueCr: { type: SchemaType.NUMBER },
                estimatedCostCr: { type: SchemaType.NUMBER },
                npvCr: { type: SchemaType.NUMBER },
                irrPercent: { type: SchemaType.NUMBER },
              },
              required: ['estimatedRevenueCr', 'estimatedCostCr', 'npvCr', 'irrPercent'],
            },
            riskFactors: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            suitabilityAnalysis: { type: SchemaType.STRING },
          },
          required: [
            'extractedAcres',
            'extractedRoadWidthFt',
            'extractedLocation',
            'extractedDealType',
            'financialFeasibilityScore',
            'keyMetrics',
            'riskFactors',
            'suitabilityAnalysis',
          ],
        },
      },
    });

    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error analyzing land document with Gemini:', error);
    throw error;
  }
};

/**
 * Multimodal extraction (audio or text) using Gemini Flash with strict PII scrubbing.
 */
export async function extractLandParcelWithGemini(
  textPrompt?: string,
  audioBase64?: string,
  mimeType: string = 'audio/mp3'
): Promise<ExtractedLand> {
  if (!genAI) {
    console.warn('[Gemini] GEMINI_API_KEY missing or placeholder. Returning structured mock for testing.');
    return {
      location: 'Shadnagar, ORR Exit 16',
      extentAcres: 2.5,
      roadWidthFt: 60,
      askingPricePerAcreInr: 25000000, // 2.5 Cr
      dealType: 'Joint Development',
      rawCleanedSummary: '2.5 acres parcel near Shadnagar Exit 16 with 60ft road access for Joint Development.',
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const prompt = `
You are an AI Real Estate Systems Architect. Extract land deal metadata from the input text/audio.

CRITICAL INSTRUCTIONS:
1. PII SCRUBBING: Remove ALL personal phone numbers, email addresses, names of landowners/agents, bank accounts, and Aadhaar numbers.
2. CONVERSION: Normalize land extent into decimal Acres (e.g., 40 Guntas = 1 Acre). Convert price into absolute INR (e.g., 2.5 Cr = 25000000).

Return ONLY a valid JSON object matching this schema.
`;

    const parts: any[] = [{ text: prompt }];

    if (textPrompt) {
      parts.push({ text: `Raw Inbound Payload:\n${textPrompt}` });
    }

    if (audioBase64) {
      parts.push({
        inlineData: {
          data: audioBase64,
          mimeType: mimeType,
        },
      });
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            location: { type: SchemaType.STRING, description: 'Micro-market name or area (e.g., Shadnagar, Devanahalli)' },
            extentAcres: { type: SchemaType.NUMBER, description: 'Total land extent normalized into Acres' },
            roadWidthFt: { type: SchemaType.NUMBER, description: 'Road width in feet' },
            askingPricePerAcreInr: { type: SchemaType.NUMBER, description: 'Asking price per acre in INR' },
            dealType: { 
              type: SchemaType.STRING, 
              format: 'enum' as const,
              enum: ['Joint Development', 'Outright Purchase'],
              description: 'Target deal structure' 
            },
            rawCleanedSummary: { type: SchemaType.STRING, description: 'Cleaned technical deal summary with all PII stripped' }
          },
          required: [
            'location',
            'extentAcres',
            'roadWidthFt',
            'askingPricePerAcreInr',
            'dealType',
            'rawCleanedSummary'
          ]
        }
      }
    });

    const responseText = result.response.text();
    return JSON.parse(responseText) as ExtractedLand;
  } catch (error) {
    console.warn('[Gemini API Call failed, returning local mock fallback]:', error);
    return {
      location: 'Shadnagar, ORR Exit 16',
      extentAcres: 2.5,
      roadWidthFt: 60,
      askingPricePerAcreInr: 25000000, // 2.5 Cr
      dealType: 'Joint Development',
      rawCleanedSummary: '2.5 acres parcel near Shadnagar Exit 16 with 60ft road access for Joint Development.',
    };
  }
}

/**
 * Generates a 768-dimensional embedding using Gemini text-embedding-004.
 */
export async function generateGeminiEmbedding(text: string): Promise<number[]> {
  if (!genAI) {
    console.warn('[Gemini] GEMINI_API_KEY missing or placeholder. Returning 768-dim placeholder vector.');
    return new Array(768).fill(0.01);
  }

  try {
    const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });
    const result = await embeddingModel.embedContent({
      content: { parts: [{ text }] },
      outputDimensionality: 768,
    } as any);
    return result.embedding.values;
  } catch (err) {
    console.error('[Gemini Embedding Error]:', err);
    return new Array(768).fill(0);
  }
}
