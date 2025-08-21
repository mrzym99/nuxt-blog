<template>
  <button class="theme-button" @click="toggleTheme">
    <ClientOnly>
      <Icon v-if="colorMode.preference === 'light'" name="ph:moon-stars" size="1.5rem"></Icon>
      <Icon v-else name="ph:sun" size="1.5rem"></Icon>
    </ClientOnly>
  </button>
</template>

<script setup lang="ts">
import type { Theme } from '~/types';
const colorMode = useColorMode();

const toggleTheme = () => {
  const theme = colorMode.preference === 'dark' ? 'light' : 'dark';
  setTheme(theme);
};

const setTheme = (theme: Theme) => {
  colorMode.preference = theme;
};
</script>

<style lang="scss" scoped>
.theme-button {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 1.5rem;
  padding: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    color: var(--white-color);
    transform: scale(1.1);
    background: var(--primary-color);
  }
}
</style>
