// server/api/levels/random.get.ts
import { defineEventHandler } from 'h3';
// Removed nanoid, getCookie, setCookie as they are no longer needed for random selection
import { useSupabase } from '@/server/utils/supabase'; // Your Supabase client helper

export default defineEventHandler(async (event) => {
  try {
    const supabase = useSupabase();

    console.log('Attempting to fetch a random level (fetching all IDs)...');

    // 1. Fetch all level IDs from the database
    const { data: allLevelIds, error: fetchIdsError } = await supabase
      .from('levels')
      .select('id'); // Select only the 'id' column

    if (fetchIdsError) {
      console.error('Error fetching all level IDs from Supabase:', fetchIdsError);
      throw fetchIdsError; // Re-throw the error
    }

    // Check if any levels were found
    if (!allLevelIds || allLevelIds.length === 0) {
      console.log('No levels found in the database.');
      return { error: 'No levels available' };
    }

    console.log(`Found ${allLevelIds.length} total level IDs.`);

    // 2. Pick one ID at random from the fetched list
    const randomIndex = Math.floor(Math.random() * allLevelIds.length);
    const randomLevelId = allLevelIds[randomIndex].id;
    console.log(`Selected random level ID: ${randomLevelId} (Index ${randomIndex})`);


    // 3. Fetch the full level data for the selected random ID
    const { data: level, error: fetchLevelError } = await supabase
      .from('levels')
      // Select all necessary fields for the frontend. Add more if needed.
      .select('id, screenshotPath, mapPath, mapName, location') // Included location if needed on index page
      .eq('id', randomLevelId) // Filter by the chosen random ID
      .single(); // Expecting exactly one row

    // This should ideally not fail if the ID came from a valid list, but error handling is good practice
    if (fetchLevelError || !level) {
        console.error("Error fetching full data for selected random level:", fetchLevelError || 'No data returned unexpectedly');
        // If this fails, something is seriously wrong or a race condition occurred (e.g., level deleted just now)
        return { error: 'Failed to retrieve data for the selected level.' };
    }

    console.log(`Successfully fetched full data for random level ID: ${level.id}`);

    // 4. Return the selected level data
    // Explicitly list the fields to return, matching the frontend's expectation
    return {
      id: level.id,
      screenshotPath: level.screenshotPath,
      mapPath: level.mapPath,
      mapName: level.mapName,
      // Include other fields if you selected them and need them on the frontend.
      // E.g., if your frontend uses location data before a guess is made:
      location: level.location, // Only if selected above and needed on index page
    };

  } catch (err: any) { // Catching any errors thrown in the try block
    console.error('An error occurred during random level fetch:', err);
    // Return a generic error message to the client
    return { error: 'Failed to fetch a random level' };
  }
});
