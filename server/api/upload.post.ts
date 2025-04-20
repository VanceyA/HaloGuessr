import { defineEventHandler, readMultipartFormData } from 'h3'
import { put } from '@vercel/blob'
import { nanoid } from 'nanoid'

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
    const screenshotBlob = await put(`screenshots/${id}_${screenshotFile.filename}`, screenshotFile.data, {
      access: 'public'
    })
    const mapBlob = await put(`maps/${id}_${mapFile.filename}`, mapFile.data, {
      access: 'public'
    })
    const metadata = {
      id,
      screenshotPath: screenshotBlob.url,
      mapPath: mapBlob.url,
      mapName,
      location: { x: parseFloat(x), y: parseFloat(y) }
    }
    // Note: Cannot write to screenshots.json at runtime on Vercel
    return {
      success: true,
      id,
      metadata,
      warning: 'Metadata not saved. Manually add the following to data/screenshots.json and redeploy:\n' + JSON.stringify(metadata, null, 2)
    }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to upload' }
  }
})