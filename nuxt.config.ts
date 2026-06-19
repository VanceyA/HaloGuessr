export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap' }
      ]
    }
  },
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