<template>
  <div>
    <!-- PC 端目录 -->
    <div class="catalog-pc">
      <div class="catalog-header">
        <h3>目录</h3>
      </div>
      <nav class="catalog-nav">
        <ul>
          <li v-for="heading in headings" :key="heading.id" :style="getHeadingStyle(heading.level)">
            <a
              :class="{ active: activeHeading?.id === heading.id }"
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
                  :class="{ active: activeHeading?.id === heading.id }"
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
import Drawer from '~/components/Drawer.vue';

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
const activeHeading = ref<Heading>();
const showDrawer = ref(false);
// 获取标题样式
const getHeadingStyle = (level: number): { paddingLeft: string } => {
  return {
    paddingLeft: `${(level - 1) * 16}px`,
  };
};

function getHeadingElements() {
  const content = document.querySelector('.article-body');
  if (!content) return [];

  return content.querySelectorAll('h1, h2, h3, h4, h5, h6');
}
// 提取标题
const extractHeadings = () => {
  const headingElements = getHeadingElements();

  headings.value = Array.from(headingElements).map(heading => ({
    id: heading.id,
    text: heading.textContent || '',
    level: parseInt(heading.tagName[1] || '1'),
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
  const headingElements = getHeadingElements();
  // 更新当前激活的标题
  for (let i = headingElements.length - 1; i >= 0; i--) {
    const headingElement = headingElements[i];
    if (!headingElement) return;
    const rect = headingElement.getBoundingClientRect();
    if (rect.top <= 100) {
      const heading = headings.value.find(item => item.id === headingElement.id);
      activeHeading.value = heading;
      history.replaceState(null, '', `#${heading?.text}`);
      break;
    }
  }
};

function navigateToTarget() {
  const target = location.hash.slice(1);
  if (target) {
    const decoded = decodeURIComponent(target) 
    const item = headings.value.find(item => item.text === decoded);
    
    if (item) {
      const element = document.getElementById(item.id);
      if (element) {
        scrollToHeading(item.id);
      }
    }
  } else {
    activeHeading.value = headings.value[0];
  }
}

onMounted(() => {
  nextTick(() => {
    extractHeadings();
    navigateToTarget();
  });
  document.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  document.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
.catalog-pc {
  display: block;
  width: 200px;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all $duration ease;
  display: flex;
  flex-direction: column;

  @include responsive(lt-sm) {
    display: none;
  }

  @include responsive(lt-md) {
    display: none;
  }
}

.catalog-header {
  border-bottom: 1px solid var(--border-color);

  h3 {
    font-size: 1.25rem;
    color: var(--text-color);
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
      margin: 0;

      a {
        display: block;
        padding: 0.25rem 0;
        text-decoration: none;
        font-size: 0.875rem;
        color: var(--text-light-color);

        @include hover-effect() {
          color: var(--primary-color);
        }

        &.active {
          color: var(--primary-color);
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

  @include responsive(lt-sm) {
    display: block;
  }

  @include responsive(lt-md) {
    display: block;
  }

  .catalog-toggle {
    display: flex;
    align-items: center;
    padding: 1.2rem 0rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    background-color: var(--primary-color);
    color: var(--white-color);

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
    color: var(--text-light-color);

    @include hover-effect() {
      color: var(--text-color);
    }

    i {
      font-size: 1.25rem;
    }
  }
}
</style>
