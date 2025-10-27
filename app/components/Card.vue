<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.card {
  box-sizing: border-box;
  background: var(--card-color);
  padding: 1rem;
  border-radius: 0.25rem;
}
</style>