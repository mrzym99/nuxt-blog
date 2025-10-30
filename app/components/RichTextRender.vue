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
    children: 'a',
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
  <div :id="galleryId">
    <div class="ql-editor ql-snow" v-html="content"></div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ql-code-block-container) {
  color: var(--text-color) !important;
  background: var(--code-color) !important;
}

:deep(img) {
  max-width: $comment-image-max-width !important;
  max-height: $comment-image-max-height !important;
  object-fit: cover;
}

:deep(table),
:deep(td),
:deep(tr) {
  border: 1px solid var(--border-color) !important;
}

:deep(code) {
  @apply font-mono text-sm inline-block rounded-md p-4 w-full my-2;
  text-shadow: none !important;
  color: var(--text-color) !important;
  background: var(--code-color) !important;
}

:deep(ol) {
  list-style-type: decimal;
}

:deep(ul) {
  list-style-type: disc;
}

:deep(ul),
:deep(ol) {
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
}

:deep(li) {
  display: list-item;
  text-align: -webkit-match-parent;
  unicode-bidi: isolate;
}
</style>
