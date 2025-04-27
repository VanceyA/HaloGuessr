export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware if not on client-side
  if (process.server) return
  
  // Skip if already on auth page to prevent redirect loops
  if (to.path.startsWith('/admin/auth')) return
  
  // Add debugging
  console.log('Admin middleware running for path:', to.fullPath)
  
  // Check if the admin token exists in cookies
  const adminToken = useCookie('admin-token').value
  console.log('Token exists:', !!adminToken)
  
  if (!adminToken) {
    console.log('No token found, redirecting to auth')
    // No token found, redirect to auth page with return URL
    return navigateTo(`/admin/auth?redirect=${encodeURIComponent(to.fullPath)}`)
  }
  
  // Verify the token is valid
  try {
    console.log('Verifying token...')
    const { valid } = await $fetch('/api/auth/verify', {
      method: 'POST',
      body: { token: adminToken }
    })
    
    console.log('Token verification result:', valid)
    
    if (!valid) {
      console.log('Invalid token, redirecting to auth')
      // Invalid token, redirect to auth page
      useCookie('admin-token').value = null
      return navigateTo(`/admin/auth?redirect=${encodeURIComponent(to.fullPath)}`)
    }
    
    console.log('Token valid, continuing to page')
  } catch (error) {
    console.error('Auth verification failed:', error)
    // Error checking token, redirect to auth page
    useCookie('admin-token').value = null
    return navigateTo(`/admin/auth?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
