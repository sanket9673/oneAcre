import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Custom environment loader to prevent external dotenv dependency issues
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const parts = trimmed.split('=');
        const key = parts[0]?.trim();
        const value = parts.slice(1).join('=').trim();
        if (key && value) {
          process.env[key] = value;
        }
      }
    });
  }
}
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const apiKey = process.env.GEMINI_API_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('ERROR: Supabase URL or Key missing. Check .env file.');
  process.exit(1);
}

if (!apiKey) {
  console.error('ERROR: GEMINI_API_KEY missing. Check .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const genAI = new GoogleGenerativeAI(apiKey);

// Raw list of 50 developers with micro-market categories
const developerSpecs = [
  // HYDERABAD DEVELOPERS
  {
    name: 'Aparna Constructions',
    minAcres: 8.0,
    maxAcres: 35.0,
    minRoadWidth: 50.0,
    locations: ['Tellapur', 'Kollur', 'Mokila', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Aparna Constructions is looking for prime JDA land parcels between 8 to 35 acres in Tellapur, Kollur, or Mokila corridors. Proximity to ORR Exits is highly preferred. Target project is high-density premium apartments or gated community villa layout. Required minimum approach road of 50 feet.'
  },
  {
    name: 'MyHome Constructions',
    minAcres: 12.0,
    maxAcres: 80.0,
    minRoadWidth: 80.0,
    locations: ['Kokapet', 'Neopolis', 'Gachibowli', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'MyHome Constructions high-rise residential expansion mandate. Seeking large land parcels (12-80 acres) in Kokapet, Neopolis, or Gachibowli zones. Ideal for premium luxury high-rise developments under 40/60 JDA shares. Approach road width must be 80 feet or more.'
  },
  {
    name: 'Rajapushpa Properties',
    minAcres: 10.0,
    maxAcres: 40.0,
    minRoadWidth: 60.0,
    locations: ['Tellapur', 'Mokila', 'Shamshabad', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Rajapushpa Properties is acquiring land for luxury gated community villas and premium mid-rise apartments. Target zones include Tellapur, Mokila, and Shamshabad. Seeking 10 to 40 acres with 60ft approach access on JDA structure.'
  },
  {
    name: 'Lansum Properties',
    minAcres: 5.0,
    maxAcres: 20.0,
    minRoadWidth: 60.0,
    locations: ['Kokapet', 'Tellapur', 'Gachibowli', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Lansum Properties premium high-rise apartment mandate. Seeking 5 to 20 acres clear-title parcels in West Hyderabad corridors (Kokapet, Tellapur, Gachibowli). Open to Joint Development.'
  },
  {
    name: 'Vasavi Builders',
    minAcres: 15.0,
    maxAcres: 90.0,
    minRoadWidth: 60.0,
    locations: ['Shamshabad', 'Shadnagar', 'Kothur', 'Hyderabad'],
    dealType: 'Outright Purchase',
    summary: 'Vasavi Builders is looking for large land parcels of 15 to 90 acres for integrated plotting layouts and commercial hubs. Prefers outright acquisition in South Hyderabad zones near Shamshabad, Shadnagar, or Kothur along the ORR access corridors.'
  },
  {
    name: 'SMR Vinay',
    minAcres: 5.0,
    maxAcres: 22.0,
    minRoadWidth: 40.0,
    locations: ['Bachupally', 'Miyapur', 'Kompally', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'SMR Vinay residential gated community expansion. Targeting Miyapur, Bachupally, and Kompally. Seeking 5 to 22 acres for mid-income luxury apartments with 40ft approach road.'
  },
  {
    name: 'Candeur Developers',
    minAcres: 4.0,
    maxAcres: 15.0,
    minRoadWidth: 50.0,
    locations: ['Miyapur', 'Tellapur', 'Kollur', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Candeur Developers mandate for ultra-modern residential towers. Target regions: Miyapur, Tellapur, and Kollur. Extent required: 4 to 15 acres, minimum road width 50 feet.'
  },
  {
    name: 'Hallmark Builders',
    minAcres: 3.0,
    maxAcres: 12.0,
    minRoadWidth: 40.0,
    locations: ['Mokila', 'Tellapur', 'Patancheru', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Hallmark Builders is seeking land for boutique residential projects and independent row house layouts. Target areas: Mokila and Tellapur. Requires 3 to 12 acres with 40ft road approach.'
  },
  {
    name: 'Ramky Estates',
    minAcres: 8.0,
    maxAcres: 50.0,
    minRoadWidth: 60.0,
    locations: ['Patancheru', 'Muthangi', 'Kollur', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Ramky Estates township and gated community expansion. Seeking 8 to 50 acres in Patancheru, Muthangi, or Kollur corridors. Open to space share Joint Development.'
  },
  {
    name: 'Modi Builders',
    minAcres: 10.0,
    maxAcres: 45.0,
    minRoadWidth: 40.0,
    locations: ['Kompally', 'Bachupally', 'Medchal', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Modi Builders affordable luxury apartments and plotting layout requirement. Focus zones are Kompally, Bachupally, and Medchal. Seeking 10 to 45 acres on JV share.'
  },
  {
    name: 'Poulomi Estates',
    minAcres: 4.0,
    maxAcres: 18.0,
    minRoadWidth: 60.0,
    locations: ['Kokapet', 'Tellapur', 'Neopolis', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Poulomi Estates premium high-end residential towers mandate. Seeking 4 to 18 acres prime land in Kokapet or Tellapur with 60ft access.'
  },
  {
    name: 'Cybercity Builders',
    minAcres: 6.0,
    maxAcres: 30.0,
    minRoadWidth: 50.0,
    locations: ['Tellapur', 'Patancheru', 'Miyapur', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Cybercity Builders gating apartment mandate. Target extent: 6 to 30 acres in Miyapur, Tellapur, or Patancheru zones. 50ft road access required.'
  },
  {
    name: 'GHR Infra',
    minAcres: 5.0,
    maxAcres: 25.0,
    minRoadWidth: 40.0,
    locations: ['Tellapur', 'Mokila', 'Kollur', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'GHR Infra smart gated community expansion. Seeking 5 to 25 acres near Kollur or Mokila. Prefers sustainable JV design proposals.'
  },
  {
    name: 'Urban Heights',
    minAcres: 3.5,
    maxAcres: 15.0,
    minRoadWidth: 40.0,
    locations: ['Muthangi', 'Patancheru', 'Medchal', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Urban Heights Realty gated apartment communities expansion. Focus areas include Muthangi and Patancheru corridors. Seeking 3.5 to 15 acres with 40ft road.'
  },
  {
    name: 'Anvita Group',
    minAcres: 5.0,
    maxAcres: 20.0,
    minRoadWidth: 60.0,
    locations: ['Kollur', 'Tellapur', 'Gachibowli', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Anvita Group luxury high-density towers mandate. Seeking 5 to 20 acres in Kollur/Tellapur corridors. JDA structure with high FSI road access.'
  },
  {
    name: 'Srishti Infra',
    minAcres: 4.5,
    maxAcres: 22.0,
    minRoadWidth: 40.0,
    locations: ['Kompally', 'Bachupally', 'Tellapur', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Srishti Infra residential housing expansion. Targets Kompally and Bachupally belts. Seeking 4.5 to 22 acres on Joint Development.'
  },
  {
    name: 'Praneeth Pranav',
    minAcres: 10.0,
    maxAcres: 60.0,
    minRoadWidth: 50.0,
    locations: ['Patancheru', 'Mokila', 'Medchal', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Praneeth Pranav Group mega gated community and plotted layout mandate. Seeking 10 to 60 acres in Patancheru, Mokila, or Medchal. Required road width 50ft.'
  },
  {
    name: 'Honer Homes',
    minAcres: 8.0,
    maxAcres: 40.0,
    minRoadWidth: 60.0,
    locations: ['Gopinapally', 'Tellapur', 'Kollur', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Honer Homes mega high-rise residential apartment project. Targeting Gopinapally, Tellapur, or Kollur. Extent: 8 to 40 acres with 60ft road approach.'
  },
  {
    name: 'Jayabheri Properties',
    minAcres: 6.0,
    maxAcres: 30.0,
    minRoadWidth: 60.0,
    locations: ['Kokapet', 'Tellapur', 'Gachibowli', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Jayabheri Properties premium landmark high-rise developer. Seeking 6 to 30 acres prime parcels in West Hyderabad zones. Required road width 60ft.'
  },

  // BANGALORE DEVELOPERS
  {
    name: 'Prestige Land Division',
    minAcres: 4.0,
    maxAcres: 25.0,
    minRoadWidth: 60.0,
    locations: ['Sarjapur Road', 'Whitefield', 'Bangalore'],
    dealType: 'Joint Development',
    summary: 'Prestige Group land acquisition mandate. Seeking 4 to 25 acres in premium East Bangalore corridors like Whitefield or Sarjapur Road for premium high-rise gated communities.'
  },
  {
    name: 'Brigade JV Wing',
    minAcres: 10.0,
    maxAcres: 75.0,
    minRoadWidth: 80.0,
    locations: ['Devanahalli', 'Yelahanka', 'Bangalore North'],
    dealType: 'Outright Purchase',
    summary: 'Brigade Group outright acquisition division. Seeking large contiguous land parcels (10-75 acres) in North Bangalore near Airport (Devanahalli, Yelahanka) for integrated township or commercial layouts.'
  },
  {
    name: 'Sumadhura Infracon',
    minAcres: 3.5,
    maxAcres: 15.0,
    minRoadWidth: 40.0,
    locations: ['Whitefield', 'Sarjapur Road', 'Bangalore'],
    dealType: 'Joint Development',
    summary: 'Sumadhura Infracon residential apartment projects mandate. Targeting Whitefield and Sarjapur Road corridors. Required extent: 3.5 to 15 acres, 40ft road.'
  },
  {
    name: 'Sobha Land Division',
    minAcres: 6.0,
    maxAcres: 35.0,
    minRoadWidth: 50.0,
    locations: ['Kanakapura Road', 'Electronic City', 'Bangalore'],
    dealType: 'Joint Development',
    summary: 'Sobha Developers premium high-density apartment developments. Target regions: Kanakapura Road and Electronic City. Extent: 6 to 35 acres, road access 50ft.'
  },
  {
    name: 'Assetz Property Group',
    minAcres: 5.0,
    maxAcres: 30.0,
    minRoadWidth: 50.0,
    locations: ['Sarjapur Road', 'Whitefield', 'Bangalore'],
    dealType: 'Joint Development',
    summary: 'Assetz Property Group eco-friendly luxury residential towers. Seeking 5 to 30 acres in East Bangalore (Whitefield, Sarjapur) with minimum road access of 50ft.'
  },
  {
    name: 'Provident Housing',
    minAcres: 12.0,
    maxAcres: 70.0,
    minRoadWidth: 60.0,
    locations: ['Yelahanka', 'Kanakapura Road', 'Bangalore'],
    dealType: 'Joint Development',
    summary: 'Provident Housing (Puravankara) mid-income gated apartment complexes. Focus hubs: Yelahanka and Kanakapura Road. Seeking 12 to 70 acres with 60ft road.'
  },
  {
    name: 'Century Real Estate',
    minAcres: 8.0,
    maxAcres: 50.0,
    minRoadWidth: 60.0,
    locations: ['Devanahalli', 'Yelahanka', 'Hebbal', 'Bangalore'],
    dealType: 'Joint Development',
    summary: 'Century Real Estate premium plotting and villa layouts mandate. Target regions: Devanahalli and Yelahanka. Seeking 8 to 50 acres on space-share JDA.'
  },
  {
    name: 'Salarpuria Sattva',
    minAcres: 6.0,
    maxAcres: 40.0,
    minRoadWidth: 60.0,
    locations: ['Whitefield', 'Hebbal', 'Sarjapur Road', 'Bangalore'],
    dealType: 'Joint Development',
    summary: 'Salarpuria Sattva commercial and premium residential towers expansion. Targeting Hebbal, Whitefield, or Sarjapur Road. Requires 6 to 40 acres with 60ft road.'
  },
  {
    name: 'Embassy Group JV',
    minAcres: 15.0,
    maxAcres: 100.0,
    minRoadWidth: 80.0,
    locations: ['Devanahalli', 'Yelahanka', 'Bangalore North'],
    dealType: 'Outright Purchase',
    summary: 'Embassy Group mega integrated premium layouts and IT Park zones. Targeting Devanahalli and Bangalore North. Outright acquisition of 15 to 100 acres on 80ft road.'
  },
  {
    name: 'Mantri Developers',
    minAcres: 5.0,
    maxAcres: 25.0,
    minRoadWidth: 50.0,
    locations: ['Electronic City', 'Kanakapura Road', 'Bangalore'],
    dealType: 'Joint Development',
    summary: 'Mantri Developers high-rise residential apartment project. Targeting South Bangalore (Kanakapura Road, Electronic City). Required road width 50ft.'
  },
  {
    name: 'Shriram Properties',
    minAcres: 8.0,
    maxAcres: 45.0,
    minRoadWidth: 40.0,
    locations: ['Electronic City', 'Whitefield', 'Bangalore'],
    dealType: 'Joint Development',
    summary: 'Shriram Properties mid-market residential apartments. Focus areas: Electronic City and Whitefield. Seeking 8 to 45 acres on Joint Development.'
  },

  // PUNE, NCR, CHENNAI & NATIONAL DEVELOPERS
  {
    name: 'Godrej Properties JV',
    minAcres: 5.0,
    maxAcres: 40.0,
    minRoadWidth: 50.0,
    locations: ['Hinjewadi', 'Kharadi', 'Pune', 'Whitefield', 'Kokapet'],
    dealType: 'Joint Development',
    summary: 'Godrej Properties premium residential developments mandate. Seeking 5 to 40 acres prime lands in Hinjewadi/Kharadi (Pune) or Whitefield (Bangalore). Strict JDA structure.'
  },
  {
    name: 'Kolte-Patil Developers',
    minAcres: 8.0,
    maxAcres: 50.0,
    minRoadWidth: 40.0,
    locations: ['Hinjewadi', 'Kharadi', 'Pune'],
    dealType: 'Joint Development',
    summary: 'Kolte-Patil Developers residential gated township mandate. Focus areas are Hinjewadi and Kharadi IT belts. Seeking 8 to 50 acres with 40ft road approach.'
  },
  {
    name: 'Runwal Group',
    minAcres: 6.0,
    maxAcres: 30.0,
    minRoadWidth: 50.0,
    locations: ['Kharadi', 'Hinjewadi', 'Pune'],
    dealType: 'Joint Development',
    summary: 'Runwal Group premium apartments expansion mandate. Seeking 6 to 30 acres prime land in Kharadi or Hinjewadi corridors. JDA structure.'
  },
  {
    name: 'Oberoi Realty JV',
    minAcres: 10.0,
    maxAcres: 60.0,
    minRoadWidth: 80.0,
    locations: ['Gurgaon Golf Course Extension', 'Gurgaon', 'NCR'],
    dealType: 'Outright Purchase',
    summary: 'Oberoi Realty ultra-luxury high-rise residential developer. Seeking 10 to 60 acres prime land on Gurgaon Golf Course Extension Road. Outright purchase with 80ft road access.'
  },
  {
    name: 'Rohan Builders',
    minAcres: 5.0,
    maxAcres: 25.0,
    minRoadWidth: 40.0,
    locations: ['Hinjewadi', 'Kharadi', 'Pune'],
    dealType: 'Joint Development',
    summary: 'Rohan Builders seeking land for eco-themed residential layout. Targeting Hinjewadi and Kharadi corridors. Requires 5 to 25 acres with 40ft road.'
  },
  {
    name: 'Mahindra Lifespaces',
    minAcres: 8.0,
    maxAcres: 45.0,
    minRoadWidth: 60.0,
    locations: ['Gurgaon', 'Hinjewadi', 'Pune'],
    dealType: 'Joint Development',
    summary: 'Mahindra Lifespaces residential gated complex mandate. Seeking 8 to 45 acres in Gurgaon or Hinjewadi zones. Required road width 60ft.'
  },
  {
    name: 'Signature Global',
    minAcres: 5.0,
    maxAcres: 30.0,
    minRoadWidth: 40.0,
    locations: ['Sohna Road', 'Gurgaon', 'NCR'],
    dealType: 'Joint Development',
    summary: 'Signature Global affordable luxury residential complexes. Seeking 5 to 30 acres in Sohna Road or Gurgaon. Required approach road width 40ft.'
  },
  {
    name: 'Eldeco Group',
    minAcres: 10.0,
    maxAcres: 60.0,
    minRoadWidth: 60.0,
    locations: ['Sohna Road', 'Gurgaon', 'NCR'],
    dealType: 'Joint Development',
    summary: 'Eldeco Group plotted developer. Seeking 10 to 60 acres in Sohna Road or Gurgaon. JDA layout.'
  },
  {
    name: 'Tata Realty',
    minAcres: 10.0,
    maxAcres: 50.0,
    minRoadWidth: 60.0,
    locations: ['Whitefield', 'Devanahalli', 'OMR Chennai'],
    dealType: 'Joint Development',
    summary: 'Tata Realty premium high-rise integrated housing. Seeking 10 to 50 acres in Devanahalli or OMR Chennai. Open to space share Joint Development.'
  },
  {
    name: 'Hero Realty',
    minAcres: 8.0,
    maxAcres: 40.0,
    minRoadWidth: 60.0,
    locations: ['Gurgaon Golf Course Extension', 'NCR'],
    dealType: 'Joint Development',
    summary: 'Hero Realty premium gated community. Seeking 8 to 40 acres in Gurgaon Golf Course Extension Road with 60ft road access.'
  },
  {
    name: 'Ashiana Housing',
    minAcres: 12.0,
    maxAcres: 50.0,
    minRoadWidth: 40.0,
    locations: ['Sohna Road', 'Gurgaon', 'NCR'],
    dealType: 'Joint Development',
    summary: 'Ashiana Housing retirement senior living complexes mandate. Focus areas are Sohna Road and Gurgaon. Seeking 12 to 50 acres with 40ft road.'
  },
  {
    name: 'Casagrand Land Division',
    minAcres: 5.0,
    maxAcres: 35.0,
    minRoadWidth: 50.0,
    locations: ['OMR Chennai', 'Chennai'],
    dealType: 'Joint Development',
    summary: 'Casagrand Developers premium high-density apartments. Target region: OMR Chennai. Seeking 5 to 35 acres on JV space share. Required road width 50ft.'
  },

  // MID-SCALE BOUTIQUE/PLOT DEVELOPERS
  {
    name: 'Apex Infrastructure',
    minAcres: 5.0,
    maxAcres: 25.0,
    minRoadWidth: 40.0,
    locations: ['Shadnagar', 'Kothur', 'ORR Exit 16', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Apex Infrastructure & Land Corp. Seeking 5 to 25 acres near Shadnagar or Kothur along ORR access for villa plotting project. Must have 40ft+ blacktop road.'
  },
  {
    name: 'Aarohi Housing',
    minAcres: 10.0,
    maxAcres: 50.0,
    minRoadWidth: 60.0,
    locations: ['Devanahalli', 'Doddaballapur', 'Bangalore North'],
    dealType: 'Outright Purchase',
    summary: 'Aarohi Housing & Developers. Looking for large contiguous land parcels in North Bangalore near Airport (10-50 acres) for mixed-use township development.'
  },
  {
    name: 'Urban Rise Group',
    minAcres: 5.0,
    maxAcres: 25.0,
    minRoadWidth: 50.0,
    locations: ['OMR Chennai', 'Chennai', 'Whitefield', 'Bangalore'],
    dealType: 'Joint Development',
    summary: 'Urban Rise Group township developer. Seeking 5 to 25 acres on JDA in Chennai OMR or Bangalore Whitefield with 50ft road.'
  },
  {
    name: 'Fortune Realty',
    minAcres: 4.0,
    maxAcres: 20.0,
    minRoadWidth: 40.0,
    locations: ['Shadnagar', 'Kothur', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Fortune Realty plotted layout developer. Focus areas include Shadnagar and Kothur. Seeking 4 to 20 acres on JV.'
  },
  {
    name: 'Inani Real Estate',
    minAcres: 3.0,
    maxAcres: 15.0,
    minRoadWidth: 30.0,
    locations: ['Mokila', 'Tellapur', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Inani Real Estate boutique farm villa layouts. Seeking 3 to 15 acres in Mokila or Tellapur corridors with 30ft road.'
  },
  {
    name: 'Vantage Group',
    minAcres: 2.0,
    maxAcres: 10.0,
    minRoadWidth: 30.0,
    locations: ['Shamshabad', 'Kangal', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Vantage Real Estate Group boutique weekend villa layouts. Seeking clear title agricultural lands (2-10 acres) near Airport corridor.'
  },
  {
    name: 'Alliance Green',
    minAcres: 4.0,
    maxAcres: 20.0,
    minRoadWidth: 50.0,
    locations: ['Sarjapur Road', 'Whitefield', 'Bangalore'],
    dealType: 'Joint Development',
    summary: 'Alliance Green Developers premium residential apartments. Seeking 4 to 20 acres in East Bangalore on revenue sharing or space sharing JV.'
  },
  {
    name: 'Bhooja Developers',
    minAcres: 6.0,
    maxAcres: 25.0,
    minRoadWidth: 60.0,
    locations: ['Kokapet', 'Tellapur', 'Gachibowli', 'Hyderabad'],
    dealType: 'Joint Development',
    summary: 'Bhooja Developers luxury high-rise towers. Targeting premium West Hyderabad zones (Kokapet, Tellapur). Seeking 6 to 25 acres on JDA with 60ft road.'
  }
];

async function getEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });
    const result = await model.embedContent({
      content: { parts: [{ text }] },
      outputDimensionality: 768,
    } as any);
    return result.embedding.values;
  } catch (err) {
    console.error(`Embedding generation failed for text: "${text.substring(0, 30)}..."`, err);
    throw err;
  }
}

async function seedDatabase() {
  console.log('=== STARTING 50 DEVELOPERS DATABASE SEEDING ===');
  console.log(`Connecting to: ${supabaseUrl}`);

  // 1. Clear existing mandates to prevent duplicates
  console.log('\n1. Clearing existing developer mandates...');
  const { error: clearError } = await supabase
    .from('developer_mandates')
    .delete()
    .gte('min_acres', 0); // deletes all rows since min_acres is >= 0

  if (clearError) {
    console.error('Error clearing table:', clearError.message);
    process.exit(1);
  }
  console.log('Table cleared successfully!');

  // 2. Iterate and generate vector embeddings
  console.log('\n2. Generating embeddings and uploading 50 developers...');
  let successCount = 0;

  for (let i = 0; i < developerSpecs.length; i++) {
    const spec = developerSpecs[i];
    console.log(`[${i + 1}/50] Processing: ${spec.name}...`);

    try {
      // Fetch embedding vector from Gemini
      const embedding = await getEmbedding(spec.summary);

      // Insert into Supabase
      const { error: insertError } = await supabase.from('developer_mandates').insert({
        developer_name: spec.name,
        min_acres: spec.minAcres,
        max_acres: spec.maxAcres,
        min_road_width_ft: spec.minRoadWidth,
        preferred_locations: spec.locations,
        ideal_deal_type: spec.dealType,
        requirement_summary: spec.summary,
        embedding: embedding,
      });

      if (insertError) {
        console.error(`  Insert failed for ${spec.name}:`, insertError.message);
      } else {
        console.log(`  Successfully seeded ${spec.name}!`);
        successCount++;
      }

      // Add a 500ms delay to prevent rate limiting
      await new Promise((r) => setTimeout(r, 500));

    } catch (err) {
      console.error(`  Skipped ${spec.name} due to Gemini API failure.`);
    }
  }

  // 3. Verify total count
  console.log('\n3. Verifying database record counts...');
  const { data: countData, error: countError } = await supabase
    .from('developer_mandates')
    .select('id', { count: 'exact' });

  if (countError) {
    console.error('Failed to retrieve count:', countError.message);
  } else {
    const totalCount = countData?.length || 0;
    console.log(`Verification Complete: Total count in developer_mandates = ${totalCount}`);
    
    if (totalCount === 50) {
      console.log('\n🏆 DATABASE SEEDING COMPLETED SUCCESSFULLY WITH 50 VALID ENTRIES!');
    } else {
      console.warn(`\n⚠️ Database count mismatch: Expected 50, found ${totalCount}. Check logs for failures.`);
    }
  }
}

seedDatabase();
