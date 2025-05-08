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
            <NuxtLink
              class="tag"
              :class="{ active: route.params.tag === 'all' }"
              to="/archives/all"
            >
              All ({{ allPosts.length }})
            </NuxtLink>
            <NuxtLink
              :to="`/archives/${tag.name}`"
              v-for="tag in allTags"
              :key="tag.name"
              class="tag"
              :class="{ active: route.params.tag === tag.name }"
            >
              {{ tag.name }}
              <span class="ml-1 text-xs">({{ tag.count }})</span>
            </NuxtLink>
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
                    <p class="text-gray-600">{{ post.description }}</p>
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
import { getAllTags } from '~/api';
definePageMeta({
  keepalive: true,
});

type Tag = {
  id: number;
  name: string;
  count: number;
  articles: IArticle[];
};

const route = useRoute();
const allTags = ref<Tag[]>([]);
const allPosts = ref<IArticle[]>([]);

// 根据标签筛选文章
const filteredPosts = computed(() => {
  const tagName = route.params.tag as string;
  if (!tagName) return groupedPosts.value;
  if (tagName === 'all') return groupedPosts.value;
  const articles = allTags.value.find(tag => tag.name === tagName)?.articles || [];
  return articleToGrops(articles);
});

// Group posts by year
const groupedPosts = computed(() => {
  return articleToGrops(allPosts.value);
});

function articleToGrops(articles: IArticle[]) {
  const groups: Record<string, any> = {};
  articles.forEach(article => {
    const year = article.createdAt && new Date(article.createdAt).getFullYear().toString();
    if (year) {
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(article);
    }
  });
  return groups;
}

async function getTags() {
  const res = await getAllTags();
  allTags.value = res.data.map((tag: Tag) => {
    return {
      ...tag,
      count: tag.articles.length,
    };
  });

  allPosts.value = [];
  allTags.value.forEach(tag => {
    tag.articles.forEach(article => {
      if (!allPosts.value.find(item => item.id === article.id)) {
        article.slug = '/posts/' + article.id;
        allPosts.value.push(article);
      }
    });
  });
}

onMounted(() => {
  getTags();
});

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
