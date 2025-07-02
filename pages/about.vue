<template>
  <div class="mx-auto">
    <PageHeader class="z-1" title="About Me" />
    <div class="container mx-auto lt-sm:py-8 relative z-1">
      <div class="flex flex-col md:flex-row gap-8">
        <main class="flex-1 p-1rem">
          <p class="mb-6 text-xl">
            <span v-html="renderedContent"></span>
          </p>
        </main>
        <SideBar />
      </div>
    </div>
    <ClientOnly>
      <Dots />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import SideBar from '~/components/SideBar.vue';
import PageHeader from '~/components/PageHeader.vue';
import Dots from '~/components/Dots.vue';
import 'highlight.js/styles/github.css';

import { computed } from 'vue';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { $fetch } from 'ofetch';
import { useAsyncData } from '#app';

const readme = ref<string>('');

const fetchAbout = async () => {
  const res = await $fetch<string>('/about.md');
  return res;
};

const { data, refresh } = await useAsyncData('about', fetchAbout);

// 配置marked-highlight
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (error) {
          console.error('代码高亮错误:', error);
        }
      }
      return code;
    },
  })
);

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  const renderer = new marked.Renderer();
  marked.setOptions({
    renderer,
    gfm: true,
  });

  if (!data.value) return '';

  return marked(data.value || '');
});

onMounted(() => {
  refresh();
});
</script>
