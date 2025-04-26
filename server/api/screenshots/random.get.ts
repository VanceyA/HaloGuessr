// server/api/getScreenshot.ts
import { defineEventHandler, getQuery, getCookie, setCookie } from 'h3'
import { Redis } from '@upstash/redis'
import { nanoid } from 'nanoid'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const redis = new Redis({
      url: config.upstashRedisUrl,
      token: config.upstashRedisToken,
    })

    // 1) Get or create a sessionId cookie
    let sessionId = getCookie(event, 'sessionId')
    if (!sessionId) {
      sessionId = nanoid()
      // set for 30 days
      setCookie(event, 'sessionId', sessionId, {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })
    }

    // 2) Fetch last 10 seen IDs
    const recentKey = `recent:${sessionId}`
    const recentIds: string[] = await redis.lrange(recentKey, 0, -1)

    // 3) Fetch all screenshot keys
    let keys = await redis.keys('screenshot:*')
    if (keys.length === 0) {
      return { error: 'No screenshots available' }
    }

    // 4) Exclude recently seen
    let available = keys.filter((key) => {
      // key = "screenshot:XYZ", extract "XYZ"
      const id = key.split(':', 2)[1]
      return !recentIds.includes(id)
    })

    // If we filtered out everything, let them see all again
    if (available.length === 0) {
      available = keys
    }

    // 5) Pick one at random
    const randomKey = available[Math.floor(Math.random() * available.length)]
    const shot = await redis.get(randomKey) as {
      id: string
      screenshotPath: string
      mapPath: string
      mapName: string
    }
    if (!shot) {
      return { error: 'Screenshot not found' }
    }

    // 6) Push this ID onto their recent list, keep only 10
    await redis.lpush(recentKey, shot.id)
    await redis.ltrim(recentKey, 0, 9)

    return {
      id: shot.id,
      screenshotPath: shot.screenshotPath,
      mapPath: shot.mapPath,
      mapName: shot.mapName,
    }
  } catch (err) {
    console.error(err)
    return { error: 'Failed to fetch screenshot' }
  }
})
