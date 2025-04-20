import { defineEventHandler, readMultipartFormData } from 'h3'
import fs from 'fs/promises'
import path from 'path'
import { nanoid } from 'nanoid'

const screenshotsDir = path.join(process.cwd(), 'public/screenshots')
const mapsDir = path.join(process.cwd(), 'public/maps')
const dataPath = path.join(process.cwd(), 'server/data/screenshots.json')

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    if (!formData) {
      return { error: 'No form data' }
    }
    let mapName = ''
    let x = ''
    let y = ''
    let screenshotFile = null
    let mapFile = null
    for (const field of formData) {
      if (field.name === 'mapName') mapName = field.data.toString()
      if (field.name === 'x') x = field.data.toString()
      if (field.name === 'y') y = field.data.toString()
      if (field.name === 'screenshot') screenshotFile = field
      if (field.name === 'mapImage') mapFile = field
    }
    if (!mapName || !x || !y || !screenshotFile || !mapFile) {
      return { error: 'Missing required fields' }
    }
    const id = nanoid()
    const screenshotExt = path.extname(screenshotFile.filename || '')
    const mapExt = path.extname(mapFile.filename || '')
    const screenshotName = `${id}_screenshot${screenshotExt}`
    const mapNameFile = `${id}_map${mapExt}`
    const screenshotPath = path.join(screenshotsDir, screenshotName)
    const mapPath = path.join(mapsDir, mapNameFile)
    await fs.writeFile(screenshotPath, screenshotFile.data)
    await fs.writeFile(mapPath, mapFile.data)
    const data = await fs.readFile(dataPath, 'utf8')
    const screenshots = JSON.parse(data)
    screenshots.push({
      id,
      screenshotPath: `/screenshots/${screenshotName}`,
      mapPath: `/maps/${mapNameFile}`,
      mapName,
      location: { x: parseFloat(x), y: parseFloat(y) } // Store as percentages
    })
    await fs.writeFile(dataPath, JSON.stringify(screenshots, null, 2))
    return { success: true, id }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to upload' }
  }
})