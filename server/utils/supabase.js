// server/utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const useSupabase = () => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.supabaseUrl;
  // Using the service role key for backend operations
  const supabaseServiceRoleKey = config.supabaseServiceRoleKey;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    // Log an error or throw a more specific error indicating missing config
    console.error('Missing Supabase URL or Service Role Key in runtime config.');
    throw new Error('Server configuration error: Supabase credentials missing.');
  }

  // Create a Supabase client instance using the service_role key
  // This key bypasses Row Level Security (RLS) and is for trusted server-side operations.
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        // Disable session persistence on the server side
        persistSession: false,
      },
  });
};
