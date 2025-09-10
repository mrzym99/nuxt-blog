<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout v-if="ready">
      <NuxtPage :keepalive="keepalive" />
    </NuxtLayout>
    <Loading :loading="true" v-else />
    <ClientOnly>
      <Toaster :toast-options="{
        duration: 2000
      }" position="top-right" :theme="theme" />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { useHead } from '#app';
import { getTitle } from '~/utils/title';
import type { Theme } from '~/types';
import { useUserStore } from './store';
import { storeToRefs } from 'pinia';
import Loading from '~/components/Loading.vue';

const { ready } = storeToRefs(useUserStore())

const theme = computed(() => {
  return useColorMode().preference as Theme;
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
