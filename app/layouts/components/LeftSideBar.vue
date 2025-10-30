<template>
  <div class="relative lt-lg:hidden flex-shrink-0 w-48">
    <aside class="sidebar hide-scrollbar w-48">
      <!-- Profile Card -->
      <div class="blog-card">
        <span class="title">Welcome to my blog!</span>
        <ClientOnly>
          <p v-if="user" class="body">
            {{ user?.nickName }}
          </p>
        </ClientOnly>
      </div>
      <div class="blog-card">
        <span class="title">每日一言</span>
        <p class="body min-h-1rem">
          {{ saying?.hitokoto }}
        </p>
      </div>
      <HomeSideBarItem v-if="isHome" />
      <ArticleSideBarItem v-if="isArticle" />
      <MessageSideBarItem v-if="isMessage" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store';
import ArticleSideBarItem from '~/pages/posts/components/ArticleSideBarItem.vue';
import MessageSideBarItem from '~/pages/messages/components/MessageSideBarItem.vue';

const route = useRoute();

const { user } = useUserStore();

const isHome = computed(() => {
  return route.path === '/'
});

const isArticle = computed(() => {
  return route.path.includes('/posts')
});

const isMessage = computed(() => {
  return route.path.includes('/messages');
});

const { data: saying } = await useAsyncData('everyDaySaying', async () => {
  const res = await fetch('https://v1.hitokoto.cn/?c=d&encode=json');
  return res.json();
});
</script>

<style lang="scss" scoped></style>
