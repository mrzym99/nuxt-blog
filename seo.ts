import type { NuxtAppConfig } from 'nuxt/schema';

export const nuxtHead: NuxtAppConfig['head'] = {
  title: import.meta.env.VITE_APP_NAME,
  meta: [
    { charset: 'utf-8' },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'description',
      content: import.meta.env.VITE_APP_DESCRIPTION,
    },
    {
      name: 'keywords',
      content: import.meta.env.VITE_APP_KEYWORDS,
    },
    // 允许 爬虫抓取
    {
      name: 'robots',
      content: 'index, follow',
    },
    // 允许 谷歌抓取
    {
      name: 'googlebot',
      content: 'index, follow',
    },
  ],
  link: [{
    rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'
  },]
};
