<template>
  <div class="w-full my-2 min-h-10rem">
    <ClientOnly>
      <link rel="stylesheet" href="/tinymce/skins/ui/oxide/content.min.css" />
      <link rel="stylesheet" href="/tinymce/skins/content/default/content.min.css" />
    </ClientOnly>
    <div class="article-content">
      <div></div>
      <div>
        <div class="article-info p-1rem rounded-md my-4">
          <p class="my-2 flex item-center justify-between flex-wrap w-full">
            <span>
              <span class="mr-2">文章类型: </span
              ><span class="type">{{ typeEnum[article.type] }}</span></span
            >
            <span>
              <span class="mr-2">阅读时长: </span
              ><span>{{ formatDuration(article.viewDuration || 0) }}</span></span
            >
          </p>
          <p class="mb-2">
            <span class="mr-2">文章地址:</span>
            <ClientOnly>
              <span v-copy="postUrl" class="underline cursor-pointer text-gradient" href="#">{{
                postUrl
              }}</span>
            </ClientOnly>
          </p>
          <p class="mb-2" v-if="postedDays">
            <span class="tip"> 文章在 {{ postedDays }} 修改过 </span>
          </p>

          <p v-if="article.originalUrl">
            <span class="mr-2">原文地址: </span
            ><a class="underline" :href="article.originalUrl" target="_blank">{{
              article.originalUrl
            }}</a>
          </p>
        </div>
        <div class="article-body markdown-body" v-html="renderedContent"></div>
        <div class="w-full h-3rem flex justify-center items-center">
          <Icon
            name="ph:thumbs-up-duotone"
            @click="handleLike"
            :class="{
              'cursor-pointer': true,
              like: isLike,
            }"
            size="1.8rem"
          />
          <span
            v-if="likeCount"
            :class="{
              like: isLike,
            }"
            class="ml-1"
            >{{ likeCount }}</span
          >
        </div>
        <div class="w-full">
          <h3>Tags</h3>
          <TagCloud />
        </div>
        <div class="w-full">
          <h3>Recomends</h3>
          <p class="recommend-item" v-for="item in recommends">
            <NuxtLink :to="'/posts/' + item.id">
              <span class="text-gradient">{{ item.title }}</span>
            </NuxtLink>
            <span>{{ formatDate(item.createdAt) }}</span>
          </p>
        </div>
        <div class="w-fuu">
          <h3>Comments</h3>
          <Comments :type="CommentType.ARTICLE" :target-id="article.id" />
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

import { computed, onBeforeUnmount } from 'vue';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import Catalog from './Catalog.vue';
import hljs from 'highlight.js';
import { formatDate, formatDuration } from '~/utils/tool';
import { CommentType, LikeType, type IArticle } from '~/types/index';
import { getIsLike, postLike, postCancelLike, getLikeCount } from '~/api/like';
import { postViewDuration } from '~/api/view';
import { useUserStore } from '~/store';
import { useNuxtApp } from '#app';
import TagCloud from './TagCloud.vue';
import { getRecommendArticle } from '~/api/article';
import Comments from './Comments.vue';

const typeEnum = {
  original: '原创',
  transport: '转载',
  translate: '翻译',
};

type ArticleProps = {
  article: IArticle;
};

const userStore = useUserStore();

const props = defineProps<ArticleProps>();

const isLike = ref(false);
const likeCount = ref<number>(0);
const startViewTimestamp = ref(0);
const currentViewDuration = ref(0);
const recommends = ref<IArticle[]>([]);

const isMd = computed(() => {
  return props.article.contentType === 'md';
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
  return window.location;
});

async function handleLike() {
  if (isLike.value) {
    const res = await postCancelLike({
      userId: userStore.user?.id,
      targetId: props.article.id,
      type: LikeType.ARTICLE,
    });

    if (res.code === 200) {
      isLike.value = false;
      likeCount.value--;
    }
  } else {
    const res = await postLike({
      userId: userStore.user?.id,
      targetId: props.article.id,
      type: LikeType.ARTICLE,
    });

    if (res.code === 200) {
      isLike.value = true;
      useNuxtApp().$toast.success('点赞成功');
      likeCount.value++;
    }
  }
}

async function checkIsLike() {
  if (!props.article.id) return;
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

async function handleGetLikeCount() {
  const res = await getLikeCount({
    targetId: props.article.id,
    type: LikeType.ARTICLE,
  });
  likeCount.value = res.data as number;
}

async function handleAddViewDuration(duration: number) {
  await postViewDuration({
    targetId: props.article.id,
    type: LikeType.ARTICLE,
    duration,
    userId: userStore.user?.id,
  });
}

async function handleGetRecommends() {
  const res = await getRecommendArticle(props.article.id);
  recommends.value = res.data as IArticle[];
}

function visibleChange() {
  if (document.visibilityState === 'visible') {
    startViewTimestamp.value = Date.now();
  } else {
    currentViewDuration.value += Date.now() - startViewTimestamp.value;
  }
}

function initViewDuration() {
  startViewTimestamp.value = Date.now();
  if (document) {
    document.addEventListener('visibilitychange', visibleChange);
  }
}

onMounted(() => {
  checkIsLike();
  handleGetLikeCount();
  handleGetRecommends();
  initViewDuration();
});

onBeforeUnmount(() => {
  // 计算总的阅读时长
  handleAddViewDuration(currentViewDuration.value + Date.now() - startViewTimestamp.value);
  document.removeEventListener('visibilitychange', visibleChange);
});
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;

.article-info {
  border: 1px solid;
  @include themed() {
    border-color: themed('border');
  }
}

.article-content {
  margin: 0 auto;
  width: 100%;

  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: 1rem;

  @include responsive(lg) {
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
    margin: 1rem 0 3rem 0;
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

.recommend-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0;
  @include themed() {
    font-size: 1rem;
    color: themed('text-light');
  }
}
</style>
