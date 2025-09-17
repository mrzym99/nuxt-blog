<template>
  <div>
    <NotFound v-if="error"> 文章未找到或已删除 </NotFound>
    <template v-else>
      <div v-if="articleDetail">
        <div class="article-header">
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
          <div v-if="articleDetail?.cover" class="article-cover">
            <img :src="articleDetail?.cover" alt="" />
          </div>
        </div>
        <div class="post-detail">
          <ArticleContent :article="articleDetail" />
        </div>
      </div>
      <NotFound v-else> 文章未找到或已删除 </NotFound>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#app';
import { useAsyncData } from '#app';
import { useRoute } from 'vue-router';

import ArticleContent from './components/ArticleContent.vue';

import { useArticleStore } from '~/store';
import { getArticleDetail } from '~/api';
import { formatDate } from '~/utils/tool';


const { setCurrentArticle } = useArticleStore();
const route = useRoute();

const { data, refresh, error } = await useAsyncData('article', async () => {
  const slug = route.params.slug as string;
  if (!slug) return null;
  try {
    const res = await getArticleDetail(slug);
    const result = res.data;
    return result;
  } catch (_err) {
    return null;
  }
});

const articleDetail = computed(() => {
  return data.value
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
    if (data.value) {
      setCurrentArticle(data.value);

      useHead({
        title: `${data.value.title}`,
        meta: [
          {
            name: 'description',
            content: `${data.value.description}`,
          },
          {
            name: 'keywords',
            content: `${data.value.tags.map(tag => tag.name).join(', ')}`,
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

.article-cover {
  height: 12rem;
  overflow: hidden;
  border-radius: 0.375rem;
  margin-bottom: 1rem;

  @include mask;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
