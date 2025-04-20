<template>
  <div class="relative">
    <img :src="mapPath" alt="Halo Map" ref="mapImage" class="w-full h-auto rounded" @click="handleClick" />
    <div
      v-if="guess"
      class="absolute w-4 h-4 rounded-full"
      :class="isUpload ? 'bg-blue-500' : 'bg-red-500'"
      :style="guessStyle"
    ></div>
    <div
      v-if="correctLocation && !isUpload"
      class="absolute w-4 h-4 bg-green-500 rounded-full"
      :style="correctLocationStyle"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  mapPath: String,
  correctLocation: Object, // { x: percentage, y: percentage }
  isUpload: { type: Boolean, default: false }
})
const emit = defineEmits(['guess'])
const mapImage = ref(null)

const guess = ref(null) // { x: percentage, y: percentage }

const handleClick = (event) => {
  const rect = mapImage.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width * 100 // Convert to percentage
  const y = (event.clientY - rect.top) / rect.height * 100
  guess.value = { x, y }
  emit('guess', guess.value)
}

const guessStyle = computed(() => {
  if (!guess.value || !mapImage.value) return {}
  const rect = mapImage.value.getBoundingClientRect()
  const pixelX = (guess.value.x / 100) * rect.width
  const pixelY = (guess.value.y / 100) * rect.height
  return {
    left: `${pixelX}px`,
    top: `${pixelY}px`,
    transform: 'translate(-50%, -50%)'
  }
})

const correctLocationStyle = computed(() => {
  if (!props.correctLocation || !mapImage.value) return {}
  const rect = mapImage.value.getBoundingClientRect()
  const pixelX = (props.correctLocation.x / 100) * rect.width
  const pixelY = (props.correctLocation.y / 100) * rect.height
  return {
    left: `${pixelX}px`,
    top: `${pixelY}px`,
    transform: 'translate(-50%, -50%)'
  }
})
</script>