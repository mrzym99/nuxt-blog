<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav class="nav" :class="{ 'nav-scrolled': isScrolled, 'nav-fixed': isFixed, 'white-nav': !getArticleHasCover }">
      <div class="nav-container">
        <NuxtLink to="/" class="text-xl font-bold nav-blog-title"> My Blog </NuxtLink>
        <!-- 移动端菜单按钮 -->
        <button class="menu-toggle" @click="showDrawer = true">
          <Icon class="menu-toggle-icon" name="ph:list" size="1.5rem" />
        </button>
        <!-- PC端导航链接 -->
        <div class="nav-links">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <NuxtLink to="/archive">Archive</NuxtLink>

          <a href="/rss.xml" target="_blank" class="rss-link" title="RSS 订阅">
            <Icon name="ph:rss" size="1.5rem" />
          </a>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>

    <!-- 移动端抽屉菜单 -->
    <Drawer v-model="showDrawer" position="right" width="60%" title="菜单">
      <div class="mobile-nav">
        <NuxtLink to="/" class="mobile-nav-item" @click="showDrawer = false">Home</NuxtLink>
        <NuxtLink to="/about" class="mobile-nav-item" @click="showDrawer = false">About</NuxtLink>
        <NuxtLink to="/archive" class="mobile-nav-item" @click="showDrawer = false">Archive</NuxtLink>
        <a href="/rss.xml" target="_blank" class="mobile-nav-item" @click="showDrawer = false">
          <Icon class="mr-2" name="ph:rss" size="1.5rem" />
          RSS
        </a>
        <div class="mobile-nav-item">
          <ThemeSwitcher />
        </div>
      </div>
    </Drawer>
    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <p>© {{ new Date().getFullYear() }} My Blog. All rights reserved.</p>
          <div class="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Icon name="ph:github-logo-light" size="1.5rem" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Icon name="ph:twitter-logo-light" size="1.5rem" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Drawer from "~/components/Drawer.vue";
import { useArticleStore } from "~/store";

const isScrolled = ref(false);
const isFixed = ref(false);
const lastScrollPosition = ref(0);
const showDrawer = ref(false);

const { getArticleHasCover } = toRefs(useArticleStore());

onMounted(() => {
  window.addEventListener("scroll", () => {
    const isDown = lastScrollPosition.value < window.screenY;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    isScrolled.value = scrollTop > 100 && isDown;
    isFixed.value = scrollTop > 100 && !isDown;
    nextTick(() => {
      lastScrollPosition.value = scrollTop;
    });
  });
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/themes.scss" as *;
@use "~/assets/styles/global.scss" as *;

.article-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.article-content {
  flex: 1;
  padding-top: 4rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
