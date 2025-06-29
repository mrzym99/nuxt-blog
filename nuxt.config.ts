// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

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
  ],

  sitemap: {
    sources: [
      // 'https://nest-server.mrzym.top:3366/blog/article/list/front?currentPage=1&pageSize=9999',
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
      '/': { prerender: true },
      // '/posts/**': { isr: true },
      '/rss.xml': {
        headers: {
          'Content-Type': 'application/xml',
        },
      },
      '/api/**': {
        proxy: `${import.meta.env.VITE_API_BASE}/api/**`,
      },
    },
  },
  hooks: {
    async 'prerender:routes'(ctx) {
      const response = await fetch(
        'https://nest-server.mrzym.top:3366/blog/article/list/front?currentPage=1&pageSize=9999'
      );
      const res = await response.json();
      const pages = res.data.list.map((item: any) => `/posts/${item.id}`);
      for (const page of pages) {
        ctx.routes.add(page);
      }
    },
  },
});
