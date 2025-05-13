<template>
  <button type="submit" :disabled="loading || disabled">
    <slot></slot>
    <Icon class="ml-2" v-if="loading" name="svg-spinners:90-ring-with-bg" size="1.2rem"></Icon>
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
  min-height: 46px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: themed('primary');
  color: themed('nav-text');

  &:disabled {
    cursor: not-allowed;
    background: #c2c2c2 !important;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
}
</style>
