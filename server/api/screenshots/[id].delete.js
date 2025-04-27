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
    
    const config = useRuntimeConfig()
    const redis = new Redis({
      url: config.upstashRedisUrl,
      token: config.upstashRedisToken
    })
    
    // Check if the screenshot exists
    const exists = await redis.exists(`screenshot:${id}`)
    if (!exists) {
      return { error: 'Screenshot not found' }
    }
    
    // Delete the screenshot
    await redis.del(`screenshot:${id}`)
    
    return { success: true, message: 'Screenshot deleted successfully' }
  } catch (error) {
    console.error('Delete screenshot error:', error)
    return { error: 'Failed to delete screenshot' }
  }
})
