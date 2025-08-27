<template>
  <!-- Main Content -->
  <div class="main-container">
    <main class="page-main">
      <div class="flex align-center justify-end md:hidden">
        <Header />
      </div>
      <slot />
    </main>
    <div class="relative w-60 lt-md:w-full flex-shrink-0">
      <SideBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from './components/SideBar.vue';
import Header from './components/Header.vue';
</script>

<style lang="scss" scoped></style>
