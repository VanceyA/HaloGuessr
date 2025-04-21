import { defineEventHandler } from 'h3'
import { Redis } from '@upstash/redis'

export default defineEventHandler(async () => {
  try {
    const config = useRuntimeConfig()
    const redis = new Redis({
      url: config.upstashRedisUrl,
      token: config.upstashRedisToken
    })
    const keys = await redis.keys('screenshot:*')
    if (keys.length === 0) {
      return { error: 'No screenshots available' }
    }
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
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