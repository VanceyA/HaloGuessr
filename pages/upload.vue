<template>
  <div class="min-h-screen bg-gradient-to-b from-halo-dark to-black text-gray-200 flex flex-col p-4 md:p-8">
    <AdminNav />

    <div class="w-full max-w-3xl mx-auto bg-halo-gray/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
      <div class="p-6 md:p-8">
        <!-- Screenshot Upload Section -->
        <div class="mb-6">
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

        <!-- Map Selector -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-blue-300 font-medium">Select Map</label>
            <NuxtLink 
              to="/admin/maps" 
              class="text-xs text-halo-green hover:text-green-300 underline"
            >
              Manage Maps
            </NuxtLink>
          </div>
          <div class="relative">
            <select 
              v-model="selectedMapId" 
              @change="onMapChange"
              class="w-full px-4 py-3 bg-halo-dark/70 border border-blue-400/50 focus:border-halo-green rounded-lg outline-none focus:ring-1 focus:ring-halo-green text-white appearance-none"
              :disabled="loadingMaps"
            >
              <option value="" disabled>{{ loadingMaps ? 'Loading maps...' : 'Select a map' }}</option>
              <optgroup v-for="game in groupedMaps" :key="game.halo_game" :label="game.halo_game">
                <option 
                  v-for="map in game.maps" 
                  :key="map.id" 
                  :value="map.id"
                >
                  {{ map.name }} ({{ map.game_mode }})
                </option>
              </optgroup>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Selected Map Preview -->
        <div v-if="selectedMap" class="mb-6">
          <label class="block text-blue-300 mb-2 font-medium">Selected Map Preview</label>
          <div class="bg-halo-dark/50 rounded-lg p-4 border border-blue-400/30">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <img :src="selectedMap.image_path" :alt="selectedMap.name" class="w-full h-auto rounded" />
              </div>
              <div class="flex flex-col justify-center">
                <h3 class="text-lg font-medium text-white mb-2">{{ selectedMap.name }}</h3>
                <p class="text-sm text-blue-300 mb-1">{{ selectedMap.halo_game }}</p>
                <p class="text-sm text-gray-400">{{ selectedMap.game_mode }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Map Location Selection -->
        <div v-if="selectedMap" class="mb-6">
          <label class="block text-blue-300 mb-2 font-medium">
            Mark the exact location on the map: 
            <span class="text-red-300" v-if="!coordinates">*Required</span>
          </label>
          <div class="rounded-lg overflow-hidden border border-blue-400/50">
            <MapCanvas :map-path="selectedMap.image_path" :is-upload="true" @guess="setCoordinates" />
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
import { ref, computed, watch, onMounted } from 'vue'
import MapCanvas from '~/components/MapCanvas.vue'

definePageMeta({
  middleware: ['admin']
})

const screenshotFile = ref(null)
const levelName = ref('')
const coordinates = ref(null)
const uploadStatus = ref('')
const isUploading = ref(false)
const selectedMapId = ref('')
const selectedMap = ref(null)
const availableMaps = ref([])
const loadingMaps = ref(false)

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

// Computed property to group maps by Halo game
const groupedMaps = computed(() => {
  const groups = {}
  availableMaps.value.forEach(map => {
    if (!groups[map.halo_game]) {
      groups[map.halo_game] = {
        halo_game: map.halo_game,
        maps: []
      }
    }
    groups[map.halo_game].maps.push(map)
  })
  return Object.values(groups)
})

// Create a computed property to check if the form is complete
const formIncomplete = computed(() => {
  return !screenshotFile.value || 
         !selectedMapId.value || 
         !levelName.value || 
         !coordinates.value
})

// Reset coordinates when map is changed
watch(selectedMapId, () => {
  coordinates.value = null
})

const onScreenshotChange = (event) => {
  if (event.target.files && event.target.files.length > 0) {
    screenshotFile.value = event.target.files[0]
  }
}

const onMapChange = () => {
  // Find the selected map and update the selectedMap object
  const map = availableMaps.value.find(m => m.id === selectedMapId.value)
  if (map) {
    selectedMap.value = map
  }
}

const fetchAvailableMaps = async () => {
  loadingMaps.value = true
  try {
    const response = await $fetch('/api/admin/maps/list')
    if (response.error) {
      console.error('Error fetching maps:', response.error)
    } else {
      availableMaps.value = response.maps || []
    }
  } catch (err) {
    console.error('Failed to fetch maps:', err)
  } finally {
    loadingMaps.value = false
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
  formData.append('levelName', levelName.value)
  formData.append('mapId', selectedMapId.value)
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
      levelName.value = ''
      selectedMapId.value = ''
      selectedMap.value = null
      coordinates.value = null
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

// Load maps when component mounts
onMounted(() => {
  fetchAvailableMaps()
})
</script>
