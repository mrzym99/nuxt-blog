// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: '小张的个人博客',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'description',
          content: 'Nuxt4 Blog，分享知识，记录生活。',
        },
        {
          name: 'keywords',
          content: 'Nuxt, Nest, Blog, Nuxt4, Vue3',
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
    // pageTransition: { name: 'page', mode: 'out-in' },
  },
  ssr: true,
  devServer: {
    port: 8048,
  },
  modules: [
    '@unocss/nuxt',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@nuxtjs/sitemap',
    // '@nuxt/eslint',
    '@nuxtjs/color-mode',
    'vue-sonner/nuxt',
    'nuxt-svgo',
  ],
  vueSonner: {
    css: true, // true by default to include css file
  },
  build: {
    transpile: ['vue-sonner'],
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
  unocss: {
    nuxtLayers: true,
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/_variables.scss" as *;',
        },
      },
    },
  },
  css: ['@unocss/reset/tailwind.css', 'photoswipe/style.css', '~/assets/styles/index.scss'],
  plugins: ['~/plugins/index.ts', '~/plugins/vee.ts', '~/plugins/auth.ts'],
  icon: {
    localApiEndpoint: '/nuxt-icon',
  },
  site: {
    url: 'https://blog.mrzym.top',
    name: '小张的个人博客',
  },
  sitemap: {
    exclude: ['/login/**', '/user-center/**'],
    sources: ['/api/__sitemap__/urls'],
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
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode',
  },
  nitro: {
    devProxy: {
      '/upload': {
        target: 'http://127.0.0.1:3000/upload',
      },
    },
  },
});
