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

    <!-- Main Content -->
    <div class="w-full max-w-7xl mx-auto flex-grow flex flex-col items-center justify-center">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-light text-blue-400 mb-4">
          Welcome to
          <span class="font-bold text-white">HALO</span>
          <span class="text-blue-400">GUESSR</span>
        </h2>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
          Test your knowledge of Halo locations. How well do you know the UNSC
          universe?
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div
          class="bg-halo-gray/20 backdrop-blur-sm rounded-lg p-8 flex flex-col items-center text-center hover:bg-halo-gray/30 transition-colors"
        >
          <div class="mb-6 text-7xl text-halo-green">
            <font-awesome-icon :icon="['fas', 'play']" />
          </div>
          <h3 class="text-2xl font-light text-blue-400 mb-3">Quick Play</h3>
          <p class="text-gray-400 mb-6">
            Jump right into a random Halo location
          </p>
          <button
            @click="startQuickPlay"
            class="bg-halo-green hover:bg-lime-500 text-black font-bold py-3 px-8 rounded-full shadow-md transition-colors duration-300"
          >
            Play Now
          </button>
        </div>

        <div
          class="bg-halo-gray/20 backdrop-blur-sm rounded-lg p-8 flex flex-col items-center text-center hover:bg-halo-gray/30 transition-colors"
        >
          <div class="mb-6 text-7xl text-halo-blue">
            <font-awesome-icon :icon="['fas', 'cog']" />
          </div>
          <h3 class="text-2xl font-light text-blue-400 mb-3">Custom Game</h3>
          <p class="text-gray-400 mb-6">
            Choose your settings and create a custom game
          </p>
          <button
            @click="goToComposer"
            class="bg-halo-blue hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-colors duration-300"
          >
            Customize
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function startQuickPlay() {
  // For quick play, we just go straight to the play page without a session
  router.push('/play');
}

function goToComposer() {
  router.push('/compose');
}
</script>
