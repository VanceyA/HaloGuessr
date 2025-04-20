<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center p-4">
    <h1 class="text-4xl font-bold text-halo-green mb-4">Upload Halo Screenshot</h1>
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-4">
      <div>
        <label class="block text-lg font-medium mb-1">Screenshot Image</label>
        <input type="file" @change="onScreenshotChange" accept="image/*" class="border p-2 w-full rounded" />
      </div>
      <div>
        <label class="block text-lg font-medium mb-1">Map Image</label>
        <input type="file" @change="onMapChange" accept="image/*" class="border p-2 w-full rounded" />
      </div>
      <div>
        <label class="block text-lg font-medium mb-1">Map Name</label>
        <input v-model="mapName" type="text" placeholder="e.g., Blood Gulch" class="border p-2 w-full rounded" />
      </div>
      <div v-if="mapPreview">
        <label class="block text-lg font-medium mb-1">Click on the map to set the screenshot location</label>
        <MapCanvas :map-path="mapPreview" :is-upload="true" @guess="setCoordinates" />
        <p v-if="coordinates" class="mt-2">Selected: X: {{ coordinates.x.toFixed(2) }}%, Y: {{ coordinates.y.toFixed(2) }}%</p>
      </div>
      <button @click="upload" class="bg-halo-green text-white px-4 py-2 rounded hover:bg-green-700" :disabled="!screenshotFile || !mapFile || !mapName || !coordinates">
        Upload
      </button>
      <p v-if="uploadStatus" class="mt-4 text-lg">{{ uploadStatus }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MapCanvas from '~/components/MapCanvas.vue'

const screenshotFile = ref(null)
const mapFile = ref(null)
const mapName = ref('')
const coordinates = ref(null)
const uploadStatus = ref('')

const mapPreview = computed(() => {
  if (mapFile.value) {
    return URL.createObjectURL(mapFile.value)
  }
  return null
})

const onScreenshotChange = (event) => {
  screenshotFile.value = event.target.files[0]
}

const onMapChange = (event) => {
  mapFile.value = event.target.files[0]
}

const setCoordinates = (coords) => {
  coordinates.value = coords
}

const upload = async () => {
  if (!screenshotFile.value || !mapFile.value || !mapName.value || !coordinates.value) {
    uploadStatus.value = 'Please fill all fields and select a location'
    return
  }
  const formData = new FormData()
  formData.append('screenshot', screenshotFile.value)
  formData.append('mapImage', mapFile.value)
  formData.append('mapName', mapName.value)
  formData.append('x', coordinates.value.x)
  formData.append('y', coordinates.value.y)
  try {
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    if (response.success) {
      uploadStatus.value = 'Upload successful'
      screenshotFile.value = null
      mapFile.value = null
      mapName.value = ''
      coordinates.value = null
    } else {
      uploadStatus.value = response.error || 'Upload failed'
    }
  } catch (error) {
    console.error(error)
    uploadStatus.value = 'Upload failed'
  }
}
</script>