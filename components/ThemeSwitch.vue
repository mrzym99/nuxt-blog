<template>
  <Popover position="bottom" :offset="8" :width="240" :arrow="true">
    <template #trigger>
      <button class="theme-switch-btn">
        <span class="theme-icon">🎨</span>
      </button>
    </template>
    <div class="theme-panel">
      <div class="theme-title">主题设置</div>
      <div class="theme-list">
        <button
          v-for="theme in themes"
          :key="theme.name"
          class="theme-item"
          :class="{ active: currentTheme === theme.name }"
          @click="setTheme(theme.name)"
        >
          <span class="theme-color" :style="{ backgroundColor: theme.color }"></span>
          <span class="theme-name">{{ theme.label }}</span>
        </button>
      </div>
    </div>
  </Popover>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Popover from './Popover.vue';

  const themes = [
    { name: 'default', label: '默认', color: '#00c6fb' },
    { name: 'dark', label: '暗色', color: '#60a5fa' },
    { name: 'purple', label: '紫色', color: '#a78bfa' },
    { name: 'green', label: '绿色', color: '#34d399' },
  ];

  const currentTheme = ref('default');

  const setTheme = (theme: string) => {
    currentTheme.value = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') || 'default';
    setTheme(savedTheme);
  });
</script>

<style lang="scss" scoped>
  @use '~/assets/styles/themes.scss' as *;

  .theme-switch-btn {
    padding: 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      @include themed() {
        background-color: themed('border');
      }
    }

    .theme-icon {
      font-size: 1.2rem;
    }
  }

  .theme-panel {
    padding: 1rem;
    min-width: 200px;

    .theme-title {
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.75rem;
      @include themed() {
        color: themed('text');
      }
    }

    .theme-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .theme-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      width: 100%;
      text-align: left;

      &:hover {
        @include themed() {
          background-color: themed('border');
        }
      }

      &.active {
        @include themed() {
          background-color: themed('border');
        }
      }

      .theme-color {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        border: 2px solid transparent;
        transition: all 0.2s ease;
      }

      .theme-name {
        font-size: 0.875rem;
        @include themed() {
          color: themed('text');
        }
      }

      &.active .theme-color {
        border-color: var(--primary-color);
      }
    }
  }
</style>
