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
        
        <div class="mt-3 md:mt-0 flex space-x-3">
          <span class="text-sm text-gray-400 bg-halo-gray/50 py-1.5 px-4 rounded-full uppercase tracking-wider">
            Admin: Manage Levels
          </span>
          <button 
            @click="logout" 
            class="text-sm text-red-400 bg-halo-gray/50 py-1.5 px-4 rounded-full uppercase tracking-wider hover:bg-halo-gray/70 transition-colors"
          >
            Logout
          </button>
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
        
        <!-- Search and Filters Section -->
        <div class="mb-6 space-y-4">
          <!-- Search Box -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search levels..." 
              class="w-full pl-10 pr-4 py-2 bg-halo-dark/70 border border-blue-400/50 focus:border-halo-green rounded-lg outline-none focus:ring-1 focus:ring-halo-green text-white"
            />
          </div>
          
          <!-- Filters -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Map Filter -->
            <div>
              <label class="block text-blue-300 text-sm mb-1">Map Name</label>
              <select 
                v-model="selectedMap" 
                class="w-full px-3 py-2 bg-halo-dark/70 border border-blue-400/50 focus:border-halo-green rounded-lg outline-none focus:ring-1 focus:ring-halo-green text-white appearance-none"
              >
                <option value="">All Maps</option>
                <option v-for="map in uniqueMaps" :key="map" :value="map">{{ map }}</option>
              </select>
            </div>
            
            <!-- Game Filter -->
            <div>
              <label class="block text-blue-300 text-sm mb-1">Halo Game</label>
              <select 
                v-model="selectedGame" 
                class="w-full px-3 py-2 bg-halo-dark/70 border border-blue-400/50 focus:border-halo-green rounded-lg outline-none focus:ring-1 focus:ring-halo-green text-white appearance-none"
              >
                <option value="">All Games</option>
                <option v-for="game in uniqueGames" :key="game" :value="game">{{ game }}</option>
              </select>
            </div>
            
            <!-- Mode Filter -->
            <div>
              <label class="block text-blue-300 text-sm mb-1">Game Mode</label>
              <select 
                v-model="selectedMode" 
                class="w-full px-3 py-2 bg-halo-dark/70 border border-blue-400/50 focus:border-halo-green rounded-lg outline-none focus:ring-1 focus:ring-halo-green text-white appearance-none"
              >
                <option value="">All Modes</option>
                <option v-for="mode in uniqueModes" :key="mode" :value="mode">{{ mode }}</option>
              </select>
            </div>
          </div>
          
          <!-- Filter Stats & Reset Button -->
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-400">
              Showing {{ filteredLevels.length }} of {{ levels.length }} levels
            </div>
            <button 
              v-if="isFiltered" 
              @click="resetFilters" 
              class="text-blue-400 hover:text-halo-green transition-colors text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
          </div>
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
        
        <!-- No Results After Filtering -->
        <div v-else-if="levels.length && !filteredLevels.length" class="bg-halo-gray/20 rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="text-xl text-blue-300 mb-2">No Matching Levels</h3>
          <p class="text-gray-400 mb-6">Try adjusting your search or filters.</p>
          <button 
            @click="resetFilters" 
            class="bg-halo-blue hover:bg-blue-700 text-white font-bold py-2 px-6 rounded inline-flex items-center"
          >
            <span>Reset Filters</span>
          </button>
        </div>
        
        <!-- Levels Table -->
        <div v-else-if="filteredLevels.length" class="overflow-hidden rounded-lg border border-blue-400/30">
          <table class="min-w-full divide-y divide-blue-400/30">
            <thead class="bg-halo-dark">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Id
                </th>
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
              <tr v-for="level in filteredLevels" :key="level.id" class="hover:bg-halo-blue/10 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {{ level.id }}
                </td>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Use the admin middleware
definePageMeta({
  middleware: ['admin']
})

const router = useRouter()
const levels = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const selectedMap = ref('')
const selectedGame = ref('')
const selectedMode = ref('')

// Add logout function
const logout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    // Clear the token from cookie (though the backend already did this)
    useCookie('admin-token').value = null
    // Redirect to home page
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Extract unique values for filters
const uniqueMaps = computed(() => {
  const maps = [...new Set(levels.value.map(level => level.mapName).filter(Boolean))]
  return maps.sort()
})

const uniqueGames = computed(() => {
  const games = [...new Set(levels.value.map(level => level.haloGame).filter(Boolean))]
  return games.sort()
})

const uniqueModes = computed(() => {
  const modes = [...new Set(levels.value.map(level => level.gameMode).filter(Boolean))]
  return modes.sort()
})

// Check if any filters are applied
const isFiltered = computed(() => {
  return searchQuery.value !== '' || selectedMap.value !== '' || 
         selectedGame.value !== '' || selectedMode.value !== ''
})

// Filter levels based on search and filters
const filteredLevels = computed(() => {
  return levels.value.filter(level => {
    // Search across all fields
    const searchMatches = !searchQuery.value || 
      Object.values(level).some(value => 
        value && value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    
    // Apply filters
    const mapMatches = !selectedMap.value || level.mapName === selectedMap.value
    const gameMatches = !selectedGame.value || level.haloGame === selectedGame.value
    const modeMatches = !selectedMode.value || level.gameMode === selectedMode.value
    
    return searchMatches && mapMatches && gameMatches && modeMatches
  })
})

// Reset all filters
const resetFilters = () => {
  searchQuery.value = ''
  selectedMap.value = ''
  selectedGame.value = ''
  selectedMode.value = ''
}

onMounted(async () => {
  console.log('Admin levels page mounted, fetching data...')
  try {
    console.log('Calling screenshots list API...')
    const response = await $fetch('/api/admin/levels/list')
    console.log('API response received:', response)
    
    // Check if response is an array (success) or has error property
    if (Array.isArray(response)) {
      // Sort by level name 
      levels.value = response.sort((a, b) => a.mapName?.localeCompare(b.mapName) || 0)
      console.log('Levels loaded:', levels.value.length)
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
