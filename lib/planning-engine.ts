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
 * 2. State & Bye-Law Detection Logic.
 */
export function detectStateAndRules(
  location?: string,
  state?: string
): { detectedState: string; applicableByeLaw: string } {
  const normLocation = (location || '').toLowerCase();
  const normState = (state || '').toLowerCase();

  // 1. Check state parameter if explicitly passed/extracted
  if (normState) {
    if (normState.includes('telangana')) {
      return { detectedState: 'Telangana', applicableByeLaw: 'Telangana GO 168 Rules' };
    }
    if (normState.includes('andhra') || normState === 'ap') {
      return { detectedState: 'Andhra Pradesh', applicableByeLaw: 'Telangana GO 168 Rules' };
    }
    if (normState.includes('karnataka') || normState.includes('bangalore') || normState.includes('bengaluru')) {
      return { detectedState: 'Karnataka', applicableByeLaw: 'Karnataka BMRDA Bye-Laws' };
    }
    if (normState.includes('maharashtra') || normState.includes('mumbai') || normState.includes('pune')) {
      return { detectedState: 'Maharashtra', applicableByeLaw: 'Unified DCPR Norms' };
    }
    if (normState.includes('tamil') || normState.includes('chennai') || normState === 'tn') {
      return { detectedState: 'Tamil Nadu', applicableByeLaw: 'Tamil Nadu TNDCPR Norms' };
    }
    if (normState.includes('delhi') || normState.includes('ncr') || normState.includes('gurgaon') || normState.includes('noida')) {
      return { detectedState: 'Delhi NCR', applicableByeLaw: 'Delhi UBBL Bye-Laws' };
    }
  }

  // 2. Check location string keywords
  if (normLocation) {
    if (normLocation.includes('ap') || normLocation.includes('andhra')) {
      return { detectedState: 'Andhra Pradesh', applicableByeLaw: 'Telangana GO 168 Rules' };
    }
    const telanganaKeywords = ['shadnagar', 'kothur', 'shamshabad', 'muthangi', 'tellapur', 'kokapet', 'hyderabad', 'telangana'];
    if (telanganaKeywords.some(keyword => normLocation.includes(keyword))) {
      return { detectedState: 'Telangana', applicableByeLaw: 'Telangana GO 168 Rules' };
    }
    const karnatakaKeywords = ['devanahalli', 'whitefield', 'sarjapur', 'yelahanka', 'bangalore', 'bengaluru', 'karnataka'];
    if (karnatakaKeywords.some(keyword => normLocation.includes(keyword))) {
      return { detectedState: 'Karnataka', applicableByeLaw: 'Karnataka BMRDA Bye-Laws' };
    }
    const maharashtraKeywords = ['panvel', 'hinjewadi', 'pune', 'mumbai', 'maharashtra'];
    if (maharashtraKeywords.some(keyword => normLocation.includes(keyword))) {
      return { detectedState: 'Maharashtra', applicableByeLaw: 'Unified DCPR Norms' };
    }
    const tamilNaduKeywords = ['chennai', 'coimbatore', 'madurai', 'tamil nadu', 'tamilnadu', 'tn'];
    if (tamilNaduKeywords.some(keyword => normLocation.includes(keyword))) {
      return { detectedState: 'Tamil Nadu', applicableByeLaw: 'Tamil Nadu TNDCPR Norms' };
    }
    const delhiNcrKeywords = ['delhi', 'ncr', 'noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad'];
    if (delhiNcrKeywords.some(keyword => normLocation.includes(keyword))) {
      return { detectedState: 'Delhi NCR', applicableByeLaw: 'Delhi UBBL Bye-Laws' };
    }
  }

  // 3. Fallback default
  return { detectedState: 'Telangana (Default)', applicableByeLaw: 'Telangana GO 168 Rules' };
}

/**
 * 3. Calculates Statutory Planning Deductions and FSI.
 * Rules are state-aware and fall back to Telangana GO 168 if unspecified.
 */
