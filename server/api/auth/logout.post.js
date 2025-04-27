import { defineEventHandler } from 'h3'
import { deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
  // Delete the admin token cookie
  deleteCookie(event, 'admin-token', {
    path: '/',
    httpOnly: true
  })
  
  return { success: true }
})
