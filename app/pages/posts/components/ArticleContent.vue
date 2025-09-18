<template>
  <div class="w-full my-2 min-h-10rem">
    <div :id="ARTICLE_CONTENT_ID" class="article-content">
      <div class="article-body" v-if="isMd">
        <MdTextPreview id="blogGallery" :content="article.content!" />
      </div>
      <div class="article-body" v-else>
        <RichTextPreview id="blogGallery" :content="article.content!" />
      </div>
      <div class="w-full h-3rem flex justify-center items-center">
        <Icon name="ph:thumbs-up-duotone" @click="handleLike" :class="{
          'cursor-pointer': true,
          like: isLike,
        }" size="1.8rem" />
        <span v-if="likeCount" :class="{
          like: isLike,
        }" class="ml-1">{{ likeCount }}</span>
      </div>
      <div class="w-full">
        <h3>评论</h3>
        <Comments :type="CommentEnum.ARTICLE" :target-id="article.id" />
      </div>
      <div class="w-full">
        <h3>推荐</h3>
        <p class="recommend-item" v-for="item in recommends">
          <NuxtLink :to="'/posts/' + item.id">
            <span class="text-gradient">{{ item.title }}</span>
          </NuxtLink>
          <span>{{ formatDate(item.createdAt) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue';

import Comments from '~/components/Comment/index.vue';
import MdTextPreview from './MdTextPreview.vue';
import RichTextPreview from './RichTextPreview.vue';
import PhotoSwipeLightbox from 'photoswipe/lightbox';

import { formatDate } from '~/utils/tool';
import { ARTICLE_CONTENT_ID } from '~/constants';
import type { IArticle } from '~/types/index';
import { CommentEnum, LikeEnum } from '~/enum';
import { getIsLike, postLike, postCancelLike, getLikeCount } from '~/api/like';
import { postViewDuration } from '~/api/view';
import { getRecommendArticle } from '~/api/article';
import { useUserStore } from '~/store';
import { useArticleStore } from '~/store';
import useIdleDetection from '~/utils/idle-detection';
import Timer from '~/utils/timer'

const { $toast } = useNuxtApp()
const timeClock = new Timer()
const SILENT = 12 // 允许用户离开时间

type ArticleProps = {
  article: IArticle;
};

const userStore = useUserStore();
const articleStore = useArticleStore();
const {
  startDetection,
  stopDetection
} = useIdleDetection(timeClock.start.bind(timeClock), () => {
  timeClock.pause.bind(timeClock)(SILENT * 1000)
}, SILENT)

const props = defineProps<ArticleProps>();
let lightbox: PhotoSwipeLightbox | null = null

const isLike = ref(false);
const likeCount = ref<number>(0);
const recommends = ref<IArticle[]>([]);

const isMd = computed(() => {
  return props.article.contentType === 'md';
});

const hasUpdated = computed(() => {
  const { createdAt, updatedAt } = props.article;

  if (new Date(updatedAt!).getTime() === new Date(createdAt!).getTime()) return 0;

  return formatDate(new Date(updatedAt!));
});

async function handleLike() {
  if (isLike.value) {
    const res = await postCancelLike({
      userId: userStore.user?.id,
      targetId: props.article.id,
      type: LikeEnum.ARTICLE,
    });

    if (res.code === 200) {
      isLike.value = false;
      likeCount.value--;
    }
  } else {
    const res = await postLike({
      userId: userStore.user?.id,
      targetId: props.article.id,
      type: LikeEnum.ARTICLE,
    });

    if (res.code === 200) {
      isLike.value = true;
      $toast.success('点赞成功');
      likeCount.value++;
    }
  }
}

async function checkIsLike() {
  if (!props.article.id) return;
  const res = await getIsLike({
    userId: userStore.user?.id,
    targetId: props.article.id,
    type: LikeEnum.ARTICLE,
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
    type: LikeEnum.ARTICLE,
  });
  likeCount.value = res.data as number;
}

async function handleAddViewDuration(duration: number) {
  await postViewDuration({
    targetId: props.article.id,
    type: LikeEnum.ARTICLE,
    duration,
    userId: userStore.user?.id,
  });
}

async function handleGetRecommends() {
  const res = await getRecommendArticle(props.article.id);
  recommends.value = res.data as IArticle[];
}

function addimageView() {
  const container = document.getElementById('blogGallery')
  const images = container!.querySelectorAll('img');
  if (!images.length) return
  images.forEach((img) => {
    // 动态加载图片以获取宽高
    const image = new Image();
    image.src = img.src;
    image.onload = () => {
      const parent = img.parentElement
      if (parent) {
        if (parent.tagName === 'a') {
          parent.setAttribute('data-pswp-width', image.width + '')
          parent.setAttribute('data-pswp-height', image.height + '')
        } else {
          const anchor = document.createElement('a');
          anchor.href = image.src;
          anchor.setAttribute('target', '_blank');
          anchor.setAttribute('data-pswp-width', image.width + '');
          anchor.setAttribute('data-pswp-height', image.height + '');
          anchor.appendChild(img);
          parent.replaceWith(anchor);
        }
      }
    };
    image.onerror = () => {
      console.error('Failed to load image:', img.src);
    };
  });

  lightbox = new PhotoSwipeLightbox({
    gallery: '#blogGallery',
    children: 'a',
    pswpModule: () => import('photoswipe'),
  });
  lightbox.init();
}

onMounted(() => {
  timeClock.start()
  startDetection()
  checkIsLike()
  handleGetLikeCount();
  handleGetRecommends();
  addimageView()
});

onBeforeUnmount(() => {
  articleStore.setRefresh(true);
  // 添加阅读时长
  const elapse = Math.round(timeClock.time)
  !isNaN(elapse) && handleAddViewDuration(elapse % 86400000);
  stopDetection()
  lightbox && lightbox.destroy()
});
</script>

<style lang="scss" scoped>
.article-content {
  width: 100%;

  p {
    font-size: 14px;
    color: var(--text-light-color);
  }

  .article-body {
    width: 100%;
    overflow: hidden;
    margin: 1rem 0;
    color: var(--text-color);

    :deep(a) {
      text-decoration: underline;
      color: var(--primary-color);
    }
  }
}

.recommend-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: var(--text-light-color);
}
</style>
