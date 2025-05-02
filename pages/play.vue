<!-- pages/play.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-b from-halo-dark to-black text-gray-200
           flex flex-col p-4 md:p-8 relative"
  >
    <!-- Header -->
    <header class="mb-6 md:mb-8 flex items-center justify-between">
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
      <div class="flex items-center space-x-4">
          <!-- Timer Display -->
          <div v-if="roundTimeLimit > 0 && screenshot && !result && !sessionComplete && !isLoadingNextLevel && !isLoadingInitial"
               class="font-mono text-xl px-3 py-1 rounded bg-black/30 border border-halo-blue/20"
               :class="timeLeft <= 10 && timeLeft > 0 ? 'text-red-400 animate-pulse border-red-500/50' : 'text-blue-300'">
              <font-awesome-icon :icon="['far', 'clock']" class="mr-2 opacity-70" />
              {{ formattedTimeLeft }}
          </div>
          <!-- End Timer Display -->

          <a
            v-if="!activeSession"
            href="https://ko-fi.com/haloguessr"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-halo-green hover:bg-lime-500 text-black font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-300 z-50"
          >
            Donate <font-awesome-icon class="ml-2" :icon="['fas', 'donate']" />
          </a>
          <button
            v-else-if="!result && !sessionComplete"
            @click="exitSession"
            class="text-gray-400 hover:text-white flex items-center"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="mr-2" />
            Exit Game
          </button>
      </div>
    </header>

    <!-- Session Progress UI -->
    <div v-if="activeSession && screenshot && !sessionComplete" class="w-full max-w-7xl mx-auto mb-4">
      <div class="bg-halo-gray/30 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="px-3 py-1 rounded bg-halo-blue/20 text-blue-300 text-sm font-mono">
            <span v-if="sessionData.maxRounds > 0">
              Round {{ sessionData.currentRound }}/{{ sessionData.maxRounds }}
            </span>
            <span v-else>
              Round {{ sessionData.currentRound }} (Endless)
            </span>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-halo-green mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="text-gray-400 text-sm mr-1">Total Score:</span>
            <span class="font-mono font-bold text-halo-green">{{ sessionData.totalScore }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Game Content -->
    <div
      v-if="screenshot && !sessionComplete"
      class="w-full max-w-7xl mx-auto flex-grow"
      :class="{ 'opacity-0': !imagesLoaded && !isLoadingInitial }"
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
          <!-- Score Display (Quick Play only) -->
          <div v-if="!activeSession" class="bg-halo-gray/30 backdrop-blur-sm rounded-t-lg p-2 border-b border-halo-blue/30 flex items-center justify-between">
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-halo-green mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div class="text-gray-400 uppercase text-xs tracking-wider">
                Round {{ sessionData.currentRound }}/{{ sessionData.maxRounds }} Score
              </div>
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
                  > <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /> </svg>
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
                  > <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" /> </svg>
                </button>
              </div>
            </div>

            <!-- Accuracy/Points UI -->
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
              <!-- Timeout Overlay -->
              <div
                v-if="showTimeoutOverlay"
                class="absolute inset-0 bg-red-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-white"
              >
                 <font-awesome-icon :icon="['fas', 'clock']" class="text-4xl mb-3 animate-ping" />
                 <p class="text-xl font-bold">TIME'S UP!</p>
                 <p class="text-sm">Processing result...</p>
              </div>
              <!-- Processing Overlay -->
              <div
                v-if="hasGuessed && !result && !showTimeoutOverlay"
                class="absolute inset-0 bg-black/70 flex items-center justify-center z-10"
              >
                <div class="animate-pulse text-halo-green font-bold flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-halo-green"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  > <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
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
          </div>
        </div>
      </div>
    </div>

    <!-- Game Complete Screen -->
    <div
      v-if="(activeSession || !activeSession && sessionData.maxRounds > 0) && sessionComplete"
      class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="max-w-2xl w-full p-6 bg-halo-gray/30 backdrop-blur-sm rounded-lg shadow-2xl">
        <h2 class="text-3xl font-light text-blue-400 mb-6 text-center">Game Complete!</h2>
        <div class="bg-black/50 rounded-lg p-5 mb-6">
          <div class="text-center mb-6">
            <div class="text-5xl font-mono font-bold text-halo-green mb-2">{{ sessionData.totalScore }}</div>
            <div class="text-gray-400 uppercase text-sm tracking-wider">Total Score</div>
          </div>
          <div class="space-y-3 max-h-60 overflow-y-auto pr-2">
            <div v-for="(round, index) in sessionRounds" :key="index"
                class="flex items-center justify-between p-2 border-b border-halo-blue/20 last:border-b-0">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-halo-blue/20 flex items-center justify-center mr-3 text-sm">
                  {{ round.round_number }}
                </div>
                <div class="text-sm text-gray-300">{{ getRoundDescription(round) }}</div>
              </div>
              <div class="font-mono font-bold text-halo-green">{{ round.score }}</div>
            </div>
          </div>
        </div>
        <div class="flex space-x-4">
          <button
            @click="exitSession"
            class="flex-1 bg-halo-blue/20 hover:bg-halo-blue/40 text-white py-3 px-4 rounded transition-colors"
          > Back to Menu </button>
          <button
            @click="playAgainWithSameSettings"
            class="flex-1 bg-halo-green hover:bg-lime-500 text-black font-bold py-3 px-4 rounded transition-colors flex items-center justify-center"
          > Play Again </button>
        </div>
      </div>
    </div>

    <!-- Initial Loading State -->
    <div
      v-if="!screenshot && !sessionComplete && isLoadingInitial"
      class="flex-grow flex items-center justify-center"
    > <div class="text-center"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-halo-green mb-4"></div> <p class="text-lg text-blue-300">Loading Halo location...</p> </div> </div>

    <!-- Loading Overlay for Next Round -->
    <div
      v-if="isLoadingNextLevel && !isLoadingInitial"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    > <div class="text-center"> <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-halo-green mb-4"></div> <p class="text-xl text-halo-green font-bold">Loading Next Location</p> <div class="mt-3 w-40 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden"> <div class="h-full bg-halo-green animate-pulse"></div> </div> </div> </div>

    <!-- Mod Info Panel -->
    <div
      v-if="showModInfo && screenshot"
      class="fixed bottom-4 right-4 bg-black/80 text-halo-green p-3 rounded shadow-lg z-50 border border-halo-blue/50"
    > <div class="text-xs uppercase tracking-wider text-blue-400 mb-1">Mod Info</div> <div class="font-mono">ID: {{ screenshot.id }}</div> <div class="mt-2 text-xs text-gray-400"> Press {{ isMac ? '⌘' : 'Ctrl' }}+K to hide </div> </div>
  </div>
</template>

<script setup>
// --- Imports and Setup ---
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MapCanvas from '~/components/MapCanvas.vue';

const route = useRoute();
const router = useRouter();

// --- State Refs ---
const screenshot = ref(null);
const result = ref(null);
const score = ref(0); // Quick Play score accumulator
const hasGuessed = ref(false);
const currentId = ref(null);
const isLoadingInitial = ref(true);
const isLoadingNextLevel = ref(false); // For subsequent loads overlay
const screenshotLoaded = ref(false);
const mapLoaded = ref(false);
const pendingGuess = ref(null);
const showModInfo = ref(false);
const isMac = ref(false);

// Session State / Quick Play State
const activeSession = ref(null);
const sessionData = ref({ currentRound: 0, maxRounds: 0, totalScore: 0 });
const sessionRounds = ref([]);
const sessionComplete = ref(false);
const sessionSettings = ref(null);

// --- Timer State ---
const roundTimeLimit = ref(0);
const timeLeft = ref(0);
const timerIntervalId = ref(null);
const showTimeoutOverlay = ref(false);

// --- Computed Properties ---
// This computed property determines if both essential images are ready
const imagesLoaded = computed(() => screenshotLoaded.value && mapLoaded.value);

const accuracy = computed(() => {
  if (!result.value?.correctLocation || !pendingGuess.value) return 0;
  const dx = pendingGuess.value.x - result.value.correctLocation.x;
  const dy = pendingGuess.value.y - result.value.correctLocation.y;
  const distance = Math.hypot(dx, dy);
  const perfectRadius = 3;
  const maxDistance = 50;

  if (distance <= perfectRadius) return 100;
  if (distance > maxDistance) return 0;

  const normalizedDistance = (distance - perfectRadius) / (maxDistance - perfectRadius);
  return Math.max(0, 100 * (1 - Math.pow(normalizedDistance, 1.5)));
});

const formattedTimeLeft = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// --- Watchers ---
watch(screenshot, () => {
  // Reset flags when the screenshot *data* changes (before images start loading)
  screenshotLoaded.value = false;
  mapLoaded.value = false;
  pendingGuess.value = null;
  result.value = null;
  showTimeoutOverlay.value = false;
}, { immediate: false });

// Watch when both images are loaded to start the timer
watch(imagesLoaded, (newValue) => {
    // Only start timer if images just finished loading, time limit exists,
    // user hasn't guessed, and game isn't over.
    if (newValue && roundTimeLimit.value > 0 && !hasGuessed.value && !sessionComplete.value) {
        startRoundTimer();
    }
    // Hide loading overlay *only* when images are loaded
    // This handles the case where one image loads much faster than the other.
    if (newValue) {
        isLoadingNextLevel.value = false;
    }
});

// --- Lifecycle Hooks ---
onMounted(() => {
  const sessionId = route.query.session;
  if (sessionId) {
    activeSession.value = sessionId;
    loadSession(sessionId);
  } else {
    // Quick Play mode
    sessionData.value = { currentRound: 0, maxRounds: 5, totalScore: 0 };
    sessionRounds.value = [];
    score.value = 0;
    sessionComplete.value = false;
    roundTimeLimit.value = 0;
    fetchScreenshot();
  }

  detectPlatform();
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  stopRoundTimer();
  window.removeEventListener('keydown', handleKeyDown);
});

// --- Timer Functions ---
function startRoundTimer() {
    stopRoundTimer();
    if (roundTimeLimit.value <= 0 || hasGuessed.value) return;

    timeLeft.value = roundTimeLimit.value;
    timerIntervalId.value = setInterval(() => {
        timeLeft.value--;
        if (timeLeft.value <= 0) {
            handleTimeout();
        }
    }, 1000);
}

function stopRoundTimer() {
    if (timerIntervalId.value) {
        clearInterval(timerIntervalId.value);
        timerIntervalId.value = null;
    }
}

function handleTimeout() {
    stopRoundTimer();
    if (hasGuessed.value) return;

    console.log("Time's up!");
    showTimeoutOverlay.value = true;
    pendingGuess.value = null;

    nextTick(() => {
        confirmGuess();
    });
}


// --- Async Functions ---
async function loadSession(sessionId) {
  isLoadingInitial.value = true;
  sessionComplete.value = false;
  stopRoundTimer();
  try {
    const response = await fetch(`/api/sessions/${sessionId}`);
    const data = await response.json();

    if (data.error) {
      console.error('Failed to load session:', data.error);
      router.push('/');
      return;
    }

    sessionSettings.value = data.settings;
    sessionData.value = {
      currentRound: data.currentRound,
      maxRounds: data.maxRounds,
      totalScore: data.totalScore,
    };
    sessionRounds.value = data.rounds || [];
    roundTimeLimit.value = parseInt(data.settings?.timeLimit, 10) || 0;

    if (data.isComplete) {
      sessionComplete.value = true;
      isLoadingInitial.value = false; // Don't show initial loading if game already complete
    } else {
      fetchScreenshot(sessionId); // This will eventually set isLoadingInitial = false
    }
  } catch (error) {
    console.error('Failed to load session:', error);
    router.push('/');
    isLoadingInitial.value = false;
  }
  // No finally block needed here for isLoadingInitial, fetchScreenshot handles it
}

async function fetchScreenshot(sessionId = null) {
  // Set loading state *before* the fetch starts
  if (!isLoadingInitial.value) {
    isLoadingNextLevel.value = true; // Show overlay only for next rounds
  }
  hasGuessed.value = false;
  stopRoundTimer();

  // Reset image loaded flags *before* fetching new data
  // This ensures imagesLoaded becomes false immediately
  screenshotLoaded.value = false;
  mapLoaded.value = false;

  try {
    const endpoint = sessionId
      ? `/api/levels/random?sessionId=${sessionId}`
      : '/api/levels/random';

    const res = await fetch(endpoint);
    const data = await res.json();

    // Handle errors first
    if (data.error) {
      isLoadingInitial.value = false; // Ensure loading stops on error
      isLoadingNextLevel.value = false;
      if (sessionId && data.sessionComplete) {
        loadSession(sessionId); // Reload to show final screen
        return;
      }
      console.error("Error fetching screenshot:", data.error);
      if (!sessionId && sessionData.value.currentRound > 0) {
          sessionComplete.value = true;
          sessionData.value.totalScore = score.value;
      } else { router.push('/'); }
      return;
    }

    // Update state with new data
    screenshot.value = data; // This triggers the watcher to reset flags again, which is fine
    currentId.value = data.id;

    // Update round counter and time limit
    if (data.sessionData) {
        roundTimeLimit.value = parseInt(data.sessionData.timeLimit, 10) || 0;
        if (sessionId) {
            sessionData.value.currentRound = data.sessionData.currentRound;
            sessionData.value.maxRounds = data.sessionData.maxRounds;
        } else {
            sessionData.value.currentRound++;
        }
    } else {
        roundTimeLimit.value = 0;
        if (!sessionId) sessionData.value.currentRound++;
    }

  } catch (e) {
    console.error("Fetch screenshot exception:", e);
    isLoadingInitial.value = false; // Ensure loading stops on error
    isLoadingNextLevel.value = false;
    router.push('/');
  } finally {
     // Don't set loading flags to false here. Let the image load callbacks handle it.
     // Only set initial loading false if it hasn't been set yet (e.g., on first load error)
     if (isLoadingInitial.value) {
         isLoadingInitial.value = false;
     }
  }
}

async function confirmGuess() {
  if (hasGuessed.value) return;
  stopRoundTimer();
  hasGuessed.value = true;

  try {
    const requestBody = {
      id: screenshot.value.id,
      guess: pendingGuess.value,
    };
    if (activeSession.value) {
      requestBody.sessionId = activeSession.value;
    }

    const res = await fetch('/api/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const data = await res.json();

    if (data.error) {
      console.error("Guess error:", data.error);
      hasGuessed.value = false; // Allow retry
      return;
    }

    result.value = data;
    showTimeoutOverlay.value = false;

    const completedRoundData = {
        round_number: sessionData.value.currentRound,
        score: data.score,
        level_id: screenshot.value.id,
    };

    if (activeSession.value && data.sessionData) {
      sessionData.value = {
        currentRound: data.sessionData.currentRound,
        maxRounds: data.sessionData.maxRounds,
        totalScore: data.sessionData.totalScore,
      };
      sessionRounds.value.push(completedRoundData);
    } else if (!activeSession.value) {
      score.value += data.score;
      sessionRounds.value.push(completedRoundData);
      if (sessionData.value.currentRound >= sessionData.value.maxRounds) {
          sessionComplete.value = true;
          sessionData.value.totalScore = score.value;
      }
    }
  } catch (e) {
    console.error("Confirm guess exception:", e);
    hasGuessed.value = false;
  }
}

// --- Action Functions ---
function nextScreenshot() {
    stopRoundTimer();
    if (activeSession.value && sessionData.value.maxRounds > 0 && sessionData.value.currentRound >= sessionData.value.maxRounds) {
        loadSession(activeSession.value);
        return;
    }
    if (!activeSession.value && sessionComplete.value) {
        return;
    }

  // Don't reset flags here, fetchScreenshot does it
  // screenshotLoaded.value = false;
  // mapLoaded.value = false;
  result.value = null;
  pendingGuess.value = null;
  showTimeoutOverlay.value = false;

  fetchScreenshot(activeSession.value);
}

function exitSession() {
  stopRoundTimer();
  router.push('/');
}

function playAgainWithSameSettings() {
  stopRoundTimer();
  router.push('/');
}

function getRoundDescription(round) {
  return `Round ${round.round_number}`;
}

// --- Helper Functions ---
function onScreenshotLoaded() {
  screenshotLoaded.value = true;
  // The watcher for imagesLoaded handles setting isLoadingNextLevel = false
  // and starting the timer. No need to duplicate logic here.
}

function onMapLoaded() {
  mapLoaded.value = true;
  // The watcher for imagesLoaded handles setting isLoadingNextLevel = false
  // and starting the timer. No need to duplicate logic here.
}

function onSelect(coords) {
  if (!hasGuessed.value) {
      pendingGuess.value = coords;
  }
}

function detectPlatform() {
  if (typeof navigator !== 'undefined') {
    isMac.value = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }
}

function handleKeyDown(e) {
  if ((isMac.value ? e.metaKey : e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    if (screenshot.value) {
      console.log('Screenshot ID:', screenshot.value.id);
      showModInfo.value = !showModInfo.value;
    }
  }
}
</script>
