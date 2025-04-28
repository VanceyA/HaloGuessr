export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    ['@vesp/nuxt-fontawesome', {
      icons: [
        'free-solid-svg-icons',
        'fas',
      ]
    }]
  ],
  css: [
    '~/assets/css/tailwind.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  nitro: {
    preset: 'vercel'
  },
  runtimeConfig: {
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
    adminPassword: process.env.ADMIN_PASSWORD,
    jwtSecret: process.env.JWT_SECRET,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  routeRules: {
    '/admin/**': { ssr: false },
    '/upload': { ssr: false }
  }
})