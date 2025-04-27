import jwt from 'jsonwebtoken'
import { getCookie } from 'h3'

export default function verifyAdmin(event) {
  try {
    const config = useRuntimeConfig()
    const token = getCookie(event, 'admin-token')
    
    if (!token) {
      return false
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, config.jwtSecret)
    
    // Check if the token has admin claim
    if (!decoded || !decoded.admin) {
      return false
    }
    
    return true
  } catch (error) {
    console.error('Admin verification error:', error)
    return false
  }
}
