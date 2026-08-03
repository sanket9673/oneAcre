import { DeveloperMatch } from '@/types/api';

export const MOCK_DEVELOPERS: Omit<DeveloperMatch, 'id' | 'similarity'>[] = [
  {
    developer_name: 'Apex Infrastructure & Land Corp',
    min_acres: 5.0,
    max_acres: 25.0,
    min_road_width_ft: 40.0,
    preferred_locations: ['Shadnagar', 'Kothur', 'ORR Exit 16', 'Hyderabad'],
    ideal_deal_type: 'Joint Development',
    requirement_summary: 'Seeking 5 to 25 acres near Shadnagar or Kothur along ORR access for villa plotting project. Must have 40ft+ blacktop road.',
  },
  {
    developer_name: 'Aarohi Housing & Developers',
    min_acres: 10.0,
    max_acres: 50.0,
    min_road_width_ft: 60.0,
    preferred_locations: ['Devanahalli', 'Doddaballapur', 'Bangalore North'],
    ideal_deal_type: 'Outright Purchase',
    requirement_summary: 'Looking for large contiguous land parcels in North Bangalore near Airport for mixed-use township development.',
  },
  {
    developer_name: 'Prestige Land Division',
    min_acres: 3.0,
    max_acres: 15.0,
    min_road_width_ft: 60.0,
    preferred_locations: ['Kokapet', 'Gachibowli', 'Narsingi', 'Hyderabad'],
    ideal_deal_type: 'Joint Development',
    requirement_summary: 'High-rise residential parcel requirement in West Hyderabad. Clear title, clear zone, direct access road required.',
  },
  {
    developer_name: 'Urban Heights Realty',
    min_acres: 8.0,
    max_acres: 30.0,
    min_road_width_ft: 40.0,
    preferred_locations: ['Muthangi', 'Patancheru', 'ORR Exit 3', 'Hyderabad'],
    ideal_deal_type: 'Joint Development',
    requirement_summary: 'Mid-scale residential gated community parcel in Muthangi corridor. Minimum 40ft road approach.',
  },
  {
    developer_name: 'Alliance Green Developers',
    min_acres: 4.0,
    max_acres: 20.0,
    min_road_width_ft: 50.0,
    preferred_locations: ['Sarjapur Road', 'Whitefield', 'Bangalore'],
    ideal_deal_type: 'Joint Development',
    requirement_summary: 'Acquiring land for premium residential apartments in East Bangalore. Open to revenue sharing or space sharing JV.',
  },
  {
    developer_name: 'Brickwork Infra Corp',
    min_acres: 15.0,
    max_acres: 100.0,
    min_road_width_ft: 80.0,
    preferred_locations: ['Maheshwaram', 'Tukkuguda', 'E-City Hyderabad'],
    ideal_deal_type: 'Outright Purchase',
    requirement_summary: 'Industrial and Logistics Park development land requirement in South Hyderabad belt with 80ft main road access.',
  },
  {
    developer_name: 'Vantage Real Estate Group',
    min_acres: 2.0,
    max_acres: 10.0,
    min_road_width_ft: 30.0,
    preferred_locations: ['Shamshabad', 'Kangal', 'Hyderabad'],
    ideal_deal_type: 'Joint Development',
    requirement_summary: 'Boutique farm plot and weekend villa developer looking for clear title agricultural land near Airport corridor.',
  },
  {
    developer_name: 'Sri Sreenivasa Constructions',
    min_acres: 5.0,
    max_acres: 18.0,
    min_road_width_ft: 50.0,
    preferred_locations: ['Tellapur', 'Miyapur', 'Kollur', 'Hyderabad'],
    ideal_deal_type: 'Joint Development',
    requirement_summary: 'Mid to high-density residential land required in Kollur/Tellapur belt with proximity to ORR Exit 2.',
  },
  {
    developer_name: 'Sovereign Land Holdings',
    min_acres: 12.0,
    max_acres: 60.0,
    min_road_width_ft: 60.0,
    preferred_locations: ['Yelahanka', 'Chikkaballapur', 'Bangalore'],
    ideal_deal_type: 'Outright Purchase',
    requirement_summary: 'Large parcel acquisition for plotted layout development with DC conversion potential.',
  },
  {
    developer_name: 'Deccan Horizon Infra',
    min_acres: 6.0,
    max_acres: 22.0,
    min_road_width_ft: 40.0,
    preferred_locations: ['Medchal', 'Kompally', 'Gundlapochampally', 'Hyderabad'],
    ideal_deal_type: 'Joint Development',
    requirement_summary: 'North Hyderabad expansion mandate for affordable residential plotting and independent housing projects.',
  },
];

export function localFallbackMatch(
  acres: number,
  roadWidthFt: number,
  location: string,
  dealType: string
): DeveloperMatch[] {
  return MOCK_DEVELOPERS.map((dev, index) => {
    let score = 0;
    
    // 1. Deal Type match
    if (dealType && dev.ideal_deal_type.toLowerCase() === dealType.toLowerCase()) {
      score += 0.3;
    } else {
      score += 0.15;
    }
    
    // 2. Size constraints match
    if (acres >= dev.min_acres && acres <= dev.max_acres) {
      score += 0.3;
    } else if (acres >= dev.min_acres * 0.8 && acres <= dev.max_acres * 1.2) {
      score += 0.15; // Partial size match
    }
    
    // 3. Road width match
    if (roadWidthFt >= dev.min_road_width_ft) {
      score += 0.2;
    } else if (roadWidthFt >= dev.min_road_width_ft * 0.8) {
      score += 0.1; // Close enough road width
    }
    
    // 4. Location match
    const locationLower = (location || '').toLowerCase();
    const matchesLocation = dev.preferred_locations.some(loc => 
      locationLower.includes(loc.toLowerCase()) || loc.toLowerCase().includes(locationLower)
    );
    if (matchesLocation) {
      score += 0.2;
    }
    
    return {
      id: `fallback-dev-${index}`,
      ...dev,
      similarity: parseFloat((0.2 + score * 0.8).toFixed(4)), // normalize similarity score between 0.2 and 1.0
    };
  })
  .filter(dev => (dev.similarity ?? 0) >= 0.35)
  .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))
  .slice(0, 5);
}
