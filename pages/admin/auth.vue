<template>
  <div class="min-h-screen bg-gradient-to-b from-halo-dark to-black text-gray-200 flex flex-col p-4 md:p-8">
    <!-- Header with Logo -->
    <header class="mb-6 md:mb-8">
      <div class="flex items-center">
        <!-- Logo Section -->
        <div class="flex items-center space-x-2">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-3">
            <path d="M24 6L8 12V24C8 32.8 14.4 41.2 24 44C33.6 41.2 40 32.8 40 24V12L24 6Z" fill="url(#paint0_linear)" />
            <defs>
              <linearGradient id="paint0_linear" x1="24" y1="6" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                <stop stop-color="#7bf442" />
                <stop offset="1" stop-color="#52b2bf" />
              </linearGradient>
            </defs>
          </svg>
          
          <div>
            <h1 class="text-3xl font-light tracking-wider">
              <span class="font-bold text-white">HALO</span>
              <span class="text-blue-400 opacity-90">GUESSR</span>
            </h1>
            <div class="h-0.5 w-full bg-gradient-to-r from-halo-green to-blue-400 rounded"></div>
          </div>
        </div>
      </div>
    </header>

    <div class="w-full max-w-md mx-auto bg-halo-gray/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden mt-8">
      <div class="p-6 md:p-8">
        <h2 class="text-2xl font-light text-blue-300 mb-6 text-center">Admin Authentication</h2>
        
        <div v-if="authError" class="mb-6 p-4 bg-red-900/40 text-red-300 rounded-lg text-center">
          {{ authError }}
        </div>
        
        <form @submit.prevent="authenticate" class="space-y-6">
          <div>
            <label class="block text-blue-300 mb-2 font-medium">Admin Password</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="Enter admin password" 
              class="w-full px-4 py-3 bg-halo-dark/70 border border-blue-400/50 focus:border-halo-green rounded-lg outline-none focus:ring-1 focus:ring-halo-green text-white"
              required
            />
          </div>
          
          <button 
            type="submit"
            class="w-full bg-halo-blue hover:bg-blue-700 text-halo-green font-bold py-3 px-6 rounded-md
                  transition-all duration-200 flex items-center justify-center"
            :disabled="isAuthenticating"
          >
            <svg v-if="isAuthenticating" class="animate-spin -ml-1 mr-3 h-5 w-5 text-halo-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isAuthenticating ? 'AUTHENTICATING...' : 'AUTHENTICATE' }}</span>
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-blue-400 hover:text-halo-green transition-colors">
            Return to Homepage
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// We're removing the client-only middleware as it's not defined
// This page doesn't need middleware since it's for authentication

const route = useRoute()
const router = useRouter()
const redirectUrl = ref('/admin/levels')

onMounted(() => {
  // Set redirect URL after component is mounted to avoid SSR mismatch
  redirectUrl.value = route.query.redirect || '/admin/levels'
})

const password = ref('')
const authError = ref('')
const isAuthenticating = ref(false)

const authenticate = async () => {
  if (!password.value) {
    authError.value = 'Password is required'
    return
  }
  
  isAuthenticating.value = true
  authError.value = ''
  
  try {
    console.log('Sending authentication request...')
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { password: password.value }
    })
    
    console.log('Auth response:', response)
    
    if (response.success) {
      console.log('Authentication successful, redirecting to:', redirectUrl.value)
      
      // Manually set the cookie in case the server cookie isn't working
      if (response.token) {
        useCookie('admin-token').value = response.token
      }
      
      // Force a small delay to ensure cookie is set
      setTimeout(() => {
        window.location.href = redirectUrl.value
      }, 300)
    } else {
      authError.value = response.error || 'Authentication failed'
    }
  } catch (error) {
    console.error('Authentication error:', error)
    authError.value = 'Authentication failed. Please try again.'
  } finally {
    isAuthenticating.value = false
  }
}

</script>
