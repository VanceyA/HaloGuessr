import { defineEventHandler } from 'h3';
import { getCookie, setCookie } from 'h3';
import { useSupabase } from '@/server/utils/supabase';

export default defineEventHandler(async (event) => {
  try {
    const supabase = useSupabase();

    // 1. Get recently played levels from cookie
    const recentlyPlayedCookie = getCookie(event, 'recently-played-levels');
    let recentlyPlayed: any[] = [];
    
    if (recentlyPlayedCookie) {
      try {
        recentlyPlayed = JSON.parse(recentlyPlayedCookie);
        // Ensure it's an array
        if (!Array.isArray(recentlyPlayed)) {
          recentlyPlayed = [];
        }
      } catch (e) {
        console.error('Error parsing recently played levels cookie:', e);
        recentlyPlayed = [];
      }
    }

    // 2. Fetch all level IDs from the database
    const { data: allLevelIds, error: fetchIdsError } = await supabase
      .from('levels')
      .select('id');

    if (fetchIdsError) {
      console.error('Error fetching all level IDs from Supabase:', fetchIdsError);
      throw fetchIdsError;
    }

    // Check if any levels were found
    if (!allLevelIds || allLevelIds.length === 0) {
      console.log('No levels found in the database.');
      return { error: 'No levels available' };
    }

    // 3. Filter out recently played levels
    let availableLevels = allLevelIds.filter(
      level => !recentlyPlayed.includes(level.id)
    );

    // If we've played all available levels or there are fewer than 10 levels total,
    // just use all levels but still avoid the most recently played one if possible
    if (availableLevels.length === 0 && allLevelIds.length > 1) {
      const mostRecentId = recentlyPlayed[0];
      availableLevels = allLevelIds.filter(level => level.id !== mostRecentId);
      console.log('All levels have been recently played. Avoiding only the most recent one.');
    } else if (availableLevels.length === 0) {
      // If we have no choice, use all levels
      availableLevels = allLevelIds;
      console.log('Using all levels as there are no alternatives.');
    }

    // 4. Pick one ID at random from the filtered list
    const randomIndex = Math.floor(Math.random() * availableLevels.length);
    const randomLevelId = availableLevels[randomIndex].id;

    // 5. Update the recently played list
    if (!recentlyPlayed.includes(randomLevelId)) {
      recentlyPlayed.unshift(randomLevelId); // Add to beginning
      if (recentlyPlayed.length > 10) {
        recentlyPlayed = recentlyPlayed.slice(0, 10); // Keep only the 10 most recent
      }
      
      // Save the updated list back to the cookie (expires in 30 days)
      setCookie(event, 'recently-played-levels', JSON.stringify(recentlyPlayed), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/'
      });
    }

    // 6. Fetch the full level data for the selected random ID
    const { data: level, error: fetchLevelError } = await supabase
      .from('levels')
      .select('id, screenshotPath, mapPath, mapName, location')
      .eq('id', randomLevelId)
      .single();

    if (fetchLevelError || !level) {
      console.error("Error fetching full data for selected random level:", 
        fetchLevelError || 'No data returned unexpectedly');
      return { error: 'Failed to retrieve data for the selected level.' };
    }

    // 7. Return the selected level data
    return {
      id: level.id,
      screenshotPath: level.screenshotPath,
      mapPath: level.mapPath,
      mapName: level.mapName,
      location: level.location,
    };

  } catch (err) {
    console.error('An error occurred during random level fetch:', err);
    return { error: 'Failed to fetch a random level' };
  }
});
