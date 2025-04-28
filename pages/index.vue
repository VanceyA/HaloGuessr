<template>
  <div
    class="min-h-screen bg-gradient-to-b from-halo-dark to-black text-gray-200
           flex flex-col p-4 md:p-8 relative"
  >
    <!-- Modern Header with Subtle Logo -->
    <header class="mb-6 md:mb-8">
      <div class="flex items-center">
        <!-- Logo Section -->
        <div class="flex items-center space-x-2">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="mr-3"
          >
            <path
              d="M24 6L8 12V24C8 32.8 14.4 41.2 24 44C33.6 41.2 40 32.8 40 24V12L24 6Z"
              fill="url(#paint0_linear)"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="24"
                y1="6"
                x2="24"
                y2="44"
                gradientUnits="userSpaceOnUse"
              >
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

    <!-- Main Content -->
    <div
      v-if="screenshot"
      class="w-full max-w-7xl mx-auto flex-grow"
      :class="{ 'opacity-0': !imagesLoaded }"
    >
      <div class="grid md:grid-cols-5 gap-6 h-full">
        <!-- Screenshot Container -->
        <div class="md:col-span-3 bg-halo-gray/20 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
          <div class="relative h-72 md:h-[450px]">
            <img
              :src="screenshot.screenshotPath"
              alt="Halo Screenshot"
              class="w-full h-full object-cover"
              @load="onScreenshotLoaded"
            />
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p class="text-white font-medium">
                <span class="text-gray-400 uppercase text-xs tracking-wide mr-2">LOCATION:</span>
                {{ screenshot.mapName }}
              </p>
            </div>
          </div>
        </div>

        <!-- Map & Guess Container -->
        <div class="md:col-span-2 flex flex-col">
          <!-- Total Score Display (always visible above map) -->
          <div class="bg-halo-gray/30 backdrop-blur-sm rounded-t-lg p-2 border-b border-halo-blue/30 flex items-center justify-between">
            <div class="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-4 w-4 text-halo-green mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div class="text-gray-400 uppercase text-xs tracking-wider">Total Score</div>
            </div>
            <div class="text-lg font-mono font-bold text-halo-green">{{ score }}</div>
          </div>
          
          <div class="bg-halo-gray/20 backdrop-blur-sm rounded-b-lg overflow-hidden shadow-lg flex flex-col h-full relative">
            <!-- Map Header -->
            <div class="p-3 border-b border-halo-blue/20 flex justify-between items-center">
              <p class="text-blue-300 text-sm uppercase tracking-wider">
                {{ !hasGuessed
                  ? 'Select location'
                  : result
                  ? 'Result'
                  : 'Processing...' }}
              </p>
              <div class="flex items-center space-x-3">
                <!-- Confirm Guess Button -->
                <button
                  v-if="pendingGuess && !hasGuessed"
                  @click="confirmGuess"
                  class="bg-halo-blue hover:bg-blue-700 text-white text-xs font-bold
                         py-1.5 px-3 rounded transition-all duration-200 flex items-center"
                >
                  CONFIRM
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <!-- Next Button -->
                <button
                  v-if="result"
                  @click="nextScreenshot"
                  class="bg-halo-blue hover:bg-blue-700 text-white text-xs font-bold
                         py-1.5 px-3 rounded transition-all duration-200 flex items-center"
                >
                  NEXT
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1
                         0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586
                         11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1
                         0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Accuracy/Points UI (Always visible above map when results are shown) -->
            <div v-if="result" class="p-2 bg-black/40 border-b border-halo-blue/30">
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3">
                  <div class="flex items-center">
                    <div class="text-xs text-gray-400 mr-1">Accuracy:</div>
                    <div class="text-sm font-bold text-halo-green">{{ accuracy.toFixed(0) }}%</div>
                  </div>
                  <div class="h-4 w-px bg-halo-blue/30"></div>
                  <div class="flex items-center">
                    <div class="text-xs text-gray-400 mr-1">Points:</div>
                    <div class="text-sm font-bold text-halo-green">+{{ result.score }}</div>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden" style="width: 100px">
                    <div 
                      class="h-full bg-gradient-to-r from-red-500 to-halo-green"
                      :style="`width: ${accuracy.toFixed(0)}%`"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Map Canvas -->
            <div class="flex-grow relative">
              <div
                v-if="hasGuessed && !result"
                class="absolute inset-0 bg-black/70 flex items-center justify-center z-10"
              >
                <div class="animate-pulse text-halo-green font-bold flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-halo-green"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0
                         0 5.373 0 12h4zm2 5.291A7.962 7.962
                         0 014 12H0c0 3.042 1.135 5.824 3
                         7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing
                </div>
              </div>
              <MapCanvas
                v-if="screenshot"
                :map-path="screenshot.mapPath"
                :correct-location="result?.correctLocation"
                :disabled="hasGuessed"
                @map-loaded="onMapLoaded"
                @select="onSelect"
              />
            </div>

            <!-- Next Button (mobile) -->
            <div v-if="result" class="p-3 md:hidden border-t border-halo-blue/20">
              <button
                @click="nextScreenshot"
                class="w-full bg-halo-blue hover:bg-blue-700 text-white font-bold
                       py-3 rounded transition"
              >
                NEXT LOCATION
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Initial Loading State -->
    <div
      v-if="!screenshot && !isLoadingNextLevel"
      class="flex-grow flex items-center justify-center"
    >
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12
                 border-t-2 border-b-2 border-halo-green mb-4"
        ></div>
        <p class="text-lg text-blue-300">Loading Halo location data...</p>
        <p class="text-sm text-gray-400 mt-2">
          Please upload locations if none are available.
        </p>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="isLoadingNextLevel || (screenshot && !imagesLoaded)"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-16 w-16
                 border-t-2 border-b-2 border-halo-green mb-4"
        ></div>
        <p class="text-xl text-halo-green font-bold">Loading Next Location</p>
        <div
          class="mt-3 w-40 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden"
        >
          <div class="h-full bg-halo-green animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Mod Info Panel (only visible when activated) -->
    <div 
      v-if="showModInfo && screenshot" 
      class="fixed bottom-4 right-4 bg-black/80 text-halo-green p-3 rounded shadow-lg z-50 border border-halo-blue/50"
    >
      <div class="text-xs uppercase tracking-wider text-blue-400 mb-1">Mod Info</div>
      <div class="font-mono">ID: {{ screenshot.id }}</div>
      <div class="mt-2 text-xs text-gray-400">
        Press {{ isMac ? '⌘' : 'Ctrl' }}+K to hide
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import MapCanvas from '~/components/MapCanvas.vue'

