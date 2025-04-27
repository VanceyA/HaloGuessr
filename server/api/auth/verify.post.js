import { defineEventHandler, readBody, getCookie } from 'h3'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    console.log('Verify endpoint called')
    
    // Get token from the request body or from the cookie
    const body = await readBody(event) || {}
    const tokenFromBody = body.token
    const tokenFromCookie = getCookie(event, 'admin-token')
    
    const token = tokenFromBody || tokenFromCookie
    
    console.log('Token from body exists:', !!tokenFromBody)
    console.log('Token from cookie exists:', !!tokenFromCookie)
    
    if (!token) {
      console.log('No token found')
      return { valid: false }
    }
    
    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret || 'fallback-secret'
    
    // Verify JWT token
    console.log('Verifying JWT token...')
    try {
      const decoded = jwt.verify(token, jwtSecret)
      
      // Check if the token has admin claim
      if (!decoded || !decoded.admin) {
        console.log('Token missing admin claim')
        return { valid: false }
      }
      
      console.log('Token valid')
      return { valid: true }
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message)
      return { valid: false, error: jwtError.message }
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return { valid: false, error: error.message }
  }
})
