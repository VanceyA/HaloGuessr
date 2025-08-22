<template>
  <div class="min-h-screen bg-gradient-to-b from-halo-dark to-black text-gray-200 flex flex-col p-4 md:p-8">
    <AdminNav />

    <!-- Maps Grid -->
    <div class="w-full max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-light text-blue-300">Map Management</h2>
        <button
          @click="showCreateModal = true"
          class="bg-halo-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>CREATE NEW MAP</span>
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-halo-green mb-4"></div>
          <p class="text-lg text-blue-300">Loading maps...</p>
        </div>
      </div>

      <!-- Maps Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="map in maps" 
          :key="map.id"
          class="bg-halo-gray/30 backdrop-blur-sm rounded-lg overflow-hidden border border-blue-400/30 hover:border-halo-green/50 transition-colors"
        >
          <div class="aspect-video bg-halo-dark/50">
            <img :src="map.image_path" :alt="map.name" class="w-full h-full object-cover" />
          </div>
          <div class="p-4">
            <h3 class="text-lg font-medium text-white mb-2">{{ map.name }}</h3>
            <p class="text-sm text-blue-300 mb-1">{{ map.halo_game }}</p>
            <p class="text-sm text-gray-400 mb-3">{{ map.game_mode }}</p>
            <div class="flex space-x-2">
              <button
                @click="editMap(map)"
                class="flex-1 bg-halo-blue/50 hover:bg-halo-blue/70 text-white text-sm py-2 px-3 rounded transition-colors"
              >
                Edit
              </button>
              <button
                @click="deleteMap(map)"
                class="bg-red-800/50 hover:bg-red-700/70 text-white text-sm py-2 px-3 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Map Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div class="bg-halo-dark border border-halo-blue/50 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl text-blue-300 mb-4">Create New Map</h3>
        
        <!-- Map Image Upload -->
        <div class="mb-4">
          <label class="block text-blue-300 mb-2 font-medium">Map Image</label>
          <div class="border border-dashed border-blue-400/50 rounded-lg p-4 bg-halo-dark/50 hover:bg-halo-blue/10 transition-colors cursor-pointer">
            <input 
              type="file" 
              @change="onMapImageChange" 
              accept="image/*" 
              class="hidden" 
              id="map-image-upload"
            />
            <label for="map-image-upload" class="flex flex-col items-center cursor-pointer">
              <div v-if="newMapPreview" class="w-full mb-2">
                <img :src="newMapPreview" alt="Map preview" class="w-full h-auto rounded max-h-32 object-contain" />
              </div>
              <template v-else>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-400/70 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
                </svg>
              </template>
              <span class="text-sm text-gray-400">
                {{ newMapFile ? newMapFile.name : 'Click to select map image' }}
              </span>
            </label>
          </div>
        </div>

        <!-- Map Name -->
        <div class="mb-4">
          <label class="block text-blue-300 mb-2 font-medium">Map Name</label>
          <input 
            v-model="newMapName" 
            type="text" 
            placeholder="e.g., Blood Gulch" 
            class="w-full px-3 py-2 bg-halo-dark/70 border border-blue-400/50 focus:border-halo-green rounded outline-none focus:ring-1 focus:ring-halo-green text-white"
          />
        </div>

        <!-- Halo Game -->
        <div class="mb-4">
          <label class="block text-blue-300 mb-2 font-medium">Halo Game</label>
          <select 
            v-model="newMapHaloGame" 
            class="w-full px-3 py-2 bg-halo-dark/70 border border-blue-400/50 focus:border-halo-green rounded outline-none focus:ring-1 focus:ring-halo-green text-white appearance-none"
          >
            <option value="" disabled>Select Halo Game</option>
            <option v-for="game in haloGames" :key="game" :value="game">{{ game }}</option>
          </select>
        </div>

        <!-- Game Mode -->
        <div class="mb-4">
          <label class="block text-blue-300 mb-2 font-medium">Game Mode</label>
          <div class="flex bg-halo-dark/70 rounded p-1 border border-blue-400/50">
            <button 
              v-for="mode in ['Multiplayer', 'Campaign', 'Firefight']" 
              :key="mode"
              @click="newMapGameMode = mode"
              :class="[
                'flex-1 py-1 px-2 text-sm rounded transition-all',
                newMapGameMode === mode 
                  ? 'bg-halo-blue text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-halo-blue/30'
              ]"
            >
              {{ mode }}
            </button>
          </div>
        </div>

        <!-- Description -->
        <div class="mb-6">
          <label class="block text-blue-300 mb-2 font-medium">Description (Optional)</label>
          <textarea 
            v-model="newMapDescription" 
            placeholder="Brief description of the map..." 
            rows="3"
            class="w-full px-3 py-2 bg-halo-dark/70 border border-blue-400/50 focus:border-halo-green rounded outline-none focus:ring-1 focus:ring-halo-green text-white resize-none"
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="flex space-x-3">
          <button 
            @click="createMap" 
            class="flex-1 bg-halo-blue hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
            :disabled="isCreating || !canCreateMap"
          >
            {{ isCreating ? 'Creating...' : 'Create Map' }}
          </button>
          <button 
            @click="cancelCreate" 
            class="px-4 py-2 bg-halo-gray/50 hover:bg-halo-gray/70 text-white rounded transition-colors"
            :disabled="isCreating"
          >
            Cancel
          </button>
        </div>

        <div v-if="createStatus" 
             class="mt-4 p-3 rounded text-center text-sm"
             :class="createStatus.includes('successful') ? 'bg-green-800/30 text-green-300' : 'bg-red-800/30 text-red-300'"
        >
          {{ createStatus }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: ['admin']
})

