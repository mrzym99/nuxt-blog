<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav class="nav article-nav" :class="{ 'nav-scrolled': isScrolled, 'nav-fixed': isFixed }">
      <div class="nav-container">
        <NuxtLink to="/" class="text-xl font-bold nav-blog-title"> My Blog </NuxtLink>
        <div class="nav-links">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <NuxtLink to="/archive">Archive</NuxtLink>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
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
const isScrolled = ref(false);
const isFixed = ref(false);
const lastScrollPosition = ref(0);

onMounted(() => {
  window.addEventListener("scroll", () => {
    const isDown = lastScrollPosition.value < window.pageYOffset;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    isScrolled.value = scrollTop > 100 && isDown;
    isFixed.value = scrollTop > 100 && !isDown;
    nextTick(() => {
      lastScrollPosition.value = scrollTop;
    });
  });
});
</script>
