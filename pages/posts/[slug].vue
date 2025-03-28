<template>
  <div class="post-detail container pt-16">
    <ArticleContent :article="article" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "article",
});
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const slug = route.params.slug as string;

const article = ref({
  title: "",
  date: "",
  readTime: 0,
  content: "",
});

// Mock data - In a real app, this would come from an API or CMS
const posts = [
  {
    id: 1,
    title: "Getting Started with Nuxt.js",
    date: "March 28, 2024",
    readTime: 5,
    excerpt: "Learn how to build modern web applications with Nuxt.js, a powerful Vue.js framework.",
    slug: "getting-started-with-nuxtjs",
    content: `
      <p>Nuxt.js is a powerful framework built on top of Vue.js that makes it easy to create modern web applications. In this article, we'll explore the key features and benefits of using Nuxt.js for your next project.</p>
      
      <h2>Why Choose Nuxt.js?</h2>
      <p>Nuxt.js provides a robust set of features out of the box:</p>
      <ul>
        <li>Server-side rendering (SSR)</li>
        <li>Static site generation (SSG)</li>
        <li>File-based routing</li>
        <li>Auto-imports</li>
        <li>Built-in state management</li>
      </ul>

      <h2>Getting Started</h2>
      <p>To create a new Nuxt.js project, you can use the following command:</p>
      <pre><code>npx nuxi init my-project</code></pre>
      
      <p>This will create a new Nuxt.js project with all the necessary dependencies and configuration files.</p>
    `,
    tags: ["Nuxt.js", "Vue.js", "JavaScript", "Web Development"],
  },
  {
    id: 2,
    title: "The Power of UnoCSS",
    date: "March 27, 2024",
    readTime: 4,
    excerpt: "Discover how UnoCSS can help you create beautiful and responsive designs with minimal effort.",
    slug: "power-of-unocss",
    content: `
      <p>UnoCSS is a modern CSS framework that provides a powerful set of utility classes for building beautiful and responsive designs. In this article, we'll explore how to use UnoCSS effectively in your projects.</p>
      
      <h2>What Makes UnoCSS Special?</h2>
      <p>UnoCSS stands out from other CSS frameworks because of its:</p>
      <ul>
        <li>Atomic CSS approach</li>
        <li>Highly customizable</li>
        <li>Small bundle size</li>
        <li>On-demand generation</li>
      </ul>

      <h2>Getting Started with UnoCSS</h2>
      <p>To add UnoCSS to your project, first install the necessary dependencies:</p>
      <pre><code>npm install -D unocss @unocss/preset-uno</code></pre>
    `,
    tags: ["CSS", "UnoCSS", "Frontend", "Styling"],
  },
];

const post = computed(() => {
  return (
    posts.find((p) => p.slug === slug) || {
      title: "Article Not Found",
      content: "The article you are looking for does not exist.",
      date: "",
      readTime: 0,
      excerpt: "",
      tags: [],
    }
  );
});

onMounted(async () => {
  // 这里应该替换为实际的 API 调用
  article.value = {
    title: "示例文章标题",
    date: new Date().toISOString(),
    readTime: 5,
    content: `
# 示例文章

这是一篇示例文章，展示了 Markdown 的各种功能。

## 标题示例

### 三级标题
#### 四级标题

## 文本格式

- **粗体文本**
- *斜体文本*
- ~~删除线文本~~

## 列表

1. 第一项
2. 第二项
3. 第三项

## 代码块

\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`

## 引用

> 这是一段引用文本。

## 表格

| 表头1 | 表头2 |
|-------|-------|
| 内容1 | 内容2 |
| 内容3 | 内容4 |

## 图片

    `,
  };
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/themes.scss" as *;
.post-detail {
  min-height: 100vh;
  @include themed() {
    background-color: themed("bg");
  }
}
</style>
