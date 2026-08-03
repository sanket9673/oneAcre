export interface LandParcelInput {
  acres: number;
  roadWidthFt: number;
  location: string;
  dealType: string; // e.g. "Joint Development", "Outright Purchase"
  targetPrice?: number;
  rawText?: string;
}

export interface DeveloperMandate {
  id: string;
  developer_name: string;
  min_acres: number;
  max_acres: number;
  min_road_width_ft: number;
  preferred_locations: string[];
  ideal_deal_type: string;
  requirement_summary: string;
  similarity?: number;
  created_at?: string;
}

export interface AIAnalysisResult {
  extractedAcres: number;
  extractedRoadWidthFt: number;
  extractedLocation: string;
  extractedDealType: string;
  financialFeasibilityScore: number; // 0 to 100
  keyMetrics: {
    estimatedRevenueCr?: number;
    estimatedCostCr?: number;
    npvCr?: number;
    irrPercent?: number;
  };
  riskFactors: string[];
  recommendedDevelopers: DeveloperMandate[];
  suitabilityAnalysis: string;
}
