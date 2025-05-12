<template>
  <button type="submit" :disabled="loading || disabled">
    <span v-if="loading"><Icon name="svg-spinners:90-ring-with-bg" size="1.5rem"></Icon></span>
    <span v-else>
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean;
  disabled?: boolean;
}>();
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;

button {
  // min-height: 50px;
  padding: 6px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: themed('primary');
  color: white;

  &:disabled {
    cursor: not-allowed;
    background: #ccc !important;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
}
</style>
