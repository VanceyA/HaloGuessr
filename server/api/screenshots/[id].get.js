import { defineEventHandler } from 'h3'
import { Redis } from '@upstash/redis'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id
    if (!id) {
      return { error: 'No ID provided' }
    }
    
    const config = useRuntimeConfig()
    const redis = new Redis({
      url: config.upstashRedisUrl,
      token: config.upstashRedisToken
    })
    
    const screenshot = await redis.get(`screenshot:${id}`)
    if (!screenshot) {
      return { error: 'Screenshot not found' }
    }
    
    // Ensure location has both x and y properties
    if (screenshot.location) {
      if (typeof screenshot.location.x !== 'number') {
        screenshot.location.x = 0;
      }
      if (typeof screenshot.location.y !== 'number') {
        screenshot.location.y = 0;
      }
    } else {
      screenshot.location = { x: 0, y: 0 };
    }
    
    return screenshot
  } catch (error) {
    console.error(error)
    return { error: 'Failed to fetch screenshot' }
  }
})
