<template>
  <div>
    <Catalog v-if="showCatalog" :articleId="getCurrentArticle!.id" />
    <div v-show="showBlogInfo">
      <BlogInfo />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArticleContentEnum } from '~/enum';
import Catalog from './Catalog.vue';
import BlogInfo from '~/layouts/components/BlogInfo.vue';
import { useArticleStore } from '~/store';

const { getCurrentArticle, getHasCatalog } = storeToRefs(useArticleStore());

const showCatalog = computed(() => {
  return (
    getCurrentArticle.value &&
    getCurrentArticle.value.contentType === ArticleContentEnum.MD
  );
});

const showBlogInfo = computed(() => {
  return !getHasCatalog.value || !showCatalog.value;
});
</script>