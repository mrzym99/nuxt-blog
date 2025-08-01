<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav
      v-if="showLayout"
      class="nav"
      :class="{
        'nav-scrolled': isScrolled,
        'nav-fixed': isFixed,
        'white-nav': whiteNav,
      }"
    >
      <NuxtLink to="/" class="text-xl font-bold nav-blog-title"> M </NuxtLink>
      <div class="nav-container">
        <!-- PC端导航链接 -->
        <div class="nav-links">
          <NuxtLink v-for="item in menuList" :to="item.path" :key="item.path">{{
            item.name
          }}</NuxtLink>
          <ThemeSwitch />
          <ClientOnly>
            <NuxtLink
              v-if="!user"
              class="login-icon"
              to="/login/pwd-login"
              @click="showDrawer = false"
              >Login</NuxtLink
            >
            <User v-else />
          </ClientOnly>

          <a href="/rss.xml" target="_blank" class="rss-link" title="RSS 订阅">
            <Icon name="ph:rss" size="1.5rem" />
          </a>
        </div>
        <!-- 移动端菜单按钮 -->
        <div class="flex items-center lg:hidden">
          <User class="mr-3" />
          <button class="menu-toggle" @click="showDrawer = true">
            <Icon class="menu-toggle-icon" name="ph:list" size="1.5rem" />
          </button>
        </div>
      </div>
    </nav>

    <!-- 移动端抽屉菜单 -->
    <Drawer v-if="showLayout" v-model="showDrawer" position="right" width="60%" title="菜单">
      <div class="mobile-nav">
        <div v-if="user" class="pl-3">
          <NuxtLink :to="`/user-center/${user?.id}`" @click="showDrawer = false">
            <img
              class="size-3rem rounded-full cursor-pointer duration-300 ease-in-out hover:scale-110"
              :src="user?.avatar"
              :alt="user?.nickName"
            />
          </NuxtLink>
        </div>
        <NuxtLink to="/" class="mobile-nav-item" @click="showDrawer = false">Home</NuxtLink>
        <NuxtLink to="/about" class="mobile-nav-item" @click="showDrawer = false">About</NuxtLink>
        <NuxtLink to="/archive/all" class="mobile-nav-item" @click="showDrawer = false"
          >Archive</NuxtLink
        >
        <a href="/rss.xml" target="_blank" class="mobile-nav-item" @click="showDrawer = false">
          <Icon class="mr-2" name="ph:rss" size="1.5rem" />
          RSS
        </a>
        <div class="mobile-bottom-nav">
          <ThemeSwitch />
          <NuxtLink
            v-if="!user"
            class="login-icon"
            to="/login/pwd-login"
            @click="showDrawer = false"
            >Login</NuxtLink
          >
          <div v-else class="login-icon" @click="logout">Log Out</div>
        </div>
      </div>
    </Drawer>

    <!-- Main Content -->
    <main class="flex-grow min-h-100vh">
      <slot />
    </main>

    <!-- Footer -->
    <footer v-if="showLayout" class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="social-links">
            <a href="https://github.com/mrzym99" target="_blank" rel="noopener noreferrer">
              <Icon name="simple-icons:github" size="3rem" />
            </a>
            <a href="https://gitee.com/mrzym" target="_blank" rel="noopener noreferrer">
              <Icon name="simple-icons:gitee" size="3rem" />
            </a>
          </div>
          <p class="text-xl">Copyright © Zy 2025</p>
          <p class="text-xl">
            Powered by
            <a class="text-gradient" href="https://nuxt.com/" target="_blank">Nuxt</a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Drawer from '~/components/Drawer.vue';
import { useArticleStore, useUserStore } from '~/store';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const isScrolled = ref(false);
const isFixed = ref(false);
const lastScrollPosition = ref(0);
const showDrawer = ref(false);
const route = useRoute();
const router = useRouter();
const { getArticleHasCover } = storeToRefs(useArticleStore());
const { user } = storeToRefs(useUserStore());

type Menu = {
  name: string;
  path: string;
};

const menuList: Menu[] = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'About',
    path: '/about',
  },
  {
    name: 'Archive',
    path: '/archive/all',
  },
];

const isMounted = ref(false);

const whiteNav = computed(() => {
  if (!isMounted.value) return false;
  return route.path && route.path.startsWith('/posts') && !getArticleHasCover.value;
});

const showLayout = computed(() => {
  const routerNames = ['login-type', '404'];
  const routeMeta = router.resolve(route.path);
  return !routerNames.includes(routeMeta.name as string);
});

const logout = () => {
  useUserStore().logout();
  showDrawer.value = false;
};

onMounted(() => {
  isMounted.value = true;
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
