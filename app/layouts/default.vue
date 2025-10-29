<template>
  <div class="h-screen w-full">
    <!-- Main Content -->
    <Header />
    <div class="main-container">
      <LeftSideBar v-show="showLeftSideBar" />
      <main class="page-main">
        <Card>
          <slot />
        </Card>
        <div class="md:hidden mt-1rem">
          <Card>
            <CopyRight />
          </Card>
        </div>
      </main>
      <RightSideBar v-show="showRightSideBar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftSideBar from './components/LeftSideBar.vue';
import RightSideBar from './components/RightSideBar.vue'
import Header from './components/Header.vue';
import CopyRight from './components/CopyRight.vue';
import ArticleLeftSideBar from '~/pages/posts/components/ArticleLeftSideBar.vue';

const route = useRoute();

const showLeftSideBar = computed(() => {
  return !route.meta.hideLeftSidebar
});

const showRightSideBar = computed(() => {
  return !route.meta.hideRightSidebar
});
</script>

<style lang="scss" scoped></style>
