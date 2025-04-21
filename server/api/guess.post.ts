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
    const maxDistance = 50
    const score = Math.max(0, Math.floor(1000 * (1 - distance / maxDistance)))
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