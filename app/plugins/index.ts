import { clickOutside } from '~/directives/clickOutSide';
import { copy } from '~/directives/copy';
import defineCustomRules from '~/utils/validate';
import { defineRule } from 'vee-validate';
import { required } from '@vee-validate/rules';

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('click-outside', clickOutside);
  vueApp.directive('copy', copy);
  // 迴圈依序加入規則
  defineRule('required', required);
  defineCustomRules();
});
