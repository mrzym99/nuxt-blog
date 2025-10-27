<template>
  <div class="relative w-60 lt-md:hidden flex-shrink-0">
    <aside class="sidebar hide-scrollbar w-60">
      <div v-if="showCateLogCard">
        <Catalog :articleId="getCurrentArticle!.id" />
      </div>
      <div v-show="showMessageCard">
        <MessageBoard />
      </div>
      <div v-show="showBlogInfoCard">
        <BlogInfo />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import Catalog from '~/pages/posts/components/Catalog.vue';
import BlogInfo from '~/layouts/components/BlogInfo.vue';
import MessageBoard from '~/pages/messages/components/Board.vue';

import { useArticleStore } from '~/store';
import { ArticleContentEnum } from '~/enum';

const { getCurrentArticle, getHasCatalog } = storeToRefs(useArticleStore());
const route = useRoute();



const showCateLogCard = computed(() => {
  return (
    getCurrentArticle.value &&
    getCurrentArticle.value.contentType === ArticleContentEnum.MD
    && getHasCatalog.value
  );
});

const showMessageCard = computed(() => {
  return route.path.includes('/messages');
});

const showBlogInfoCard = computed(() => {
  return !showCateLogCard.value && !showMessageCard.value;
});
</script>
