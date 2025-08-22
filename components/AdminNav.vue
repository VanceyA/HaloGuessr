<template>
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
      
      <!-- Navigation -->
      <div class="mt-3 md:mt-0 flex flex-wrap gap-2">
        <NuxtLink 
          to="/admin" 
          class="text-sm py-1.5 px-4 rounded-full uppercase tracking-wider transition-colors"
          :class="$route.path === '/admin' 
            ? 'text-white bg-halo-blue' 
            : 'text-gray-400 bg-halo-gray/50 hover:bg-halo-gray/70'"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink 
          to="/admin/levels" 
          class="text-sm py-1.5 px-4 rounded-full uppercase tracking-wider transition-colors"
          :class="$route.path.startsWith('/admin/levels') 
            ? 'text-white bg-halo-blue' 
            : 'text-gray-400 bg-halo-gray/50 hover:bg-halo-gray/70'"
        >
          Levels
        </NuxtLink>
        <NuxtLink 
          to="/admin/maps" 
          class="text-sm py-1.5 px-4 rounded-full uppercase tracking-wider transition-colors"
          :class="$route.path.startsWith('/admin/maps') 
            ? 'text-white bg-halo-blue' 
            : 'text-gray-400 bg-halo-gray/50 hover:bg-halo-gray/70'"
        >
          Maps
        </NuxtLink>
        <NuxtLink 
          to="/upload" 
          class="text-sm py-1.5 px-4 rounded-full uppercase tracking-wider transition-colors"
          :class="$route.path === '/upload' 
            ? 'text-white bg-halo-green' 
            : 'text-gray-400 bg-halo-gray/50 hover:bg-halo-gray/70'"
        >
          Create Level
        </NuxtLink>
        <NuxtLink 
          to="/" 
          class="text-sm text-gray-400 bg-halo-gray/50 py-1.5 px-4 rounded-full uppercase tracking-wider hover:bg-halo-gray/70 transition-colors"
        >
          Back to Game
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
// No props needed for this component
</script>
