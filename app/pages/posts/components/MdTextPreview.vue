<script lang="ts" setup>
import { useMdRender } from '~/hooks/useMdRender';

// const toast = useToast();

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
        // toast.success({ message: '复制成功' });
      })
      .catch(err => {
        // toast.error({ message: '复制失败' });
        console.error('复制失败:', err);
      });
  }
}

// 添加复制按钮到代码块
function addCopyButtons() {
  if (!document) return;
  const codeBlocks = document.querySelectorAll('pre');

  codeBlocks.length &&
    codeBlocks.forEach(block => {
      // 检查是否已经添加过按钮
      if (block.querySelector('.copy-button')) return;

      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.textContent = '复制';
      copyButton.onclick = () => {
        const codeElement = block.querySelector('code');
        if (codeElement) {
          copyCode(codeElement.textContent || '');
        }
      };

      block.style.position = 'relative';
      block.appendChild(copyButton);
    });
}

watch(
  () => colorMode.preference,
  async () => {
    document && document.documentElement.setAttribute('data-theme', colorMode.preference);
  }
);

onMounted(() => {
  addCopyButtons();
  document && document.documentElement.setAttribute('data-theme', colorMode.preference);
});
</script>

<template>
  <div v-html="renderContent"></div>
</template>

<style lang="scss" scoped>
:deep(pre) {
  @apply relative rounded-md my-4 overflow-x-auto;

  &:hover {
    .copy-button {
      @apply block;
    }
  }
}

:deep(.copy-button) {
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
