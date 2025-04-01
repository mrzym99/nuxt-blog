<template>
  <div>
    <!-- Hero Section -->
    <section :style="bgStyle" class="bg-gray-100 flex flex-col items-center justify-center blog-bg">
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
          <div class="space-y-8">
            <article v-for="post in posts" :key="post.id" class="blog-post group cursor-pointer">
              <div class="flex flex-col gap-4">
                <div class="flex-1 blog-info" @click="navigateTo(post.slug)">
                  <h3 class="post-title">
                    {{ post.title }}
                  </h3>
                  <div class="post-meta">
                    <span>{{ post.date }}</span>
                    <span class="mx-2">·</span>
                    <span>{{ post.readTime }} min read</span>
                  </div>
                  <p class="post-excerpt">{{ post.excerpt }}</p>
                </div>
                <div class="tags">
                  <span
                    v-for="tag in post.tags"
                    :key="tag"
                    class="tag"
                    @click="navigateTo('/archives/' + tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </article>
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
import bg from '~/assets/images/bg.png';
import SideBar from '~/components/SideBar.vue';
import { posts as postsData } from '~/api';

const posts = ref(postsData);

const bgStyle = computed(() => {
  return {
    backgroundImage: `url(${bg})`,
  };
});
</script>

<style scoped>
.blog-post {
  @apply p-6 rounded-lg transition-colors;
}

.post-title {
  @apply text-2xl font-bold mb-2;
}

.post-meta {
  @apply text-sm text-gray-600 mb-3;
}

.post-excerpt {
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
