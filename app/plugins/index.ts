import { clickOutside } from '~/directives/clickOutSide';
import { copy } from '~/directives/copy';
import defineCustomeRules from '~/utils/validate';

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('click-outside', clickOutside);
  vueApp.directive('copy', copy);
  defineCustomeRules();
});
