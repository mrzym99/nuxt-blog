<template>
  <div>
    <div v-if="showLoading" :style="{
      height: height ?? '20rem'
    }" class="loading-container">
      <slot name="loading">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p class="loading-text">Loading...</p>
        </div>
      </slot>
    </div>
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  loading: boolean;
  delay?: number;
  height?: string;
}>();

const showLoading = ref(false)
let timer: any = null

watch(
  () => props.loading,
  (val) => {
    if (timer) clearTimeout(timer) // 清掉上一次的延迟
    if (val && props.delay) {
      // 延迟 ≥ delay 才显示
      timer = window.setTimeout(() => (showLoading.value = true), props.delay)
    } else if (val) {
      showLoading.value = true
    } else {
      showLoading.value = false
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
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
  @apply w-8 h-8 border-2 border-t-transparent rounded-full;
  animation: spin 1s linear infinite;
}

.loading-text {
  @apply mt-2 text-lg;
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
