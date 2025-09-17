<template>
  <div class="comment-input-container">
    <ClientOnly>
      <Editor class="comment-input" v-model="content" :toolbar-container="options" :placeholder="placeholder ?? '请输入'"
        :read-only="!user" @focus="focus" @blur="blur" :height="editorHeight" />
    </ClientOnly>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { useUserStore } from '~/store';

defineProps<{
  placeholder: string;
}>();

const options = [
  [
    'image',
    'emoji',
  ],
]

const content = defineModel<string>();

const { user } = storeToRefs(useUserStore());

const editorHeight = ref(60);

function focus() {
  editorHeight.value = 120;
}

function blur() {
  editorHeight.value = 60;
}
</script>

<style lang="scss" scoped>
.comment-input-container {
  position: relative;
  width: 100%;
}

.footer {
  position: absolute;
  bottom: 0;
  right: 0;
}

.comment-input {
  display: flex;
  flex-direction: column-reverse;

  :deep(.ql-container) {
    border: 1px solid var(--border-color) !important;
    border-radius: 4px !important;
  }

  :deep(.ql-toolbar) {
    border: none !important;
  }

  :deep(.ql-editor) {
    padding: 10px !important;
  }

  :deep(.ql-blank::before) {
    left: 10px !important;
  }
}
</style>