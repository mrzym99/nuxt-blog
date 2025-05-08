import { defineNuxtPlugin } from '#app';
import { clickOutside } from '~/directives/clickOutSide';

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('click-outside', clickOutside);

  const router = useRouter();

  router.options.scrollBehavior = async (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
  };
});
