<template>
  <div class="archive">
    <!-- Blog Posts -->
    <main>
      <Card>
        <div class="tag-cloud">
          <NuxtLink class="tag tag-all" :class="{ active: route.params.slug === ALL }" to="/archive/all"
            :replace="true">
            <strong>
              All <sup class="ml-1">{{ data?.allTotal }}</sup>
            </strong>
          </NuxtLink>
          <NuxtLink :to="`/archive/${tag.name}`" :replace="true" v-for="tag in allTags" :key="tag.name" class="tag"
            :class="{
              active: route.params.slug === tag.name,
              'tag-grey': tag.count <= 2,
              'tag-light': tag.count <= 5 && tag.count > 2,
              'tag-normal': tag.count > 5,
            }">
            <strong>{{ tag.name }} <sup class="ml-1">{{ tag.count ? tag.count : null }}</sup></strong>
          </NuxtLink>
        </div>
      </Card>
      <Loading :loading="pending" :delay="300">
        <div>
          <div v-for="(yearPosts, year) in groupedPosts" :key="year">
            <h2 class="title font-bold">{{ year }}</h2>
            <div class="post-item">
              <article v-for="post in yearPosts" :key="post.id" class="blog-post">
                <div class="post-body flex flex-col gap-1">
                  <div class="flex justify-between">
                    <NuxtLink :to="post.slug">
                      <h3 class="post-title">
                        {{ post.title }}
                      </h3>
                    </NuxtLink>
                    <span class="ml-1rem post-meta">{{ formatDate(post.createdAt) }}</span>
                  </div>
                  <p @click=" toArticle(post.id)" class="post-description">{{ post.description }}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
        <ScrollLoading ref="target" :loading="loading" :empty="!data?.list.length" empty-text="暂无文章"
          :full-loaded="fullLoaded" :current-page="currentPage" />
      </Loading>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { getAllTags, getArticleList } from '~/api';
import type { IArticle, ITag } from '~/types/index';
import { useAsyncData } from '#app';
import { ALL, PAGE_SIZE } from '~/constants';
import { useIntersectionObserver } from '@vueuse/core';
import { useRefresh } from '~/hooks/useRefresh';

defineOptions({
  name: 'Archive',
});

definePageMeta({
  key: 'Archive',
  middleware: ['refresh-same-route']
});

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const target = useTemplateRef<HTMLDivElement>('target')
const currentPage = ref(1);
const toArticle = (id: number) => {
  router.push({
    path: '/posts/' + id,
  });
};

const { data: allTags } = await useAsyncData('all-tags', async () => {
  const res = await getAllTags();

  return res.data
    .map((tag: ITag) => {
      return {
        ...tag,
        count: tag.articleCount,
      };
    })
    .sort((a: ITag, b: ITag) => {
      return b.count - a.count;
    });
});

const { data, refresh, pending } = await useAsyncData('archives-posts', async () => {
  const t = route.params.slug === ALL ? '' : route.params.slug as string;
  const res = await getArticleList({
    currentPage: currentPage.value,
    pageSize: PAGE_SIZE,
    tagName: t
  });
  const {
    list, total, allTotal
  } = res.data;
  return {
    list: list.map((item: IArticle) => ({
      ...item,
      slug: '/posts/' + item.id,
    })),
    total: total,
    allTotal: allTotal ?? 0,
  }
});

const posts = computed(() => data.value?.list || []);

async function loadMore() {
  currentPage.value += 1
  loading.value = true
  const t = route.params.slug === ALL ? '' : route.params.slug as string;
  const res = await getArticleList({
    currentPage: currentPage.value,
    pageSize: PAGE_SIZE,
    tagName: t
  });

  const {
    list, total, allTotal
  } = res.data;

  data.value = {
    list: [...posts.value, ...list.map((item) => ({
      ...item,
      slug: '/posts/' + item.id,
    }))],
    total: total,
    allTotal: allTotal ?? 0,
  };
  loading.value = false
}

// Group posts by year
const groupedPosts = computed(() => {
  return articleToGroups(posts.value ?? []);
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

function infiniteScroll() {
  const { stop } = useIntersectionObserver(
    target,
    ([entry]) => {
      if (entry && entry.isIntersecting) {
        if (posts.value.length < (data.value?.total ?? 0)) {
          loadMore();
        } else {
          stop();
        }
      }
    },
    {
      rootMargin: '0% 0% 40% 0%',
    }
  )
}

const fullLoaded = computed(() => {
  return data.value?.list.length === (data.value?.total ?? 0)
});

async function fullRefresh() {
  currentPage.value = 1;
  await refresh();
  infiniteScroll();
}

onMounted(() => {
  infiniteScroll();
});

useRefresh(route.name as string, route.params.slug as string, fullRefresh)
</script>

<style lang="scss" scoped>
.archive {
  @include responsive(lt-lg) {
    display: block;
  }
}

.title {
  margin: 0.5rem 1rem;
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
