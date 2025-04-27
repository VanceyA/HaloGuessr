export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css'],
  nitro: {
    preset: 'vercel'
  },
  runtimeConfig: {
    upstashRedisUrl: process.env.KV_REST_API_URL,
    upstashRedisToken: process.env.KV_REST_API_TOKEN,
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
    adminPassword: process.env.ADMIN_PASSWORD,
    jwtSecret: process.env.JWT_SECRET,
  },
  routeRules: {
    '/admin/**': { ssr: false },
    '/upload': { ssr: false }
  }
})