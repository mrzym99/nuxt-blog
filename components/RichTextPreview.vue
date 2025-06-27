<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useBlogStore } from '~/store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'TinymcePreview',
});

const { getTheme } = storeToRefs(useBlogStore());

const props = defineProps<{
  content: string;
}>();

const iframeRef = ref<any>();

const iframeUrl = computed(() => {
  if (!props.content) return '';

  return `
        <!DOCTYPE html>
        <html>
          <head>
           <link rel="stylesheet" href="/tinymce/skins/ui/oxide/content.min.css" />
           <link rel="stylesheet" href="/tinymce/skins/content/default/content.min.css" />
           <style>
              body {
                color: ${getTheme.value === 'dark' ? '#fff' : ''};
              }
              p  {
                margin: 0.5rem 0;
              }
           </style>
          </head>
          <body>
            ${props.content}
          </body>
        </html>
      `;
});

const updateIframeHeight = () => {
  if (iframeRef.value) {
    // 获取内容文档的实际高度
    const contentHeight = iframeRef.value.contentDocument?.body.scrollHeight;
    if (contentHeight) {
      iframeRef.value.style.height = `${contentHeight + 60}px`; // +10px 缓冲
    }
  }
};

onMounted(() => {
  // 使用 ResizeObserver 监听内容尺寸变化
  const observer = new window.ResizeObserver(updateIframeHeight);
  // iframe 加载完成后首次计算
  iframeRef.value?.addEventListener('load', updateIframeHeight);

  // 监听内容区域 DOM 变化
  if (iframeRef.value?.contentDocument?.body) {
    observer.observe(iframeRef.value.contentDocument.body);
  }
});
</script>

<template>
  <iframe ref="iframeRef" class="w-full" :srcdoc="iframeUrl" frameborder="0"></iframe>
</template>
