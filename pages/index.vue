<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center p-4">
    <h1 class="text-4xl font-bold text-halo-green mb-4">HaloGuessr</h1>
    <p class="text-xl mb-4">Score: {{ score }}</p>
    <div v-if="screenshot" class="w-full max-w-4xl space-y-4">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <img :src="screenshot.screenshotPath" alt="Halo Screenshot" class="w-full h-96 object-cover rounded mb-4" />
        <p class="text-lg">Map: {{ screenshot.mapName }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <MapCanvas :map-path="screenshot.mapPath" :correct-location="result?.correctLocation" @guess="submitGuess" />
      </div>
      <div v-if="result" class="bg-white p-4 rounded-lg shadow-lg">
        <p class="text-lg">Score for this guess: {{ result.score }}</p>
        <p class="text-lg">Correct location: X: {{ result.correctLocation.x.toFixed(2) }}%, Y: {{ result.correctLocation.y.toFixed(2) }}%</p>
        <button @click="nextScreenshot" class="mt-4 bg-halo-green text-white px-4 py-2 rounded hover:bg-green-700">
          Next Screenshot
        </button>
      </div>
    </div>
    <p v-else class="text-lg">Loading screenshot... Please upload one if none are available.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MapCanvas from '~/components/MapCanvas.vue'

const screenshot = ref(null)
const result = ref(null)
const score = ref(0)

const fetchScreenshot = async () => {
  try {
    const response = await $fetch('/api/screenshots/random')
    if (response.error) {
      console.error(response.error)
      screenshot.value = null
    } else {
      screenshot.value = response
      result.value = null
    }
  } catch (error) {
    console.error(error)
  }
}

const submitGuess = async (guess) => {
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

onMounted(() => {
  fetchScreenshot()
})
</script>