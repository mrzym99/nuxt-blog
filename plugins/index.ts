import { defineNuxtPlugin } from "#app";
import { clickOutside } from "~/directives/clickOutSide";

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive("click-outside", clickOutside);
});
