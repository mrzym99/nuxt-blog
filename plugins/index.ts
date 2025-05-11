import { defineNuxtPlugin } from '#app';
import { clickOutside } from '~/directives/clickOutSide';

import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { initToast } from '~/utils/request';

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('click-outside', clickOutside);

  vueApp.use(Vue3Toastify, { autoClose: 2000 });
  initToast(Vue3Toastify);

  return {
    provide: { toast },
  };
});
