<template>
  <!-- Main Content -->
  <div class="main-container">
    <main class="page-main">
      <div class="flex align-center justify-end md:hidden">
        <Menus class="md:hidden" />
      </div>
      <slot />
    </main>
    <div class="hidden md:block relative w-60 flex-shrink-0">
      <SideBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from './components/SideBar.vue';
import Menus from './components/Menus.vue';
</script>

<style lang="scss" scoped></style>
