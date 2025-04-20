/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        'halo-green': '#1a3c34', // UNSC green
        'halo-purple': '#4b0082' // Covenant purple
      }
    }
  },
  plugins: []
}