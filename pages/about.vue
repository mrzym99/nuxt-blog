<template>
  <div class="mx-auto">
    <section class="blog-bg flex flex-col items-center justify-center">
      <h1 class="text-6xl leading-tight font-bold mb-6">About Me</h1>
    </section>

    <div class="container mx-auto lt-sm:py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <main class="flex-1 p-1.5rem">
          <p class="mb-6 text-xl">
            <span v-html="renderedContent"></span>
          </p>
        </main>
        <SideBar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from '~/components/SideBar.vue';
import 'highlight.js/styles/github.css';

import { computed } from 'vue';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const readme = ref<string>('');

async function readMeMd() {
  try {
    const res = await fetch('/about.md');
    readme.value = await res.text();
  } catch (error) {
    console.log(error);
  }
}

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

  return marked(readme.value || '');
});

onMounted(() => {
  readMeMd();
});
</script>
