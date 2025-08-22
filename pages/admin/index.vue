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
          <NuxtLink 
            to="/" 
            class="text-sm text-gray-400 bg-halo-gray/50 py-1.5 px-4 rounded-full uppercase tracking-wider hover:bg-halo-gray/70 transition-colors"
          >
            Back to Game
          </NuxtLink>
          <span class="text-sm text-gray-400 bg-halo-gray/50 py-1.5 px-4 rounded-full uppercase tracking-wider">
            Admin Dashboard
          </span>
        </div>
      </div>
    </header>

    <!-- Dashboard Content -->
    <div class="w-full max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-light text-blue-300 mb-2">Admin Dashboard</h2>
        <p class="text-gray-400">Manage your HaloGuessr content</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="bg-halo-gray/30 backdrop-blur-sm rounded-lg p-6 border border-blue-400/30">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-white mb-1">Total Levels</h3>
              <p class="text-2xl font-bold text-halo-green">{{ stats.levels }}</p>
            </div>
            <div class="bg-halo-blue/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-halo-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-halo-gray/30 backdrop-blur-sm rounded-lg p-6 border border-blue-400/30">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-white mb-1">Total Maps</h3>
              <p class="text-2xl font-bold text-halo-green">{{ stats.maps }}</p>
            </div>
            <div class="bg-halo-blue/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-halo-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Actions -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Levels Management -->
        <NuxtLink 
          to="/admin/levels"
          class="group bg-halo-gray/30 backdrop-blur-sm rounded-lg p-6 border border-blue-400/30 hover:border-halo-green/50 transition-all duration-200 hover:scale-105"
        >
          <div class="text-center">
            <div class="bg-halo-blue/20 group-hover:bg-halo-blue/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-halo-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-white mb-2 group-hover:text-halo-green transition-colors">Manage Levels</h3>
            <p class="text-sm text-gray-400">View, edit, and delete game levels</p>
          </div>
        </NuxtLink>

        <!-- Maps Management -->
        <NuxtLink 
          to="/admin/maps"
          class="group bg-halo-gray/30 backdrop-blur-sm rounded-lg p-6 border border-blue-400/30 hover:border-halo-green/50 transition-all duration-200 hover:scale-105"
        >
          <div class="text-center">
            <div class="bg-halo-blue/20 group-hover:bg-halo-blue/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-halo-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-white mb-2 group-hover:text-halo-green transition-colors">Manage Maps</h3>
            <p class="text-sm text-gray-400">Create and manage game maps</p>
          </div>
        </NuxtLink>

        <!-- Create Level -->
        <NuxtLink 
          to="/upload"
          class="group bg-halo-gray/30 backdrop-blur-sm rounded-lg p-6 border border-blue-400/30 hover:border-halo-green/50 transition-all duration-200 hover:scale-105"
        >
          <div class="text-center">
            <div class="bg-halo-green/20 group-hover:bg-halo-green/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-halo-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-white mb-2 group-hover:text-halo-green transition-colors">Create Level</h3>
            <p class="text-sm text-gray-400">Upload new game levels</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Recent Activity (Placeholder) -->
      <div class="mt-8 bg-halo-gray/30 backdrop-blur-sm rounded-lg p-6 border border-blue-400/30">
        <h3 class="text-lg font-medium text-white mb-4">Quick Stats</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p class="text-2xl font-bold text-halo-green">{{ stats.haloGames }}</p>
            <p class="text-sm text-gray-400">Halo Games</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-blue-400">{{ stats.gameModes }}</p>
            <p class="text-sm text-gray-400">Game Modes</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-yellow-400">{{ stats.multiplayer }}</p>
            <p class="text-sm text-gray-400">Multiplayer</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-purple-400">{{ stats.campaign }}</p>
            <p class="text-sm text-gray-400">Campaign</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  middleware: ['admin']
})

const stats = ref({
  levels: 0,
  maps: 0,
  haloGames: 0,
  gameModes: 0,
  multiplayer: 0,
  campaign: 0
})

const fetchStats = async () => {
  try {
    // Fetch levels count
    const levelsResponse = await $fetch('/api/admin/levels/list')
    if (levelsResponse.levels) {
      stats.value.levels = levelsResponse.levels.length
    }

    // Fetch maps count and analyze
    const mapsResponse = await $fetch('/api/admin/maps/list')
    if (mapsResponse.maps) {
      const maps = mapsResponse.maps
      stats.value.maps = maps.length
      
      // Count unique Halo games
      const uniqueGames = new Set(maps.map(map => map.halo_game))
      stats.value.haloGames = uniqueGames.size
      
      // Count unique game modes
      const uniqueModes = new Set(maps.map(map => map.game_mode))
      stats.value.gameModes = uniqueModes.size
      
      // Count by game mode
      stats.value.multiplayer = maps.filter(map => map.game_mode === 'Multiplayer').length
      stats.value.campaign = maps.filter(map => map.game_mode === 'Campaign').length
    }
  } catch (err) {
    console.error('Failed to fetch stats:', err)
  }
}

onMounted(() => {
  fetchStats()
})
</script>
