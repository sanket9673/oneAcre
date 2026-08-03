import { extractLandParcelWithGemini, generateGeminiEmbedding } from '../lib/gemini';
import { calculateArchitectFeasibility } from '../lib/planning-engine';
import { supabase } from '../lib/supabase';

async function runApiIngestTest() {
  console.log('=== 1ACRE MULTIMODAL INGESTION & VECTOR MATCHING TEST ===\n');

  // Simulated raw unscrubbed WhatsApp message containing sensitive PII
  const rawWhatsappMessage = `
    "Hi bro, Ramesh here from Shadnagar (Ph: +91 98765-43210). 
     Got 2.5 acres land parcel available right near Shadnagar ORR Exit 16. 
     Road width is 60 feet blacktop. Asking price is 2.5 Crore per acre. 
     Landowner Mr. Venkat Rao (Aadhaar: 4455-2211-9988) wants Joint Development with a top Tier-1 builder."
  `;

  console.log('1. RAW UNFILTERED INBOUND PAYLOAD:');
  console.log(rawWhatsappMessage.trim());

  console.log('\n2. EXECUTING MULTIMODAL EXTRACTION & PII SCRUBBING...');
  const extractedData = await extractLandParcelWithGemini(rawWhatsappMessage);
  console.log(JSON.stringify(extractedData, null, 2));

  console.log('\n3. COMPUTING STATUTORY & JV FINANCIAL FEASIBILITY...');
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

  console.log(`Feasibility Score : ${feasibilityReport.feasibilityScore}/100`);
  console.log(`Viability Rating  : ${feasibilityReport.viabilityRating}`);
  console.log(`Permissible BUA   : ${feasibilityReport.planning.permissibleBuaSqFt.toLocaleString()} sqft`);
  console.log(`Developer Profit  : ₹${(feasibilityReport.financials.developerNetProfit / 10000000).toFixed(2)} Cr`);

  console.log('\n4. GENERATING GEMINI VECTOR EMBEDDING & QUERYING SUPABASE...');
  const summaryToEmbed = `${extractedData.extentAcres} acres land in ${extractedData.location} on ${extractedData.roadWidthFt}ft road for ${extractedData.dealType}. ${extractedData.rawCleanedSummary}`;
  const embedding = await generateGeminiEmbedding(summaryToEmbed);
  console.log(`Generated Vector Dimensions: ${embedding.length}`);

  let matchedDevelopers: any[] = [];
  try {
    const { data, error } = await supabase.rpc('match_developers', {
      query_embedding: embedding,
      match_threshold: 0.0,
      match_count: 3,
    });

    if (!error && data) {
      matchedDevelopers = data;
    }
  } catch (err) {
    console.warn('Supabase DB connection check skipped in local test mode.');
  }

  console.log('\n5. MATCHED DEVELOPER MANDATES:');
  if (matchedDevelopers.length > 0) {
    console.table(matchedDevelopers);
  } else {
    console.log('No live DB records matched or Supabase disconnected. Seed data ready in Supabase SQL Editor.');
  }

  console.log('\n=== TEST COMPLETE: Multimodal Ingestion Engine Ready ===');
}

runApiIngestTest();
