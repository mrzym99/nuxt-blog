<template>
  <button type="submit" :disabled="loading">
    <span v-if="loading"><Icon name="svg-spinners:90-ring-with-bg" size="1.5rem"></Icon></span>
    <span v-else>
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean;
}>();
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;

button {
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:disabled {
    cursor: not-allowed;
    background: #ccc !important;
  }
}
</style>
