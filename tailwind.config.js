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
        'halo-green': '#7bf442',
        'halo-blue': '#1c3b57',
        'halo-dark': '#0a1929',
        'halo-gray': '#263238',
        'halo-accent': '#52b2bf',
        'unsc': '#415a77'
      },
    }
  },
  plugins: []
}