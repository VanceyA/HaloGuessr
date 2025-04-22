import { defineEventHandler, getQuery } from 'h3'
import { Redis } from '@upstash/redis'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const excludeId = typeof query.exclude === 'string' ? query.exclude : undefined

    const config = useRuntimeConfig()
    const redis = new Redis({
      url: config.upstashRedisUrl,
      token: config.upstashRedisToken
    })
    
    const keys = await redis.keys('screenshot:*')
    if (keys.length === 0) {
      return { error: 'No screenshots available' }
    }
    
    // Filter out the current ID if provided
    let availableKeys = keys
    if (excludeId) {
      availableKeys = keys.filter(key => excludeId && !key.includes(excludeId))
      
      // If we've gone through all screenshots, just use all of them again
      if (availableKeys.length === 0) {
        availableKeys = keys
      }
    }
    
    const randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)]
    const screenshot = await redis.get(randomKey) as {
      id: string
      screenshotPath: string
      mapPath: string
      mapName: string
    }
    
    if (!screenshot) {
      return { error: 'Screenshot not found' }
    }
    
    return {
      id: screenshot.id,
      screenshotPath: screenshot.screenshotPath,
      mapPath: screenshot.mapPath,
      mapName: screenshot.mapName
    }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to fetch screenshot' }
  }
})
