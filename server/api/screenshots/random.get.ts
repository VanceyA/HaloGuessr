import { defineEventHandler } from 'h3'
import fs from 'fs/promises'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data/screenshots.json')

export default defineEventHandler(async () => {
  try {
    const data = await fs.readFile(dataPath, 'utf8')
    const screenshots = JSON.parse(data)
    if (screenshots.length === 0) {
      return { error: 'No screenshots available' }
    }
    const randomIndex = Math.floor(Math.random() * screenshots.length)
    const screenshot = screenshots[randomIndex]
    return {
      id: screenshot.id,
      screenshotPath: screenshot.screenshotPath, // Vercel Blob URL
      mapPath: screenshot.mapPath, // Vercel Blob URL
      mapName: screenshot.mapName
    }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to fetch screenshot' }
  }
})