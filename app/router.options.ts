import type { RouterConfig } from '@nuxt/schema';

// 可以定制路由滚动
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    console.log(savedPosition);
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
};
