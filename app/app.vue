<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage :keepalive="keepalive" />
    </NuxtLayout>
    <Toaster position="top-left" :theme="theme" />
  </div>
</template>

<script lang="ts" setup>
import { useHead } from '#app';
import { getTitle } from '~/utils/title';
import type { Theme } from '~/types';
const theme = computed(() => {
  return useColorMode().preference as Theme
});

const keepalive = {
  include: ['Home', 'Archive'],
};

const route = useRoute();
const routeTitle = computed(() => {
  return getTitle(route.path);
});

watch(
  () => route.path,
  () => {
    useHead({
      title: routeTitle.value,
    });
  }
);
</script>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
