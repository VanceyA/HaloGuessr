<template>
  <div class="map-root">
    <img
      :src="mapPath"
      alt="Halo Map"
      ref="mapImage"
      class="map-img"
      :class="{
        'disabled-empty': disabled && !guess,
        'disabled-guessed': disabled && guess,
      }"
      @click="handleClick"
      @load="handleMapLoaded"
    />

    <!-- Guess marker -->
    <div
      v-if="guess"
      class="marker"
      :style="guessStyle"
      :data-x="guess.x"
      :data-y="guess.y"
    >
      <div class="marker-dot">
        <div class="marker-ping" :class="isUpload ? 'upload' : 'guess'"></div>
        <div class="marker-fill" :class="isUpload ? 'upload' : 'guess'"></div>
        <div class="marker-center"></div>
      </div>
    </div>

    <!-- Correct location marker -->
    <div
      v-if="correctLocation && !isUpload"
      class="marker"
      :style="correctLocationStyle"
    >
      <div class="marker-dot">
        <div class="marker-ping correct"></div>
        <div class="marker-fill correct"></div>
        <div class="marker-center"></div>
      </div>
    </div>

    <!-- Distance line -->
    <div
      v-if="guess && correctLocation && !isUpload"
      class="dist-line"
      :style="lineStyle"
    ></div>

    <!-- Distance label -->
    <div
      v-if="guess && correctLocation && !isUpload"
      class="dist-label"
      :style="distanceLabelStyle"
    >
      {{ calculateDistance().toFixed(0) }}%
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  mapPath: String,
  correctLocation: Object,
  isUpload: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  initialMarker: { type: Object, default: null }
})

const emit = defineEmits(['select', 'map-loaded'])
const mapImage = ref(null)
const guess = ref(null)
const mapSize = ref({ width: 0, height: 0 })
let resizeObserver = null

watch(
  () => props.mapPath,
  () => {
    if (!props.initialMarker) guess.value = null
  },
  { immediate: true }
)

const handleClick = (e) => {
  if (props.disabled) return
  const rect = mapImage.value.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  guess.value = { x, y }
  emit('select', guess.value)
}

const handleMapLoaded = () => {
  emit('map-loaded')
}

onMounted(() => {
  resizeObserver = new ResizeObserver(entries => {
    const entry = entries[0]
    if (entry) {
      const { width, height } = entry.contentRect
      mapSize.value = { width, height }
    }
  })
  if (mapImage.value) resizeObserver.observe(mapImage.value)

  if (!props.initialMarker) return
  const img = mapImage.value
  const setIt = () => {
    nextTick(() => {
      guess.value = { x: props.initialMarker.x, y: props.initialMarker.y }
      emit('select', guess.value)
    })
  }
  img.complete ? setIt() : (img.onload = setIt)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

const guessStyle = computed(() => {
  if (!guess.value || !mapSize.value.width) return {}
  return {
    left: `${(guess.value.x / 100) * mapSize.value.width}px`,
    top: `${(guess.value.y / 100) * mapSize.value.height}px`,
  }
})

const correctLocationStyle = computed(() => {
  if (!props.correctLocation || !mapSize.value.width) return {}
  return {
    left: `${(props.correctLocation.x / 100) * mapSize.value.width}px`,
    top: `${(props.correctLocation.y / 100) * mapSize.value.height}px`,
  }
})

const lineStyle = computed(() => {
  if (!guess.value || !props.correctLocation || !mapSize.value.width) return {}
  const x1 = (guess.value.x / 100) * mapSize.value.width
  const y1 = (guess.value.y / 100) * mapSize.value.height
  const x2 = (props.correctLocation.x / 100) * mapSize.value.width
  const y2 = (props.correctLocation.y / 100) * mapSize.value.height
  const length = Math.hypot(x2 - x1, y2 - y1)
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  return {
    left: `${x1}px`,
    top: `${y1}px`,
    width: `${length}px`,
    transform: `rotate(${angle}deg)`,
    transformOrigin: '0 0',
  }
})

const distanceLabelStyle = computed(() => {
  if (!guess.value || !props.correctLocation || !mapSize.value.width) return {}
  const x1 = (guess.value.x / 100) * mapSize.value.width
  const y1 = (guess.value.y / 100) * mapSize.value.height
  const x2 = (props.correctLocation.x / 100) * mapSize.value.width
  const y2 = (props.correctLocation.y / 100) * mapSize.value.height
  return {
    left: `${(x1 + x2) / 2}px`,
    top: `${(y1 + y2) / 2}px`,
  }
})

const calculateDistance = () => {
  if (!guess.value || !props.correctLocation) return 0
  return Math.hypot(
    guess.value.x - props.correctLocation.x,
    guess.value.y - props.correctLocation.y
  )
}
</script>

<style scoped>
.map-root {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  cursor: crosshair;
}
.map-img.disabled-empty  { cursor: not-allowed; }
.map-img.disabled-guessed { cursor: default; }

/* ── Markers ───────────────────────────────────────────── */
.marker {
  position: absolute;
  z-index: 10;
  transform: translate(-50%, -50%);
}

.marker-dot {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-ping {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0.7;
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.marker-fill {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.marker-center {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
}

/* Guess marker: red in play mode, blue in upload mode */
.marker-ping.guess,
.marker-fill.guess  { background: #ef4444; }
.marker-ping.upload,
.marker-fill.upload { background: #60a5fa; }

/* Correct-location marker: halo green */
.marker-ping.correct,
.marker-fill.correct { background: #4fe08a; }

/* ── Distance line ─────────────────────────────────────── */
.dist-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(to right, rgba(220, 38, 38, 0.8), rgba(123, 244, 66, 0.8));
  pointer-events: none;
}

/* ── Distance label ────────────────────────────────────── */
.dist-label {
  position: absolute;
  pointer-events: none;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
