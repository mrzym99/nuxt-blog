<template>
  <!-- Blog Posts -->
  <main class="post-container relative w-full">
    <article v-for="post in posts" :key="post.id" class="blog-post">
      <div class="flex flex-col gap-1">
        <div class="flex">
          <NuxtLink class="blog-info" :to="post.slug">
            <h3 class="post-title">
              {{ post.title }}
            </h3>
          </NuxtLink>
          <span class="ml-1rem post-meta">{{ post.createdAt && formatDate(post.createdAt) }}</span>
        </div>
        <span class="post-description" :title="post.description">{{ post.description }}</span>
        <div class="post-meta flex items-center justify-between">
          <span>
            Posted by {{ post.author?.profile.nickName }}
          </span>
          <div class="flex items-center">
            <Icon v-if="post.likeCount" name="ph:thumbs-up-duotone" class="mr-1" />
            {{ formatNumber(post.likeCount) }}
            <span v-if="post.likeCount && post.viewCount" class="mx-2">·</span>
            <Icon v-if="post.viewCount" name="ph:eye" class="mr-1" />
            {{ formatNumber(post.viewCount) }}
          </div>

        </div>
      </div>
    </article>
  </main>
  <Pagination class="mt-4" :current="current" :total="total" :page-size="PAGE_SIZE" />
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { getArticleList } from '~/api';
import { formatDate, formatNumber } from '~/utils/tool';
import type { IArticle } from '~/types/index';
import { useAsyncData } from '#app';
import { useArticleStore } from '~/store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'Home',
});

const route = useRoute();
const PAGE_SIZE = 5;
const { getRefresh } = storeToRefs(useArticleStore());
let timer: any = null;

// 使用 useAsyncData 安全获取数据
const { data, refresh } = await useAsyncData('home-posts', async () => {
  const current = Number(route.query.current) || 1;

  const res = await getArticleList({
    currentPage: current,
    pageSize: PAGE_SIZE,
  });

  return {
    list: res.data.list.map((item: IArticle) => ({
      ...item,
      slug: '/posts/' + item.id,
    })),
    total: res.data.total,
  };
});

const posts = computed(() => data.value?.list || []);
const total = computed(() => data.value?.total || 0);
const current = computed(() => Number(route.query.current) || 1);

// 监听路由变化刷新数据
watch(
  () => route.query.current,
  () => {
    refresh();
  }
);

onMounted(() => {
  timer = window.setTimeout(() => {
    getRefresh.value && refresh();
    useArticleStore().setRefresh(false);
  }, 300);
});

onBeforeMount(() => {
  window.clearTimeout(timer);
  timer = null;
});
</script>

<style lang="scss" scoped></style>
