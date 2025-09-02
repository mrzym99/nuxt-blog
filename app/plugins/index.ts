import { clickOutside } from '~/directives/clickOutSide';
import { copy } from '~/directives/copy';

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('click-outside', clickOutside);
  vueApp.directive('copy', copy);
});
