<template>
  <div class="w-1.5rem h-1.5rem">
    <Icon class="search-icon" name="ph:magnifying-glass" size="1.4rem" @click="openSearch">Open Modal</Icon>
    <Modal v-model="modelValue" fullscreen @close="handleClose">
      <div class="w-52vw mx-auto lt-sm:w-full">
        <input :value="keyword" ref="inputRef" class="search-input" type="text" placeholder="Search..."
          @input="handleInput" />
        <div class="search-result">
          <template v-if="searchResult">
            <div v-if="!isEmpty">
              <div v-for="([rKey, values]) in Object.entries(searchResult)" :key="rKey">
                <div class="search-item" v-for="item in values" :key="item.id">
                  <div class="search-item-title" @click="modelValue = false">
                    <NuxtLink :to="item.slug">
                      <span v-if="item.title?.start">{{ item.title.start }}</span>
                      <span class="keyword" v-if="item.title?.keyword">{{ item.title?.keyword }}</span>
                      <span v-if="item.title?.end">{{ item.title?.end }}</span>
                    </NuxtLink>
                  </div>
                  <div class="search-item-description">
                    <span v-if="item.description?.start">{{ item.description.start }}</span>
                    <span class="keyword" v-if="item.description?.keyword">{{ item.description?.keyword }}</span>
                    <span v-if="item.description?.end">{{ item.description?.end }}</span>
                  </div>
                  <div class="search-item-content">
                    <span v-if="item.content?.start" v-html="item.content.start"></span>
                    <span class="keyword" v-if="item.content?.keyword" v-html="item.content.keyword"></span>
                    <span v-if="item.content?.end" v-html="item.content.end"></span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty">
              试试搜索其他内容吧。。。
            </div>
          </template>
        </div>
      </div>
    </Modal>
  </div>

</template>

<script lang="ts" setup>
import type { IArticle, IArticleSearch } from '~/types';
import Modal from './Modal.vue';
import { useDebounceFn } from '@vueuse/core';
import { getSearchList } from '~/api';

const modelValue = defineModel<boolean>()

const inputRef = ref<HTMLInputElement | null>(null)
const keyword = ref<string>('')

function handleInput(e: Event) {
  keyword.value = (e.target as HTMLInputElement).value
}

const openSearch = () => {
  modelValue.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}
const handleClose = () => {
  modelValue.value = false
}

const searchResult = ref<Record<string, Array<IArticleSearch>> | null>(null)

const isEmpty = computed(() => {
  return searchResult.value ? Object.values(searchResult.value).every(item => !item || !item.length) : true
})

const handleSearch = useDebounceFn(async () => {
  if (!keyword.value) {
    handleClear()
    return
  }
  getSearchList(keyword.value).then(res => {
    const result: Record<string, Array<IArticleSearch>> = {}
    Object.keys(res.data).forEach(key => {
      if (key === 'articles' && res.data[key]) {
        result[key] = res.data[key].map((item: IArticle) => {
          return {
            ...item,
            slug: '/posts/' + item.id,
            description: strToStartEnd(item.description || '', keyword.value),
            content: strToStartEnd(item.content || '', keyword.value),
            title: strToStartEnd(item.title, keyword.value),
          };
        });
      }
    })
    searchResult.value = result
  })
}, 500)

function handleClear() {
  searchResult.value = null
}

watch(() => keyword.value, () => {
  handleSearch()
})

</script>

<style lang="scss" scoped>
.search-icon {
  padding: 0 !important;
  flex-shrink: 0;

  &:hover {
    scale: 1.1;
    color: var(--primary-color);
  }
}

.search-input {
  padding: 0.5rem;
  height: 3rem;
  line-height: 2rem;
  border-radius: 0.3rem;
  outline: none;
  max-width: 60vw;
  margin: 0 auto;
  border: none;
  font-size: 2rem;
  color: var(--text-color);
}

.search-result {
  color: var(--text-color);
  max-height: 80vh;
  overflow: auto;
}

.search-item {
  padding: 0.3rem;
  border-bottom: 1px solid var(--border-color);

  .keyword {
    color: var(--white-color);
    background: var(--primary-color);
  }

  &-title {
    transition: all $duration ease;
    font-size: 1.2rem;
    line-height: $line-height-normal;
    letter-spacing: 2px;
    color: var(--text-color);
    font-weight: normal;
    margin: 0 0 0.3rem 0;
    text-decoration: underline;
    color: var(--primary-color);
  }

  &-description {
    overflow-wrap: break-word;
    font-weight: 400;
    letter-spacing: 1px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  &-content {
    color: var(--text-light-color);
    font-size: 0.9rem;
    overflow-wrap: break-word;
    font-weight: 400;
    letter-spacing: 1px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
}

.empty {
  padding: 2rem 0.3rem;
  font-size: 1.2rem;
  color: var(--text-color);
}
</style>