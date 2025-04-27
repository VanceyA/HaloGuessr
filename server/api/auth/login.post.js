import { defineEventHandler, readBody, setCookie } from 'h3'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { password } = body
    
    if (!password) {
      return { error: 'Password is required' }
    }
    
    const config = useRuntimeConfig()
    const adminPassword = config.adminPassword
    
    console.log('Login attempt, checking password...')
    
    // Validate password
    if (password !== adminPassword) {
      console.log('Invalid password provided')
      return { error: 'Invalid password' }
    }
    
    console.log('Password valid, creating token...')
    
    // Create a signed JWT token
    const token = jwt.sign(
      { admin: true, timestamp: Date.now() },
      config.jwtSecret || 'fallback-secret',
      { expiresIn: '7d' } // Token expires in 7 days
    )
    
    console.log('Setting admin-token cookie...')
    
    // Set cookie with the token - with extra debug options
    setCookie(event, 'admin-token', token, {
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
      httpOnly: false, // Set to false for debugging
      sameSite: 'lax', // Changed from 'strict' to improve cross-site behavior
      secure: false // Set to false for local development
    })
    
    console.log('Cookie set, returning success')
    
    return { success: true, token: token } // Return the token for debugging
  } catch (error) {
    console.error('Auth login error:', error)
    return { error: 'Authentication failed: ' + error.message }
  }
})
