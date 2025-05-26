<template>
  <div>
    <!-- Hero Section -->
    <section :style="bgStyle" class="bg-gray-100 flex flex-col items-center justify-center blog-bg">
      <h1 class="text-6xl text-center tracking-[3px] font-bold mb-6 lt-md:text-5xl">zy</h1>
      <p class="text-2xl lt-md:text-xl tracking-[1px] text-center mx-auto px-4">
        「 真理往往简单明了 」
      </p>
    </section>
    <div class="container mx-auto lt-sm:py-8">
      <Loading :loading="loading">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Blog Posts -->
          <main class="flex-1">
            <article v-for="post in posts" :key="post.id" class="blog-post cursor-pointer">
              <div class="flex flex-col gap-4">
                <div class="flex-1 blog-info" @click="navigateTo(post.slug)">
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
                </div>
              </div>
            </article>
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
      </Loading>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SideBar from '~/components/SideBar.vue';
import { getArticleList } from '~/api';
import { formatDate } from '~/utils/tool';
import type { IArticle } from '~/types/index';
import { formatNumber } from '~/utils/tool';
import bg from '~/assets/images/bg.jpg';

defineOptions({
  name: 'Home',
});

const route = useRoute();
const posts = ref<IArticle[]>([]);
const loading = ref(true);
const total = ref(0);
const PAGE_SIZE = 10;

const bgStyle = computed(() => {
  return {
    backgroundImage: `url(${bg})`,
  };
});

async function getArticle() {
  const current = Number(route.query.current) || 1;

  const res = await getArticleList({
    currentPage: current,
    pageSize: PAGE_SIZE,
  });
  loading.value = false;
  total.value = res.data.total;
  posts.value = res.data.list.map((item: IArticle) => {
    return {
      ...item,
      slug: '/posts/' + item.id,
    };
  });
}

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

watch(
  () => route.query.current,
  () => {
    getArticle();
  }
);

onMounted(() => {
  getArticle();
});
</script>

<style lang="scss" scoped></style>
