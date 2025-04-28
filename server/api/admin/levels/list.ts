// server/api/admin/levels/list.ts
import { defineEventHandler } from 'h3'
import { useSupabase } from '@/server/utils/supabase'; // Your Supabase client helper

export default defineEventHandler(async (event) => {
  console.log('Admin list levels API called'); // Renamed from listScreenshots

  try {
    const supabase = useSupabase(); // Get Supabase client

    // *** Replace redis.keys + mget with Supabase select ***
    // Fetch all levels from Supabase. Select all columns.
    const { data: levels, error } = await supabase
      .from('levels') // Your table name
      .select('*'); // Select all columns to return all level data

    if (error) {
      console.error('Supabase query failed:', error.message)
       return {
        error: 'Failed to fetch levels from database',
        details: error.message
       }
    }

    console.log(`Retrieved ${levels.length} levels from Supabase`);

    // Supabase returns the data directly as an array of objects
    return levels;

  } catch (error: any) { // Catch any errors thrown during the process
    console.error('Database operation failed:', error.message)
     return {
      error: 'Failed to fetch levels',
      details: error.message
     }
  }
});
