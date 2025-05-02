// server/api/guess.post.js
import { defineEventHandler, readBody } from 'h3';
import { useSupabase } from '../utils/supabase'; // Adjust path if needed

// Helper function for score calculation
function calculateScore(guess, correctLocation) {
    // *** If guess is null (timeout), score is 0 ***
    if (guess === null) {
        return 0;
    }
    // Original validation and calculation
    if (!guess || !correctLocation || typeof guess.x !== 'number' || typeof correctLocation.x !== 'number') {
        console.warn("Invalid input for score calculation:", { guess, correctLocation });
        return 0; // Invalid input
    }
    const distance = Math.hypot(guess.x - correctLocation.x, guess.y - correctLocation.y);
    const perfectRadius = 3;
    const maxDistance = 50;

    if (distance <= perfectRadius) return 1000;
    if (distance > maxDistance) return 0;

    const normalizedDistance = (distance - perfectRadius) / (maxDistance - perfectRadius);
    return Math.max(0, Math.floor(1000 * (1 - Math.pow(normalizedDistance, 2))));
}


export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id: levelId, guess, sessionId } = body;

    // --- Modified Input Validation ---
    // Level ID is always required.
    // Guess can be null (for timeout) or must be an object with x/y numbers.
    if (!levelId || (guess !== null && (typeof guess !== 'object' || typeof guess.x !== 'number' || typeof guess.y !== 'number'))) {
      console.error("Invalid guess input:", { levelId, guess, sessionId });
      return { error: 'Missing levelId or invalid guess format.' };
    }
    // --- End Modified Input Validation ---

    const supabase = useSupabase();

    // --- Fetch Level Data ---
    const { data: level, error: levelError } = await supabase
      .from('levels')
      .select('location, mapName')
      .eq('id', levelId)
      .single();

    if (levelError || !level) {
      console.error(`Error fetching level ${levelId}:`, levelError);
      return { error: 'Level not found or database error.' };
    }

    const correctLocation = level.location;
    if (!correctLocation || typeof correctLocation.x !== 'number' || typeof correctLocation.y !== 'number') {
      console.error(`Invalid location data for level ${levelId}:`, correctLocation);
      return { error: 'Internal error: Level location data is invalid.' };
    }

    // --- Calculate Score (Handles null guess) ---
    const score = calculateScore(guess, correctLocation);

    let sessionResponseData = null;

    // --- Session Handling (if sessionId is provided) ---
    if (sessionId) {
      const { data: session, error: sessionFetchError } = await supabase
        .from('game_sessions')
        .select('current_round, max_rounds, total_score, is_complete')
        .eq('id', sessionId)
        .single();

      if (sessionFetchError || !session) {
        console.error(`Error fetching session ${sessionId} for guess:`, sessionFetchError);
        return { error: 'Game session not found or invalid.' };
      }
      if (session.is_complete) {
        console.warn(`Attempted guess for already completed session ${sessionId}`);
        return { error: 'Game session is already complete.' };
      }

      const currentRound = session.current_round;
      const maxRounds = session.max_rounds;
      const newRoundNumber = currentRound + 1;

      // Insert the new round data
      const { error: roundInsertError } = await supabase
        .from('game_rounds')
        .insert({
          session_id: sessionId,
          level_id: levelId,
          round_number: newRoundNumber,
          score: score, // Score will be 0 if guess was null
          guess: guess, // Store null if timed out, or coordinates otherwise
          correct_location: correctLocation
        });

      if (roundInsertError) {
        console.error(`Error inserting round ${newRoundNumber} for session ${sessionId}:`, roundInsertError);
        return { error: 'Failed to save round data. Please try again.' };
      }

      // Update the session summary
      const newTotalScore = session.total_score + score;
      const isNowComplete = maxRounds > 0 && newRoundNumber >= maxRounds;

      const { data: updatedSession, error: sessionUpdateError } = await supabase
        .from('game_sessions')
        .update({
          current_round: newRoundNumber,
          total_score: newTotalScore,
          is_complete: isNowComplete,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select('current_round, max_rounds, total_score, is_complete')
        .single();

      if (sessionUpdateError) {
        console.error(`Error updating session ${sessionId} after round ${newRoundNumber}:`, sessionUpdateError);
        return { error: 'Failed to update session summary.' };
      }

      sessionResponseData = {
        currentRound: updatedSession.current_round,
        maxRounds: updatedSession.max_rounds,
        totalScore: updatedSession.total_score,
        isComplete: updatedSession.is_complete
      };
    }

    // --- Prepare Final Response ---
    const responsePayload = {
      score,
      correctLocation,
      mapName: level.mapName,
      ...(sessionResponseData && { sessionData: sessionResponseData })
    };

    return responsePayload;

  } catch (error) {
    console.error('Unexpected error during guess processing:', error);
    return { error: 'Internal server error processing guess.' };
  }
});
