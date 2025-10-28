<template>
  <div>
    <NotFound v-if="error"> 文章未找到或已删除 </NotFound>
    <template v-else>
      <div v-if="articleDetail">
        <div :id="ARTICLE_HEADER_ID" class="article-header">
          <div class="info-wrapper">
            <div class="tag-cloud">
              <Back class="back" />
              <NuxtLink class="tag" v-for="tag in articleDetail?.tags" :to="'/archive/' + tag.name" :key="tag.id">
                {{ tag.name }}
              </NuxtLink>
            </div>
            <h1>{{ articleDetail?.title }}</h1>
            <div class="article-meta">
              <span class="date">Posted By {{ articleDetail?.author?.profile.nickName }} on
                {{ articleDetail?.createdAt && formatDate(articleDetail?.createdAt) }}</span>
            </div>
          </div>
          <ArticleCover v-if="articleDetail?.cover" :cover="articleDetail.cover" />
          <div class="flex items-center justify-between read-duration mb-2">
            <span><span class="tip" v-if="hasUpdated"> Updated On {{ hasUpdated }} </span> <span class="type-tag">{{
              ARTICLE_TYPE_NAME[articleDetail.type] }}</span></span>
            <span>阅读时长:<span class="ml-2">{{ formatDuration(viewDuration || 0) }}</span></span>
          </div>
          <div class="text-sm">
            <p v-if="articleDetail.originalUrl">
              <span class="mr-2">原文地址: </span><a class="underline" :href="articleDetail.originalUrl" target="_blank">{{
                articleDetail.originalUrl
              }}</a>
            </p>
          </div>
        </div>
        <div class="post-detail">
          <ArticleContent :article="articleDetail" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#app';
import { useAsyncData } from '#app';
import { useRoute } from 'vue-router';

import ArticleContent from './components/ArticleContent.vue';
import ArticleCover from './components/ArticleCover.vue';

import { useArticleStore, useUserStore } from '~/store';
import { getArticleDetail, getViewDuration } from '~/api';
import { formatDate } from '~/utils/tool';
import { ViewEnum } from '~/enum';
import { ARTICLE_HEADER_ID, ARTICLE_TYPE_NAME } from '~/constants';

const { setCurrentArticle } = useArticleStore();
const userStore = useUserStore();
const route = useRoute();
const viewDuration = ref<number>(0)

const { data: articleDetail, refresh, error } = await useAsyncData('article', async () => {
  const slug = route.params.slug as string;
  if (!slug) return null;
  try {
    const res = await getArticleDetail(slug);
    const result = res.data;
    return result;
  } catch (_err) {
    throw _err;
  }
});

const hasUpdated = computed(() => {
  if (!articleDetail.value) return false
  const { createdAt, updatedAt } = articleDetail.value;
  if (new Date(updatedAt!).getTime() === new Date(createdAt!).getTime()) return 0;

  return formatDate(new Date(updatedAt!));
});

async function handleGetViewDuration() {
  const res = await getViewDuration({
    type: ViewEnum.ARTICLE,
    targetId: route.params.slug as unknown as number,
    userId: userStore.user?.id
  })
  viewDuration.value = res.data as number
}

// 监听路由变化刷新数据
watch(
  () => route.params.slug,
  () => {
    if (route.path.includes('posts')) {
      refresh();
    }
  }
);

watch(
  () => articleDetail.value,
  () => {
    if (articleDetail.value) {
      setCurrentArticle(articleDetail.value);
      handleGetViewDuration()

      useHead({
        title: `${articleDetail.value.title}`,
        meta: [
          {
            name: 'description',
            content: `${articleDetail.value.description}`,
          },
          {
            name: 'keywords',
            content: `${articleDetail.value.tags.map(tag => tag.name).join(', ')}`,
          },
        ],
      });
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style lang="scss" scoped>
.post-detail {
  min-height: 100vh;
  background-color: var(--bg-color);
  border-top: 1px solid var(--border-color);
}

.tip {
  margin-right: 10px;
  color: #dc8e56;
}

.type-tag {
  display: inline-block;
  padding: 1px 10px;
  color: var(--white-color);
  border-radius: 3px;
  background: var(--primary-color);
}

.read-duration {
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--text-light-color);
  border-color: var(--border-color);
}

.article-header {
  position: relative;

  h1 {
    font-size: 2rem;
    margin: 1rem 0;
    font-weight: 600;
    letter-spacing: 3px;
    color: var(--text-color);
  }

  @include responsive(lt-sm) {
    h1 {
      font-size: 1.8rem;
      margin: 1rem 0;
    }
  }

  @include responsive(lt-md) {
    h1 {
      font-size: 1.8rem;
      margin: 1rem 0;
    }
  }

  .article-meta {
    font-family: Lora, 'Times New Roman', serif;
    font-size: 0.9rem;
    font-weight: 300;
    margin-bottom: 0.5rem;
    letter-spacing: 1px;
    color: var(--text-color);
  }
}

.white-tags {
  .tag {
    background: transparent;
    color: var(--white-color);
    border: 1px solid var(--white-color);

    @include hover-effect {
      background-color: var(--primary-color);
      color: var(--white-color);
      border-color: transparent;
    }
  }
}

.header-content {
  width: 100%;
}

.info-wrapper {
  position: relative;
  width: 100%;
  z-index: 10;
}
</style>
