// server/api/admin/levels/[id].put.ts
import { defineEventHandler, readBody } from 'h3'
import verifyAdmin from '../../../utils/verifyAdmin'
import { useSupabase } from '../../../utils/supabase'; // Your Supabase client helper

export default defineEventHandler(async (event) => {
  // Verify admin authentication (keep as is)
  if (!verifyAdmin(event)) {
    return { error: 'Unauthorized', status: 401 }
  }

  try {
    const id = event.context.params?.id; // Safely access ID from route params
    if (!id) {
      return { error: 'No ID provided in route' };
    }

    const body = await readBody(event);
    // Basic validation for required fields and location format
    if (!body.levelName || !body.mapId || !body.location || typeof body.location.x !== 'number' || typeof body.location.y !== 'number') {
         return { error: 'Missing or invalid required fields' };
     }

    const supabase = useSupabase(); // Get Supabase client

    // Verify the map exists
    const { data: mapExists, error: mapError } = await supabase
      .from('maps')
      .select('id')
      .eq('id', body.mapId)
      .single();

    if (mapError || !mapExists) {
      return { error: 'Selected map not found' };
    }

    // Update the levels table with new map_id
    const { data, error } = await supabase
      .from('levels')
      .update({
        levelName: body.levelName,
        map_id: body.mapId,
        location: body.location
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating level in Supabase:', error);
       // Check if the error indicates the row was not found
       if (error.code === 'PGRST116') { // Common PostgREST error code for "Not Found"
            return { error: 'Level not found' };
       }
      return { error: 'Failed to update level' };
    }

     // Supabase update returns an array of updated rows. If no row matched the id, it's empty.
    if (!data || data.length === 0) {
         // This case should ideally be caught by error.code 'PGRST116', but good to double-check.
         console.warn(`Update operation for ID ${id} returned no matching rows.`);
         return { error: 'Level not found' };
    }

    return { success: true };

  } catch (error) {
    console.error('Update level error:', error);
    return { error: 'Failed to update level' };
  }
});
