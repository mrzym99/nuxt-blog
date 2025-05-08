<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav
      class="nav"
      :class="{
        'nav-scrolled': isScrolled,
        'nav-fixed': isFixed,
        'white-nav': isPost && !getArticleHasCover,
      }"
    >
      <NuxtLink to="/" class="text-xl font-bold nav-blog-title"> M </NuxtLink>
      <div class="nav-container">
        ,
        <!-- 移动端菜单按钮 -->
        <div class="flex items-center md:hidden">
          <ThemeSwitch class="mr-3" />
          <button class="menu-toggle" @click="showDrawer = true">
            <Icon class="menu-toggle-icon" name="ph:list" size="1.5rem" />
          </button>
        </div>
        <!-- PC端导航链接 -->
        <div class="nav-links">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <NuxtLink to="/archives/all">Archive</NuxtLink>
          <a href="/rss.xml" target="_blank" class="rss-link" title="RSS 订阅">
            <Icon name="ph:rss" size="1.5rem" />
          </a>
          <ThemeSwitch />
        </div>
      </div>
    </nav>

    <!-- 移动端抽屉菜单 -->
    <Drawer v-model="showDrawer" position="right" width="60%" title="菜单">
      <div class="mobile-nav">
        <NuxtLink to="/" class="mobile-nav-item" @click="showDrawer = false">Home</NuxtLink>
        <NuxtLink to="/about" class="mobile-nav-item" @click="showDrawer = false">About</NuxtLink>
        <NuxtLink to="/archives/all" class="mobile-nav-item" @click="showDrawer = false"
          >Archive</NuxtLink
        >
        <a href="/rss.xml" target="_blank" class="mobile-nav-item" @click="showDrawer = false">
          <Icon class="mr-2" name="ph:rss" size="1.5rem" />
          RSS
        </a>
        <div class="mobile-nav-item">
          <ThemeSwitch />
        </div>
      </div>
    </Drawer>

    <!-- Main Content -->
    <main class="flex-grow min-h-100vh">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <p>© {{ new Date().getFullYear() }} Zym'S Blog. All rights reserved.</p>
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
import Drawer from '~/components/Drawer.vue';
import { useArticleStore } from '~/store';
const { getArticleHasCover } = toRefs(useArticleStore());

const isScrolled = ref(false);
const isFixed = ref(false);
const lastScrollPosition = ref(0);
const showDrawer = ref(false);
const route = useRoute();

const isPost = computed(() => {
  return route.path.startsWith('/posts');
});

onMounted(() => {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const isDown = lastScrollPosition.value < scrollTop;
    isScrolled.value = scrollTop > 100 && isDown;
    isFixed.value = scrollTop > 100 && !isDown;
    nextTick(() => {
      lastScrollPosition.value = scrollTop;
    });
  });
});
</script>

<style lang="scss" scoped></style>
