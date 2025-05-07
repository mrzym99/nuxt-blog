<template>
  <div>
    <!-- PC 端目录 -->
    <div class="catalog-pc" :class="{ 'catalog-fixed': isFixed }">
      <div class="catalog-header">
        <h3>目录</h3>
      </div>
      <nav class="catalog-nav">
        <ul>
          <li v-for="heading in headings" :key="heading.id" :style="getHeadingStyle(heading.level)">
            <a
              :class="{ active: activeHeading === heading.id }"
              :href="'#' + heading.id"
              @click.prevent="scrollToHeading(heading.id)"
            >
              {{ heading.text }}
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- 移动端目录按钮和 Drawer -->
    <div class="catalog-mobile">
      <button class="catalog-toggle" @click="showDrawer = true">
        <Icon name="ph:list" size="1.5rem" />
      </button>
      <Drawer v-model="showDrawer" position="right" width="60%" :title="'目录'">
        <div class="catalog-drawer-content">
          <nav class="catalog-nav">
            <ul>
              <li
                v-for="heading in headings"
                :key="heading.id"
                :style="getHeadingStyle(heading.level)"
              >
                <a
                  :class="{ active: activeHeading === heading.id }"
                  :href="'#' + heading.id"
                  @click.prevent="scrollToHeading(heading.id)"
                >
                  {{ heading.text }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </Drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import Drawer from './Drawer.vue';

const props = defineProps<{
  identifier: string;
  cover?: string;
}>();

interface Heading {
  id: string;
  text: string;
  level: number;
}

const headings = ref<Heading[]>([]);
const activeHeading = ref('');
const isFixed = ref(false);
const showDrawer = ref(false);

// 获取标题样式
const getHeadingStyle = (level: number): { paddingLeft: string } => {
  return {
    paddingLeft: `${(level - 1) * 16}px`,
  };
};

// 提取标题
const extractHeadings = () => {
  const content = document.querySelector('.article-body');
  if (!content) return;

  const headingElements = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.value = Array.from(headingElements).map(heading => ({
    id: heading.id,
    text: heading.textContent || '',
    level: parseInt(heading.tagName[1]),
  }));
};

// 滚动到指定标题
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  showDrawer.value = false;
};

// 处理滚动
const handleScroll = () => {
  const content = document.querySelector('.article-body');
  if (!content) return;

  const headingElements = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const scrollPosition = window.scrollY;

  // 更新固定目录状态
  const isCover = props.cover;
  const startFixedHeight = isCover ? 450 : 350;
  isFixed.value = scrollPosition > startFixedHeight;

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
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;
.catalog-pc {
  display: block;
  width: 240px;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all $duration ease;
  display: flex;
  flex-direction: column;
  @include themed() {
    background-color: themed('bg');
  }

  &.catalog-fixed {
    position: fixed;
    top: 4rem;
    max-height: calc(100vh - 10rem);
    overflow-y: auto;
    z-index: 10;
  }

  @include responsive(md) {
    display: none;
  }
}

.catalog-header {
  border-bottom: 1px solid var(--border-color);

  h3 {
    font-size: 1.25rem;
    @include themed() {
      color: themed('text');
    }
  }
}

.catalog-nav {
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
          color: themed('text-light');
          &:hover {
            color: themed('primary');
          }
        }

        &.active {
          @include themed() {
            color: themed('primary');
          }
        }
      }
    }
  }
}

.catalog-mobile {
  display: none;
  position: fixed;
  top: 55vh;
  right: 3px;
  z-index: 100;

  @include responsive(md) {
    display: block;
  }

  .catalog-toggle {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    @include themed() {
      background-color: themed('primary');
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &:hover {
      opacity: 0.9;
    }
  }
}

.catalog-drawer-content {
  position: relative;
  height: 100%;

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    @include themed() {
      color: themed('text-light');
      &:hover {
        color: themed('text');
      }
    }

    i {
      font-size: 1.25rem;
    }
  }
}
</style>
