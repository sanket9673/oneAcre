import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Helper to check if URL is valid to prevent crashes during Next.js builds/prerendering
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const safeUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder-project.supabase.co';
const safeAnonKey = supabaseAnonKey || 'placeholder-anon-key';

// Client for public / browser-side queries
export const supabase = createClient(safeUrl, safeAnonKey);

// Helper function for server-side / admin API calls
export const getServiceSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const adminUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder-project.supabase.co';
  const adminKey = serviceRoleKey || 'placeholder-service-role-key';

  return createClient(adminUrl, adminKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

