/**
 * 用于使用了 slug + keepAlive 的页面判断是否需要刷新页面
 * @param routeName
 * @param slug
 * @param cb
 */
export function useRefresh(routeName: string, slug: string, cb: () => void) {
  const route = useRoute();
  const oldSlug = ref(slug);

  function setOldSlug(slug: string) {
    oldSlug.value = slug;
  }

  function fresh(slug: string) {
    if (oldSlug.value !== slug) {
      setOldSlug(slug);
      cb();
    }
  }

  watch(route, async () => {
    if (route.name !== routeName) return; // 只处理当前页的刷新
    const slug = route.params.slug as string;
    if (route.meta.refresh) {
      setOldSlug(slug);
      cb();
    } else {
      fresh(slug);
    }
  });

  return {
    fresh,
    setOldSlug,
  };
}
