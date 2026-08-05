import { calculateArchitectFeasibility } from '../lib/planning-engine';

console.log('=== ACREGRID MULTI-STATE DETERMINISTIC PLANNING & JV FINANCIAL ENGINE TEST ===\n');

const testParcels = [
  {
    name: 'Telangana Case (Shadnagar)',
    extentValue: 2.5,
    extentUnit: 'acres' as const,
    roadWidthFt: 60,
    location: 'Shadnagar, ORR Exit 16',
    sellingPricePerSqFt: 5500,
    constructionCostPerSqFt: 2800,
    landownerSharePct: 40,
  },
  {
    name: 'Andhra Pradesh Case (AP - Vizag)',
    extentValue: 1.5,
    extentUnit: 'acres' as const,
    roadWidthFt: 45,
    location: 'AP Vizag Madhurawada',
    sellingPricePerSqFt: 6000,
    constructionCostPerSqFt: 2500,
    landownerSharePct: 40,
  },
  {
    name: 'Karnataka Case (Devanahalli Layout)',
    extentValue: 3.5, // ~16,940 sq yds
    extentUnit: 'acres' as const,
    roadWidthFt: 40,
    location: 'Devanahalli, near Airport Road',
    sellingPricePerSqFt: 5000,
    constructionCostPerSqFt: 2800,
    landownerSharePct: 40,
  },
  {
    name: 'Maharashtra Case (Hinjewadi Pune)',
    extentValue: 0.9, // ~4,356 sq yds (>= 4,000 sq yds)
    extentUnit: 'acres' as const,
    roadWidthFt: 50,
    location: 'Hinjewadi IT Park, Pune',
    sellingPricePerSqFt: 7500,
    constructionCostPerSqFt: 3000,
    landownerSharePct: 35,
  },
  {
    name: 'Tamil Nadu Case (Chennai OMR)',
    extentValue: 2.0, // ~9,680 sq yds (>= 3,000 sq yds)
    extentUnit: 'acres' as const,
    roadWidthFt: 60,
    location: 'OMR Chennai Tamil Nadu',
    sellingPricePerSqFt: 8000,
    constructionCostPerSqFt: 3200,
    landownerSharePct: 45,
  },
  {
    name: 'Delhi NCR Case (Gurgaon Sector 65)',
    extentValue: 1.2, // ~5,808 sq yds (>= 5,000 sq yds)
    extentUnit: 'acres' as const,
    roadWidthFt: 80,
    location: 'Sector 65 Gurgaon Haryana NCR',
    sellingPricePerSqFt: 12000,
    constructionCostPerSqFt: 4000,
    landownerSharePct: 30,
  },
  {
    name: 'Default / Unspecified Case',
    extentValue: 0.5,
    extentUnit: 'acres' as const,
    roadWidthFt: 25,
    location: 'General Unspecified Location',
    sellingPricePerSqFt: 5000,
    constructionCostPerSqFt: 2800,
    landownerSharePct: 40,
  }
];

for (const parcel of testParcels) {
  console.log(`========================================`);
  console.log(`TEST CASE: ${parcel.name}`);
  console.log(`========================================`);
  const report = calculateArchitectFeasibility(parcel);

  console.log('LOCATION         :', parcel.location);
  console.log('DETECTED STATE   :', report.detectedState);
  console.log('APPLICABLE RULES :', report.applicableByeLaw);
  console.log('INPUT            :', `${parcel.extentValue} ${parcel.extentUnit} on ${parcel.roadWidthFt}ft Road`);
  
  console.log('\n--- STATUTORY PLANNING & FSI ---');
  console.log(`Gross Plot Area        : ${report.planning.grossPlotAreaSqYards.toLocaleString()} Sq. Yds (${report.planning.grossPlotAreaSqFt.toLocaleString()} Sq. Ft.)`);
  console.log(`Open Space Surrender % : ${(report.planning.openSpaceSurrenderPct * 100).toFixed(0)}%`);
  console.log(`Surrendered Area       : ${report.planning.surrenderedAreaSqYards.toLocaleString()} Sq. Yds`);
  console.log(`Net Plot Area          : ${report.planning.netPlotAreaSqYards.toLocaleString()} Sq. Yds (${report.planning.netPlotAreaSqFt.toLocaleString()} Sq. Ft.)`);
  console.log(`Applicable FSI         : ${report.planning.applicableFsi}x`);
  console.log(`Permissible Built-Up   : ${report.planning.permissibleBuaSqFt.toLocaleString()} Sq. Ft.`);

  console.log('\n--- FINANCIAL FEASIBILITY ---');
  console.log(`GDV                    : ₹${(report.financials.gdv / 10000000).toFixed(2)} Cr`);
  console.log(`Construction Cost      : ₹${(report.financials.totalConstructionCost / 10000000).toFixed(2)} Cr`);
  console.log(`Landowner Revenue Share: ₹${(report.financials.landownerRevenueShare / 10000000).toFixed(2)} Cr`);
  console.log(`Developer Net Profit   : ₹${(report.financials.developerNetProfit / 10000000).toFixed(2)} Cr`);
  console.log(`Developer Net Margin % : ${report.financials.developerNetMarginPct.toFixed(2)}%`);
  console.log(`Feasibility Score      : ${report.feasibilityScore}/100 (${report.viabilityRating})`);
  console.log(`Summary Narrative      : ${report.summary}\n`);
}
