import { defineEventHandler, readBody } from 'h3'
import { Redis } from '@upstash/redis'
import verifyAdmin from '../../utils/verifyAdmin'

export default defineEventHandler(async (event) => {
  // Verify admin authentication
  if (!verifyAdmin(event)) {
    return { error: 'Unauthorized', status: 401 }
  }
  
  try {
    const id = event.context.params.id
    if (!id) {
      return { error: 'No ID provided' }
    }
    
    const body = await readBody(event)
    if (!body.mapName || !body.levelName || !body.gameMode || !body.haloGame || !body.location) {
      return { error: 'Missing required fields' }
    }
    
    const config = useRuntimeConfig()
    const redis = new Redis({
      url: config.upstashRedisUrl,
      token: config.upstashRedisToken
    })
    
    // Get the existing data first
    const existingData = await redis.get(`screenshot:${id}`)
    if (!existingData) {
      return { error: 'Screenshot not found' }
    }
    
    // Update only the fields that can change, preserve the rest
    const updatedData = {
      ...existingData,
      mapName: body.mapName,
      levelName: body.levelName,
      gameMode: body.gameMode,
      haloGame: body.haloGame,
      location: body.location
    }
    
    await redis.set(`screenshot:${id}`, updatedData)
    
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to update screenshot' }
  }
})
