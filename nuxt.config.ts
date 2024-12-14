// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'


export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  typescript: {
    typeCheck: true
  },

  ssr : false,
  // Necessary for static site generation

  app : {
    baseURL: '/destination-app', // Replace with your GitHub repo name
  },


  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
 
 

  
});