<template>
  <div class="mx-auto">
    <section class="h-20rem flex flex-col items-center justify-center blog-bg">
      <h1 class="text-6xl leading-tight font-bold mb-6">Archive</h1>
    </section>
    <div class="container mx-auto lt-sm:py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Blog Posts -->
        <main class="flex-1 p-1.5rem">
          <div class="tags-cloud">
            <div
              class="tag"
              :class="{ active: route.params.tag === 'all' }"
              @click="handleTagClick('all')"
            >
              All ({{ posts.length }})
            </div>
            <div
              v-for="tag in allTags"
              :key="tag.name"
              class="tag"
              :class="{ active: route.params.tag === tag.name }"
              @click="handleTagClick(tag.name)"
            >
              {{ tag.name }}
              <span class="ml-1 text-xs">({{ tag.count }})</span>
            </div>
          </div>
          <div v-for="(yearPosts, year) in filteredPosts" :key="year" class="mb-12">
            <h2 class="text-2xl font-bold mb-6">{{ year }}</h2>
            <div class="space-y-6">
              <article v-for="post in yearPosts" :key="post.id" class="blog-card">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-xl font-semibold mb-2">
                      <NuxtLink :to="post.slug" class="hover:text-primary-color">
                        {{ post.title }}
                      </NuxtLink>
                    </h3>
                    <p class="text-gray-600">{{ post.excerpt }}</p>
                  </div>
                  <time class="text-sm text-gray-500">{{ post.date }}</time>
                </div>
              </article>
            </div>
          </div>
        </main>
        <div class="lg:w-30"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { posts as postsData } from '~/api';

const route = useRoute();
const router = useRouter();
const posts = ref(postsData);

// 根据标签筛选文章
const filteredPosts = computed(() => {
  const tag = route.params.tag as string;
  if (!tag) return groupedPosts.value;
  if (tag === 'all') return groupedPosts.value;

  const filtered: Record<string, any> = {};
  Object.entries(groupedPosts.value).forEach(([year, yearPosts]) => {
    const filteredPosts = yearPosts.filter((post: any) => post.tags.includes(tag));
    if (filteredPosts.length > 0) {
      filtered[year] = filteredPosts;
    }
  });
  return filtered;
});

// Group posts by year
const groupedPosts = computed(() => {
  const groups: Record<string, any> = {};
  posts.value.forEach(post => {
    const year = new Date(post.date).getFullYear().toString();
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(post);
  });
  return groups;
});

const allTags = computed(() => {
  const tagCounts: Record<string, number> = {};
  posts.value.forEach(post => {
    post.tags.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const list = Object.entries(tagCounts).map(([name, count]) => ({ name, count }));
  return list.sort((a, b) => b.count - a.count);
});

// 处理标签点击
const handleTagClick = (tag: string) => {
  if (tag === 'all') {
    router.push('/archives/all');
  } else {
    router.push(`/archives/${tag}`);
  }
};

// 监听路由变化
watch(
  () => route.params.tag,
  () => {
    // 路由变化时会自动触发计算属性的重新计算
    // 不需要手动更新
  }
);
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;

.tags-cloud {
  @apply flex flex-wrap mb-8;

  .tag {
    @apply px-3 py-1 rounded-full text-sm cursor-pointer transition-colors duration-200;
    @include themed() {
      background-color: themed('bg');
      color: themed('text');
      border: 1px solid themed('border');

      &:hover {
        background-color: themed('hover');
        color: themed('nav-text');
      }

      &.active {
        background-color: themed('primary');
        color: themed('nav-text');
      }
    }
  }
}
</style>
