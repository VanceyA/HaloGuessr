// server/api/sessions/create.post.js
import { defineEventHandler, readBody } from 'h3';
import { useSupabase } from '../../utils/supabase'; // Adjust path if needed

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate and parse rounds, default to 5, handle 0 for unlimited
    const requestedRounds = parseInt(body.rounds, 10);
    const maxRounds = isNaN(requestedRounds) || requestedRounds < 0 ? 5 : requestedRounds; // Use 0 for unlimited

    // Validate games array
    const games = Array.isArray(body.games) && body.games.length > 0
        ? body.games
        : ['halo1', 'halo2']; // Default if invalid or empty

    // Validate time limit
    const timeLimit = parseInt(body.timeLimit, 10);
    const validTimeLimit = isNaN(timeLimit) || timeLimit < 0 ? 0 : timeLimit;

    // Validate difficulty
    const validDifficulties = ['easy', 'normal', 'hard'];
    const difficulty = validDifficulties.includes(body.difficulty) ? body.difficulty : 'normal';

    // Prepare settings object to store in DB
    const settings = {
      games: games,
      timeLimit: validTimeLimit,
      difficulty: difficulty,
      // We don't store 'unlimited' flag, max_rounds = 0 implies unlimited
    };

    const supabase = useSupabase();

    // Insert new session into the database
    const { data: session, error } = await supabase
      .from('game_sessions')
      .insert({
        settings,
        max_rounds: maxRounds // Store 0 in the DB for unlimited
      })
      .select('id, settings, current_round, max_rounds') // Select max_rounds
      .single();

    // Handle potential insertion errors
    if (error) {
      console.error('Failed to create game session in DB:', error);
      // Consider more specific error mapping if needed
      return { error: `Database error creating session: ${error.message}` };
    }

    // Return successful response
    return {
      sessionId: session.id,
      settings: session.settings,
      currentRound: session.current_round, // Should be 0 initially
      maxRounds: session.max_rounds, // Return the stored value (could be 0)
      isComplete: false, // New session is never complete
      totalScore: 0 // New session score is 0
    };

  } catch (error) {
    // Catch unexpected errors during processing
    console.error('Unexpected error in create session endpoint:', error);
    return { error: 'Internal server error creating session' };
  }
});
