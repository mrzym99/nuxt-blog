<template>
  <div class="h-screen w-full">
    <!-- Main Content -->
    <Header />
    <div class="main-container">
      <main class="page-main">
        <div class="lt-sm:p-1rem lt-md:p-2rem">
          <slot />
        </div>
        <div class="md:hidden">
          <CopyRight />
        </div>
      </main>
      <div class="relative w-52 lt-md:w-full flex-shrink-0">
        <SideBar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from './components/SideBar.vue';
import Header from './components/Header.vue';
import CopyRight from './components/CopyRight.vue';
</script>

<style lang="scss" scoped></style>
