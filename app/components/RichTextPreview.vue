<script lang="ts" setup>
import '~/assets/styles/tinymce/skins/content/default/content.min.css';
import '~/assets/styles/tinymce/skins/ui/oxide/content.min.css';
defineOptions({
  name: 'TinymcePreview',
});

defineProps<{
  content: string;
}>();

const showLightBox = ref(false);
const images = ref<string[]>([]);
const currentIndex = ref(0);

function collectImagesAndAddListener() {
  const imageList = document.querySelectorAll('img');
  imageList.forEach(image => {
    images.value.push(image.src);
  });
  imageList.forEach((image, index) => {
    image.addEventListener('click', () => {
      showLightBox.value = true;
      currentIndex.value = index;
    });
  });
}

onMounted(() => {
  collectImagesAndAddListener();
});
</script>

<template>
  <div class="tinymce-content" v-html="content"></div>
  <VueEasyLightbox
    :visible="showLightBox"
    :imgs="images"
    :index="currentIndex"
    @hide="showLightBox = false"
  />
</template>

<style lang="scss" scoped>
:deep(img) {
  max-height: 480px !important;
  object-fit: contain;
}

:deep(.vel-img) {
  box-shadow: 0 5px 10px 2px rgba(0, 0, 0, 0.3);
}
</style>
