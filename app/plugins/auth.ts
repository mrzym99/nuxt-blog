// plugins/auth.js
import { useUserStore } from '~/store';
import { isLoggedIn } from '~/utils/auth';

export default defineNuxtPlugin(({ hook }) => {
  const userStore = useUserStore();
  hook('app:mounted', async () => {
    if (isLoggedIn()) {
      await userStore.initUserInfo();
    }
  });
});
