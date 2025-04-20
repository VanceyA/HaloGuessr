// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css'],
  nitro: {
    preset: 'vercel' // Optimize for Vercel
  },
  runtimeConfig: {
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN // Expose Blob token to server
  }
})