<template>
  <div class="w-full my-2 min-h-10rem">
    <div :id="ARTICLE_CONTENT_ID" class="article-content">
      <div class="article-body" v-if="isMd">
        <MdTextPreview id="blogGallery" :content="article.content!" />
      </div>
      <div class="article-body" v-else>
        <RichTextPreview id="blogGallery" :content="article.content!" />
      </div>
      <div class="w-full h-3rem flex justify-center items-center lg-md:hidden">
        <Like :id="article.id" :type="LikeEnum.ARTICLE" />
      </div>
      <div class="w-full">
        <h3>评论</h3>
        <Comments :type="CommentTypeEnum.ARTICLE" :target-id="article.id" notify />
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

import { ARTICLE_CONTENT_ID } from '~/constants';
import type { IArticle } from '~/types/index';
import { ArticleContentEnum, CommentTypeEnum, LikeEnum, ViewEnum } from '~/enum';
import { postViewDuration } from '~/api/view';
import { useUserStore } from '~/store';
import { useArticleStore } from '~/store';
import useIdleDetection from '~/utils/idle-detection';
import Timer from '~/utils/timer'

const timeClock = new Timer()
const SILENT = 3 // 允许用户离开时间

type ArticleProps = {
  article: IArticle;
};

const userStore = useUserStore();
const articleStore = useArticleStore();
const {
  startDetection,
  stopDetection
} = useIdleDetection(timeClock.start.bind(timeClock), timeClock.pause.bind(timeClock), SILENT)

const props = defineProps<ArticleProps>();
let lightbox: PhotoSwipeLightbox | null = null

const isMd = computed(() => {
  return props.article.contentType === ArticleContentEnum.MD;
});

async function handleAddViewDuration(duration: number) {
  await postViewDuration({
    targetId: props.article.id,
    type: ViewEnum.ARTICLE,
    duration,
    userId: userStore.user?.id,
  });
}

function addimageView() {
  const container = document.getElementById('blogGallery')
  if (!container) return
  const images = container.querySelectorAll('img');
  if (!images.length) return
  images.forEach((img) => {
    // 动态加载图片以获取宽高
    const image = new Image();
    image.src = img.src;
    image.onload = () => {
      const parent = img.parentElement
      if (parent) {
        if (parent.tagName === 'a') {
          parent.className = 'pswp-image-link'
          parent.setAttribute('data-pswp-width', image.width + '')
          parent.setAttribute('data-pswp-height', image.height + '')
        } else {
          const anchor = document.createElement('a');
          anchor.href = image.src;
          anchor.className = 'pswp-image-link'
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
    children: 'a.pswp-image-link',
    pswpModule: () => import('photoswipe'),
  });
  lightbox.init();
}

onMounted(() => {
  timeClock.start()
  startDetection()
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
    margin: 2rem 0;
    color: var(--text-color);

    :deep(a) {
      text-decoration: underline;
      color: var(--primary-color);
    }
  }
}
</style>
