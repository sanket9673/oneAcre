import { z } from 'zod';
import { FeasibilityReport } from './planning';

export const InboundPayloadSchema = z.object({
  textPrompt: z.string().optional(),
  audioBase64: z.string().optional(),
  mimeType: z.string().optional().default('audio/mp3'),
});

export type InboundPayload = z.infer<typeof InboundPayloadSchema>;

export const ExtractedLandSchema = z.object({
  location: z.string().describe('Micro-market name or area (e.g., Shadnagar, Devanahalli)'),
  extentAcres: z.number().describe('Total land extent normalized into Acres'),
  roadWidthFt: z.number().describe('Road width in feet'),
  askingPricePerAcreInr: z.number().describe('Asking price per acre in INR'),
  dealType: z.enum(['Joint Development', 'Outright Purchase']).describe('Target deal structure'),
  rawCleanedSummary: z.string().describe('Cleaned technical deal summary with all PII stripped'),
});

export type ExtractedLand = z.infer<typeof ExtractedLandSchema>;

export interface DeveloperMatch {
  id: string;
  developer_name: string;
  min_acres: number;
  max_acres: number;
  min_road_width_ft: number;
  preferred_locations: string[];
  ideal_deal_type: string;
  requirement_summary: string;
  similarity: number;
}

export interface IngestResponse {
  success: boolean;
  piiScrubbed: boolean;
  extractedData: ExtractedLand;
  feasibilityReport: FeasibilityReport;
  matchedDevelopers: DeveloperMatch[];
  error?: string;
}
