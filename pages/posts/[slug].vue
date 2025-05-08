<template>
  <Loading :loading="loading">
    <div
      :class="{
        'transition-all duration-300': article.cover,
        'article-header cover article-bg': article.cover,
        'article-header': !article.cover,
      }"
      :style="{
        backgroundImage: article.cover ? `url(${article.cover})` : 'none',
      }"
    >
      <div class="article-container info-wrapper z-10">
        <div :class="['tags', article.cover ? 'white-tags' : '']">
          <span
            class="tag"
            v-for="tag in article.tags"
            :key="tag.id"
            @click="navigateTo(`/archives/${tag.name}`)"
          >
            {{ tag.name }}
          </span>
        </div>
        <h1>{{ article.title }}</h1>
        <h3>{{ article.description }}</h3>
        <div class="article-meta">
          <span class="date"
            >Posted By {{ article.author?.profile.nickName }} on
            {{ article.createdAt && formatDate(article.createdAt) }}</span
          >
        </div>
      </div>
    </div>
    <div class="post-detail article-container">
      <ArticleContent :article="article" />
    </div>
  </Loading>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useArticleStore } from '~/store';
import { getArticleDetail } from '~/api';
import { formatDate } from '~/utils/tool';

const loading = ref(false);
const { setCurrentArticle } = useArticleStore();
const route = useRoute();
const slug = route.params.slug as string;

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
  contentType: 0,
  order: null,
  top: null,
  type: 0,
  originalUrl: '',
  author: null,
});

const getArticleInfo = async () => {
  loading.value = true;
  const res = await getArticleDetail(slug);
  loading.value = false;
  const result = res.data;

  Object.assign(article.value, result);
  setCurrentArticle(article.value);
};

onMounted(() => {
  getArticleInfo();
});
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

  @include bg;

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

    @include themed() {
      color: themed('text');
    }
  }

  h3 {
    font-size: 1.6rem;
    margin: 0 0 3rem 0;
    font-weight: 300;

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
    @include themed() {
      color: themed('text-light');
    }

    .date {
      font-size: 1rem;
      font-weight: 100;
      font-style: italic;
    }

    @include responsive(md) {
      .date {
        font-size: 1rem;
      }
    }
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

.info-wrapper {
  width: 100%;
  padding-top: 6rem;
  padding-bottom: 3rem;
  padding-right: 260px;

  @include responsive(md) {
    padding-top: 4rem;
    padding-right: 2rem;
  }
}
</style>
