<template>
  <div>
    <NuxtLoadingIndicator />
    <Loading :loading="!ready">
      <NuxtLayout>
        <NuxtPage :keepalive="keepalive" />
      </NuxtLayout>
    </Loading>
    <ClientOnly>
      <Toaster :toast-options="{
        duration: TOAST_DURATION
      }" position="top-right" :theme="theme" />
      <BackTop />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { useHead } from '#app';
import { storeToRefs } from 'pinia';

import Loading from '~/components/Loading.vue';

import { getTitle } from '~/utils/title';
import type { Theme } from '~/types';
import { useUserStore } from './store';
import { TOAST_DURATION } from '~/assets/constant';

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
