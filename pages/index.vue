<!-- pages/index.vue -->
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
      <a
        href="https://ko-fi.com/haloguessr"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-halo-green hover:bg-lime-500 text-black font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-300 z-50"
      >
        Donate
        <font-awesome-icon class="ml-2" :icon="['fas', 'donate']" />
      </a>
    </header>

    <!-- Main Content - Game Composer -->
    <div class="w-full max-w-4xl mx-auto flex-grow flex flex-col">
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-light text-blue-400 mb-2">
          Welcome to HaloGuessr!
        </h2>
        <p class="text-gray-400">Select a preset or create your own game below.</p>
      </div>

      <!-- Presets Section -->
      <div class="mb-10">
        <h3 class="text-xl text-blue-300 uppercase tracking-wider mb-4 border-b border-halo-blue/20 pb-2">
          Presets
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            v-for="preset in presets"
            :key="preset.id"
            @click="startPresetGame(preset)"
            class="bg-halo-gray/20 backdrop-blur-sm rounded-lg p-4 text-left hover:bg-halo-gray/40 transition-colors border border-transparent hover:border-halo-blue/30"
          >
            <div class="flex items-center mb-2">
              <font-awesome-icon
                :icon="preset.icon"
                class="text-halo-green mr-3 text-xl w-6 text-center"
              />
              <span class="font-semibold text-lg text-white">{{ preset.name }}</span>
            </div>
            <p class="text-sm text-gray-400">{{ preset.description }}</p>
          </button>
        </div>
      </div>

      <!-- Custom Game Section -->
      <div>
        <h3 class="text-xl text-blue-300 uppercase tracking-wider mb-4 border-b border-halo-blue/20 pb-2">
          Custom Game
        </h3>
        <div class="bg-halo-gray/30 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <div class="grid md:grid-cols-2 gap-x-8 gap-y-6">
            <!-- Number of Rounds -->
            <div>
              <label class="block text-blue-300 text-sm uppercase tracking-wider mb-3">
                Number of Rounds
              </label>
              <div class="flex items-center space-x-4">
                <button
                  type="button"
                  @click="decreaseRounds"
                  class="bg-halo-blue/30 hover:bg-halo-blue/50 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg transition-opacity"
                  :disabled="settings.rounds <= 1 && !settings.unlimited"
                  :class="(settings.rounds <= 1 && !settings.unlimited) || settings.unlimited ? 'opacity-50 cursor-not-allowed' : ''"
                >
                  -
                </button>
                <div class="flex-grow text-center">
                  <span v-if="!settings.unlimited" class="text-2xl font-mono text-halo-green">{{ settings.rounds }}</span>
                  <span v-else class="text-2xl font-mono text-halo-green italic">Unlimited</span>
                </div>
                <button
                  type="button"
                  @click="increaseRounds"
                  class="bg-halo-blue/30 hover:bg-halo-blue/50 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg transition-opacity"
                  :disabled="settings.rounds >= 50 && !settings.unlimited"
                  :class="(settings.rounds >= 50 && !settings.unlimited) || settings.unlimited ? 'opacity-50 cursor-not-allowed' : ''"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                @click="toggleUnlimitedRounds"
                class="w-full mt-3 px-3 py-1.5 rounded border text-xs transition-colors"
                :class="settings.unlimited ? 'bg-halo-blue/30 border-halo-blue text-white' : 'bg-black/30 border-halo-blue/30 text-gray-400 hover:bg-black/50'"
              >
                {{ settings.unlimited ? 'Set Round Limit' : 'Go Unlimited' }}
              </button>
            </div>

            <!-- Game Selection -->
            <div>
              <label class="block text-blue-300 text-sm uppercase tracking-wider mb-3">
                Halo Games
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="toggleSelectAllEnabled"
                  class="text-left px-3 py-2 rounded border border-halo-blue/30 transition-colors text-sm"
                  :class="areAllEnabledSelected ? 'bg-halo-blue/30 text-white' : 'bg-black/30 text-gray-400 hover:bg-black/50'"
                >
                  Select All Enabled
                </button>
                <button
                  type="button"
                  v-for="game in availableGames"
                  :key="game.id"
                  @click="toggleGameSelection(game.id)"
                  class="text-left px-3 py-2 rounded border border-halo-blue/30 transition-colors text-sm"
                  :class="[
                    settings.games.includes(game.id) ? 'bg-halo-blue/30 text-white' : 'bg-black/30 text-gray-400',
                    game.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/50'
                  ]"
                  :disabled="game.disabled"
                >
                  {{ game.name }}
                  <span v-if="game.disabled" class="text-xs text-red-400/70 ml-1">Coming Soon</span>
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Only Halo: CE, Halo 2, and Halo 3 are currently available.
              </p>
            </div>

            <!-- Time Limit -->
            <div class="md:col-span-1">
              <label class="block text-blue-300 text-sm uppercase tracking-wider mb-3">
                Time Limit Per Round
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  v-for="time in timeLimits"
                  :key="time.value"
                  @click="settings.timeLimit = time.value"
                  class="px-3 py-2 rounded border transition-colors text-sm"
                  :class="settings.timeLimit === time.value ? 'bg-halo-blue/30 border-halo-blue text-white' : 'bg-black/30 border-halo-blue/30 text-gray-400 hover:bg-black/50'"
                >
                  {{ time.label }}
                </button>
              </div>
            </div>

            <!-- Difficulty -->
            <!-- <div class="md:col-span-1">
              <label class="block text-blue-300 text-sm uppercase tracking-wider mb-3">
                Difficulty
              </label>
              <div class="flex space-x-2">
                <button
                  type="button"
                  v-for="difficulty in ['easy', 'normal', 'hard']"
                  :key="difficulty"
                  @click="settings.difficulty = difficulty"
                  class="flex-1 px-3 py-2 rounded capitalize border transition-colors text-sm"
                  :class="settings.difficulty === difficulty ? 'bg-halo-blue/30 border-halo-blue text-white' : 'bg-black/30 border-halo-blue/30 text-gray-400 hover:bg-black/50'"
                >
                  {{ difficulty }}
                </button>
              </div>
            </div> -->

            <!-- Start Custom Game Button -->
            <div class="md:col-span-2 pt-4">
              <button
                type="button"
                @click="startCustomGame"
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
                {{ isStarting ? 'Starting...' : 'Start Custom Game' }}
              </button>
              <p v-if="startError || settings.games.length === 0" class="text-red-400 text-sm mt-2 text-center">
                {{ startError || (settings.games.length === 0 ? 'Please select at least one game.' : '') }}
              </p>
            </div>
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

