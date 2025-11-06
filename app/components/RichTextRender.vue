<script lang="ts" setup>
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import type { ContentTypeEnum } from '~/enum';
import 'quill/dist/quill.snow.css';

defineOptions({
  name: 'RichTextRender',
});

const props = defineProps<{
  id: number;
  type: ContentTypeEnum;
  content: string;
}>();

let lightbox: PhotoSwipeLightbox | null = null
const galleryId = computed(() => 'richTextGallery' + props.type + props.id)

function addimageView() {
  const container = document.getElementById(galleryId.value)
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
        const anchor = document.createElement('a');
        anchor.href = image.src;
        anchor.className = 'pswp-image-link'
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('data-pswp-width', image.width + '');
        anchor.setAttribute('data-pswp-height', image.height + '');
        while (parent.firstChild) {
          anchor.appendChild(parent.firstChild);
        }
        parent.replaceWith(anchor);
      }
    };
    image.onerror = () => {
      console.error('Failed to load image:', img.src);
    };
  });

  lightbox = new PhotoSwipeLightbox({
    gallery: '#' + galleryId.value,
    children: 'a.pswp-image-link',
    pswpModule: () => import('photoswipe'),
  });
  lightbox.init();
}

onMounted(() => {
  addimageView()
});

onBeforeUnmount(() => {
  lightbox && lightbox.destroy();
});
</script>

<template>
  <div class="richtext-container" :id="galleryId">
    <div v-html="content"></div>
  </div>
</template>

<style lang="scss" scoped>
.richtext-container {
  width: 100%;
  white-space: pre-wrap;
  font-size: 0.875rem;
}

:deep(.ql-code-block-container) {
  color: var(--text-color) !important;
  background: var(--code-color) !important;
  margin-bottom: 5px;
  margin-top: 5px;
  padding: 5px 10px;
}

:deep(img) {
  max-width: $comment-image-max-width !important;
  max-height: $comment-image-max-height !important;
  object-fit: cover;
}
</style>
