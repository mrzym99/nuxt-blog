<template>
  <div class="article-container">
    <!-- 文章内容区域 -->
    <div class="article-content">
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="date">{{ formatDate(article.date) }}</span>
          <span class="read-time">{{ article.readTime }} min read</span>
        </div>
      </div>
      <div class="article-content-wrapper">
        <div ref="contentRef" class="content" v-html="renderedContent"></div>
        <div class="toc-container-wrapper">
          <div
            ref="tocContainerRef"
            class="toc-container"
            :class="{ 'toc-fixed': isTocFixed }"
          >
            <div class="toc-header">
              <h3>目录</h3>
            </div>
            <nav class="toc-nav">
              <ul>
                <li v-for="heading in headings" :key="heading.id">
                  <a
                    :class="{ active: activeHeading == heading.id }"
                    :href="'#' + heading.id"
                    @click.prevent="scrollToHeading(heading.id)"
                  >
                    {{ heading.text }}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { marked } from "marked";
import VueScrollama from "vue-scrollama";

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
});

const contentRef = ref(null);
const tocContainerRef = ref(null);
const headings = ref([]);
const activeHeading = ref("");
const isTocFixed = ref(false);

const randomId = (level) => {
  return "blog_" + level + "_" + Math.random().toString(36).substring(2, 12);
};

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  const renderer = new marked.Renderer();
  renderer.heading = (text) => {
    const { depth, text: textContent } = text;
    const id = randomId(depth);
    return `<h${depth} id="${id}">${textContent}</h${depth}>`;
  };

  marked.setOptions({
    renderer,
  });

  return marked(props.article.content);
});

// 提取标题
const extractHeadings = () => {
  const content = contentRef.value;
  if (!content) return;

  const headingElements = content.querySelectorAll("h1, h2, h3, h4, h5, h6");

  headings.value = Array.from(headingElements).map((heading) => ({
    id: heading.id,
    text: heading.textContent,
    level: parseInt(heading.tagName[1]),
  }));
};

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// 滚动到指定标题
const scrollToHeading = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

// 处理滚动
const handleScroll = () => {
  const content = contentRef.value;
  if (!content) return;

  const headingElements = content.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const scrollPosition = window.scrollY;

  // 更新固定目录状态
  isTocFixed.value = scrollPosition > 120;

  // 更新当前激活的标题
  for (let i = headingElements.length - 1; i >= 0; i--) {
    const heading = headingElements[i];
    const rect = heading.getBoundingClientRect();
    if (rect.top <= 100) {
      activeHeading.value = heading.id;
      break;
    }
  }
};

onMounted(() => {
  nextTick(() => {
    extractHeadings();
  });
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/themes.scss" as *;
@use "~/assets/styles/main.scss" as *;

.article-container {
  margin: 0 auto;
  padding: 2rem 0;
}

.article-content {
  position: relative;
}

.article-content-wrapper {
  display: grid;
  grid-template-columns: 1fr 200px;
  padding-left: 100px;
}

.toc-container-wrapper {
  position: relative;
}

.article-header {
  margin-bottom: 2rem;
  text-align: center;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  @include themed() {
    color: themed("text");
  }
}

.article-meta {
  @include themed() {
    color: themed("text-light");
  }
  font-size: 0.875rem;

  .date,
  .read-time {
    margin: 0 0.5rem;
  }
}

.toc-container {
  width: 200px;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  @include themed() {
    background-color: themed("bg");
    border: 1px solid themed("border");
  }

  &.toc-fixed {
    position: fixed;
    top: 2rem;
    max-height: calc(100vh - 10rem);
    overflow-y: auto;
    z-index: 10;
  }
}

.toc-header {
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);

  h3 {
    font-size: 1.25rem;
    @include themed() {
      color: themed("text");
    }
  }
}

.toc-nav {
  flex: 1;
  overflow-y: auto;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin: 0.5rem 0;

      a {
        display: block;
        padding: 0.25rem 0;
        text-decoration: none;
        font-size: 0.875rem;
        @include themed() {
          color: themed("text-light");
          &:hover {
            color: themed("primary");
          }
        }

        &.active {
          @include themed() {
            color: themed("primary");
          }
        }
      }
    }
  }
}

.content {
  padding-right: 1rem;
  @include themed() {
    color: themed("text");
  }
  line-height: 1.8;

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    margin: 2rem 0 1rem;
    @include themed() {
      color: themed("text");
    }
  }

  :deep(h1) {
    font-size: 2rem;
  }
  :deep(h2) {
    font-size: 1.75rem;
  }
  :deep(h3) {
    font-size: 1.5rem;
  }
  :deep(h4) {
    font-size: 1.25rem;
  }
  :deep(h5) {
    font-size: 1.1rem;
  }
  :deep(h6) {
    font-size: 1rem;
  }

  :deep(p) {
    margin-bottom: 1.5rem;
  }

  :deep(a) {
    @include themed() {
      color: themed("primary");
      &:hover {
        text-decoration: underline;
      }
    }
  }

  :deep(code) {
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    @include themed() {
      background-color: themed("border");
    }
  }

  :deep(pre) {
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
    @include themed() {
      background-color: themed("border");
    }
  }

  :deep(blockquote) {
    margin: 1.5rem 0;
    padding-left: 1rem;
    border-left: 4px solid var(--primary-color);
    @include themed() {
      color: themed("text-light");
    }
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1.5rem 0;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;

    th,
    td {
      padding: 0.75rem;
      border: 1px solid var(--border-color);
    }

    th {
      @include themed() {
        background-color: themed("border");
      }
    }
  }
}

@media (max-width: 768px) {
  .article-container {
    padding: 1rem;
  }

  .article-content {
    padding-right: 0;
  }

  .toc-container {
    position: static;
    width: 100%;
    margin-bottom: 2rem;
  }
}
</style>
