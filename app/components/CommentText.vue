<script lang="ts" setup>
import PhotoSwipeLightbox from 'photoswipe/lightbox';
defineOptions({
  name: 'CommentText',
});

const props = defineProps<{
  content: string;
  id: string;
}>();

let lightbox: PhotoSwipeLightbox | null = null

function addimageView() {
  const container = document.getElementById('commentGallery' + props.id)

  const images = container!.querySelectorAll('img');
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
    gallery: '#commentGallery' + props.id,
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
  <div :id="'commentGallery' + id">
    <div v-html="content"></div>
  </div>
</template>

<style lang="scss" scoped>
:deep(img) {
  max-width: $comment-image-max-width !important;
  object-fit: cover;
}

:deep(.ql-code-block) {
  @apply font-mono text-sm inline-block rounded-md p-4 w-full my-2;
  text-shadow: none !important;
  color: var(--text-color) !important;
  background: var(--code-color) !important;
}
</style>
