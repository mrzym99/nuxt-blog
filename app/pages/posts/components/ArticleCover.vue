<template>
  <div id="ArticleCover">
    <a :href="cover" class="article-cover" id="ArticleCover" target="_blank">
      <img :src="cover" />
    </a>
  </div>
</template>

<script setup lang="ts">
import PhotoSwipeLightbox from 'photoswipe/lightbox';

const props = defineProps<{
  cover: string;
}>();

let lightbox: PhotoSwipeLightbox | null = null

function addimageView() {
  const container = document.getElementById('ArticleCover')

  const images = container!.querySelectorAll('img');
  if (!images.length) return
  images.forEach((img) => {
    // 动态加载图片以获取宽高
    const image = new Image();
    image.src = img.src;
    image.onload = () => {
      const parent = img.parentElement
      if (parent) {
        parent.setAttribute('data-pswp-width', image.width + '');
        parent.setAttribute('data-pswp-height', image.height + '');
      }
    };
    image.onerror = () => {
      console.error('Failed to load image:', img.src);
    };
  });

  lightbox = new PhotoSwipeLightbox({
    gallery: '#ArticleCover',
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

<style lang="scss" scoped>
.article-cover {
  display: inline-block;
  width: 100%;
  height: 12rem;
  overflow: hidden;
  border-radius: 0.375rem;
  margin-bottom: 1rem;

  // @include mask;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>