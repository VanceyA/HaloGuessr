import { defineEventHandler, readBody } from 'h3'
import fs from 'fs/promises'
import path from 'path'

const dataPath = path.join(process.cwd(), 'server/data/screenshots.json')

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id, guess } = body // guess: { x: percentage, y: percentage }
    const data = await fs.readFile(dataPath, 'utf8')
    const screenshots = JSON.parse(data)
    const screenshot = screenshots.find((s: { id: any }) => s.id === id)
    if (!screenshot) {
      return { error: 'Screenshot not found' }
    }
    const distance = Math.sqrt(
      Math.pow(guess.x - screenshot.location.x, 2) +
      Math.pow(guess.y - screenshot.location.y, 2)
    )
    const maxDistance = 50 // Max distance in percentage units (e.g., 50% of image)
    const score = Math.max(0, Math.floor(1000 * (1 - distance / maxDistance)))
    return {
      score,
      correctLocation: screenshot.location, // { x: percentage, y: percentage }
      mapName: screenshot.mapName
    }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to process guess' }
  }
})