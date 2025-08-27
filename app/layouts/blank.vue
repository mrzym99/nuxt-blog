<template>
  <div class="h-screen w-full">
    <!-- Main Content -->
    <div class="blank-container">
      <slot />
    </div>
    <Toaster position="top-right" :theme="theme" />
  </div>
</template>

<script setup lang="ts">
import type { Theme } from '~/types';
const theme = computed(() => {
  return useColorMode().preference as Theme
});
</script>
