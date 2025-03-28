<template>
  <div class="theme-switcher">
    <button class="theme-button" @click="toggleMenu">
      <Icon :name="currentTheme === 'dark' ? 'ph:moon-bold' : 'ph:sun-bold'" size="1.5rem" />
    </button>
    <div class="theme-menu" :class="{ show: isMenuOpen }">
      <div
        v-for="theme in themes"
        :key="theme.name"
        class="theme-option"
        :class="{ active: currentTheme === theme.name }"
        @click="selectTheme(theme.name)"
      >
        {{ theme.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const themes = [
  { name: 'default', label: '默认主题' },
  { name: 'dark', label: '暗色主题' },
  { name: 'purple', label: '紫色主题' },
  { name: 'green', label: '绿色主题' }
]

const isMenuOpen = ref(false)
const currentTheme = ref('default')

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const selectTheme = (themeName) => {
  currentTheme.value = themeName
  document.documentElement.setAttribute('data-theme', themeName)
  localStorage.setItem('theme', themeName)
  isMenuOpen.value = false
}

// 监听主题变化，添加过渡效果
watch(currentTheme, () => {
  document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease'
})

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'default'
  currentTheme.value = savedTheme
  document.documentElement.setAttribute('data-theme', savedTheme)
})
</script>

<style lang="scss" scoped>
@use "~/assets/styles/themes.scss" as *;
// Theme switcher
.theme-switcher {
  position: relative;
  .theme-button {
    width: 2rem;
    height: 2rem;
    border-radius: 2rem;
    @include themed() {
      background-color: themed('primary');
      color: white;
    }
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  .theme-menu {
    position: absolute;
    top: 2.1rem;
    left: 0;
    width: 6rem;
    transform: translateX(-50%);
    margin-bottom: 1rem;
    padding: 0.5rem;
    z-index: 2001;
    @include themed() {
      background-color: themed('bg');
      border: 1px solid themed('border');
    }
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: none;

    &.show {
      display: block;
    }

    .theme-option {
      padding: 0.25rem 0.3rem;
      cursor: pointer;
      border-radius: 0.25rem;
      text-align: center;
      @include themed() {
        color: themed('text');
        &:hover {
          background-color: themed('border');
        }
      }
    }
  }
}
</style>