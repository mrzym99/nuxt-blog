<template>
  <div class="w-full my-2">
    <div class="article-content">
      <div>
        <div class="py-3 px-2 bg-gray-100 rounded-md mb-4">
          <p class="my-2">
            <span class="mr-2">文章类型: </span
            ><span class="type">{{ typeEnum[article.type] }}</span>
          </p>
          <p class="mb-2">
            <span class="mr-2">文章地址:</span>
            <a class="underline" href="#">{{ postUrl }}</a>
          </p>
          <p class="mb-2" v-if="postedDays">
            <span class="tip"> 文章在 {{ postedDays }} 修改过 </span>
          </p>
          <p v-if="article.originalUrl">
            <span class="mr-2">原文地址: </span
            ><a class="text-underline" href="#">{{ article.originalUrl }}</a>
          </p>
        </div>
        <div class="article-body markdown-body" v-html="renderedContent"></div>
        <div class="like w-full h-2rem">
          <Icon name="ph:thumbs-up-duotone" size="1.2rem" />
        </div>
      </div>
      <div>
        <Catalog
          v-if="isMd && renderedContent"
          :identifier="article.title"
          :cover="article.cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'highlight.js/styles/atom-one-dark.css';

import { computed } from 'vue';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import Catalog from './Catalog.vue';
import hljs from 'highlight.js';
import { formatDate } from '~/utils/tool';
import { LikeType, type IArticle } from '~/types/index';
import { getIsLike, postLike } from '~/api/like';
import { useUserStore } from '~/store';

const typeEnum = {
  0: '原创',
  1: '转载',
  2: '翻译',
};

type ArticleProps = {
  article: IArticle;
};

const userStore = useUserStore();

const props = defineProps<ArticleProps>();

const isLike = ref(false);

const isMd = computed(() => {
  return props.article.contentType === 0;
});

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
  if (!isMd.value) return props.article.content;
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

const postedDays = computed(() => {
  const { createdAt, updatedAt } = props.article;
  if (new Date(updatedAt!).getTime() === new Date(createdAt!).getTime()) return 0;

  return formatDate(new Date(updatedAt!));
});

const postUrl = computed(() => {
  return `${window.location.origin}/posts/${props.article.id}`;
});

async function handleLike() {
  const res = await postLike({
    userId: userStore.user?.id,
    targetId: props.article.id,
    type: LikeType.ARTICLE,
  });

  if (res.code === 200) {
    isLike.value = true;
    // message.success('点赞成功');
  }
}
async function handleCalcelLike() {
  const res = await postLike({
    userId: userStore.user?.id,
    targetId: props.article.id,
    type: LikeType.ARTICLE,
  });

  if (res.code === 200) {
    isLike.value = false;
    // message.success('取消点赞成功');
  }
}

async function checkIsLike() {
  const res = await getIsLike({
    userId: userStore.user?.id,
    targetId: props.article.id,
    type: LikeType.ARTICLE,
  });

  if (res.data) {
    isLike.value = true;
  } else {
    isLike.value = false;
  }
}

onMounted(() => {
  checkIsLike();
});
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;

.article-content {
  margin: 0 auto;
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 1rem;

  @include responsive(md) {
    display: block;
  }

  p {
    font-size: 14px;
    @include themed() {
      color: themed('text-light');
    }
  }

  .tip {
    color: #ff8023;
  }

  .type {
    cursor: pointer;
    padding: 0.3rem 0.8rem;
    font-size: 0.875rem;
    @include themed() {
      color: themed('nav-text');
      background: themed('primary');
    }
    border-radius: 9999px;
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
