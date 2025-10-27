<template>
  <aside class="sidebar hide-scrollbar w-40">
    <div class="blog-card">
      <span class="title">推荐文章</span>
      <p class="recommend-item" v-for="item in recommends">
        <NuxtLink :to="'/posts/' + item.id">
          <span>{{ item.title }}</span>
        </NuxtLink>
      </p>
    </div>
    <div class="blog-card">
      <Like :id="getCurrentArticle?.id" :type="LikeEnum.ARTICLE" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { getRecommendArticle } from '~/api/article';
import { LikeEnum } from '~/enum';
import { useArticleStore } from '~/store';
import type { IArticle } from '~/types';

const { getCurrentArticle } = storeToRefs(useArticleStore());
const recommends = ref<IArticle[]>([]);
async function handleGetRecommends() {
  if (!getCurrentArticle.value) return
  const res = await getRecommendArticle(getCurrentArticle.value.id);
  recommends.value = res.data as IArticle[];
}

watch(getCurrentArticle, () => {
  handleGetRecommends();
}, {
  immediate: true,
})
</script>

<style lang="scss" scoped>
.recommend-item {
  padding: 0 0 0.5rem 0;
  font-size: 0.875rem;
  text-decoration: underline;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.3s ease;

  &:hover {
    color: var(--primary-color);
  }
}
</style>
