// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devServer: {
    port: 8081,
  },
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@unocss/nuxt', '@nuxt/icon', '@pinia/nuxt'],

  plugins: ['~/plugins/index.ts'],

  css: ['~/assets/styles/main.scss'],

  vite: {
    css: {
      preprocessorOptions: {},
    },
  },

  unocss: {
    // presets
    uno: true, // enabled `@unocss/preset-uno`
    icons: true, // enabled `@unocss/preset-icons`
    attributify: true, // enabled `@unocss/preset-attributify`,

    // core options
    shortcuts: [
      [
        'btn',
        'px-4 py-2 rounded-lg inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
      ],
      [
        'icon-btn',
        'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600',
      ],
    ],
    theme: {
      colors: {
        primary: '#00c6fb',
        secondary: '#005bea',
      },
    },
  },

  compatibilityDate: '2025-03-28',

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        prependPath: true,
      },
      '/upload': {
        target: 'http://localhost:3000/upload',
        changeOrigin: true,
        prependPath: true,
      },
    },
    routeRules: {
      '/': { prerender: true },
      '/posts/**': { isr: true },
      '/api/v1/**': {
        proxy: 'http://localhost:3000/**',
      },
      '/rss.xml': {
        headers: {
          'Content-Type': 'application/xml',
        },
      },
    },
  },
});
