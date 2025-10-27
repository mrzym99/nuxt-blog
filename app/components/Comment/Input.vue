<template>
  <div class="comment-input-container">
    <ClientOnly>
      <Editor class="comment-input" v-model="content" :toolbar-container="options" :placeholder="placeholder ?? '请输入'"
        :read-only="!user" :mentions="mentionList" @focus="focus" :height="editorHeight" />
    </ClientOnly>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { useUserStore } from '~/store';

const props = defineProps<{
  placeholder?: string;
  autoFocus?: boolean;
}>();

const options = [
  [
    'image',
    'emoji',
  ],
]

const content = defineModel<string>();

const { user, mentionList } = storeToRefs(useUserStore());
const hasFocus = ref(props.autoFocus ?? false);

const editorHeight = computed(() => {
  return user.value && hasFocus.value ? '120px' : '80px';
});

function focus() {
  hasFocus.value = true;
}

function blur() {
  hasFocus.value = false;
}

defineExpose({
  focus,
  blur,
});
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