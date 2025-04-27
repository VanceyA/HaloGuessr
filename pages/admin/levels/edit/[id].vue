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
            Edit Level
          </span>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex-grow flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-halo-green mb-4"></div>
        <p class="text-lg text-blue-300">Loading level data...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="w-full max-w-3xl mx-auto bg-red-900/30 text-red-300 p-6 rounded-lg text-center">
      <p class="text-lg mb-4">{{ error }}</p>
      <NuxtLink 
        to="/admin/levels" 
        class="bg-halo-gray/50 hover:bg-halo-gray/70 text-white font-medium py-2 px-6 rounded inline-flex items-center"
      >
        Return to Level List
      </NuxtLink>
    </div>

    <!-- Edit Form -->
    <div v-else class="w-full max-w-3xl mx-auto bg-halo-gray/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
      <div class="p-6 md:p-8">
        <h2 class="text-2xl font-light text-blue-300 mb-6">Edit Level</h2>
        
        <!-- Preview Section -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-blue-300 mb-2 font-medium">Screenshot Image</label>
            <div class="rounded-lg overflow-hidden border border-blue-400/50 bg-halo-dark/50">
              <img :src="level.screenshotPath" alt="Screenshot" class="w-full h-auto" />
            </div>
          </div>
          
          <div>
            <label class="block text-blue-300 mb-2 font-medium">Map Image</label>
            <div class="rounded-lg overflow-hidden border border-blue-400/50 bg-halo-dark/50">
              <img :src="level.mapPath" alt="Map" class="w-full h-auto" />
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
              @click="level.gameMode = mode"
              class="flex-1 py-2 text-center rounded-md transition-all duration-200"
              :class="level.gameMode === mode ? 'bg-halo-blue text-halo-green font-medium' : 'text-gray-400 hover:bg-halo-blue/20'"
            >
              {{ mode }}
            </button>
          </div>
        </div>

        <!-- Halo Game Selector -->
        <div class="mb-6">
          <label class="block text-blue-300 mb-2 font-medium">Halo Game</label>
          <select 
            v-model="level.haloGame" 
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
            v-model="level.levelName" 
            type="text" 
            placeholder="e.g., Blue Grenades" 
            class="w-full px-4 py-3 bg-halo-dark/70 border border-blue-400/50 focus:border-halo-green rounded-lg outline-none focus:ring-1 focus:ring-halo-green text-white"
          />
        </div>

        <!-- Map Name Input -->
        <div class="mb-6">
          <label class="block text-blue-300 mb-2 font-medium">Map Name</label>
          <input 
            v-model="level.mapName" 
            type="text" 
            placeholder="e.g., Blood Gulch" 
            class="w-full px-4 py-3 bg-halo-dark/70 border border-blue-400/50 focus:border-halo-green rounded-lg outline-none focus:ring-1 focus:ring-halo-green text-white"
          />
        </div>
        
        <!-- Map Location -->
        <div class="mb-6">
          <label class="block text-blue-300 mb-2 font-medium">Location on Map</label>
          <div class="rounded-lg overflow-hidden border border-blue-400/50">
            <MapCanvas :map-path="level.mapPath" :is-upload="true" :initial-marker="level.location" @guess="setCoordinates" />
          </div>
          <p v-if="level.location" class="mt-2 text-blue-300">
            Selected: X: <span class="text-halo-green">{{ level.location.x.toFixed(0) }}%</span>, 
            Y: <span class="text-halo-green">{{ level.location.y.toFixed(0) }}%</span>
          </p>
        </div>
        
        <!-- Update Button & Status -->
        <div class="flex space-x-4">
          <button 
            @click="updateLevel" 
            class="flex-1 bg-halo-blue hover:bg-blue-700 text-halo-green font-bold py-3 px-6 rounded-md
                  transition-all duration-200 transform hover:scale-105 flex items-center justify-center
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-halo-blue"
            :disabled="isUpdating"
          >
            <svg v-if="isUpdating" class="animate-spin -ml-1 mr-3 h-5 w-5 text-halo-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isUpdating ? 'SAVING...' : 'SAVE CHANGES' }}</span>
          </button>
          
          <NuxtLink 
            to="/admin/levels" 
            class="px-6 py-3 bg-halo-gray/50 hover:bg-halo-gray/70 text-white font-bold rounded-md flex items-center justify-center transition-colors"
          >
            CANCEL
          </NuxtLink>
        </div>
        
        <div v-if="updateStatus" 
             class="mt-4 p-3 rounded-lg text-center"
             :class="updateStatus.includes('successful') ? 'bg-green-800/30 text-green-300' : 'bg-red-800/30 text-red-300'"
        >
          {{ updateStatus }}
        </div>
        
        <!-- Delete Section -->
        <div class="mt-8 pt-6 border-t border-halo-blue/30">
          <h3 class="text-xl font-light text-red-300 mb-4">Danger Zone</h3>
          <p class="text-gray-400 mb-4">This action will permanently remove this level from the game.</p>
          
          <button 
            @click="showDeleteConfirm = true" 
            class="bg-red-800/50 hover:bg-red-700/70 text-white font-bold py-2 px-4 rounded
                   transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>DELETE LEVEL</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div class="bg-halo-dark border border-halo-blue/50 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl text-red-300 mb-4">Delete Confirmation</h3>
        <p class="text-gray-300 mb-6">
          Are you sure you want to delete <strong>{{ level.levelName }}</strong>? This action cannot be undone.
        </p>
        
        <div class="flex space-x-4">
          <button 
            @click="deleteLevel" 
            class="flex-1 bg-red-800 hover:bg-red-700 text-white font-bold py-3 rounded
                   transition-colors flex items-center justify-center disabled:opacity-50"
            :disabled="isDeleting"
          >
            <svg v-if="isDeleting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isDeleting ? 'DELETING...' : 'CONFIRM DELETE' }}</span>
          </button>
          
          <button 
            @click="cancelDelete" 
            class="px-6 py-3 bg-halo-gray/50 hover:bg-halo-gray/70 text-white font-bold rounded
                  transition-colors"
            :disabled="isDeleting"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MapCanvas from '~/components/MapCanvas.vue'

