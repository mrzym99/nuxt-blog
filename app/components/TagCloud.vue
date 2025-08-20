<template>
  <!-- Tags Cloud -->
  <div class="tags-cloud">
    <NuxtLink v-for="tag in allTags" :key="tag.name" :to="`/archive/${tag.name}`" class="tag">
      {{ tag.name }}
      <span class="ml-1 text-xs">({{ tag.count }})</span>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { getAllTags } from '~/api';
import type { ITag } from '~/types/index';

const { data } = await useAsyncData('tags-clould', async () => {
  const res = await getAllTags();
  return res.data;
});

const allTags = computed(() => {
  return (
    data.value &&
    data.value.map((tag: ITag) => {
      return {
        ...tag,
        count: tag.articles.length,
      };
    })
  );
});
</script>
