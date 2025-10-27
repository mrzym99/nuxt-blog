<template>
  <div class="relative lt-lg:hidden flex-shrink-0" :class="[isArticle ? 'w-40' : 'w-48']">
    <aside v-show="!isArticle" class="sidebar hide-scrollbar w-48">
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
    </aside>
    <ArticleLeftSideBar v-if="isArticle" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store';
import ArticleLeftSideBar from '~/pages/posts/components/ArticleLeftSideBar.vue';
const route = useRoute();

const { user } = useUserStore();
const isArticle = computed(() => {
  return route.path.includes('/posts')
});

const { data: saying } = await useAsyncData('everyDaySaying', async () => {
  const res = await fetch('https://v1.hitokoto.cn/?c=d&encode=json');
  return res.json();
});
</script>

<style lang="scss" scoped></style>
