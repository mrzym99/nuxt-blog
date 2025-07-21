// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';
import generateDynamicSitemap from './utils/sitemap';

export default defineNuxtConfig({
  app: {
    head: {
      title: '小张的个人博客',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'description',
          content: 'Nuxt 3 Blog，分享知识，记录生活。',
        },
        {
          name: 'keywords',
          content: 'Nuxt, Nest, Blog, Nuxt3, Vue3',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
        {
          name: 'googlebot',
          content: 'index, follow',
        },
      ],
    },
  },
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
    '@nuxtjs/sitemap',
    'nuxt-easy-lightbox',
  ],
  site: {
    url: 'https://blog.mrzym.top',
    name: '小张的个人博客',
  },
  sitemap: {
    exclude: ['/login/**', '/user-center/**'],
    urls: async () => await generateDynamicSitemap(),
    cacheMaxAgeSeconds: 6 * 60 * 60,
    autoLastmod: true,
    // 添加更多配置
    defaults: {
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    },
    // 确保sitemap可以被搜索引擎访问
    xslColumns: [
      { label: 'URL', width: '50%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
      { label: 'Change Frequency', select: 'sitemap:changefreq', width: '12.5%' },
    ],
  },

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
    routeRules: {
      '/rss.xml': {
        headers: {
          'Content-Type': 'application/xml',
        },
      },
      // 确保sitemap可以被访问
      '/sitemap.xml': {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600',
        },
      },
    },
  },
});
