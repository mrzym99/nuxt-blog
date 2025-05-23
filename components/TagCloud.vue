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
import { ref, onMounted } from 'vue';
import { getAllTags } from '~/api';
import type { ITag } from '~/types/index';

const allTags = ref<ITag[]>([]);

async function getTags() {
  const res = await getAllTags();
  allTags.value = res.data.map((tag: ITag) => {
    return {
      ...tag,
      count: tag.articles.length,
    };
  });
}

onMounted(() => {
  getTags();
});
</script>