// --- Game Data ---
const availableGames = ref([
  { id: 'halo1', name: 'Halo: CE', disabled: false },
  { id: 'halo2', name: 'Halo 2', disabled: false },
  { id: 'halo3', name: 'Halo 3', disabled: false },
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

const enabledGameIds = computed(() =>
  availableGames.value.filter((g) => !g.disabled).map((g) => g.id),
);

// --- Presets Definition ---
const presets = ref([
  {
    id: 'quickplay',
    name: 'Quick Play',
    icon: ['fas', 'play'],
    description: '5 rounds, random locations from all available Halo games.',
    settings: {
      rounds: 5,
      games: [...enabledGameIds.value],
      timeLimit: 0,
      difficulty: 'normal',
      unlimited: false,
    },
  },
  {
    id: 'endless',
    name: 'Endless',
    icon: ['fas', 'infinity'],
    description: 'Unlimited rounds from all available Halo games. Play as long as you can!',
    settings: {
      rounds: 5, // This value is ignored when unlimited is true
      games: [...enabledGameIds.value],
      timeLimit: 0,
      difficulty: 'normal',
      unlimited: true,
    },
  },
  {
    id: 'trilogy',
    name: 'Trilogy',
    icon: ['fas', 'dice-three'],
    description: 'Classic trilogy locations from Halo: CE, 2, and 3.',
    settings: {
      rounds: 10,
      games: ['halo1', 'halo2'], // Explicitly define enabled games for this preset
      timeLimit: 0,
      difficulty: 'normal',
      unlimited: false,
    },
  },
  // Add more presets as games become enabled
  // {
  //     id: 'bungie',
  //     name: 'Bungie Era',
  //     icon: ['fas', 'history'],
  //     description: 'Locations from Halo CE, 2, 3, ODST, and Reach.',
  //     settings: { rounds: 10, games: ['halo1', 'halo2', 'halo3', 'halo3odst', 'haloreach'], timeLimit: 0, difficulty: 'normal', unlimited: false }
  // },
  // {
  //     id: '343',
  //     name: '343 Era',
  //     icon: ['fas', 'microchip'],
  //     description: 'Locations from Halo 4, 5, and Infinite.',
  //     settings: { rounds: 10, games: ['halo4', 'halo5', 'infinite'], timeLimit: 0, difficulty: 'normal', unlimited: false }
  // },
]);

// --- Custom Settings State ---
const settings = ref({
  rounds: 5,
  games: [...enabledGameIds.value], // Default to all enabled
  timeLimit: 0,
  difficulty: 'normal',
  unlimited: false, // New flag for unlimited rounds
});

// --- Computed Properties for Custom Settings ---
const areAllEnabledSelected = computed(() => {
  return (
    enabledGameIds.value.length > 0 && // Ensure there are enabled games
    enabledGameIds.value.every((id) => settings.value.games.includes(id)) &&
    settings.value.games.length === enabledGameIds.value.length
  ); // Ensure no extra games are selected
});

// --- Methods for Custom Settings ---
const increaseRounds = () => {
  if (!settings.value.unlimited && settings.value.rounds < 50) {
    // Set a reasonable max limit
    settings.value.rounds++;
  }
};

const decreaseRounds = () => {
  if (!settings.value.unlimited && settings.value.rounds > 1) {
    settings.value.rounds--;
  }
};

const toggleUnlimitedRounds = () => {
  settings.value.unlimited = !settings.value.unlimited;
  if (settings.value.unlimited) {
    // Optionally reset rounds to a default when switching to unlimited, or keep it
    // settings.value.rounds = 5;
  } else {
    // Ensure rounds is at least 1 when switching back
    if (settings.value.rounds < 1) settings.value.rounds = 1;
  }
};

const toggleGameSelection = (gameId) => {
  const game = availableGames.value.find((g) => g.id === gameId);
  if (!game || game.disabled) return; // Ignore clicks on disabled games

  const index = settings.value.games.indexOf(gameId);
  if (index > -1) {
    settings.value.games.splice(index, 1);
  } else {
    settings.value.games.push(gameId);
  }
};

const toggleSelectAllEnabled = () => {
  if (areAllEnabledSelected.value) {
    settings.value.games = [];
  } else {
    settings.value.games = [...enabledGameIds.value];
  }
};

// --- Start Game Logic ---
const startGame = async (gameSettings) => {
  isStarting.value = true;
  startError.value = null;

  // Ensure at least one game is selected
  if (!gameSettings || !gameSettings.games || gameSettings.games.length === 0) {
    startError.value = 'Please select at least one game.';
    isStarting.value = false;
    return;
  }

  try {
    // Prepare payload: use 0 for rounds if unlimited is true
    const payload = {
      ...gameSettings,
      rounds: gameSettings.unlimited ? 0 : gameSettings.rounds, // Send 0 to API for unlimited
    };
    // Remove the 'unlimited' flag itself before sending if your API doesn't expect it
    delete payload.unlimited;

    const response = await fetch('/api/sessions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.error || !data.sessionId) {
      console.error('Failed to start game:', data.error);
      startError.value = data.error || 'Failed to create game session.';
      return;
    }

    router.push(`/play?session=${data.sessionId}`);
  } catch (error) {
    console.error('Failed to start game:', error);
    startError.value = 'An unexpected error occurred.';
  } finally {
    isStarting.value = false;
  }
};

// Specific handlers for buttons
const startPresetGame = (preset) => {
  // Filter preset games to only include currently enabled ones
  const enabledPresetGames = preset.settings.games.filter((gameId) =>
    enabledGameIds.value.includes(gameId),
  );

  if (enabledPresetGames.length === 0) {
    startError.value = `The preset "${preset.name}" currently has no enabled games.`;
    return;
  }

  const settingsToSend = {
    ...preset.settings,
    games: enabledPresetGames, // Use only the enabled games from the preset
  };
  startGame(settingsToSend);
};

const startCustomGame = () => {
  // Ensure custom selection has at least one enabled game
  const enabledCustomGames = settings.value.games.filter((gameId) =>
    enabledGameIds.value.includes(gameId),
  );
  if (enabledCustomGames.length === 0) {
    startError.value = 'Please select at least one enabled game (Halo 1 or 2).';
    return;
  }
  // Use the current custom settings state, but ensure only enabled games are included
  const settingsToSend = {
    ...settings.value,
    games: enabledCustomGames,
  };
  startGame(settingsToSend);
};
</script>
