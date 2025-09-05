<script lang="ts" setup>
defineOptions({
  name: 'CommentText',
});

defineProps<{
  content: string;
}>();
</script>

<template>
  <div v-html="content"></div>
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
