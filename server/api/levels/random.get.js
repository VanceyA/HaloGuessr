// server/api/levels/random.js
import { defineEventHandler, getQuery, getCookie, setCookie } from 'h3';
import { useSupabase } from '../../utils/supabase'; // Ensure this path is correct

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const sessionId = query.sessionId;
    const supabase = useSupabase();

    let gameFilters = null;
    let excludedLevelIds = [];
    let sessionData = null;

    // Check if using a game session
    if (sessionId) {
      // Get session data
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .select('settings, current_round, max_rounds, is_complete')
        .eq('id', sessionId)
        .single();

      if (sessionError || !session) {
        console.error('Error fetching game session:', sessionError);
        return { error: 'Game session not found' };
      }

      sessionData = session;

      if (session.is_complete) {
        return {
          error: 'Game session is already complete',
          sessionComplete: true
        };
      }

      if (session.current_round >= session.max_rounds) {
        return {
          error: 'All rounds in this session have been played',
          sessionComplete: true
        };
      }

      // Apply game filters from session settings
      // *** IMPORTANT: Use the game IDs ('halo1', 'halo2', etc.) from compose.vue ***
      if (session.settings?.games && !session.settings.games.includes('all')) {
         // Map the short IDs ('halo1') to the full names ('Halo: Combat Evolved')
         // stored in the database if necessary, or ensure your compose.vue sends
         // the full names if that's what's stored. Assuming full names are stored:
         const gameIdToFullNameMap = {
            'halo1': 'Halo: Combat Evolved',
            'halo2': 'Halo 2',
            'halo3': 'Halo 3',
            'halo3odst': 'Halo 3: ODST',
            'haloreach': 'Halo: Reach',
            'halo4': 'Halo 4',
            'halo5': 'Halo 5: Guardians',
            'infinite': 'Halo Infinite'
         };
         // Filter out any potential 'all' value and map IDs to full names
         gameFilters = session.settings.games
            .filter(gameId => gameId !== 'all')
            .map(gameId => gameIdToFullNameMap[gameId])
            .filter(Boolean); // Remove any undefined results if mapping fails
      }

      // Get levels already played in this session
      const { data: playedRounds, error: roundsError } = await supabase
        .from('game_rounds')
        .select('level_id')
        .eq('session_id', sessionId);

      if (!roundsError && playedRounds) {
        excludedLevelIds = playedRounds.map(round => round.level_id);
      }
    }

    // Start building the query for levels
    let levelsQuery = supabase.from('levels').select('id');

    // Apply game filters if specified
    if (gameFilters && gameFilters.length > 0) {
      // *** FIX: Use the correct column name 'haloGame' ***
      levelsQuery = levelsQuery.in('haloGame', gameFilters);
    }

    // Get all level IDs matching the filters
    const { data: allLevelIds, error: fetchIdsError } = await levelsQuery;

    if (fetchIdsError) {
      // Log the specific error from Supabase
      console.error('Error fetching level IDs:', fetchIdsError);
      // Return a more specific error if possible, or a generic one
      return { error: `Database error fetching levels: ${fetchIdsError.message}` };
    }

    if (!allLevelIds || allLevelIds.length === 0) {
       // Check if filters were applied to provide a more specific message
       if (gameFilters && gameFilters.length > 0) {
           return { error: `No levels available for the selected game(s): ${gameFilters.join(', ')}` };
       }
       return { error: 'No levels available in the database.' };
    }

    // For non-session mode, use cookie-based exclusion
    if (!sessionId) {
      const recentlyPlayedCookie = getCookie(event, 'recently-played-levels');

      if (recentlyPlayedCookie) {
        try {
          let recentlyPlayed = JSON.parse(recentlyPlayedCookie);
          if (Array.isArray(recentlyPlayed)) {
            excludedLevelIds = recentlyPlayed;
          }
        } catch (e) {
          console.error('Error parsing recently played cookie:', e);
        }
      }
    }

    // Filter out excluded level IDs
    let availableLevels = allLevelIds.filter(
      level => !excludedLevelIds.includes(level.id)
    );

    // Handle the case when all levels matching filters have been played
    if (availableLevels.length === 0 && allLevelIds.length > 0) {
        console.warn(`All ${allLevelIds.length} levels matching filters have been played recently or in this session. Resetting available levels.`);
        // Reset available levels, potentially avoiding just the last one if possible
        if (excludedLevelIds.length > 0 && allLevelIds.length > 1) {
            const mostRecentId = excludedLevelIds[0]; // Assumes most recent is first
            availableLevels = allLevelIds.filter(level => level.id !== mostRecentId);
            // If filtering still results in zero, use all matching levels
            if (availableLevels.length === 0) {
                availableLevels = allLevelIds;
            }
        } else {
            availableLevels = allLevelIds; // Use all if only one level exists or no exclusions
        }
    }

    // If after all filtering, still no levels, something is wrong.
    if (availableLevels.length === 0) {
        console.error("No available levels found after filtering exclusions.");
        return { error: 'Could not find an available level to play.' };
    }


    // Select a random level
    const randomIndex = Math.floor(Math.random() * availableLevels.length);
    const randomLevelId = availableLevels[randomIndex].id;

    // Update cookie for non-session mode
    if (!sessionId) {
      let recentlyPlayed = excludedLevelIds.filter(id => typeof id === 'string'); // Ensure IDs are strings for cookie
      if (!recentlyPlayed.includes(randomLevelId)) {
        recentlyPlayed.unshift(randomLevelId);
        // Limit cookie size (e.g., 10-20 recent levels)
        if (recentlyPlayed.length > 15) {
          recentlyPlayed = recentlyPlayed.slice(0, 15);
        }

        setCookie(event, 'recently-played-levels', JSON.stringify(recentlyPlayed), {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
          httpOnly: true, // Good practice for server-set cookies
          sameSite: 'lax'
        });
      }
    }

    // Fetch the full level data
    const { data: level, error: fetchLevelError } = await supabase
      .from('levels')
      .select('id, screenshotPath, mapPath, mapName, location, haloGame') // Select haloGame too if needed later
      .eq('id', randomLevelId)
      .single();

    if (fetchLevelError || !level) {
      console.error("Error fetching full level data for ID:", randomLevelId, fetchLevelError);
      return { error: 'Failed to retrieve data for the selected level.' };
    }

    // Return level data with session information if applicable
    const response = {
      id: level.id,
      screenshotPath: level.screenshotPath,
      mapPath: level.mapPath,
      mapName: level.mapName,
      location: level.location,
      // Optionally include game name if needed on the frontend
      // haloGame: level.haloGame
    };

    if (sessionId && sessionData) {
      response.sessionData = {
        currentRound: sessionData.current_round + 1, // Increment for display (1-based)
        maxRounds: sessionData.max_rounds
      };
    }

    return response;
  } catch (err) {
    // Catch any unexpected errors
    console.error('Unexpected error during random level fetch:', err);
    // Avoid exposing detailed errors to the client in production
    return { error: 'An internal server error occurred while fetching a level.' };
  }
});
