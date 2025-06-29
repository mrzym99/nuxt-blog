<script lang="ts" setup>
import { useHead } from '#app';
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: '/tinymce/skins/content/default/content.min.css',
    },
    {
      rel: 'stylesheet',
      href: '/tinymce/skins/ui/oxide/content.min.css',
    },
  ],
});

defineOptions({
  name: 'TinymcePreview',
});

defineProps<{
  content: string;
}>();
</script>

<template>
  <div v-html="content"></div>
</template>
