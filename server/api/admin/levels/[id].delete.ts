// server/api/admin/deleteScreenshot/[id].ts
import { defineEventHandler } from 'h3'
import verifyAdmin from '@/server/utils/verifyAdmin'
import { useSupabase } from '@/server/utils/supabase'; // Your Supabase client helper

export default defineEventHandler(async (event) => {
  // Verify admin authentication (keep as is)
  if (!verifyAdmin(event)) {
    return { error: 'Unauthorized', status: 401 }
  }

  try {
    const id = event.context.params?.id; // Get ID from route params
    if (!id) {
      return { error: 'No ID provided in route' };
    }

    const supabase = useSupabase(); // Get Supabase client

    // *** Replace redis.exists + redis.del with Supabase delete ***
    console.log(`Attempting to delete level with ID: ${id}`);

    // Perform the delete operation
    const { error, count } = await supabase
      .from('levels') // Your table name
      .delete()
      .eq('id', id) // Filter by the level ID to delete the specific row
      .select(); // Or use .returning('id') for some databases, but Supabase uses select()
      // Note: count is available on the result object for delete operations in Supabase

    if (error) {
      console.error('Error deleting level from Supabase:', error);
       // Check if the error indicates the row was not found (Supabase might not explicitly error for not found on delete)
       // Alternatively, you could try fetching first, but a direct delete is simpler.
       // If error.code === 'PGRST....' for not found, handle it.
      return { error: 'Failed to delete level' };
    }

    // Check if any rows were actually deleted
    if (count === 0) {
        console.warn(`Delete operation for ID ${id} resulted in 0 deleted rows (Level not found?).`);
        return { error: 'Level not found', status: 404 }; // Return 404 if nothing was deleted
    }

    console.log(`Successfully deleted level with ID: ${id}. Deleted count: ${count}`);
    return { success: true, message: 'Level deleted successfully' };

  } catch (error) {
    console.error('Delete level error:', error);
    return { error: 'Failed to delete level' };
  }
});
