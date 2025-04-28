// server/api/admin/levels/[id].get.ts
import { defineEventHandler } from 'h3'
import { useSupabase } from '@/server/utils/supabase'; // Your Supabase client helper

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id; // Get ID from route params
    if (!id) {
      return { error: 'No ID provided in route' };
    }

    const supabase = useSupabase(); // Get Supabase client

    // *** Replace redis.get with Supabase select by ID ***
    const { data: level, error } = await supabase
      .from('levels') // Your table name
      .select('*') // Select all columns for the level details page/view
      .eq('id', id) // Filter by the level ID
      .single(); // Expecting exactly one row

    if (error || !level) {
      console.error(`Error fetching level ID ${id}:`, error);
       // Supabase single() will throw an error if not found, the catch block handles it.
       // If error occurs here, it means multiple rows matched (unlikely for PK) or other DB error.
      return { error: 'Level not found or failed to fetch' }
    }

    // Ensure location has both x and y properties (keep this validation)
    // Since 'location' is JSONB, it should be an object if it exists.
    if (!level.location || typeof level.location.x !== 'number' || typeof level.location.y !== 'number') {
       console.warn(`Level ID ${id} has invalid location data:`, level.location);
       // You might set a default or return an error depending on how strict you need this.
       level.location = { x: 0, y: 0 }; // Set default if invalid
    }

    console.log(`Successfully fetched level with ID: ${id}`);
    return level; // Return the level object

  } catch (error) {
    console.error('Failed to fetch level:', error);
    return { error: 'Failed to fetch level' }
  }
});
