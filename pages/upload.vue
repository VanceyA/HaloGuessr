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
            to="/admin/levels" 
            class="text-sm text-gray-400 bg-halo-gray/50 py-1.5 px-4 rounded-full uppercase tracking-wider hover:bg-halo-gray/70 transition-colors"
          >
            Back to Levels
          </NuxtLink>
          <span class="text-sm text-gray-400 bg-halo-gray/50 py-1.5 px-4 rounded-full uppercase tracking-wider">
            Upload New Levels
          </span>
        </div>
      </div>
    </header>

    <div class="w-full max-w-3xl mx-auto bg-halo-gray/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
      <div class="p-6 md:p-8">
        <!-- File Upload Section -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-blue-300 mb-2 font-medium">Screenshot Image</label>
            <div class="border border-dashed border-blue-400/50 rounded-lg p-4 bg-halo-dark/50 hover:bg-halo-blue/10 transition-colors cursor-pointer">
              <input 
                type="file" 
                @change="onScreenshotChange" 
                accept="image/*" 
                class="hidden" 
                id="screenshot-upload"
              />
              <label for="screenshot-upload" class="flex flex-col items-center cursor-pointer">
                <div v-if="screenshotPreview" class="w-full mb-2">
                  <div class="text-xs text-blue-300 mb-1">Preview:</div>
                  <img :src="screenshotPreview" alt="Screenshot preview" class="w-full h-auto rounded max-h-40 object-contain" />
                </div>
                <template v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-400/70 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </template>
                <span class="text-sm text-gray-400">
                  {{ screenshotFile ? screenshotFile.name : 'Click to select a screenshot' }}
                </span>
              </label>
            </div>
          </div>
          
          <div>
            <label class="block text-blue-300 mb-2 font-medium">Map Image</label>
            <div class="border border-dashed border-blue-400/50 rounded-lg p-4 bg-halo-dark/50 hover:bg-halo-blue/10 transition-colors cursor-pointer">
              <input 
                type="file" 
                @change="onMapChange" 
                accept="image/*" 
                class="hidden" 
                id="map-upload"
              />
              <label for="map-upload" class="flex flex-col items-center cursor-pointer">
                <div v-if="mapPreview" class="w-full mb-2">
                  <div class="text-xs text-blue-300 mb-1">Preview:</div>
                  <img :src="mapPreview" alt="Map preview" class="w-full h-auto rounded max-h-40 object-contain" />
                </div>
                <template v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-400/70 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
                  </svg>
                </template>
                <span class="text-sm text-gray-400">
                  {{ mapFile ? mapFile.name : 'Click to select a map' }}
                </span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Game Mode Selector -->
        <div class="mb-6">
          <label class="block text-blue-300 mb-2 font-medium">Game Mode</label>
          <div class="flex bg-halo-dark/70 rounded-lg p-1 border border-blue-400/50">
            <button 
              v-for="mode in ['Multiplayer', 'Campaign', 'Firefight']" 
              :key="mode"
              @click="gameMode = mode"
              class="flex-1 py-2 text-center rounded-md transition-all duration-200"
              :class="gameMode === mode ? 'bg-halo-blue text-halo-green font-medium' : 'text-gray-400 hover:bg-halo-blue/20'"
            >
              {{ mode }}
            </button>
          </div>
        </div>

        <!-- Halo Game Selector -->
        <div class="mb-6">
          <label class="block text-blue-300 mb-2 font-medium">Halo Game</label>
          <select 
            v-model="haloGame" 
            class="w-full px-4 py-3 bg-halo-dark/70 border border-blue-400/50 focus:border-halo-green rounded-lg outline-none focus:ring-1 focus:ring-halo-green text-white appearance-none"
          >
            <option value="" disabled>Select Halo Game</option>
            <option v-for="game in haloGames" :key="game" :value="game">{{ game }}</option>
          </select>
        </div>
        
        <!-- Level Name Input -->
        <div class="mb-6">
          <label class="block text-blue-300 mb-2 font-medium">Level Name</label>
          <input 
            v-model="levelName" 
            type="text" 
            placeholder="e.g., Blue Grenades" 
            class="w-full px-4 py-3 bg-halo-dark/70 border border-blue-400/50 focus:border-halo-green rounded-lg outline-none focus:ring-1 focus:ring-halo-green text-white"
          />
        </div>

        <!-- Map Name Input -->
        <div class="mb-6">
          <label class="block text-blue-300 mb-2 font-medium">Map Name</label>
          <input 
            v-model="mapName" 
            type="text" 
            placeholder="e.g., Blood Gulch" 
            class="w-full px-4 py-3 bg-halo-dark/70 border border-blue-400/50 focus:border-halo-green rounded-lg outline-none focus:ring-1 focus:ring-halo-green text-white"
          />
        </div>
        
        <!-- Map Selection (if map is uploaded) -->
        <div v-if="mapPreview" class="mb-6">
          <label class="block text-blue-300 mb-2 font-medium">
            Mark the exact location on the map: 
            <span class="text-red-300" v-if="!coordinates">*Required</span>
          </label>
          <div class="rounded-lg overflow-hidden border border-blue-400/50">
            <MapCanvas :map-path="mapPreview" :is-upload="true" @select="setCoordinates" />
          </div>
          <p v-if="coordinates" class="mt-2 text-blue-300">
            Selected: X: <span class="text-halo-green">{{ coordinates.x.toFixed(0) }}%</span>, 
            Y: <span class="text-halo-green">{{ coordinates.y.toFixed(0) }}%</span>
          </p>
        </div>
        
        <!-- Upload Button & Status -->
        <div>
          <button 
            @click="upload" 
            class="w-full bg-halo-blue hover:bg-blue-700 text-halo-green font-bold py-3 px-6 rounded-md
                  transition-all duration-200 transform hover:scale-105 flex items-center justify-center
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-halo-blue"
            :disabled="formIncomplete || isUploading"
          >
            <template v-if="isUploading">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-halo-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>UPLOADING...</span>
            </template>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span>UPLOAD LOCATION</span>
            </template>
          </button>
          
          <div v-if="uploadStatus" 
               class="mt-4 p-3 rounded-lg text-center"
               :class="uploadStatus.includes('successful') ? 'bg-green-800/30 text-green-300' : 'bg-red-800/30 text-red-300'"
          >
            {{ uploadStatus }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import MapCanvas from '~/components/MapCanvas.vue'

definePageMeta({
  middleware: ['admin']
})

const screenshotFile = ref(null)
const mapFile = ref(null)
const levelName = ref('')
const mapName = ref('')
const coordinates = ref(null)
const uploadStatus = ref('')
const gameMode = ref('Multiplayer')
const haloGame = ref('')
const isUploading = ref(false)

const haloGames = [
  'Halo: Combat Evolved',
  'Halo 2',
  'Halo 3',
  'Halo 3: ODST',
  'Halo: Reach',
  'Halo 4',
  'Halo 5: Guardians',
  'Halo Infinite'
]

const screenshotPreview = computed(() => {
  if (screenshotFile.value) {
    return URL.createObjectURL(screenshotFile.value)
  }
  return null
})

const mapPreview = computed(() => {
  if (mapFile.value) {
    return URL.createObjectURL(mapFile.value)
  }
  return null
})

// Create a computed property to check if the form is complete
const formIncomplete = computed(() => {
  return !screenshotFile.value || 
         !mapFile.value || 
         !levelName.value || 
         !coordinates.value || 
         !haloGame.value
})

// Reset coordinates when map is changed
watch(mapFile, () => {
  coordinates.value = null
})

const onScreenshotChange = (event) => {
  if (event.target.files && event.target.files.length > 0) {
    screenshotFile.value = event.target.files[0]
  }
}

const onMapChange = (event) => {
  if (event.target.files && event.target.files.length > 0) {
    mapFile.value = event.target.files[0]
  }
}

const setCoordinates = (coords) => {
  console.log('Coordinates set:', coords)
  coordinates.value = coords
}

const upload = async () => {
  if (formIncomplete.value) {
    uploadStatus.value = 'Please fill all fields and select a location'
    return
  }
  
  // Set uploading state to true to disable the button
  isUploading.value = true
  uploadStatus.value = ''
  
  const formData = new FormData()
  formData.append('screenshot', screenshotFile.value)
  formData.append('mapImage', mapFile.value)
  formData.append('mapName', mapName.value)
  formData.append('levelName', levelName.value)
  formData.append('gameMode', gameMode.value)
  formData.append('haloGame', haloGame.value)
  formData.append('x', coordinates.value.x)
  formData.append('y', coordinates.value.y)
  
  try {
    const response = await $fetch('/api/admin/levels/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      uploadStatus.value = 'Upload successful'
      screenshotFile.value = null
      mapFile.value = null
      mapName.value = ''
      levelName.value = ''
      coordinates.value = null
      // Keep the game mode and halo game selections for convenience
    } else {
      uploadStatus.value = response.error || 'Upload failed'
    }
  } catch (error) {
    console.error(error)
    uploadStatus.value = 'Upload failed'
  } finally {
    // Set uploading state back to false regardless of success or failure
    isUploading.value = false
  }
}
</script>
