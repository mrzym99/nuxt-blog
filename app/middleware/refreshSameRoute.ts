export default defineNuxtRouteMiddleware((to, from) => {
  // 解决相同页面切换tag刷新问题
  if (to.name === from.name) {
    to.meta.refresh = true;
  }
});
