<template>
  <div
    :class="{
      'transition-all duration-300': article.cover,
      'article-header cover blog-bg h-36rem flex lt-lg:h-28rem lt-md:h-24rem pt-6rem lt-lg:pt-4rem':
        article.cover,
      'article-header mb-2rem pt-20': !article.cover,
    }"
    :style="{
      backgroundImage: article.cover ? `url(${article.cover})` : 'none',
    }"
  >
    <div class="container info-wrapper z-10">
      <div :class="['tags', article.cover ? 'white-tags' : '']">
        <span
          class="tag"
          v-for="tag in article.tags"
          :key="tag"
          @click="navigateTo(`/tags/${tag}`)"
        >
          {{ tag }}
        </span>
      </div>
      <h1>{{ article.title }}</h1>
      <h3>{{ article.description }}</h3>
      <div class="article-meta">
        <span class="date">Posted By XiaoZhang on {{ formatDate(article.createTime) }}</span>
      </div>
    </div>
  </div>
  <div class="post-detail container">
    <ArticleContent :article="article" />
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'article',
  });
  import docker from '~/assets/images/docker.png';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useArticleStore } from '~/store';

  const { setCurrentArticle } = useArticleStore();
  const route = useRoute();
  const slug = route.params.slug as string;

  const article = ref<IArticle>({
    id: 0,
    title: '',
    date: '',
    readTime: 0,
    description: '',
    slug: '',
    createTime: 0,
    content: '',
    tags: [],
    cover: '',
  });

  // 格式化日期
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Mock data - In a real app, this would come from an API or CMS
  const posts = [
    {
      id: 1,
      title: 'Getting Started with Nuxt.js',
      date: 'March 28, 2024',
      readTime: 5,
      createTime: 1717027200000,
      description:
        'Learn how to build modern web applications with Nuxt.js, a powerful Vue.js framework.',
      slug: 'getting-started-with-nuxtjs',
      cover: docker,
      content: `
# 示例文章

这是一篇示例文章，展示了 Markdown 的各种功能。

## 标题示例

### 三级标题
#### 四级标题

## 文本格式

- **粗体文本**
- *斜体文本*
- ~~删除线文本~~

## 列表

1. 第一项
2. 第二项
3. 第三项

## 代码块

\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`

## 引用

> 这是一段引用文本。

## 表格

| 表头1 | 表头2 |
|-------|-------|
| 内容1 | 内容2 |
| 内容3 | 内容4 |


## 图片`,
      tags: ['Nuxt.js', 'Vue.js', 'JavaScript', 'Web Development'],
    },
  ];

  onMounted(() => {
    article.value = posts[0] as IArticle;
    const num = Math.floor(Math.random() * 4);
    posts[0].slug = slug;
    if (num % 2 === 0) {
      article.value.cover = docker;
    } else {
      article.value.cover = '';
    }
    setCurrentArticle(article.value);
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

  .article-header {
    h1 {
      margin: 1rem 0;
      line-height: 1.1;
      font-size: 2.4rem;
      font-weight: 700;
      @include themed() {
        color: themed('text');
      }
    }

    h3 {
      margin: 0 0 1rem 0;
      font-size: 1.2rem;
      line-height: $line-height-normal;
      font-weight: 300;
      @include themed() {
        color: themed('text-light');
      }
    }

    @include responsive(md) {
      h1 {
        font-size: 3rem;
        margin: 1.4rem 0;
      }

      h3 {
        font-size: 1.6rem;
        margin: 0 0 3rem 0;
      }
    }

    @include responsive(lg) {
      h1 {
        font-size: 4rem;
        margin: 1.4rem 0;
      }

      h3 {
        font-size: 1.6rem;
        margin: 0 0 3rem 0;
      }

      .article-meta {
        .date {
          font-size: 1.2rem !important;
        }
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
    @include responsive(lg) {
      padding-right: 260px;
    }
  }
</style>
