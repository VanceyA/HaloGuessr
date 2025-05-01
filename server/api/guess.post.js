// server/api/guess.post.js
import { defineEventHandler, readBody } from 'h3';
import { useSupabase } from '../utils/supabase';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, guess, sessionId } = body;
    
    if (!id || !guess || typeof guess.x !== 'number' || typeof guess.y !== 'number') {
      return { error: 'Missing or invalid input parameters' };
    }
    
    const supabase = useSupabase();
    
    // Fetch the level data
    const { data: level, error } = await supabase
      .from('levels')
      .select('location, mapName')
      .eq('id', id)
      .single();
    
    if (error || !level) {
      console.error("Error fetching level for guess:", error);
      return { error: 'Level not found' };
    }
    
    // Check if location data is valid
    const correctLocation = level.location;
    if (!correctLocation || typeof correctLocation.x !== 'number' || typeof correctLocation.y !== 'number') {
      console.error("Fetched level has invalid location data:", correctLocation, "for ID:", id);
      return { error: 'Internal error: Level location data is invalid.' };
    }
    
    // Calculate distance and score
    const distance = Math.sqrt(
      Math.pow(guess.x - correctLocation.x, 2) +
      Math.pow(guess.y - correctLocation.y, 2)
    );
    
    const perfectRadius = 3;
    const maxDistance = 50;
    
    let score;
    if (distance <= perfectRadius) {
      score = 1000;
    } else if (distance > maxDistance) {
      score = 0;
    } else {
      const normalizedDistance = (distance - perfectRadius) / (maxDistance - perfectRadius);
      score = Math.max(0, Math.floor(1000 * (1 - Math.pow(normalizedDistance, 2))));
    }
    
    let sessionData = null;
    
    // If this is part of a game session, update the session data
    if (sessionId) {
      // Get current session state
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .select('current_round, max_rounds, total_score, is_complete')
        .eq('id', sessionId)
        .single();
      
      if (sessionError || !session) {
        console.error("Error fetching session:", sessionError);
        return { error: 'Game session not found' };
      }
      
      if (session.is_complete) {
        return { error: 'Game session is already complete' };
      }
      
      // Add the round to the session
      const newRoundNumber = session.current_round + 1;
      
      // Insert the round data
      const { error: roundError } = await supabase
        .from('game_rounds')
        .insert({
          session_id: sessionId,
          level_id: id, // Using the nanoid text field as is
          round_number: newRoundNumber,
          score: score,
          guess: guess,
          correct_location: correctLocation
        });
      
      if (roundError) {
        console.error("Error adding round to session:", roundError);
        return { error: 'Failed to save round data' };
      }
      
      // Update session data
      const newTotalScore = session.total_score + score;
      const isLastRound = newRoundNumber >= session.max_rounds;
      
      const { data: updatedSession, error: updateError } = await supabase
        .from('game_sessions')
        .update({
          current_round: newRoundNumber,
          total_score: newTotalScore,
          is_complete: isLastRound,
          updated_at: new Date()
        })
        .eq('id', sessionId)
        .select('id, current_round, max_rounds, total_score, is_complete')
        .single();
      
      if (updateError) {
        console.error("Error updating session:", updateError);
        return { error: 'Failed to update session' };
      }
      
      sessionData = updatedSession;
    }
    
    // Return the result
    const result = {
      score,
      correctLocation,
      mapName: level.mapName
    };
    
    if (sessionData) {
      result.sessionData = {
        currentRound: sessionData.current_round,
        maxRounds: sessionData.max_rounds,
        totalScore: sessionData.total_score,
        isComplete: sessionData.is_complete
      };
    }
    
    return result;
  } catch (error) {
    console.error('Guess processing failed:', error);
    return { error: 'Failed to process guess' };
  }
});
