<template>
  <div class="blog-card">
    <span class="title">推荐文章</span>
    <p class="recommend-item" v-for="item in recommends">
      <NuxtLink :to="'/posts/' + item.id">
        <span :title="item.title">{{ item.title }}</span>
      </NuxtLink>
    </p>
  </div>
  <div class="blog-card">
    <Like :id="getCurrentArticle?.id" :type="LikeEnum.ARTICLE" />
  </div>
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