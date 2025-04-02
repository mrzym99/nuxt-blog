<template>
  <div class="not-found">
    <div class="content">
      <h1 class="text-6xl font-bold mb-4">404</h1>
      <p class="text-xl mb-8">页面未找到</p>
      <NuxtLink to="/" class="btn-primary"> 返回首页 </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
.not-found {
  @apply min-h-screen flex items-center justify-center;
  @include themed() {
    background-color: themed('bg');
    color: themed('text');
  }

  .content {
    @apply text-center;
  }

  .btn-primary {
    @apply px-6 py-2 rounded-lg transition-colors duration-200;
    @include themed() {
      background-color: themed('primary');
      color: themed('nav-text');

      &:hover {
        background-color: themed('hover');
      }
    }
  }
}
</style>
