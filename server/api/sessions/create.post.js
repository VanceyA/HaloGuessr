// server/api/sessions/create.post.js
import { defineEventHandler, readBody } from 'h3';
import { useSupabase } from '../../utils/supabase';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { rounds = 5, games = ["all"], timeLimit = 0, difficulty = "normal" } = body;
    
    const settings = {
      rounds,
      games,
      timeLimit,
      difficulty
    };
    
    const supabase = useSupabase();
    
    const { data: session, error } = await supabase
      .from('game_sessions')
      .insert({
        settings,
        max_rounds: rounds
      })
      .select('id, settings, current_round, max_rounds')
      .single();
    
    if (error) {
      console.error('Failed to create game session:', error);
      return { error: 'Failed to create game session' };
    }
    
    return {
      sessionId: session.id,
      settings: session.settings,
      currentRound: session.current_round,
      maxRounds: session.max_rounds,
      isComplete: false,
      totalScore: 0
    };
  } catch (error) {
    console.error('Failed to create game session:', error);
    return { error: 'Failed to create game session' };
  }
});
