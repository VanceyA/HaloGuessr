// server/api/admin/maps/create.post.ts
import { defineEventHandler, readMultipartFormData } from 'h3'
import verifyAdmin from '../../../utils/verifyAdmin'
import { useSupabase } from '../../../utils/supabase'
import { put } from '@vercel/blob'

export default defineEventHandler(async (event) => {
  // Verify admin authentication
  if (!verifyAdmin(event)) {
    return { error: 'Unauthorized', status: 401 }
  }

  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData) {
      return { error: 'No form data received' }
    }

    // Extract form fields
    const mapImageFile = formData.find(field => field.name === 'mapImage')
    const name = formData.find(field => field.name === 'name')?.data?.toString()
    const haloGame = formData.find(field => field.name === 'haloGame')?.data?.toString()
    const gameMode = formData.find(field => field.name === 'gameMode')?.data?.toString()
    const description = formData.find(field => field.name === 'description')?.data?.toString()

    // Validate required fields
    if (!mapImageFile || !name || !haloGame || !gameMode) {
      return { error: 'Missing required fields: mapImage, name, haloGame, gameMode' }
    }

    // Upload map image to blob storage
    const mapImageBlob = await put(`maps/${Date.now()}-${mapImageFile.filename}`, mapImageFile.data, {
      access: 'public'
    })

    const supabase = useSupabase()

    // Create map record
    const { data: map, error } = await supabase
      .from('maps')
      .insert({
        name: name.trim(),
        image_path: mapImageBlob.url,
        halo_game: haloGame.trim(),
        game_mode: gameMode.trim(),
        description: description?.trim() || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating map:', error)
      return { error: 'Failed to create map' }
    }

    return { success: true, map }
  } catch (error) {
    console.error('Create map error:', error)
    return { error: 'Failed to create map' }
  }
})
