<!-- pages/compose.vue -->
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

      <button
        @click="goHome"
        class="text-gray-400 hover:text-white flex items-center"
      >
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="mr-2" />
        Back to Menu
      </button>
    </header>

    <!-- Game Composer Content -->
    <div class="max-w-xl mx-auto w-full flex-grow flex flex-col justify-center">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-light text-blue-400 mb-2">Game Composer</h2>
        <p class="text-gray-400">Customize your HaloGuessr experience</p>
      </div>

      <div class="bg-halo-gray/30 backdrop-blur-sm rounded-lg p-6 shadow-lg">
        <div class="space-y-8">
          <!-- Number of Rounds -->
          <div>
            <label class="block text-blue-300 text-sm uppercase tracking-wider mb-3">
              Number of Rounds
            </label>
            <div class="flex items-center space-x-4">
              <button
                type="button"
                @click="decreaseRounds"
                class="bg-halo-blue/30 hover:bg-halo-blue/50 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl transition-opacity"
                :disabled="settings.rounds <= 1"
                :class="settings.rounds <= 1 ? 'opacity-50 cursor-not-allowed' : ''"
              >
                -
              </button>
              <div class="flex-grow text-center">
                <span class="text-3xl font-mono text-halo-green">{{ settings.rounds }}</span>
              </div>
              <button
                type="button"
                @click="increaseRounds"
                class="bg-halo-blue/30 hover:bg-halo-blue/50 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl transition-opacity"
                :disabled="settings.rounds >= 10"
                :class="settings.rounds >= 10 ? 'opacity-50 cursor-not-allowed' : ''"
              >
                +
              </button>
            </div>
          </div>

          <!-- Game Selection -->
          <div>
            <label class="block text-blue-300 text-sm uppercase tracking-wider mb-3">
              Halo Games
            </label>
            <div class="grid grid-cols-2 gap-3">
              <!-- "Select All" Button -->
              <button
                type="button"
                @click="toggleSelectAllEnabled"
                class="text-left px-4 py-3 rounded border border-halo-blue/30 transition-colors"
                :class="areAllEnabledSelected ? 'bg-halo-blue/30 text-white' : 'bg-black/30 text-gray-400 hover:bg-black/50'"
              >
                Select All (Halo 1 & 2)
              </button>
              <!-- Individual Game Buttons -->
              <button
                type="button"
                v-for="game in availableGames"
                :key="game.id"
                @click="toggleGameSelection(game.id)"
                class="text-left px-4 py-3 rounded border border-halo-blue/30 transition-colors"
                :class="[
                  settings.games.includes(game.id) ? 'bg-halo-blue/30 text-white' : 'bg-black/30 text-gray-400',
                  game.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/50'
                ]"
                :disabled="game.disabled"
              >
                {{ game.name }}
                <span v-if="game.disabled" class="text-xs text-red-400/70 ml-1">(Coming soon)</span>
              </button>
            </div>
             <p class="text-xs text-gray-500 mt-2">Only Halo: CE and Halo 2 are currently enabled.</p>
          </div>

          <!-- Time Limit -->
          <div>
            <label class="block text-blue-300 text-sm uppercase tracking-wider mb-3">
              Time Limit Per Round
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                v-for="time in timeLimits"
                :key="time.value"
                @click="settings.timeLimit = time.value"
                class="px-3 py-2 rounded border transition-colors"
                :class="settings.timeLimit === time.value ? 'bg-halo-blue/30 border-halo-blue text-white' : 'bg-black/30 border-halo-blue/30 text-gray-400 hover:bg-black/50'"
              >
                {{ time.label }}
              </button>
            </div>
          </div>

          <!-- Difficulty -->
          <div>
            <label class="block text-blue-300 text-sm uppercase tracking-wider mb-3">
              Difficulty
            </label>
            <div class="flex space-x-2">
              <button
                type="button"
                v-for="difficulty in ['easy', 'normal', 'hard']"
                :key="difficulty"
                @click="settings.difficulty = difficulty"
                class="flex-1 px-3 py-2 rounded capitalize border transition-colors"
                :class="settings.difficulty === difficulty ? 'bg-halo-blue/30 border-halo-blue text-white' : 'bg-black/30 border-halo-blue/30 text-gray-400 hover:bg-black/50'"
              >
                {{ difficulty }}
              </button>
            </div>
          </div>

          <!-- Start Game Button -->
          <div class="pt-4">
            <button
              type="button"
              @click="startGame"
              :disabled="isStarting || settings.games.length === 0"
              class="w-full bg-halo-green hover:bg-lime-500 text-black font-bold py-3 px-4 rounded-full shadow-md transition-colors duration-300 flex items-center justify-center"
              :class="(isStarting || settings.games.length === 0) ? 'opacity-70 cursor-not-allowed' : ''"
            >
              <svg
                v-if="isStarting"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isStarting ? 'Starting...' : 'Start Game' }}
            </button>
            <p v-if="startError || settings.games.length === 0" class="text-red-400 text-sm mt-2 text-center">
              {{ startError || (settings.games.length === 0 ? 'Please select at least one game.' : '') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isStarting = ref(false);
const startError = ref(null);

const availableGames = ref([
  { id: 'halo1', name: 'Halo: CE', disabled: false },
  { id: 'halo2', name: 'Halo 2', disabled: false },
  { id: 'halo3', name: 'Halo 3', disabled: true },
  { id: 'halo3odst', name: 'Halo 3: ODST', disabled: true },
  { id: 'haloreach', name: 'Halo Reach', disabled: true },
  { id: 'halo4', name: 'Halo 4', disabled: true },
  { id: 'halo5', name: 'Halo 5', disabled: true },
  { id: 'infinite', name: 'Halo Infinite', disabled: true },
]);

const timeLimits = ref([
  { value: 0, label: 'None' },
  { value: 30, label: '30s' },
  { value: 60, label: '1m' },
  { value: 120, label: '2m' },
  { value: 180, label: '3m' },
  { value: 300, label: '5m' },
]);

// Get IDs of enabled games
const enabledGameIds = computed(() =>
  availableGames.value.filter(g => !g.disabled).map(g => g.id)
);

const settings = ref({
  rounds: 5,
  // Start with all *enabled* games selected by default
  games: [...enabledGameIds.value],
  timeLimit: 0,
  difficulty: 'normal',
});

// Computed property to check if all enabled games are currently selected
const areAllEnabledSelected = computed(() => {
  return enabledGameIds.value.length > 0 && // Ensure there are enabled games
         enabledGameIds.value.every(id => settings.value.games.includes(id)) &&
         settings.value.games.length === enabledGameIds.value.length; // Ensure no extra games are selected
});


const increaseRounds = () => {
  if (settings.value.rounds < 10) {
    settings.value.rounds++;
  }
};

const decreaseRounds = () => {
  if (settings.value.rounds > 1) {
    settings.value.rounds--;
  }
};

// Toggles a single game selection
const toggleGameSelection = (gameId) => {
  const game = availableGames.value.find(g => g.id === gameId);
  if (!game || game.disabled) {
    return; // Ignore clicks on disabled games
  }

  const index = settings.value.games.indexOf(gameId);
  if (index > -1) {
    // If game is already selected, remove it
    settings.value.games.splice(index, 1);
  } else {
    // If game is not selected, add it
    settings.value.games.push(gameId);
  }
};

// Toggles selecting/deselecting all *enabled* games
const toggleSelectAllEnabled = () => {
    if (areAllEnabledSelected.value) {
        // If all are selected, deselect all
        settings.value.games = [];
    } else {
        // If not all (or none) are selected, select all enabled
        settings.value.games = [...enabledGameIds.value];
    }
};


const startGame = async () => {
  isStarting.value = true;
  startError.value = null;

  // Ensure at least one game is selected
  if (settings.value.games.length === 0) {
      startError.value = 'Please select at least one game.';
      isStarting.value = false;
      return;
  }

  try {
    // Send the exact selection
    const payload = { ...settings.value };

    const response = await fetch('/api/sessions/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.error || !data.sessionId) {
      console.error('Failed to start game:', data.error);
      startError.value = data.error || 'Failed to create game session.';
      return;
    }

    // Navigate to the game page with the session ID
    router.push(`/play?session=${data.sessionId}`);
  } catch (error) {
    console.error('Failed to start game:', error);
    startError.value = 'An unexpected error occurred.';
  } finally {
    isStarting.value = false;
  }
};

const goHome = () => {
  router.push('/');
};
</script>
