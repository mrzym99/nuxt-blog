<template>
  <Loading :loading="loading">
    <div>
      <!-- Hero Section -->
      <section
        :style="bgStyle"
        class="bg-gray-100 flex flex-col items-center justify-center blog-bg"
      >
        <h1 class="text-6xl text-center leading-tight font-bold mb-6 lt-md:text-5xl">Zym'S Blog</h1>
        <p class="text-2xl lt-md:text-xl text-center mx-auto px-4">
          「 A place where I share my journey in technology and life. 」
        </p>
      </section>
      <!-- Main Content with Sidebar -->
      <div class="container mx-auto lt-sm:py-8">
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
                    <!-- <span class="mx-2">·</span>
                    <span>1000 min read</span> -->
                  </div>
                </div>
              </div>
            </article>
          </main>
          <!-- Sidebar -->
          <SideBar />
        </div>
      </div>
    </div>
  </Loading>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import bg from '~/assets/images/bg.jpg';
import SideBar from '~/components/SideBar.vue';
import { getArticleList } from '~/api';
import { formatDate } from '~/utils/tool';

const posts = ref<IArticle[]>([]);
const loading = ref(true);

const bgStyle = computed(() => {
  return {
    backgroundImage: `url(${bg})`,
  };
});

onMounted(async () => {
  loading.value = true;
  const res = await getArticleList({
    current: 1,
    pageSize: 10,
  });
  loading.value = false;
  posts.value = res.data.list.map((item: IArticle) => {
    return {
      ...item,
      slug: '/posts/' + item.id,
    };
  });
});
</script>

<style scoped>
.blog-post {
  @apply transition-colors;
}

.post-meta {
  @apply text-sm text-gray-600 mb-3;
}

.post-description {
  @apply text-gray-600 mb-4;
}

.tags {
  @apply flex flex-wrap gap-2;
}

.tag {
  @apply px-2 py-1 text-sm rounded-full;
}

.blog-card {
  @apply p-6 rounded-lg;
}
</style>
