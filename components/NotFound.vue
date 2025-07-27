<template>
  <div class="not-found">
    <div class="content">
      <h1 class="text-6xl font-bold mb-4">404</h1>
      <p class="text-xl mb-8">
        <slot> 页面未找到 </slot>
      </p>
      <NuxtLink to="/" class="btn-primary"> 返回首页 </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  @apply min-h-screen flex items-center justify-center;
  background-color: var(--bg-color);
  color: var(--text-color);
  width: 100%;
  height: 100%;

  .content {
    @apply text-center;
  }

  .btn-primary {
    @apply px-6 py-2 rounded-lg transition-colors duration-200;
    background-color: var(--primary-color);
    color: var(--nav-text-color);

    &:hover {
      background-color: var(--hover-color);
    }
  }
}
</style>
