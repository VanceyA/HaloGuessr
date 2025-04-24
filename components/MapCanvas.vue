<template>
  <div class="relative w-full h-full">
    <img 
      :src="mapPath" 
      alt="Halo Map" 
      ref="mapImage" 
      class="w-full h-auto object-contain" 
      @click="handleClick"
      :class="{'cursor-not-allowed': disabled && !guess, 'cursor-default': disabled && guess}"
    />
    
    <!-- Guess Marker -->
    <div
      v-if="guess"
      class="absolute guess-marker z-10"
      :style="guessStyle"
      :data-x="guess.x"
      :data-y="guess.y"
    >
      <div class="w-5 h-5 rounded-full flex items-center justify-center">
        <div class="w-full h-full animate-ping absolute rounded-full opacity-70" 
             :class="isUpload ? 'bg-blue-400' : 'bg-red-500'"></div>
        <div class="w-full h-full rounded-full" 
             :class="isUpload ? 'bg-blue-400' : 'bg-red-500'"></div>
        <div class="absolute -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>
    </div>
    
    <!-- Correct Location Marker -->
    <div
      v-if="correctLocation && !isUpload"
      class="absolute w-5 h-5 rounded-full z-10"
      :style="correctLocationStyle"
    >
      <div class="w-full h-full flex items-center justify-center">
        <div class="w-full h-full animate-ping absolute rounded-full opacity-70 bg-halo-green"></div>
        <div class="w-full h-full rounded-full bg-halo-green"></div>
        <div class="absolute -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>
    </div>
    
    <!-- Distance Line -->
    <div
      v-if="guess && correctLocation && !isUpload"
      class="absolute pointer-events-none"
      :style="lineStyle"
    ></div>
    
    <!-- Distance Label -->
    <div
      v-if="guess && correctLocation && !isUpload"
      class="absolute pointer-events-none text-xs bg-black/80 text-white px-1.5 py-0.5 rounded transform -translate-x-1/2 -translate-y-1/2"
      :style="distanceLabelStyle"
    >
      {{ calculateDistance().toFixed(0) }}%
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  mapPath: String,
  correctLocation: Object,
  isUpload: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  initialMarker: { type: Object, default: null }
})

const emit = defineEmits(['guess'])
const mapImage = ref(null)
const guess = ref(null)

// Reset the guess when mapPath changes
watch(() => props.mapPath, () => {
  if (!props.initialMarker) {
    guess.value = null
  }
}, { immediate: true })

// Handle clicking on the map to place a marker
const handleClick = (event) => {
  // Don't allow clicks if disabled
  if (props.disabled) return
  
  const rect = mapImage.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width * 100 // Convert to percentage
  const y = (event.clientY - rect.top) / rect.height * 100
  guess.value = { x, y }
  emit('guess', guess.value)
}

// Set the initial marker position
onMounted(() => {
  if (props.initialMarker) {
    console.log('Initial marker:', props.initialMarker) // Debug: log the marker
    
    // Wait for the image to load
    const imgElement = mapImage.value
    if (imgElement) {
      if (imgElement.complete) {
        setInitialMarker()
      } else {
        imgElement.onload = setInitialMarker
      }
    }
  }
})

// Function to set the initial marker after image is loaded
const setInitialMarker = () => {
  if (!props.initialMarker) return
  
  nextTick(() => {
    // Make sure we have both x and y coordinates
    const x = typeof props.initialMarker.x === 'number' ? props.initialMarker.x : 0
    const y = typeof props.initialMarker.y === 'number' ? props.initialMarker.y : 0
    
    guess.value = { x, y }
    console.log('Setting initial marker at:', guess.value) // Debug: log the set marker
    
    // Emit the initial guess
    emit('guess', guess.value)
  })
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

const lineStyle = computed(() => {
  if (!guess.value || !props.correctLocation || !mapImage.value) return {}
  
  const rect = mapImage.value.getBoundingClientRect();
  const x1 = (guess.value.x / 100) * rect.width;
  const y1 = (guess.value.y / 100) * rect.height;
  const x2 = (props.correctLocation.x / 100) * rect.width;
  const y2 = (props.correctLocation.y / 100) * rect.height;
  
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  
  return {
    left: `${x1}px`,
    top: `${y1}px`,
    width: `${length}px`,
    height: '2px',
    background: 'linear-gradient(to right, rgba(220, 38, 38, 0.8), rgba(123, 244, 66, 0.8))',
    transform: `rotate(${angle}deg)`,
    transformOrigin: '0 0'
  }
})

const distanceLabelStyle = computed(() => {
  if (!guess.value || !props.correctLocation || !mapImage.value) return {}
  
  const rect = mapImage.value.getBoundingClientRect();
  const x1 = (guess.value.x / 100) * rect.width;
  const y1 = (guess.value.y / 100) * rect.height;
  const x2 = (props.correctLocation.x / 100) * rect.width;
  const y2 = (props.correctLocation.y / 100) * rect.height;
  
  // Position label at the middle of the distance line
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  return {
    left: `${midX}px`,
    top: `${midY}px`
  }
})

const calculateDistance = () => {
  if (!guess.value || !props.correctLocation) return 0
  
  return Math.sqrt(
    Math.pow(guess.value.x - props.correctLocation.x, 2) +
    Math.pow(guess.value.y - props.correctLocation.y, 2)
  )
}
</script>
