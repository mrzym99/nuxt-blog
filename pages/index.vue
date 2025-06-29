<template>
  <div>
    <!-- Hero Section -->
    <HomeHeader />
    <div class="container mx-auto lt-sm:py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Blog Posts -->
        <main class="flex-1">
          <div v-for="post in posts" :key="post.id" class="blog-post cursor-pointer">
            <div class="flex flex-col gap-4">
              <NuxtLink class="flex-1 blog-info" :to="post.slug">
                <h3 class="post-title">
                  {{ post.title }}
                </h3>
                <p class="post-description">{{ post.description }}</p>
                <div class="post-meta">
                  <span
                    >Posted by {{ post.author?.profile.nickName }} on
                    {{ post.createdAt && formatDate(post.createdAt) }}</span
                  >
                  <span v-if="post.likeCount" class="mx-2">·</span>
                  <Icon v-if="post.likeCount" name="ph:thumbs-up-duotone" class="mr-1" />
                  {{ formatNumber(post.likeCount) }}
                  <span v-if="post.viewCount" class="mx-2">·</span>
                  <Icon v-if="post.viewCount" name="ph:eye" class="mr-1" />
                  {{ formatNumber(post.viewCount) }}
                </div>
              </NuxtLink>
            </div>
          </div>
          <div class="py-4 flex justify-between items-center">
            <div>
              <NuxtLink class="pagination" v-if="showPrev" :to="`?current=${prev}`">
                prev
              </NuxtLink>
            </div>
            <div>
              <NuxtLink class="pagination" v-if="showNext" :to="`?current=${next}`">
                next
              </NuxtLink>
            </div>
          </div>
        </main>
        <!-- Sidebar -->
        <SideBar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SideBar from '~/components/SideBar.vue';
import { getArticleList } from '~/api';
import { formatDate, formatNumber } from '~/utils/tool';
import type { IArticle } from '~/types/index';
import HomeHeader from '~/components/HomeHeader.vue';
import { useAsyncData } from '#app';

defineOptions({
  name: 'Home',
});

const route = useRoute();
const PAGE_SIZE = 8;

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

// 分页计算（保持不变）
const showPrev = computed(() => {
  return route.query.current && Number(route.query.current) > 1;
});

const showNext = computed(() => {
  return route.query.current
    ? Number(route.query.current) * PAGE_SIZE < total.value
    : total.value > PAGE_SIZE;
});

const prev = computed(() => {
  return route.query.current ? Number(route.query.current) - 1 : 1;
});

const next = computed(() => {
  return route.query.current ? Number(route.query.current) + 1 : 2;
});

// 监听路由变化刷新数据
watch(
  () => route.query.current,
  () => {
    refresh();
  }
);
</script>

<style lang="scss" scoped></style>
