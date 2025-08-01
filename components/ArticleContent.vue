<template>
  <div class="w-full my-2 min-h-10rem">
    <div class="article-content">
      <div></div>
      <div>
        <div class="article-info p-1rem rounded-md mb-2">
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
        <div class="article-body" v-if="isMd">
          <MdTextPreview :content="article.content!" />
        </div>
        <div class="article-body" v-else>
          <RichTextPreview :content="article.content!" />
        </div>
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
        <div class="w-full">
          <h3>Comments</h3>
          <Comments :type="CommentType.ARTICLE" :target-id="article.id" />
        </div>
      </div>
      <div>
        <Catalog v-if="isMd" :identifier="article.title" :cover="article.cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue';
import Catalog from './Catalog.vue';
import { formatDate, formatDuration } from '~/utils/tool';
import { CommentType, LikeType, type IArticle } from '~/types/index';
import { getIsLike, postLike, postCancelLike, getLikeCount } from '~/api/like';
import { postViewDuration } from '~/api/view';
import { useUserStore } from '~/store';
import { useNuxtApp } from '#app';
import TagCloud from './TagCloud.vue';
import { getRecommendArticle } from '~/api/article';
import Comments from './Comments.vue';
import RichTextPreview from './RichTextPreview.vue';
import { useArticleStore } from '~/store';

const typeEnum = {
  original: '原创',
  transport: '转载',
  translate: '翻译',
};

type ArticleProps = {
  article: IArticle;
};

const userStore = useUserStore();
const articleStore = useArticleStore();

const props = defineProps<ArticleProps>();

const isLike = ref(false);
const likeCount = ref<number>(0);
const startViewTimestamp = ref(0);
const currentViewDuration = ref(0);
const recommends = ref<IArticle[]>([]);

const isMd = computed(() => {
  return props.article.contentType === 'md';
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
    const elapse = Date.now() - Number(startViewTimestamp.value);
    if (!isNaN(elapse) && elapse > 1000) {
      currentViewDuration.value += elapse;
      startViewTimestamp.value = Date.now();
    }
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
  articleStore.setRefresh(true);
  // 计算总的阅读时长
  const elapse = Date.now() - Number(startViewTimestamp.value);
  const du = Number(currentViewDuration.value) + elapse;

  !isNaN(du) && handleAddViewDuration(du % 86400000);

  document.removeEventListener('visibilitychange', visibleChange);
});
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;
@use '~/assets/styles/article-content.scss' as *;

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
  //grid-template-columns: 200px 1fr 200px;
  grid-template-columns: 200px minmax(0, 880px) 200px;
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
    max-width: 880px;
    overflow: hidden;
    margin: 1rem 0;
    @include themed() {
      color: themed('text');
    }
  }

  .article-body {
    :deep(a) {
      text-decoration: underline;
      @include themed() {
        color: themed('primary');
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
