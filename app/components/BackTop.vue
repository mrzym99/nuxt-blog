<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';

const showBackTop = ref(false);
const backTop = () => {
  if (window) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const scroll = () => {
  if (window) {
    if (window.scrollY > 150) {
      showBackTop.value = true;
    } else {
      showBackTop.value = false;
    }
  }
}

const delayedScroll = useDebounceFn(scroll, 50);

const listenScroll = () => {
  window.addEventListener("scroll", delayedScroll);
};

onMounted(() => {
  listenScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", delayedScroll);
});
</script>

<template>
  <transition name="fade">
    <span class="back-top right-4rem bottom-4rem lt-sm:right-0.2rem lt-sm:bottom-2rem" v-if="showBackTop">
      <Icon name="ph:arrow-circle-up-duotone" size="2rem" @click="backTop" />
    </span>
  </transition>
</template>

<style lang="scss" scoped>
.back-top {
  position: fixed;
  cursor: pointer;
  color: var(--text-color);
  transition: all 0.3s;

  &:hover {
    color: var(--primary-color);
  }
}
</style>