const screenshot = ref(null)
const result = ref(null)
const score = ref(0)
const hasGuessed = ref(false)
const currentId = ref(null)
const isLoadingNextLevel = ref(false)
const screenshotLoaded = ref(false)
const mapLoaded = ref(false)
const pendingGuess = ref(null)
const showModInfo = ref(false)
const isMac = ref(false)

const imagesLoaded = computed(() => screenshotLoaded.value && mapLoaded.value)

watch(screenshot, () => {
  screenshotLoaded.value = false
  mapLoaded.value = false
  pendingGuess.value = null
  result.value = null
}, { immediate: false })

async function fetchScreenshot() {
  hasGuessed.value = false
  try {
    const res = await $fetch('/api/levels/random')
    if (!res.error) {
      screenshot.value = res
      currentId.value = res.id
    }
  } catch (e) {
    console.error(e)
  }
}

function onScreenshotLoaded() {
  screenshotLoaded.value = true
  if (imagesLoaded.value) isLoadingNextLevel.value = false
}

function onMapLoaded() {
  mapLoaded.value = true
  if (imagesLoaded.value) isLoadingNextLevel.value = false
}

function onSelect(coords) {
  pendingGuess.value = coords
}

async function confirmGuess() {
  if (!pendingGuess.value || hasGuessed.value) return
  hasGuessed.value = true
  try {
    const res = await $fetch('/api/guess', {
      method: 'POST',
      body: { id: screenshot.value.id, guess: pendingGuess.value }
    })
    if (!res.error) {
      result.value = res
      score.value += res.score
    }
  } catch (e) {
    console.error(e)
  }
}

function nextScreenshot() {
  isLoadingNextLevel.value = true
  screenshotLoaded.value = false
  mapLoaded.value = false
  setTimeout(fetchScreenshot, 100)
}

// Detect if user is on Mac
function detectPlatform() {
  if (typeof navigator !== 'undefined') {
    isMac.value = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  }
}

// Cross-platform mod tools keyboard shortcut handler
function handleKeyDown(e) {
  // Cmd+M on Mac, Ctrl+K on Windows/Linux
  if ((isMac.value ? e.metaKey : e.ctrlKey) && e.key === 'k') {
    e.preventDefault() // Prevent default browser behavior
    if (screenshot.value) {
      console.log('Screenshot ID:', screenshot.value.id)
      showModInfo.value = !showModInfo.value
    }
  }
}

const accuracy = computed(() => {
  if (!result.value?.correctLocation || !pendingGuess.value) return 0
  const dx = pendingGuess.value.x - result.value.correctLocation.x
  const dy = pendingGuess.value.y - result.value.correctLocation.y
  // you can invert or scale this however you like; here smaller distance → higher %
  return Math.max(0, 100 - Math.hypot(dx, dy))
})

onMounted(() => {
  fetchScreenshot()
  detectPlatform()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>
