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
    if (!body.mapName || !body.levelName || !body.gameMode || !body.haloGame || !body.location || typeof body.location.x !== 'number' || typeof body.location.y !== 'number') {
         return { error: 'Missing or invalid required fields' };
     }

    const supabase = useSupabase(); // Get Supabase client

    // Prepare data for update - only include fields that can be updated via this endpoint
    const updatedData = {
      mapName: body.mapName,
      levelName: body.levelName,
      gameMode: body.gameMode,
      haloGame: body.haloGame.trim(),
      location: body.location, // Stored as JSONB. Supabase handles updating JSONB fields.
      // Do NOT include 'id', 'screenshotPath', 'mapPath' here as they shouldn't be changed by this endpoint.
    };

    // *** Replace redis.get + redis.set with Supabase update ***
    const { data, error } = await supabase
      .from('levels') // Your table name
      .update(updatedData) // Provide the data to update
      .eq('id', id) // Filter by the level ID to update the specific row
      .select(); // Optionally select the updated row to confirm (returns array)

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
