<template>
  <div>
    <Loading :loading="!ready">
      <NuxtLayout>
        <NuxtPage :keepalive="keepalive" />
      </NuxtLayout>
    </Loading>
    <ClientOnly>
      <Toaster :toast-options="toastOptions" position="top-right" :theme="theme" />
      <BackTop />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { useHead } from '#app';
import { storeToRefs } from 'pinia';

import Loading from '~/components/Loading.vue';

import { getTitle } from '~/utils/title';
import { useUserStore } from './store';
import { TOAST_DURATION, TOAST_TOP } from '~/constants';
import type { ThemeEnum } from './enum';

const { ready } = storeToRefs(useUserStore())

const theme = computed(() => {
  return useColorMode().preference as ThemeEnum;
});

const keepalive = {
  include: ['Home', 'Archive'],
};

const toastOptions = {
  style: {
    top: TOAST_TOP + 'px'
  },
  duration: TOAST_DURATION
}

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
  }, {
  immediate: true
}
);
</script>
