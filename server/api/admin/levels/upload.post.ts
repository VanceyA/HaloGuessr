// server/api/admin/levels/upload.post.ts
import { defineEventHandler, readMultipartFormData } from 'h3'
import { put } from '@vercel/blob'
import { nanoid } from 'nanoid'
import verifyAdmin from '@/server/utils/verifyAdmin'
import { useSupabase } from '@/server/utils/supabase';

export default defineEventHandler(async (event) => {
  // Verify admin authentication (keep this as is)
  if (!verifyAdmin(event)) {
    return { error: 'Unauthorized', status: 401 }
  }

  try {
    const config = useRuntimeConfig();
    const supabase = useSupabase(); // Get Supabase client

    const formData = await readMultipartFormData(event);
    if (!formData) {
      return { error: 'No form data' };
    }

    let levelName = '';
    let mapId = '';
    let x = '';
    let y = '';
    let screenshotFile = null;

    // Parse form data
    for (const field of formData) {
      if (field.name === 'levelName') levelName = field.data.toString();
      if (field.name === 'mapId') mapId = field.data.toString();
      if (field.name === 'x') x = field.data.toString();
      if (field.name === 'y') y = field.data.toString();
      if (field.name === 'screenshot') screenshotFile = field;
    }

    if (!levelName || !x || !y || !screenshotFile || !mapId) {
      return { error: 'Missing required fields' };
    }

    // Verify the map exists
    const { data: mapExists, error: mapError } = await supabase
      .from('maps')
      .select('id')
      .eq('id', mapId)
      .single();

    if (mapError || !mapExists) {
      return { error: 'Selected map not found' };
    }

    const id = nanoid(); // Continue generating nanoid for consistency

    // Upload screenshot to blob storage
    const screenshotBlob = await put(`screenshots/${id}_${screenshotFile.filename}`, screenshotFile.data, {
      access: 'public',
      token: config.blobReadWriteToken
    });

    const metadata = {
      id, // Use the generated nanoid as the primary key
      screenshotPath: screenshotBlob.url,
      levelName,
      map_id: mapId,
      location: { x: parseFloat(x), y: parseFloat(y) } // Stored as JSONB
    };

    // *** Replace redis.set with Supabase insert ***
    const { data, error } = await supabase
      .from('levels') // Your table name
      .insert([metadata]) // Insert the metadata object as a new row
      .select(); // Optionally select the inserted row to confirm

    if (error) {
      console.error('Error inserting level into Supabase:', error);
      // TODO: Ideally, you'd handle cleanup here, e.g., delete the blobs if DB insert fails.
      // Vercel Blob doesn't have a direct delete via URL, you might need to store blob references or implement cleanup separately.
      return { error: 'Failed to save level metadata to database' };
    }

    return { success: true, id: data ? data[0].id : id }; // Return the id
  } catch (error) {
    console.error('Upload failed:', error);
    return { error: 'Failed to upload level' };
  }
});
