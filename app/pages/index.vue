<template>
  <!-- Blog Posts -->
  <Loading :loading="pending">
    <main class="post-container relative w-full" :key="refreshKey">
      <transition-group name="list">
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
            <span v-if="post.description" class="post-description" :title="post.description">{{ post.description
              }}</span>
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
      </transition-group>
      <div ref="target" class="h-1rem mt-4">
        <div v-show="loading" class="text-center loading">
          <Icon name="eos-icons:bubble-loading" size="1.6rem" />
        </div>
      </div>
    </main>
  </Loading>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { getArticleList, getLikeCount } from '~/api';
import { formatDate, formatNumber } from '~/utils/tool';
import { type IArticle } from '~/types/index';
import { LikeEnum } from '~/enum';
import { useAsyncData } from '#app';
import { useArticleStore } from '~/store';
import { storeToRefs } from 'pinia';
import { useIntersectionObserver } from '@vueuse/core';

defineOptions({
  name: 'Home',
});

const target = useTemplateRef<HTMLDivElement>('target')
const PAGE_SIZE = 10;
const { getRefresh, getCurrentArticle } = storeToRefs(useArticleStore());
const refreshKey = ref(1)
let timer: any = null;
const currentPage = ref(1);
const loading = ref(false);

// 使用 useAsyncData 安全获取数据
const { data, pending } = await useAsyncData('home-posts', async () => {
  const res = await getArticleList({
    currentPage: currentPage.value,
    pageSize: PAGE_SIZE,
  });

  const {
    list, total
  } = res.data;

  return {
    list: list.map((item: IArticle) => ({
      ...item,
      slug: '/posts/' + item.id,
    })),
    total: total,
  };
});

const posts = computed(() => data.value?.list || []);
async function loadMore() {
  currentPage.value += 1
  loading.value = true
  const res = await getArticleList({
    currentPage: currentPage.value,
    pageSize: PAGE_SIZE,
  });

  const {
    list, total
  } = res.data;

  data.value = {
    list: [...posts.value, ...list.map((item) => ({
      ...item,
      slug: '/posts/' + item.id,
    }))],
    total: total,
  };
  loading.value = false
}

async function refreshArticle() {
  if (!getCurrentArticle.value || !getCurrentArticle.value.id) return
  const index = data.value?.list.findIndex(item => item.id == getCurrentArticle.value?.id);

  const { data: likeCount } = await getLikeCount({
    targetId: getCurrentArticle.value.id,
    type: LikeEnum.ARTICLE,
  });
  if (index !== undefined && index != -1 && data.value) {
    const viewCount = data.value.list[index]?.viewCount ?? 0
    data.value.list[index]!.viewCount = viewCount + 1
    data.value.list[index]!.likeCount = likeCount
    forceUpdate()
  }
}

function forceUpdate() {
  refreshKey.value++;
}

function infiniteScroll() {
  const { stop } = useIntersectionObserver(
    target,
    ([entry]) => {
      if (entry && entry.isIntersecting) {
        if (posts.value.length < data.value!.total) {
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

onActivated(() => {
  if (getRefresh.value) {
    timer = window.setTimeout(() => {
      refreshArticle()
    }, 300);
  }
});

onMounted(() => {
  infiniteScroll();
});

onBeforeMount(() => {
  window.clearTimeout(timer);
  timer = null;
});
</script>

<style lang="scss" scoped>
.loading {
  color: var(--text-light-color);
}
</style>
