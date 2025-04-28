// server/api/guess.post.ts
import { defineEventHandler, readBody } from 'h3'
import { useSupabase } from '../utils/supabase'; // Your Supabase client helper

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id, guess } = body

    if (!id || !guess || typeof guess.x !== 'number' || typeof guess.y !== 'number') {
        return { error: 'Missing or invalid input parameters' };
    }

    const supabase = useSupabase(); // Get Supabase client

    // *** Replace redis.get with Supabase select ***
    // Fetch the level from Supabase using the provided ID
    const { data: level, error } = await supabase
      .from('levels') // Your table name
      .select('location, mapName') // Select only necessary fields for the guess logic and response
      .eq('id', id) // Filter by the level ID
      .single(); // Expecting only one result

    if (error || !level) {
      console.error("Error fetching level for guess:", error);
      // Supabase single() will return an error if no row is found or multiple are found
      // You might differentiate 'not found' errors if needed, but a generic error is fine.
      return { error: 'Level not found' }
    }

    // Check if location data is valid (paranoia check for JSONB structure)
     const correctLocation = level.location;
     if (!correctLocation || typeof correctLocation.x !== 'number' || typeof correctLocation.y !== 'number') {
         console.error("Fetched level has invalid location data:", correctLocation, "for ID:", id);
         return { error: 'Internal error: Level location data is invalid.' };
     }

    // Location calculation logic (keep as is)
    const distance = Math.sqrt(
      Math.pow(guess.x - correctLocation.x, 2) +
      Math.pow(guess.y - correctLocation.y, 2)
    )

    // Score calculation logic (keep as is)
    const perfectRadius = 3
    const maxDistance = 50

    let score
    if (distance <= perfectRadius) {
      score = 1000
    } else if (distance > maxDistance) {
        score = 0;
    } else {
      const normalizedDistance = (distance - perfectRadius) / (maxDistance - perfectRadius)
      score = Math.max(0, Math.floor(1000 * (1 - Math.pow(normalizedDistance, 2))))
    }

    return {
      score,
      correctLocation: correctLocation, // Return the location from the DB
      mapName: level.mapName // Return the mapName from the DB
    }
  } catch (error) {
    console.error('Guess processing failed:', error)
    return { error: 'Failed to process guess' }
  }
})
