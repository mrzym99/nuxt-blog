<template>
  <div
    :class="{
      'transition-all duration-300': articleDetail?.cover,
      'article-header cover article-bg': articleDetail?.cover,
      'article-header': !articleDetail?.cover,
    }"
    :style="{
      backgroundImage: articleDetail?.cover ? `url(${articleDetail?.cover})` : 'none',
    }"
  >
    <div class="article-container header-content z-10">
      <div></div>
      <div class="info-wrapper">
        <div :class="['tags', articleDetail?.cover ? 'white-tags' : '']">
          <span
            class="tag"
            v-for="tag in articleDetail?.tags"
            :key="tag.id"
            @click="navigateTo(`/archive/${tag.name}`)"
          >
            {{ tag.name }}
          </span>
        </div>
        <h1>{{ articleDetail?.title }}</h1>
        <h3>{{ articleDetail?.description }}</h3>
        <div class="article-meta">
          <span class="date"
            >Posted By {{ articleDetail?.author?.profile.nickName }} on
            {{ articleDetail?.createdAt && formatDate(articleDetail?.createdAt) }}</span
          >
        </div>
      </div>
      <div></div>
    </div>
  </div>
  <div class="post-detail article-container">
    <ArticleContent :article="article" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useArticleStore } from '~/store';
import { getArticleDetail } from '~/api';
import { formatDate } from '~/utils/tool';
import type { IArticle } from '~/types/index';
import { useHead } from '#app';
import { useAsyncData } from '#app';

const { setCurrentArticle } = useArticleStore();
const route = useRoute();

const article = ref<IArticle>({
  id: 0,
  title: '',
  description: '',
  cover: '',
  tags: [],
  slug: '',
  createdAt: null,
  updatedAt: null,
  content: '',
  contentType: 'md',
  order: null,
  top: null,
  type: 'original',
  originalUrl: '',
  author: null,
});

const { data, refresh } = await useAsyncData('article', async () => {
  const slug = route.params.slug as string;
  const res = await getArticleDetail(slug);
  const result = res.data;

  return result;
});

const articleDetail = computed(() => {
  return Object.assign(article.value, data.value);
});

// 监听路由变化刷新数据
watch(
  () => route.params.slug,
  () => {
    refresh();
  }
);

watch(
  () => data.value,
  () => {
    nextTick(() => {
      if (data.value) {
        setCurrentArticle(data.value);
        useHead({
          title: `${data.value.title}`,
        });
      }
    });
  }
);
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;

.post-detail {
  min-height: 100vh;

  @include themed() {
    background-color: themed('bg');
  }
}

.article-bg {
  min-height: 28rem;
  display: flex;
  align-items: center;

  @include mask;

  @include responsive(lg) {
    min-height: 24rem;
  }

  @include responsive(md) {
    min-height: 20rem;
  }
}

.article-header {
  h1 {
    font-size: 4rem;
    margin: 1.4rem 0;
    font-weight: 600;
    letter-spacing: 3px;

    @include themed() {
      color: themed('text');
    }
  }

  h3 {
    font-size: 1.6rem;
    margin: 0 0 3rem 0;
    font-weight: 300;
    letter-spacing: 1px;
    font-style: italic;

    @include themed() {
      color: themed('text-light');
    }
  }

  @include responsive(lg) {
    h1 {
      font-size: 3rem;
      margin: 1.4rem 0;
    }

    h3 {
      font-size: 1.6rem;
      margin: 0 0 3rem 0;
    }
  }

  @include responsive(md) {
    h1 {
      font-size: 2rem;
      margin: 1rem 0;
    }

    h3 {
      margin: 0 0 1rem 0;
      font-size: 1.2rem;
    }
  }

  .article-meta {
    font-family: Lora, 'Times New Roman', serif;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    font-style: italic;
  }
}

.white-tags {
  .tag {
    background: transparent;

    @include themed() {
      color: themed('nav-text');
      border: 1px solid rgba(themed('border'), 0.7);
    }

    @include hover-effect {
      background-color: themed('primary');
      color: white;
    }
  }
}

.cover {
  h1 {
    @include themed() {
      color: themed('nav-text');
    }
  }

  h3 {
    @include themed() {
      color: themed('nav-text');
    }
  }

  .article-meta {
    @include themed() {
      color: themed('nav-text');
    }
  }
}

.header-content {
  width: 100%;
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: 1rem;

  @include responsive(lg) {
    display: block;
  }
}

.info-wrapper {
  width: 100%;
  padding-top: 6rem;
  padding-bottom: 3rem;

  @include responsive(md) {
    padding-top: 4rem;
  }
}
</style>