definePageMeta({
  middleware: ['admin']
})

const route = useRoute()
const router = useRouter()
const id = route.params.id

const level = ref({
  id: '',
  screenshotPath: '',
  mapPath: '',
  mapName: '',
  levelName: '',
  gameMode: '',
  haloGame: '',
  location: { x: 0, y: 0 }
})

const loading = ref(true)
const error = ref(null)
const isUpdating = ref(false)
const updateStatus = ref('')

// Delete related refs
const showDeleteConfirm = ref(false)
const deletePassword = ref('')
const isDeleting = ref(false)
const deleteError = ref('')

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

const setCoordinates = (coords) => {
  level.value.location = coords
}

const updateLevel = async () => {
  if (!level.value.levelName || !level.value.mapName || !level.value.haloGame) {
    updateStatus.value = 'Please fill all required fields'
    return
  }
  
  isUpdating.value = true
  updateStatus.value = ''
  
  try {
    const response = await $fetch(`/api/screenshots/${id}`, {
      method: 'PUT',
      body: {
        mapName: level.value.mapName,
        levelName: level.value.levelName,
        gameMode: level.value.gameMode,
        haloGame: level.value.haloGame,
        location: level.value.location
      }
    })
    
    if (response.success) {
      updateStatus.value = 'Update successful!'
      // Optionally redirect after a short delay
      setTimeout(() => {
        router.push('/admin/levels')
      }, 1500)
    } else {
      updateStatus.value = response.error || 'Update failed'
    }
  } catch (err) {
    console.error(err)
    updateStatus.value = 'Update failed. Please try again.'
  } finally {
    isUpdating.value = false
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  deletePassword.value = ''
  deleteError.value = ''
}

const deleteLevel = async () => {
  isDeleting.value = true
  
  try {
    const response = await $fetch(`/api/screenshots/${id}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      // Successfully deleted, redirect to levels list
      router.push('/admin/levels')
    } else {
      deleteError.value = response.error || 'Failed to delete level'
      isDeleting.value = false
    }
  } catch (err) {
    console.error(err)
    deleteError.value = 'An error occurred while deleting. Please try again.'
    isDeleting.value = false
  }
}

onMounted(async () => {
  try {
    const response = await $fetch(`/api/screenshots/${id}`)
    if (response.error) {
      error.value = response.error
    } else {
      level.value = response
    }
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load level. Please try again.'
  } finally {
    loading.value = false
  }
})
</script>
