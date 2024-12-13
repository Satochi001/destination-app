// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  typescript: {
    typeCheck: true
  },
  ssr : false,
  app: {
    baseURL: '/destination-app', // Replace with your GitHub repo name
  },


  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  generate: {
    routes: ['/'],
  },

  
});