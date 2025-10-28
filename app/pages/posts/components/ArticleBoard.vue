<template>
  <div>
    <Catalog v-if="getCurrentArticle" :articleId="getCurrentArticle!.id" />
    <div v-show="!showCatalog">
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
    && getHasCatalog.value
  );
});
</script>