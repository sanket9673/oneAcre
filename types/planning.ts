export type LandUnitType = 'acres' | 'guntas' | 'sq_yards' | 'sq_ft' | 'cents' | 'ankanams';

export interface ExtractedLandInput {
  extentValue: number;
  extentUnit: LandUnitType;
  roadWidthFt: number;
  location?: string;
  dealType?: 'Joint Development' | 'Outright Purchase' | 'Revenue Share';
  sellingPricePerSqFt?: number;      // Default: 5000
  constructionCostPerSqFt?: number;  // Default: 2800
  landownerSharePct?: number;        // Default: 40 (i.e., 40% Owner / 60% Developer)
  state?: string;
}

export interface NormalizedLandUnits {
  acres: number;
  guntas: number;
  sqYards: number;
  sqFt: number;
  cents: number;
  ankanams: number;
}

export interface StatutoryPlanningResult {
  grossPlotAreaSqYards: number;
  grossPlotAreaSqFt: number;
  openSpaceSurrenderPct: number; // 0.15 (15%) or 0
  surrenderedAreaSqYards: number;
  netPlotAreaSqYards: number;
  netPlotAreaSqFt: number;
  applicableFsi: number;
  permissibleBuaSqFt: number;
}

export interface JvMatrixResult {
  sellingPricePerSqFt: number;
  constructionCostPerSqFt: number;
  landownerSharePct: number;
  developerSharePct: number;
  gdv: number; // Gross Development Value in INR
  totalConstructionCost: number; // in INR
  landownerRevenueShare: number; // in INR
  developerRevenueShare: number; // in INR
  developerNetProfit: number; // in INR
  developerNetMarginPct: number; // %
}

export interface FeasibilityReport {
  input: ExtractedLandInput;
  normalizedUnits: NormalizedLandUnits;
  planning: StatutoryPlanningResult;
  financials: JvMatrixResult;
  feasibilityScore: number; // 0 - 100
  viabilityRating: 'EXCELLENT' | 'VIABLE' | 'MARGINAL' | 'UNFEASIBLE';
  summary: string;
  detectedState: string;
  applicableByeLaw: string;
}
