<template>
  <div class="article-content">
    <div class="article-body markdown-body" v-html="renderedContent"></div>
    <Catalog :identifier="article.title" :cover="article.cover" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { marked } from 'marked';
  import Catalog from './Catalog.vue';

  type ArticleProps = {
    article: IArticle;
  };

  const props = defineProps<ArticleProps>();

  // 渲染 Markdown 内容
  const renderedContent = computed(() => {
    const renderer = new marked.Renderer();
    (renderer.heading as any) = (text: any) => {
      const { depth, text: textContent } = text;
      const id = `blog_${depth}_${Math.random().toString(36).substring(2, 12)}`;
      return `<h${depth} id="${id}">${textContent}</h${depth}>`;
    };

    marked.setOptions({
      renderer,
      gfm: true,
    });

    return marked(props.article.content);
  });
</script>

<style lang="scss" scoped>
  @use '~/assets/styles/themes.scss' as *;
  @use '~/assets/styles/global.scss' as *;

  .article-content {
    margin: 0 auto;

    @include responsive(lg) {
      display: grid;
      grid-template-columns: 1fr 240px;
      gap: 2rem;
    }

    .article-body {
      @include themed() {
        color: themed('text');
      }
    }
  }
</style>
