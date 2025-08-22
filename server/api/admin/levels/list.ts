// server/api/admin/levels/list.ts
import { defineEventHandler } from 'h3'
import { useSupabase } from '@/server/utils/supabase'; // Your Supabase client helper

export default defineEventHandler(async (event) => {
  try {
    const supabase = useSupabase(); // Get Supabase client

    // *** Fetch all levels with map data from normalized structure ***
    const { data: levels, error } = await supabase
      .from('levels')
      .select(`
        *,
        maps (
          id,
          name,
          image_path,
          halo_game,
          game_mode
        )
      `); // Select levels with joined map data

    if (error) {
      console.error('Supabase query failed:', error.message)
       return {
        error: 'Failed to fetch levels from database',
        details: error.message
       }
    }

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
