<template>
  <div class="relative w-60 lt-md:hidden flex-shrink-0">
    <aside class="sidebar hide-scrollbar w-60">
      <div v-if="showArticleCard">
        <ArticleBoard />
      </div>
      <div v-show="showBlogInfoCard">
        <BlogInfo />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import ArticleBoard from '~/pages/posts/components/ArticleBoard.vue';
import BlogInfo from '~/layouts/components/BlogInfo.vue';

const route = useRoute();

const showArticleCard = computed(() => {
  return route.path.includes('/posts');
});

const showBlogInfoCard = computed(() => {
  return !showArticleCard.value
});
</script>
