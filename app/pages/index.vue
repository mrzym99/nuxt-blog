<template>
  <!-- Blog Posts -->
  <main class="post-container relative w-full">
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
          <span class="post-description" :title="post.description">{{ post.description }}</span>
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
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { getArticleDetail, getArticleList, getLikeCount } from '~/api';
import { formatDate, formatNumber } from '~/utils/tool';
import { LikeType, type IArticle } from '~/types/index';
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
let timer: any = null;
const currentPage = ref(1);
const loading = ref(false);

// 使用 useAsyncData 安全获取数据
const { data } = await useAsyncData('home-posts', async () => {
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

// TODO 优化接口
async function refreshArticle() {
  if (!getCurrentArticle.value || !getCurrentArticle.value.id) return
  const res = await getArticleDetail(getCurrentArticle.value.id.toString());
  const index = data.value?.list.findIndex(item => item.id == res.data.id);


  const { data: likeCount } = await getLikeCount({
    targetId: getCurrentArticle.value.id,
    type: LikeType.ARTICLE,
  });
  if (index !== undefined && index != -1 && data.value) {
    data.value.list[index]!.viewCount = res.data.viewCount
    data.value.list[index]!.likeCount = likeCount
  }


}

// TODO 滚动到指定 current 
// 监听路由变化刷新数据
// watch(
//   () => route.query.current,
//   () => {
//     refresh();
//   }
// );

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
      rootMargin: '0px 0px 300px 0px',
    }
  )
}

onActivated(() => {
  if (getRefresh.value) {
    timer = window.setTimeout(() => {
      refreshArticle()
    }, 500);
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

.list-enter-active,
.list-leave-active {
  transition: all 0.6s ease-in-out;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}
</style>
