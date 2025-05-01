// server/api/sessions/[id].get.js
import { defineEventHandler } from 'h3';
import { useSupabase } from '../../utils/supabase';

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const supabase = useSupabase();
    
    // Get session data
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('id, settings, current_round, max_rounds, total_score, is_complete')
      .eq('id', id)
      .single();
    
    if (sessionError) {
      console.error('Failed to get session:', sessionError);
      return { error: 'Session not found' };
    }
    
    // Get rounds data
    const { data: rounds, error: roundsError } = await supabase
      .from('game_rounds')
      .select('round_number, score, guess, correct_location, level_id')
      .eq('session_id', id)
      .order('round_number', { ascending: true });
    
    if (roundsError) {
      console.error('Failed to get rounds:', roundsError);
      return { error: 'Failed to get session rounds' };
    }
    
    return {
      id: session.id,
      settings: session.settings,
      currentRound: session.current_round,
      maxRounds: session.max_rounds,
      totalScore: session.total_score,
      isComplete: session.is_complete,
      rounds: rounds || []
    };
  } catch (error) {
    console.error('Failed to get session:', error);
    return { error: 'Failed to get session' };
  }
});
