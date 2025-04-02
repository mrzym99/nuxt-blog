<template>
  <div class="article-content">
    <div class="article-body markdown-body" v-html="renderedContent"></div>
    <Catalog v-if="renderedContent" :identifier="article.title" :cover="article.cover" />
  </div>
</template>

<script setup lang="ts">
import 'highlight.js/styles/atom-one-dark.css';

import { computed } from 'vue';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import Catalog from './Catalog.vue';
import hljs from 'highlight.js';

type ArticleProps = {
  article: IArticle;
};

const props = defineProps<ArticleProps>();

// 配置marked-highlight
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (error) {
          console.error('代码高亮错误:', error);
        }
      }
      return code;
    },
  })
);

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

  return marked(props.article.content || '');
});
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;

.article-content {
  margin: 0 auto;
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 2rem;

  @include responsive(md) {
    display: block;
  }

  .article-body {
    width: 100%;
    overflow: hidden;
    @include themed() {
      color: themed('text');
    }

    :deep(pre) {
      @apply rounded-md p-4 my-4 overflow-x-auto;
      @include themed() {
        background-color: var(--code-bg-color);
      }
    }

    :deep(code) {
      @apply font-mono text-sm;
    }

    :deep(p) {
      @apply my-4 leading-relaxed;
    }

    :deep(blockquote) {
      @apply pl-4 border-l-4 my-4 italic;
      @include themed() {
        border-color: themed('primary');
        color: var(--text-secondary-color);
      }
    }
  }
}
</style>
