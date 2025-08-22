// server/api/admin/maps/list.get.ts
import { defineEventHandler } from 'h3'
import { useSupabase } from '@/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = useSupabase()

    const { data: maps, error } = await supabase
      .from('maps')
      .select('id, name, halo_game, game_mode, image_path')
      .order('halo_game', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching maps:', error)
      return { error: 'Failed to fetch maps' }
    }

    return { maps: maps || [] }
  } catch (error) {
    console.error('Failed to fetch maps:', error)
    return { error: 'Failed to fetch maps' }
  }
})
