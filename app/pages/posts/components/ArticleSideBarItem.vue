<template>
  <div class="blog-card">
    <span class="title">推荐文章</span>
    <Loading :loading="pending" height="6rem">
      <p class="recommend-item" v-for="item in data">
        <NuxtLink :to="'/posts/' + item.id">
          <span :title="item.title">{{ item.title }}</span>
        </NuxtLink>
      </p>
    </Loading>
  </div>
  <div class="blog-card">
    <Like :id="getCurrentArticle?.id" :type="LikeEnum.ARTICLE" />
  </div>
</template>

<script setup lang="ts">
import { getRecommendArticle } from '~/api/article';
import { LikeEnum } from '~/enum';
import { useArticleStore } from '~/store';

const { getCurrentArticle } = storeToRefs(useArticleStore());

const { data, pending } = await useAsyncData('recommend-posts', async () => {
  const id = getCurrentArticle.value?.id;
  if (!id) return
  const res = await getRecommendArticle(Number(id));
  return res.data
}, {
  watch: [getCurrentArticle]
});
</script>