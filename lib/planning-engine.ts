import {
  LandUnitType,
  ExtractedLandInput,
  NormalizedLandUnits,
  StatutoryPlanningResult,
  JvMatrixResult,
  FeasibilityReport
} from '@/types/planning';

/**
 * 1. Converts any Indian regional land metric to standard units.
 * Conversions:
 * 1 Acre = 40 Guntas = 4,840 Sq. Yards = 43,560 Sq. Ft.
 * 1 Gunta = 121 Sq. Yards = 1,089 Sq. Ft.
 * 1 Cent = 48.4 Sq. Yards = 435.6 Sq. Ft.
 * 1 Ankanam = 8 Sq. Yards = 72 Sq. Ft.
 */
export function normalizeLandUnits(value: number, unit: LandUnitType): NormalizedLandUnits {
  let totalSqYards = 0;

  switch (unit) {
    case 'acres':
      totalSqYards = value * 4840;
      break;
    case 'guntas':
      totalSqYards = value * 121;
      break;
    case 'cents':
      totalSqYards = value * 48.4;
      break;
    case 'ankanams':
      totalSqYards = value * 8;
      break;
    case 'sq_ft':
      totalSqYards = value / 9;
      break;
    case 'sq_yards':
    default:
      totalSqYards = value;
      break;
  }

  const sqFt = totalSqYards * 9;
  const acres = totalSqYards / 4840;
  const guntas = totalSqYards / 121;
  const cents = totalSqYards / 48.4;
  const ankanams = totalSqYards / 8;

  return {
    acres: Number(acres.toFixed(4)),
    guntas: Number(guntas.toFixed(2)),
    sqYards: Number(totalSqYards.toFixed(2)),
    sqFt: Number(sqFt.toFixed(2)),
    cents: Number(cents.toFixed(2)),
    ankanams: Number(ankanams.toFixed(2)),
  };
}

/**
 * 2. Calculates Statutory Planning Deductions and FSI.
 * Rules:
 * - If Gross Plot Area >= 4,000 Sq. Yds (~0.826 Acres), deduct 15% for mandatory open space/roads.
 * - Road Width Tiering:
 *   < 30 ft: FSI = 1.50
 *   30 - 39 ft: FSI = 2.00
 *   40 - 59 ft: FSI = 2.50
 *   >= 60 ft: FSI = 3.50
 */
export function calculateStatutoryPlanning(
  grossSqYards: number,
  roadWidthFt: number
): StatutoryPlanningResult {
  const openSpaceSurrenderPct = grossSqYards >= 4000 ? 0.15 : 0.0;
  const surrenderedAreaSqYards = grossSqYards * openSpaceSurrenderPct;
  const netPlotAreaSqYards = grossSqYards - surrenderedAreaSqYards;
  const netPlotAreaSqFt = netPlotAreaSqYards * 9;

  let applicableFsi = 1.5;
  if (roadWidthFt >= 60) {
    applicableFsi = 3.5;
  } else if (roadWidthFt >= 40) {
    applicableFsi = 2.5;
  } else if (roadWidthFt >= 30) {
    applicableFsi = 2.0;
  } else {
    applicableFsi = 1.5;
  }

  const permissibleBuaSqFt = netPlotAreaSqFt * applicableFsi;

  return {
    grossPlotAreaSqYards: Number(grossSqYards.toFixed(2)),
    grossPlotAreaSqFt: Number((grossSqYards * 9).toFixed(2)),
    openSpaceSurrenderPct,
    surrenderedAreaSqYards: Number(surrenderedAreaSqYards.toFixed(2)),
    netPlotAreaSqYards: Number(netPlotAreaSqYards.toFixed(2)),
    netPlotAreaSqFt: Number(netPlotAreaSqFt.toFixed(2)),
    applicableFsi,
    permissibleBuaSqFt: Number(permissibleBuaSqFt.toFixed(2)),
  };
}

