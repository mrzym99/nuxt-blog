<script lang="ts" setup>
import { useMdRender } from '~/hooks/useMdRender';
import 'highlight.js/styles/atom-one-dark.css'

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

onMounted(async () => {
  document.body.addEventListener('click', handleCopy);
  document && document.documentElement.setAttribute('data-theme', colorMode.value);
});

onBeforeUnmount(() => {
  document.body.removeEventListener('click', handleCopy);
});
</script>

<template>
  <div class="md-body" v-html="renderContent"></div>
</template>

<style lang="scss" scoped>
:deep(pre) {
  @apply relative rounded-md overflow-x-auto;
  padding: 1.6em 1em 0 1em;
  background: var(--code-color) !important;

  code {
    line-height: 1.7;
    font-size: 0.875rem;
    padding: 0 !important;
    padding-bottom: 1em !important;
    background: var(--code-color) !important;
  }

  .hljs-ln-numbers {
    font-weight: 300;
    width: 2em;
    text-align: right;
    padding-right: 0.5em;
  }
}

:deep(.md-code-copy-button) {
  position: absolute;
  top: 0.3rem;
  right: 0.5rem;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  color: var(--white-color);

  &:hover {
    color: var(--primary-color);
  }
}

:deep(code:not(pre code)) {
  @apply font-mono text-sm;
  color: var(--primary-color);
  background-color: rgb(from var(--primary-color) r g b / 0.1);
  border-radius: 3px;
  padding: 2px 4px;
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
