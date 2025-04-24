import { defineEventHandler, readBody } from 'h3'
import { Redis } from '@upstash/redis'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const redis = new Redis({
      url: config.upstashRedisUrl,
      token: config.upstashRedisToken
    })
    const body = await readBody(event)
    const { id, guess } = body
    const screenshot = await redis.get(`screenshot:${id}`) as {
      id: string
      screenshotPath: string
      mapPath: string
      mapName: string
      location: {
        x: number
        y: number
      }
    }
    if (!screenshot) {
      return { error: 'Screenshot not found' }
    }
    const distance = Math.sqrt(
      Math.pow(guess.x - screenshot.location.x, 2) +
      Math.pow(guess.y - screenshot.location.y, 2)
    )
    
    // Perfect score radius (units within which score is 1000)
    const perfectRadius = 3
    
    // Maximum distance at which points can be earned
    const maxDistance = 50
    
    let score
    if (distance <= perfectRadius) {
      // Perfect score within the small radius
      score = 1000
    } else {
      // Quadratic drop-off outside the perfect radius for faster decrease
      // Adjusted to ensure score = 0 at maxDistance
      const normalizedDistance = (distance - perfectRadius) / (maxDistance - perfectRadius)
      score = Math.max(0, Math.floor(1000 * (1 - Math.pow(normalizedDistance, 2))))
    }
    
    return {
      score,
      correctLocation: screenshot.location,
      mapName: screenshot.mapName
    }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to process guess' }
  }
})