const maps = ref([])
const loading = ref(true)
const showCreateModal = ref(false)
const isCreating = ref(false)
const createStatus = ref('')

// New map form data
const newMapFile = ref(null)
const newMapName = ref('')
const newMapHaloGame = ref('')
const newMapGameMode = ref('Multiplayer')
const newMapDescription = ref('')

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

const newMapPreview = computed(() => {
  if (newMapFile.value) {
    return URL.createObjectURL(newMapFile.value)
  }
  return null
})

const canCreateMap = computed(() => {
  return newMapFile.value && newMapName.value && newMapHaloGame.value && newMapGameMode.value
})

const fetchMaps = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/maps/list')
    if (response.error) {
      console.error('Error fetching maps:', response.error)
    } else {
      maps.value = response.maps || []
    }
  } catch (err) {
    console.error('Failed to fetch maps:', err)
  } finally {
    loading.value = false
  }
}

const onMapImageChange = (event) => {
  if (event.target.files && event.target.files.length > 0) {
    newMapFile.value = event.target.files[0]
  }
}

const createMap = async () => {
  if (!canCreateMap.value) return

  isCreating.value = true
  createStatus.value = ''

  const formData = new FormData()
  formData.append('mapImage', newMapFile.value)
  formData.append('name', newMapName.value)
  formData.append('haloGame', newMapHaloGame.value)
  formData.append('gameMode', newMapGameMode.value)
  formData.append('description', newMapDescription.value)

  try {
    const response = await $fetch('/api/admin/maps/create', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      createStatus.value = 'Map created successfully!'
      await fetchMaps() // Refresh the list
      setTimeout(() => {
        cancelCreate()
      }, 1500)
    } else {
      createStatus.value = response.error || 'Failed to create map'
    }
  } catch (err) {
    console.error('Create map error:', err)
    createStatus.value = 'Failed to create map'
  } finally {
    isCreating.value = false
  }
}

const cancelCreate = () => {
  showCreateModal.value = false
  newMapFile.value = null
  newMapName.value = ''
  newMapHaloGame.value = ''
  newMapGameMode.value = 'Multiplayer'
  newMapDescription.value = ''
  createStatus.value = ''
  isCreating.value = false
}

const editMap = (map) => {
  // TODO: Implement edit functionality
  console.log('Edit map:', map)
}

const deleteMap = (map) => {
  // TODO: Implement delete functionality
  console.log('Delete map:', map)
}

onMounted(() => {
  fetchMaps()
})
</script>
