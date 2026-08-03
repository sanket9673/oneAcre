import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { ExtractedLand } from '@/types/api';

const apiKey = process.env.GEMINI_API_KEY || '';
const isPlaceholder = !apiKey || apiKey.includes('your_google_gemini_api_key');
export const genAI = !isPlaceholder ? new GoogleGenerativeAI(apiKey) : null;

// Multi-model fallbacks for generation and embedding
const STABLE_MODELS = ['gemini-1.5-flash-latest', 'gemini-1.5-flash-8b', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-1.5-flash'];
const EMBEDDING_MODELS = ['text-embedding-004', 'embedding-001', 'gemini-embedding-2'];

/**
 * Normalizes a vector's dimension by slicing/truncating or padding to meet the target dimension (default 768).
 */
export function normalizeVectorDimension(vec: number[], targetDim = 768): number[] {
  if (!Array.isArray(vec) || vec.length === 0) {
    return new Array(targetDim).fill(0.01);
  }
  if (vec.length > targetDim) {
    return vec.slice(0, targetDim); // Truncate 3072 down to 768
  }
  const result = [...vec];
  while (result.length < targetDim) {
    result.push(0.01); // Pad up to 768
  }
  return result;
}

/**
 * Generates a 768-dimensional embedding vector for a given text using text-embedding-004 with fallbacks.
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  if (!genAI) {
    console.warn('GEMINI_API_KEY is not configured or placeholder. Returning zero vector.');
    return normalizeVectorDimension([]);
  }

  for (const modelName of EMBEDDING_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.embedContent({
        content: { parts: [{ text }] },
        ...(modelName === 'text-embedding-004' ? { outputDimensionality: 768 } : {}),
      } as any);
      if (result.embedding?.values) {
        return normalizeVectorDimension(result.embedding.values);
      }
    } catch (error) {
      // Quiet warning for intermediate failures
    }
  }

  console.warn('[Gemini Embedding] All embedding models failed in generateEmbedding.');
  return normalizeVectorDimension([]);
};

/**
 * Analyzes land parcel details and extracts structured metadata and feasibility scores using STABLE_MODELS.
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

  let lastError = null;
  for (const modelName of STABLE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
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
      lastError = error;
    }
  }

  console.warn('[Gemini analyzeLandDocument] All models failed in analyzeLandDocument.');
  throw lastError || new Error('All generative models failed during land document analysis.');
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
    console.warn('[Gemini] GEMINI_API_KEY missing or placeholder. Returning structured mock.');
    return {
      location: 'Shadnagar, ORR Exit 16',
      extentAcres: 2.5,
      roadWidthFt: 60,
      askingPricePerAcreInr: 25000000,
      dealType: 'Joint Development',
      rawCleanedSummary: '2.5 acres parcel near Shadnagar Exit 16 with 60ft road access for Joint Development.',
    };
  }

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

  for (const modelName of STABLE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
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
      // quiet loop
    }
  }

  console.warn('[Gemini] All models failed, returning local mock fallback.');
  return {
    location: 'Shadnagar, ORR Exit 16',
    extentAcres: 2.5,
    roadWidthFt: 60,
    askingPricePerAcreInr: 25000000,
    dealType: 'Joint Development',
    rawCleanedSummary: '2.5 acres parcel near Shadnagar Exit 16 with 60ft road access for Joint Development.',
  };
}

/**
 * Generates a 768-dimensional embedding using Gemini text-embedding-004.
 */
export async function generateGeminiEmbedding(text: string): Promise<number[]> {
  if (!genAI) {
    console.warn('[Gemini] GEMINI_API_KEY missing or placeholder. Returning 768-dim placeholder vector.');
    return normalizeVectorDimension(new Array(768).fill(0.01));
  }

  for (const modelName of EMBEDDING_MODELS) {
    try {
      const embeddingModel = genAI.getGenerativeModel({ model: modelName });
      const result = await embeddingModel.embedContent({
        content: { parts: [{ text }] },
        ...(modelName === 'text-embedding-004' ? { outputDimensionality: 768 } : {}),
      } as any);
      if (result.embedding?.values) {
        return normalizeVectorDimension(result.embedding.values);
      }
    } catch (err) {
      // quiet loop
    }
  }

  console.warn('[Gemini Embedding] All embedding models failed in generateGeminiEmbedding.');
  return normalizeVectorDimension(new Array(768).fill(0.01));
}
