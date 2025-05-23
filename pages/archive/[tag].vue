<template>
  <div class="mx-auto">
    <section class="h-6rem flex flex-col items-center justify-center blog-bg">
      <h1 class="leading-tight font-bold mb-6">Archive</h1>
    </section>
    <div class="article-container mx-auto lt-sm:py-8">
      <div class="archive">
        <div></div>
        <!-- Blog Posts -->
        <main class="flex-1">
          <div class="tags-cloud">
            <NuxtLink
              class="tag tag-all"
              :class="{ active: route.params.tag === 'all' }"
              to="/archive/all"
              :replace="true"
            >
              <strong>
                All <sup>{{ allPosts.length }}</sup></strong
              >
            </NuxtLink>
            <NuxtLink
              :to="`/archive/${tag.name}`"
              :replace="true"
              v-for="tag in allTags"
              :key="tag.name"
              class="tag"
              :class="{
                active: route.params.tag === tag.name,
                'tag-grey': tag.count <= 2,
                'tag-light': tag.count <= 5 && tag.count > 2,
                'tag-normal': tag.count > 5,
              }"
            >
              <strong
                >{{ tag.name }} <sup class="ml-1">{{ tag.count }}</sup></strong
              >
            </NuxtLink>
          </div>
          <div v-for="(yearPosts, year) in filteredPosts" :key="year" class="mb-6">
            <h2 class="title font-bold">{{ year }}</h2>
            <div class="post-item">
              <article v-for="post in yearPosts" :key="post.id" class="blog-card">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="!mb-5 !font-normal">
                      <NuxtLink :to="post.slug" class="hover:text-primary-color">
                        {{ post.title }}
                      </NuxtLink>
                    </h3>
                    <p>{{ post.description }}</p>
                  </div>
                  <time class="text-sm mt-1.5rem">{{ formatDate(post.createdAt) }}</time>
                </div>
              </article>
            </div>
          </div>
        </main>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { getAllTags } from '~/api';
import type { IArticle } from '~/types/index';
import { useHead } from '#app';

defineOptions({
  name: 'Archives',
});

useHead({
  title: `小张的博客 | Archive`,
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

  Object.keys(groups).forEach(year => {
    groups[year].sort((a: IArticle, b: IArticle) => {
      const dateA = (a.createdAt && new Date(a.createdAt)) || new Date();
      const dateB = (b.createdAt && new Date(b.createdAt)) || new Date();
      return dateB.getTime() - dateA.getTime();
    });
  });

  return groups;
}

async function getTags() {
  const res = await getAllTags();
  allTags.value = res.data
    .map((tag: Tag) => {
      return {
        ...tag,
        count: tag.articles.length,
      };
    })
    .sort((a: Tag, b: Tag) => {
      return b.count - a.count;
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
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;

.archive {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: 1rem;

  @include responsive(lg) {
    display: block;
  }
}

.title {
  margin: 0.8rem 0;

  @include themed() {
    color: themed('primary');
  }
}

.tags-cloud {
  @apply flex flex-wrap mb-8;

  .tag {
    @apply px-3 py-1 rounded-full cursor-pointer transition-colors duration-200;

    @include themed() {
      color: themed('text');
      border: 1px solid themed('border');

      &:hover {
        background-color: themed('hover') !important;
        color: themed('nav-text');
      }

      &.active {
        background-color: #2f93b4 !important;
        color: themed('nav-text');
      }
    }
  }

  .tag-all {
    @include themed() {
      color: themed('nav-text');
      background-color: #7cbad1;
    }
  }

  .tag-grey {
    @include themed() {
      color: themed('nav-text');
      background-color: #c9cbcd;
    }
  }

  .tag-light {
    @include themed() {
      color: themed('nav-text');
      background-color: #c5c7ee;
    }
  }

  .tag-normal {
    @include themed() {
      color: themed('nav-text');
      background-color: #abe7b8;
    }
  }
}
</style>
