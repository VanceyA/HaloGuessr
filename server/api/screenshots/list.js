import { defineEventHandler } from 'h3'
import { Redis } from '@upstash/redis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Check if Redis credentials are available
  if (!config.upstashRedisUrl || !config.upstashRedisToken) {
    console.error('Missing Redis credentials in runtime config')
    return { error: 'Server configuration error (missing Redis credentials)' }
  }
  
  try {
    const redis = new Redis({
      url: config.upstashRedisUrl,
      token: config.upstashRedisToken
    })
    
    // Test the connection
    await redis.ping()
    
    // Get all keys
    const keys = await redis.keys('screenshot:*')
    console.log(`Found ${keys.length} screenshot keys`)
    
    if (keys.length === 0) {
      return []
    }
    
    // Get all screenshot data in parallel
    const screenshots = await Promise.all(
      keys.map(async (key) => {
        try {
          return await redis.get(key)
        } catch (err) {
          console.error(`Error fetching data for key ${key}:`, err)
          return null
        }
      })
    )
    
    const validScreenshots = screenshots.filter(Boolean)
    console.log(`Retrieved ${validScreenshots.length} valid screenshots`)
    
    return validScreenshots
  } catch (error) {
    console.error('Redis operation failed:', error.message)
    if (error.cause) {
      console.error('Underlying cause:', error.cause)
    }
    
    // Return a more detailed error message
    return { 
      error: 'Failed to fetch screenshots', 
      details: error.message
    }
  }
})