/**
 * 3. Computes Joint Development (JV) Yield Matrix.
 */
export function calculateJvMatrix(
  permissibleBuaSqFt: number,
  sellingPricePerSqFt: number = 5000,
  constructionCostPerSqFt: number = 2800,
  landownerSharePct: number = 40
): JvMatrixResult {
  const devSharePct = 100 - landownerSharePct;
  const gdv = permissibleBuaSqFt * sellingPricePerSqFt;
  const totalConstructionCost = permissibleBuaSqFt * constructionCostPerSqFt;

  const landownerRevenueShare = gdv * (landownerSharePct / 100);
  const developerRevenueShare = gdv * (devSharePct / 100);
  const developerNetProfit = developerRevenueShare - totalConstructionCost;
  const developerNetMarginPct = (developerNetProfit / developerRevenueShare) * 100;

  return {
    sellingPricePerSqFt,
    constructionCostPerSqFt,
    landownerSharePct,
    developerSharePct: devSharePct,
    gdv: Number(gdv.toFixed(2)),
    totalConstructionCost: Number(totalConstructionCost.toFixed(2)),
    landownerRevenueShare: Number(landownerRevenueShare.toFixed(2)),
    developerRevenueShare: Number(developerRevenueShare.toFixed(2)),
    developerNetProfit: Number(developerNetProfit.toFixed(2)),
    developerNetMarginPct: Number(developerNetMarginPct.toFixed(2)),
  };
}

/**
 * 4. Master Orchestrator: Feasibility Engine
 */
export function calculateArchitectFeasibility(input: ExtractedLandInput): FeasibilityReport {
  const normalizedUnits = normalizeLandUnits(input.extentValue, input.extentUnit);
  const planning = calculateStatutoryPlanning(normalizedUnits.sqYards, input.roadWidthFt);
  
  const financials = calculateJvMatrix(
    planning.permissibleBuaSqFt,
    input.sellingPricePerSqFt ?? 5000,
    input.constructionCostPerSqFt ?? 2800,
    input.landownerSharePct ?? 40
  );

  // Scoring weights: 60% Dev Net Margin, 40% FSI Density Score
  let marginScore = 0;
  if (financials.developerNetMarginPct >= 30) marginScore = 100;
  else if (financials.developerNetMarginPct >= 20) marginScore = 80 + (financials.developerNetMarginPct - 20) * 2;
  else if (financials.developerNetMarginPct >= 10) marginScore = 50 + (financials.developerNetMarginPct - 10) * 3;
  else marginScore = Math.max(0, financials.developerNetMarginPct * 5);

  const fsiScore = (planning.applicableFsi / 3.5) * 100;
  const feasibilityScore = Math.round(marginScore * 0.6 + fsiScore * 0.4);

  let viabilityRating: FeasibilityReport['viabilityRating'] = 'MARGINAL';
  if (feasibilityScore >= 80) viabilityRating = 'EXCELLENT';
  else if (feasibilityScore >= 65) viabilityRating = 'VIABLE';
  else if (feasibilityScore >= 45) viabilityRating = 'MARGINAL';
  else viabilityRating = 'UNFEASIBLE';

  const summary = `Parcel of ${normalizedUnits.acres} Acres (${normalizedUnits.sqYards} Sq Yds) on a ${input.roadWidthFt}ft road. Net BUA: ${planning.permissibleBuaSqFt.toLocaleString()} sqft (FSI: ${planning.applicableFsi}x). GDV: ₹${(financials.gdv / 10000000).toFixed(2)} Cr. Developer Net Profit: ₹${(financials.developerNetProfit / 10000000).toFixed(2)} Cr (${financials.developerNetMarginPct}% Net Margin). Viability: ${viabilityRating}.`;

  return {
    input,
    normalizedUnits,
    planning,
    financials,
    feasibilityScore,
    viabilityRating,
    summary,
  };
}
