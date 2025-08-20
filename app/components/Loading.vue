<template>
  <div>
    <div v-if="loading" class="loading-container min-h-50rem">
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
.loading-container {
  @apply w-full h-full flex items-center justify-center;

  color: var(--text-light-color);
}

.loading-spinner {
  @apply flex flex-col items-center;
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
