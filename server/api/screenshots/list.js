import { defineEventHandler } from 'h3'
import { Redis } from '@upstash/redis'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const redis = new Redis({
      url: config.upstashRedisUrl,
      token: config.upstashRedisToken
    })
    
    const keys = await redis.keys('screenshot:*')
    if (keys.length === 0) {
      return []
    }
    
    // Get all screenshot data in parallel
    const screenshots = await Promise.all(
      keys.map(key => redis.get(key))
    )
    
    return screenshots.filter(Boolean) // Remove any null values
  } catch (error) {
    console.error(error)
    return { error: 'Failed to fetch screenshots' }
  }
})
