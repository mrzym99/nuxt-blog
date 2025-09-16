<script lang="ts" setup>
import { useMdRender } from '~/hooks/useMdRender';

const { $toast } = useNuxtApp()

defineOptions({
  name: 'MdPreview',
});

const props = defineProps<{
  content: string;
}>();

const colorMode = useColorMode();
const { marked } = useMdRender();

// 渲染 Markdown 内容
const renderContent = computed(() => {
  return marked(props.content || '');
});

function copyCode(code: string) {
  if (window && window.navigator) {
    window.navigator.clipboard
      .writeText(code)
      .then(() => {
        $toast.success('复制成功');
      })
      .catch(err => {
        $toast.error('复制失败');
        console.error('复制失败:', err);
      });
  }
}

// 添加复制按钮到代码块
function handleCopy(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.classList.contains('md-code-copy-button')) {
    const code = decodeURIComponent(target.getAttribute('data-code') || '');
    copyCode(code);
  }
}

watch(
  () => colorMode.value,
  async () => {
    document && document.documentElement.setAttribute('data-theme', colorMode.value);
  }
);

onMounted(() => {
  document.body.addEventListener('click', handleCopy);
  document && document.documentElement.setAttribute('data-theme', colorMode.value);
});

onBeforeUnmount(() => {
  document.body.removeEventListener('click', handleCopy);
});
</script>

<template>
  <div v-html="renderContent"></div>
</template>

<style lang="scss" scoped>
:deep(pre) {
  @apply relative rounded-md my-4 overflow-x-auto;

  &:hover {
    .md-code-copy-button {
      @apply block;
    }
  }
}

:deep(.md-code-copy-button) {
  display: none;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  color: var(--text-color);

  &:hover {
    color: var(--primary-color);
  }
}

:deep(code) {
  @apply font-mono text-sm;
  background: var(--code-color) !important;
}

:deep(p) {
  @apply my-2 leading-relaxed;
}

:deep(ul) {
  @apply list-disc pl-8;
}

:deep(ol) {
  @apply list-decimal pl-8;
}

:deep(blockquote) {
  @apply pl-4 border-l-4 my-4 italic;
  border-color: var(--primary-color);
  color: var(--text-secondary-color);
}
</style>
