<template>
  <div class="archive py-2">
    <!-- Blog Posts -->
    <main>
      <div class="tag-cloud">
        <NuxtLink class="tag tag-all" :class="{ active: route.params.tag === 'all' }" to="/archive/all" :replace="true">
          <strong>
            All <sup>{{ allPosts.length }}</sup></strong>
        </NuxtLink>
        <NuxtLink :to="`/archive/${tag.name}`" :replace="true" v-for="tag in allTags" :key="tag.name" class="tag"
          :class="{
            active: route.params.tag === tag.name,
            'tag-grey': tag.count <= 2,
            'tag-light': tag.count <= 5 && tag.count > 2,
            'tag-normal': tag.count > 5,
          }">
          <strong>{{ tag.name }} <sup class="ml-1">{{ tag.count ? tag.count : null }}</sup></strong>
        </NuxtLink>
      </div>
      <div v-for="(yearPosts, year) in filteredPosts" :key="year" class="mb-6">
        <h2 class="title font-bold">{{ year }}</h2>
        <div class="post-item">
          <article v-for="post in yearPosts" :key="post.id" class="blog-post">
            <div class="flex justify-between items-start">
              <div class="flex flex-col gap-2">
                <h3 class="post-title">
                  <NuxtLink :to="`/posts/${post.id}`" class="hover:text-primary-color">
                    {{ post.title }}
                  </NuxtLink>
                </h3>
                <p @click="toArticle(post.id)" class="post-description">{{ post.description }}</p>
              </div>
              <time class="text-sm">{{ formatDate(post.createdAt) }}</time>
            </div>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { getAllTags } from '~/api';
import type { IArticle } from '~/types/index';
import { useAsyncData } from '#app';

defineOptions({
  name: 'Archive',
});

type Tag = {
  id: number;
  name: string;
  count: number;
  articles: IArticle[];
};

const route = useRoute();
const router = useRouter();
const allPosts = ref<IArticle[]>([]);
const cachedFilteredPosts = ref<Record<string, IArticle[]>>()

const toArticle = (id: number) => {
  router.push({
    path: '/posts/' + id,
  });
};

const { data: allTags } = await useAsyncData('allTags', async () => {
  const res = await getAllTags();

  return res.data
    .map((tag: Tag) => {
      return {
        ...tag,
        count: tag.articles.length,
      };
    })
    .sort((a: Tag, b: Tag) => {
      return b.count - a.count;
    });
});

initPosts();

function initPosts() {
  allTags.value &&
    allTags.value.forEach(tag => {
      tag.articles.forEach(article => {
        if (!allPosts.value.find(item => item.id === article.id)) {
          allPosts.value.push(article);
        }
      });
    });
}

// 根据标签筛选文章
const filteredPosts = computed(() => {
  const tagName = route.params.tag as string;

  if (!tagName) return cachedFilteredPosts.value || groupedPosts.value;
  if (tagName === 'all') return groupedPosts.value;
  const articles =
    (allTags.value && allTags.value.find(tag => tag.name === tagName)?.articles) || [];
  cachedFilteredPosts.value = articleToGroups(articles);
  return cachedFilteredPosts.value
});

// Group posts by year
const groupedPosts = computed(() => {
  return articleToGroups(allPosts.value);
});

function articleToGroups(articles: IArticle[]) {
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
</script>

<style lang="scss" scoped>
.archive {
  @include responsive(lt-lg) {
    display: block;
  }
}

.title {
  margin: 0.5rem 0;
  color: var(--primary-color);
}

.tag {
  border: 1px solid transparent;

  &:hover {
    background-color: var(--hover-color) !important;
    color: var(--white-color);
  }

  &.active {
    color: var(--white-color);
    background-color: var(--tag-active-color) !important;
  }
}

.tag-all {
  color: var(--white-color);
  background-color: var(--tag-all-color);
}

.tag-grey {
  color: var(--white-color);
  background-color: var(--tag-grey-color);
}

.tag-light {
  color: var(--white-color);
  background-color: var(--tag-light-color);
}

.tag-normal {
  color: var(--white-color);
  background-color: var(--tag-normal-color);
}
</style>
