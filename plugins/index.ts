import { defineNuxtPlugin } from '#app';
import { clickOutside } from '~/directives/clickOutSide';
import { copy } from '~/directives/copy';

import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { initToast } from '~/utils/request';

import { defineRule } from 'vee-validate';
import { all } from '@vee-validate/rules';
import { configure } from 'vee-validate';
import { localize, setLocale } from '@vee-validate/i18n';
import zhCn from '@vee-validate/i18n/dist/locale/zh_CN.json';
import defineCustomeRules from '~/utils/validate';
// 进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

//全局进度条的配置
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 200, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.4, // 更改启动时使用的最小百分比
  parent: '#__nuxt', //指定进度条的父容器
});

function initVeeValidate() {
  Object.keys(all).forEach(rule => {
    defineRule(rule, all[rule]);
  });
  // 自定义错误
  defineCustomeRules();
  configure({
    generateMessage: localize({ zhCn }),
  });

  setLocale('zhCn');
}

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('click-outside', clickOutside);
  vueApp.directive('copy', copy);

  vueApp.use(Vue3Toastify, { autoClose: 2000 });
  initToast(toast);
  initVeeValidate();

  if (import.meta.client) {
    useRouter().beforeEach(() => {
      NProgress.start();
    });

    useRouter().afterEach(() => {
      NProgress.done();
    });
  }

  return {
    provide: { toast },
  };
});
