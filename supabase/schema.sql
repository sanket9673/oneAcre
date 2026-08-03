-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create Developer Mandates Table
CREATE TABLE IF NOT EXISTS developer_mandates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_name TEXT NOT NULL,
    min_acres NUMERIC(10, 2) NOT NULL,
    max_acres NUMERIC(10, 2) NOT NULL,
    min_road_width_ft NUMERIC(10, 2) NOT NULL,
    preferred_locations TEXT[] NOT NULL,
    ideal_deal_type TEXT NOT NULL, -- e.g., 'Joint Development', 'Outright Purchase'
    requirement_summary TEXT NOT NULL,
    embedding VECTOR(768), -- Vector size for Google Gemini text-embedding-004
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Vector Similarity Match RPC Function
CREATE OR REPLACE FUNCTION match_developers(
    query_embedding VECTOR(768),
    match_threshold FLOAT DEFAULT 0.3,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    developer_name TEXT,
    min_acres NUMERIC,
    max_acres NUMERIC,
    min_road_width_ft NUMERIC,
    preferred_locations TEXT[],
    ideal_deal_type TEXT,
    requirement_summary TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dm.id,
        dm.developer_name,
        dm.min_acres,
        dm.max_acres,
        dm.min_road_width_ft,
        dm.preferred_locations,
        dm.ideal_deal_type,
        dm.requirement_summary,
        (1 - (dm.embedding <=> query_embedding))::FLOAT AS similarity
    FROM developer_mandates dm
    WHERE 1 - (dm.embedding <=> query_embedding) > match_threshold
    ORDER BY dm.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 4. Seed Data: 10 Realistic Indian Real Estate Developer Mandates
INSERT INTO developer_mandates 
(developer_name, min_acres, max_acres, min_road_width_ft, preferred_locations, ideal_deal_type, requirement_summary, embedding)
VALUES
(
    'Apex Infrastructure & Land Corp', 
    5.0, 25.0, 40.0, 
    ARRAY['Shadnagar', 'Kothur', 'ORR Exit 16', 'Hyderabad'], 
    'Joint Development', 
    'Seeking 5 to 25 acres near Shadnagar or Kothur along ORR access for villa plotting project. Must have 40ft+ blacktop road.', 
    array_fill(0, ARRAY[768])::vector
),
(
    'Aarohi Housing & Developers', 
    10.0, 50.0, 60.0, 
    ARRAY['Devanahalli', 'Doddaballapur', 'Bangalore North'], 
    'Outright Purchase', 
    'Looking for large contiguous land parcels in North Bangalore near Airport for mixed-use township development.', 
    array_fill(0, ARRAY[768])::vector
),
(
    'Prestige Land Division', 
    3.0, 15.0, 60.0, 
    ARRAY['Kokapet', 'Gachibowli', 'Narsingi', 'Hyderabad'], 
    'Joint Development', 
    'High-rise residential parcel requirement in West Hyderabad. Clear title, clear zone, direct access road required.', 
    array_fill(0, ARRAY[768])::vector
),
(
    'Urban Heights Realty', 
    8.0, 30.0, 40.0, 
    ARRAY['Muthangi', 'Patancheru', 'ORR Exit 3', 'Hyderabad'], 
    'Joint Development', 
    'Mid-scale residential gated community parcel in Muthangi corridor. Minimum 40ft road approach.', 
    array_fill(0, ARRAY[768])::vector
),
(
    'Alliance Green Developers', 
    4.0, 20.0, 50.0, 
    ARRAY['Sarjapur Road', 'Whitefield', 'Bangalore'], 
    'Joint Development', 
    'Acquiring land for premium residential apartments in East Bangalore. Open to revenue sharing or space sharing JV.', 
    array_fill(0, ARRAY[768])::vector
),
(
    'Brickwork Infra Corp', 
    15.0, 100.0, 80.0, 
    ARRAY['Maheshwaram', 'Tukkuguda', 'E-City Hyderabad'], 
    'Outright Purchase', 
    'Industrial and Logistics Park development land requirement in South Hyderabad belt with 80ft main road access.', 
    array_fill(0, ARRAY[768])::vector
),
(
    'Vantage Real Estate Group', 
    2.0, 10.0, 30.0, 
    ARRAY['Shamshabad', 'Kangal', 'Hyderabad'], 
    'Joint Development', 
    'Boutique farm plot and weekend villa developer looking for clear title agricultural land near Airport corridor.', 
    array_fill(0, ARRAY[768])::vector
),
(
    'Sri Sreenivasa Constructions', 
    5.0, 18.0, 50.0, 
    ARRAY['Tellapur', 'Miyapur', 'Kollur', 'Hyderabad'], 
    'Joint Development', 
    'Mid to high-density residential land required in Kollur/Tellapur belt with proximity to ORR Exit 2.', 
    array_fill(0, ARRAY[768])::vector
),
(
    'Sovereign Land Holdings', 
    12.0, 60.0, 60.0, 
    ARRAY['Yelahanka', 'Chikkaballapur', 'Bangalore'], 
    'Outright Purchase', 
    'Large parcel acquisition for plotted layout development with DC conversion potential.', 
    array_fill(0, ARRAY[768])::vector
),
(
    'Deccan Horizon Infra', 
    6.0, 22.0, 40.0, 
    ARRAY['Medchal', 'Kompally', 'Gundlapochampally', 'Hyderabad'], 
    'Joint Development', 
    'North Hyderabad expansion mandate for affordable residential plotting and independent housing projects.', 
    array_fill(0, ARRAY[768])::vector
);
