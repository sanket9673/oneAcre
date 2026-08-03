import { calculateArchitectFeasibility } from '../lib/planning-engine';

console.log('=== 1ACRE DETERMINISTIC PLANNING & JV FINANCIAL ENGINE TEST ===\n');

// Test Case: 2.5 Acres land parcel in Shadnagar on 60ft main road
const testParcel = {
  extentValue: 2.5,
  extentUnit: 'acres' as const,
  roadWidthFt: 60,
  location: 'Shadnagar, ORR Exit 16',
  sellingPricePerSqFt: 5500,
  constructionCostPerSqFt: 2800,
  landownerSharePct: 40,
};

const report = calculateArchitectFeasibility(testParcel);

console.log('LOCATION:', testParcel.location);
console.log('INPUT:', `${testParcel.extentValue} ${testParcel.extentUnit} on ${testParcel.roadWidthFt}ft Road`);
console.log('\n--- NORMALIZED LAND UNITS ---');
console.table(report.normalizedUnits);

console.log('\n--- STATUTORY PLANNING & FSI ---');
console.log(`Gross Plot Area        : ${report.planning.grossPlotAreaSqYards.toLocaleString()} Sq. Yds`);
console.log(`Statutory Surrender (15%): ${report.planning.surrenderedAreaSqYards.toLocaleString()} Sq. Yds`);
console.log(`Net Plot Area          : ${report.planning.netPlotAreaSqYards.toLocaleString()} Sq. Yds (${report.planning.netPlotAreaSqFt.toLocaleString()} Sq. Ft.)`);
console.log(`Applicable FSI         : ${report.planning.applicableFsi}x`);
console.log(`Permissible Built-Up Area: ${report.planning.permissibleBuaSqFt.toLocaleString()} Sq. Ft.`);

console.log('\n--- JV FINANCIAL MATRIX ---');
console.log(`Gross Development Value (GDV): ₹${(report.financials.gdv / 10000000).toFixed(2)} Cr`);
console.log(`Total Construction Budget    : ₹${(report.financials.totalConstructionCost / 10000000).toFixed(2)} Cr`);
console.log(`Landowner Revenue (40%)      : ₹${(report.financials.landownerRevenueShare / 10000000).toFixed(2)} Cr`);
console.log(`Developer Gross Share (60%)  : ₹${(report.financials.developerRevenueShare / 10000000).toFixed(2)} Cr`);
console.log(`Developer Net Profit         : ₹${(report.financials.developerNetProfit / 10000000).toFixed(2)} Cr`);
console.log(`Developer Net Margin %       : ${report.financials.developerNetMarginPct}%`);

console.log('\n--- FEASIBILITY SCORE & SUMMARY ---');
console.log(`Feasibility Score : ${report.feasibilityScore}/100`);
console.log(`Viability Rating  : ${report.viabilityRating}`);
console.log(`Summary           : ${report.summary}`);
