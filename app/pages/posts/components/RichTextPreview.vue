<script lang="ts" setup>
defineOptions({
  name: 'TinymcePreview',
});

defineProps<{
  content: string;
}>();
</script>

<template>
  <div class="tinymce-content" v-html="content"></div>
</template>

<style lang="scss" scoped>
:deep(img) {
  max-height: 480px !important;
  object-fit: cover;
}

:deep(.vel-img) {
  box-shadow: 0 5px 10px 2px rgba(0, 0, 0, 0.3);
}

:deep(table),
:deep(td),
:deep(tr) {
  border: 1px solid var(--border-color) !important;
}

:deep(code) {
  @apply font-mono text-sm inline-block rounded-md p-4 w-full my-2;
  text-shadow: none !important;
  color: #333;
  background: #f4f2f0 !important;
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
