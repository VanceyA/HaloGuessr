// server/api/levels/random.js
import { defineEventHandler, getQuery, getCookie, setCookie } from 'h3';
import { useSupabase } from '../../utils/supabase'; // Adjust path if needed

// Helper map for converting short IDs to full game names stored in DB
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

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const sessionId = query.sessionId;
    const supabase = useSupabase();

    let gameFilters = null;
    let excludedLevelIds = [];
    let currentRoundFromSession = 0;
    let maxRoundsFromSession = 0; // 0 means unlimited
    let timeLimitFromSession = 0; // Default time limit

    // --- Session Handling ---
    if (sessionId) {
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .select('settings, current_round, max_rounds, is_complete')
        .eq('id', sessionId)
        .single();

      if (sessionError || !session) {
        console.error(`Error fetching session ${sessionId}:`, sessionError);
        return { error: 'Game session not found or invalid.' };
      }

      currentRoundFromSession = session.current_round;
      maxRoundsFromSession = session.max_rounds;
      // *** Get timeLimit from settings ***
      timeLimitFromSession = parseInt(session.settings?.timeLimit, 10) || 0; // Ensure it's a number

      // Check completion status
      if (session.is_complete || (maxRoundsFromSession > 0 && currentRoundFromSession >= maxRoundsFromSession)) {
        return { error: 'Game session is complete.', sessionComplete: true };
      }

      // Apply game filters
      if (session.settings?.games && Array.isArray(session.settings.games)) {
         gameFilters = session.settings.games
            .map(gameId => gameIdToFullNameMap[gameId])
            .filter(Boolean);
         if (gameFilters.length === 0) {
             return { error: 'No valid games selected for this session.' };
         }
      } else {
          gameFilters = [gameIdToFullNameMap['halo1'], gameIdToFullNameMap['halo2'], gameIdToFullNameMap['halo3']].filter(Boolean);
      }

      // Get played levels
      const { data: playedRounds, error: roundsError } = await supabase
        .from('game_rounds')
        .select('level_id')
        .eq('session_id', sessionId);
      if (!roundsError && playedRounds) {
        excludedLevelIds = playedRounds.map(round => round.level_id);
      }
    } else {
        // --- Quick Play / No Session Handling ---
        gameFilters = [gameIdToFullNameMap['halo1'], gameIdToFullNameMap['halo2']].filter(Boolean);
        timeLimitFromSession = 0; // No time limit for default quick play
        // Cookie exclusion
        const recentlyPlayedCookie = getCookie(event, 'recently-played-levels');
        if (recentlyPlayedCookie) {
            try {
                let recentlyPlayed = JSON.parse(recentlyPlayedCookie);
                if (Array.isArray(recentlyPlayed)) {
                    excludedLevelIds = [...new Set([...excludedLevelIds, ...recentlyPlayed])];
                }
            } catch (e) { console.error('Error parsing recently played cookie:', e); }
        }
    }

    // --- Level Fetching ---
    let levelsQuery = supabase.from('levels').select('id');
    if (gameFilters && gameFilters.length > 0) {
      levelsQuery = levelsQuery.in('haloGame', gameFilters);
    }
    const { data: allLevelIds, error: fetchIdsError } = await levelsQuery;
    if (fetchIdsError) { return { error: `Database error: ${fetchIdsError.message}` }; }
    if (!allLevelIds || allLevelIds.length === 0) { return { error: 'No levels available for selection.' }; }

    // Filter excluded
    let availableLevels = allLevelIds.filter(level => !excludedLevelIds.includes(level.id));
    if (availableLevels.length === 0 && allLevelIds.length > 0) { availableLevels = allLevelIds; }
    if (availableLevels.length === 0) { return { error: 'Could not find an available level.' }; }

    // Pick random level
    const randomIndex = Math.floor(Math.random() * availableLevels.length);
    const randomLevelId = availableLevels[randomIndex].id;

    // --- Cookie Update (Non-Session Mode) ---
    if (!sessionId) {
        let recentlyPlayed = excludedLevelIds.filter(id => typeof id === 'string');
        if (!recentlyPlayed.includes(randomLevelId)) {
            recentlyPlayed.unshift(randomLevelId);
            if (recentlyPlayed.length > 15) { recentlyPlayed = recentlyPlayed.slice(0, 15); }
            setCookie(event, 'recently-played-levels', JSON.stringify(recentlyPlayed), {
                maxAge: 30 * 24 * 60 * 60, path: '/', httpOnly: true, sameSite: 'lax'
            });
        }
    }

    // --- Fetch Full Level Data ---
    const { data: level, error: fetchLevelError } = await supabase
      .from('levels')
      .select('id, screenshotPath, mapPath, mapName, location')
      .eq('id', randomLevelId)
      .single();
    if (fetchLevelError || !level) { return { error: 'Failed to retrieve level data.' }; }

    // --- Prepare Response ---
    const response = {
      id: level.id,
      screenshotPath: level.screenshotPath,
      mapPath: level.mapPath,
      mapName: level.mapName,
      location: level.location,
    };

    // Add session data if applicable
    if (sessionId) {
      response.sessionData = {
        currentRound: currentRoundFromSession + 1,
        maxRounds: maxRoundsFromSession,
        // *** Include timeLimit in sessionData ***
        timeLimit: timeLimitFromSession
      };
    } else {
        // Include default time limit for quick play if needed
        response.sessionData = { timeLimit: 0 };
    }

    return response;

  } catch (err) {
    console.error('Unexpected error during random level fetch:', err);
    return { error: 'An internal server error occurred while fetching a level.' };
  }
});
