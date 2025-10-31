<template>
  <div class="comment-input-container">
    <ClientOnly>
      <Editor class="comment-input" v-model="content" :toolbar-container="options" :placeholder="placeholder ?? '请输入'"
        :read-only="!user" :max-length="1024" :mentions="mentionList" :height="height" />
    </ClientOnly>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { useUserStore } from '~/store';

withDefaults(defineProps<{
  placeholder?: string;
  autoFocus?: boolean;
  height?: number;
}>(), {
  height: 70,
})

const options = [
  [
    'image',
    'emoji',
  ],
]

const content = defineModel<string>();

const { user, mentionList } = storeToRefs(useUserStore());
</script>

<style lang="scss" scoped>
.comment-input-container {
  position: relative;
  min-width: 0;
  width: 100%;
}

.footer {
  position: absolute;
  bottom: -3px;
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

  :deep(.ql-blank::before) {
    left: 10px !important;
  }

  :deep(.max-limit) {
    bottom: 35px;
  }
}
</style>