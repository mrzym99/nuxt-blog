import { defineNuxtPlugin } from '#app';
import { clickOutside } from '~/directives/clickOutSide';

import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { initToast } from '~/utils/request';

import { defineRule } from 'vee-validate';
import { all } from '@vee-validate/rules';
import { configure } from 'vee-validate';
import { localize, setLocale } from '@vee-validate/i18n';
import zhCn from '@vee-validate/i18n/dist/locale/zh_CN.json';
import defineCustomeRules from '~/utils/validate';

function initVeeValidate() {
  Object.keys(all).forEach(rule => {
    defineRule(rule, all[rule]);
  });
  // 自定义错误
  defineCustomeRules();
  configure({
    generateMessage: localize({ zhCn }),
  });

  setLocale('zh_TW');
}

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('click-outside', clickOutside);

  vueApp.use(Vue3Toastify, { autoClose: 2000 });
  initToast(toast);
  initVeeValidate();

  return {
    provide: { toast },
  };
});
