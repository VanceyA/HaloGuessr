import { defineEventHandler } from 'h3'
import { Redis } from '@upstash/redis'

export default defineEventHandler(async () => {
  try {
    const config = useRuntimeConfig()
    console.log('Upstash Redis URL:', config.upstashRedisUrl)
    const redis = new Redis({
      url: config.upstashRedisUrl,
      token: config.upstashRedisToken
    })
    const keys = await redis.keys('screenshot:*')
    if (keys.length === 0) {
      return { error: 'No screenshots available' }
    }
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    const screenshotStr = await redis.get(randomKey) as string
    if (!screenshotStr) {
      return { error: 'Screenshot not found' }
    }
    const screenshot = JSON.parse(screenshotStr as string)
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