<template>
  <div class="min-h-screen bg-gradient-to-b from-halo-dark to-black text-gray-200 flex flex-col p-4 md:p-8">
    <!-- Modern Header with Consistent Logo -->
    <header class="mb-6 md:mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <!-- Logo Section -->
        <div class="flex items-center space-x-2">
          <div class="flex items-center">
            <!-- Halo-inspired shield icon -->
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
        
        <div class="mt-3 md:mt-0">
          <span class="text-sm text-gray-400 bg-halo-gray/50 py-1.5 px-4 rounded-full uppercase tracking-wider">
            Admin: Manage Levels
          </span>
        </div>
      </div>
    </header>

    <div class="w-full max-w-6xl mx-auto bg-halo-gray/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
      <div class="p-6 md:p-8">
        <!-- Header with Actions -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-light text-blue-300">All Levels</h2>
          <NuxtLink 
            to="/upload" 
            class="bg-halo-blue hover:bg-blue-700 text-halo-green font-bold py-2 px-4 rounded
                  transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            <span>ADD NEW LEVEL</span>
          </NuxtLink>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-halo-green mb-4"></div>
          <p class="text-lg text-blue-300">Loading level data...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="bg-red-900/30 text-red-300 p-4 rounded-lg text-center">
          {{ error }}
        </div>
        
        <!-- No Levels Found -->
        <div v-else-if="!levels.length" class="bg-halo-gray/20 rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <h3 class="text-xl text-blue-300 mb-2">No Levels Found</h3>
          <p class="text-gray-400 mb-6">Start by uploading some Halo locations.</p>
          <NuxtLink 
            to="/upload" 
            class="bg-halo-blue hover:bg-blue-700 text-white font-bold py-2 px-6 rounded inline-flex items-center"
          >
            <span>Upload Now</span>
          </NuxtLink>
        </div>
        
        <!-- Levels Table -->
        <div v-else class="overflow-hidden rounded-lg border border-blue-400/30">
          <table class="min-w-full divide-y divide-blue-400/30">
            <thead class="bg-halo-dark">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Level Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Map Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Game
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Mode
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-halo-gray/10 divide-y divide-blue-400/30">
              <tr v-for="level in levels" :key="level.id" class="hover:bg-halo-blue/10 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {{ level.levelName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ level.mapName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ level.haloGame }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-green-900/50 text-green-300': level.gameMode === 'Multiplayer',
                      'bg-blue-900/50 text-blue-300': level.gameMode === 'Campaign',
                      'bg-orange-900/50 text-orange-300': level.gameMode === 'Firefight',
                    }"
                  >
                    {{ level.gameMode }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <NuxtLink 
                    :to="`/admin/levels/edit/${level.id}`" 
                    class="text-blue-400 hover:text-halo-green transition-colors"
                  >
                    Edit
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const levels = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await $fetch('/api/screenshots/list')
    
    // Check if response is an array (success) or has error property
    if (Array.isArray(response)) {
      // Sort by level name 
      levels.value = response.sort((a, b) => a.mapName?.localeCompare(b.mapName) || 0)
    } else if (response.error) {
      error.value = response.details 
        ? `${response.error}: ${response.details}` 
        : response.error
      console.error('API Error:', response)
    }
  } catch (err) {
    console.error('Request failed:', err)
    error.value = 'Failed to load levels. Please try again.'
  } finally {
    loading.value = false
  }
})
</script>