export function calculateStatutoryPlanning(
  grossSqYards: number,
  roadWidthFt: number,
  detectedState: string
): StatutoryPlanningResult {
  let openSpaceSurrenderPct = 0.0;
  let applicableFsi = 1.5;

  const normalizedState = detectedState.toLowerCase();

  if (normalizedState.includes('karnataka')) {
    openSpaceSurrenderPct = grossSqYards >= 3000 ? 0.10 : 0.0;
    if (roadWidthFt >= 60) {
      applicableFsi = 3.25;
    } else if (roadWidthFt >= 40) {
      applicableFsi = 2.25;
    } else if (roadWidthFt >= 30) {
      applicableFsi = 1.75;
    } else {
      applicableFsi = 1.25;
    }
  } else if (normalizedState.includes('maharashtra')) {
    openSpaceSurrenderPct = grossSqYards >= 4000 ? 0.10 : 0.0;
    if (roadWidthFt >= 60) {
      applicableFsi = 3.00;
    } else if (roadWidthFt >= 40) {
      applicableFsi = 2.00;
    } else if (roadWidthFt >= 30) {
      applicableFsi = 1.50;
    } else {
      applicableFsi = 1.00;
    }
  } else if (normalizedState.includes('tamil nadu')) {
    openSpaceSurrenderPct = grossSqYards >= 3000 ? 0.10 : 0.0;
    if (roadWidthFt >= 60) {
      applicableFsi = 3.25;
    } else if (roadWidthFt >= 40) {
      applicableFsi = 2.00;
    } else if (roadWidthFt >= 30) {
      applicableFsi = 1.75;
    } else {
      applicableFsi = 1.50;
    }
  } else if (normalizedState.includes('delhi')) {
    openSpaceSurrenderPct = grossSqYards >= 5000 ? 0.20 : 0.0;
    if (roadWidthFt >= 60) {
      applicableFsi = 3.50;
    } else if (roadWidthFt >= 40) {
      applicableFsi = 2.25;
    } else if (roadWidthFt >= 30) {
      applicableFsi = 1.50;
    } else {
      applicableFsi = 1.20;
    }
  } else {
    // Telangana, Andhra Pradesh, and Default fallback (GO 168)
    openSpaceSurrenderPct = grossSqYards >= 4000 ? 0.15 : 0.0;
    if (roadWidthFt >= 60) {
      applicableFsi = 3.5;
    } else if (roadWidthFt >= 40) {
      applicableFsi = 2.5;
    } else if (roadWidthFt >= 30) {
      applicableFsi = 2.0;
    } else {
      applicableFsi = 1.5;
    }
  }

  const surrenderedAreaSqYards = grossSqYards * openSpaceSurrenderPct;
  const netPlotAreaSqYards = grossSqYards - surrenderedAreaSqYards;
  const netPlotAreaSqFt = netPlotAreaSqYards * 9;
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
 * 4. Computes Joint Development (JV) Yield Matrix.
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
 * 5. Master Orchestrator: Feasibility Engine
 */
export function calculateArchitectFeasibility(input: ExtractedLandInput): FeasibilityReport {
  const { detectedState, applicableByeLaw } = detectStateAndRules(input.location, input.state);
  const normalizedUnits = normalizeLandUnits(input.extentValue, input.extentUnit);
  const planning = calculateStatutoryPlanning(normalizedUnits.sqYards, input.roadWidthFt, detectedState);
  
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

  const summary = `Parcel of ${normalizedUnits.acres} Acres (${normalizedUnits.sqYards} Sq Yds) on a ${input.roadWidthFt}ft road in ${detectedState} under ${applicableByeLaw}. Net BUA: ${planning.permissibleBuaSqFt.toLocaleString()} sqft (FSI: ${planning.applicableFsi}x). GDV: ₹${(financials.gdv / 10000000).toFixed(2)} Cr. Developer Net Profit: ₹${(financials.developerNetProfit / 10000000).toFixed(2)} Cr (${financials.developerNetMarginPct}% Net Margin). Viability: ${viabilityRating}.`;

  return {
    input,
    normalizedUnits,
    planning,
    financials,
    feasibilityScore,
    viabilityRating,
    summary,
    detectedState,
    applicableByeLaw,
  };
}
