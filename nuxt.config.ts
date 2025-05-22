// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  ssr: true,
  devServer: {
    port: 8081,
  },
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@unocss/nuxt',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
  ],

  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },

  plugins: ['~/plugins/index.ts'],

  css: ['~/assets/styles/main.scss'],

  vite: {
    css: {
      preprocessorOptions: {},
    },
  },

  icon: {
    localApiEndpoint: '/nuxt-icon',
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

  compatibilityDate: '2025-05-14',

  nitro: {
    devProxy: {
      '/api': {
        target: 'https://nest-server.mrzym.top:3366',
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
      '/rss.xml': {
        headers: {
          'Content-Type': 'application/xml',
        },
      },
    },
  },
});
