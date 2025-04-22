<template>
  <div class="min-h-screen bg-gradient-to-b from-halo-dark to-black text-gray-200 flex flex-col p-4 md:p-8">
    <!-- Modern Header with Subtle Logo -->
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
        
        <!-- Score Display -->
        <div class="mt-3 md:mt-0 flex items-center space-x-4">
          <div class="flex items-center space-x-2 bg-halo-gray/50 rounded-full px-4 py-1.5">
            <div class="text-gray-400 uppercase text-xs tracking-wider">Total Score</div>
            <div class="text-xl font-mono font-bold text-halo-green">{{ score }}</div>
          </div>
          
          <div v-if="result" class="flex items-center space-x-2 bg-halo-gray/50 rounded-full px-4 py-1.5">
            <div class="text-gray-400 uppercase text-xs tracking-wider">Last</div>
            <div class="text-xl font-mono font-bold text-halo-green">+{{ result.score }}</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div v-if="screenshot" class="w-full max-w-7xl mx-auto flex-grow">
      <!-- Game Area - Grid layout for desktop -->
      <div class="grid md:grid-cols-5 gap-6 h-full">
        <!-- Screenshot Container (3/5 width on desktop) -->
        <div class="md:col-span-3 bg-halo-gray/20 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
          <div class="relative h-72 md:h-[450px]">
            <img 
              :src="screenshot.screenshotPath" 
              alt="Halo Screenshot" 
              class="w-full h-full object-cover"
            />
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p class="text-white font-medium">
                <span class="text-gray-400 uppercase text-xs tracking-wide mr-2">LOCATION:</span>
                {{ screenshot.mapName }}
              </p>
            </div>
          </div>
        </div>

        <!-- Map Container (2/5 width on desktop) -->
        <div class="md:col-span-2 flex flex-col">
          <div class="bg-halo-gray/20 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg flex flex-col h-full relative">
            <!-- Map Header -->
            <div class="p-3 border-b border-halo-blue/20 flex justify-between items-center">
              <p class="text-blue-300 text-sm uppercase tracking-wider">
                {{ !hasGuessed ? 'Select location' : result ? 'Result' : 'Processing...' }}
              </p>
              
              <!-- Integrated Result Info (appears in map header) -->
              <div v-if="result" class="flex items-center space-x-3">
                <div class="text-xs text-white">
                  <span class="text-gray-400">Distance:</span> 
                  <span class="text-halo-green">{{ calculateDistance(result.correctLocation) }}%</span>
                </div>
                <button 
                  @click="nextScreenshot" 
                  class="bg-halo-blue hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded
                        transition-all duration-200 flex items-center"
                >
                  <span>NEXT</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Map Content -->
            <div class="flex-grow relative">
              <!-- Processing Overlay -->
              <div v-if="hasGuessed && !result" class="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                <div class="animate-pulse text-halo-green font-bold flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-halo-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </div>
              </div>
              
              <MapCanvas 
                :map-path="screenshot.mapPath" 
                :correct-location="result?.correctLocation" 
                @guess="submitGuess"
                :disabled="hasGuessed"
              />
            </div>
            
            <!-- Large Next Button (mobile only, shown at bottom when results are in) -->
            <div v-if="result" class="p-3 md:hidden border-t border-halo-blue/20">
              <button 
                @click="nextScreenshot" 
                class="w-full bg-halo-blue hover:bg-blue-700 text-white font-bold py-3 px-6 rounded
                      transition-all duration-200 flex items-center justify-center"
              >
                <span>NEXT LOCATION</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="flex-grow flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-halo-green mb-4"></div>
        <p class="text-lg text-blue-300">Loading Halo location data...</p>
        <p class="text-sm text-gray-400 mt-2">Please upload locations if none are available.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import MapCanvas from '~/components/MapCanvas.vue'

const screenshot = ref(null)
const result = ref(null)
const score = ref(0)
const hasGuessed = ref(false)
const currentId = ref(null)

const fetchScreenshot = async () => {
  try {
    hasGuessed.value = false
    result.value = null
    
    // Pass the current ID to avoid getting the same screenshot again
    const response = await $fetch('/api/screenshots/random', {
      params: { exclude: currentId.value }
    })
    
    if (response.error) {
      console.error(response.error)
      screenshot.value = null
    } else {
      screenshot.value = response
      currentId.value = response.id
    }
  } catch (error) {
    console.error(error)
  }
}

const submitGuess = async (guess) => {
  // Prevent multiple submissions
  if (hasGuessed.value) return
  
  hasGuessed.value = true
  
  try {
    const response = await $fetch('/api/guess', {
      method: 'POST',
      body: { id: screenshot.value.id, guess }
    })
    if (response.error) {
      console.error(response.error)
    } else {
      result.value = response
      score.value += response.score
    }
  } catch (error) {
    console.error(error)
  }
}

const nextScreenshot = () => {
  fetchScreenshot()
}

const calculateDistance = (correctLocation) => {
  if (!correctLocation) return 0
  
  // Get the guess from the MapCanvas component
  const guessElement = document.querySelector('.guess-marker')
  if (!guessElement) return 0
  
  const guessX = parseFloat(guessElement.dataset.x)
  const guessY = parseFloat(guessElement.dataset.y)
  
  const distance = Math.sqrt(
    Math.pow(guessX - correctLocation.x, 2) +
    Math.pow(guessY - correctLocation.y, 2)
  ).toFixed(1)
  
  return distance
}

onMounted(() => {
  fetchScreenshot()
})
</script>
