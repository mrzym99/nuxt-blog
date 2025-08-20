<template>
  <div class="h-screen w-full">
    <!-- Main Content -->
    <div class="main-container">
      <main class="page-main hide-scrollbar">
        <div class="flex align-center justify-end md:hidden">
          <Menus class="md:hidden" />
        </div>
        <slot />
      </main>
      <SideBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from './components/SideBar.vue';
import Menus from './components/Menus.vue';
</script>

<style lang="scss" scoped></style>
