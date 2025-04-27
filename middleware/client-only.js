export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server
  if (process.server) return
})
