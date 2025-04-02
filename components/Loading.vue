<template>
  <div>
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-text">加载中...</p>
      </div>
    </div>
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;

.loading-container {
  @apply fixed inset-0 z-10 flex items-center justify-center;
  @include themed() {
    background-color: rgba(themed('bg'), 0.5);
  }
}

.loading-spinner {
  @apply flex flex-col items-center;
  @include themed() {
    color: themed('text');
  }
}

.spinner {
  @apply w-12 h-12 border-4 border-t-transparent rounded-full;
  animation: spin 1s linear infinite;
}

.loading-text {
  @apply mt-4 text-lg;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
