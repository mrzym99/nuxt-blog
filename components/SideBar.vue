<template>
  <aside class="sidebar md:w-50 lg:w-70">
    <!-- Profile Card -->
    <div class="blog-card">
      <div class="profile">
        <div class="avatar">
          <img src="../assets/images/avatar.png" alt="Profile" />
        </div>
        <h3 class="text-xl font-bold mb-2">Your Name</h3>
        <p class="text-gray-600 mb-4">Frontend Developer & Tech Enthusiast</p>
        <div class="social-links">
          <a href="https://github.com/mrzym99" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://gitee.com/mrzym" target="_blank" rel="noopener noreferrer"> Gitee </a>
        </div>
      </div>
    </div>

    <!-- Tags Cloud -->
    <div class="blog-card">
      <h3>Tags</h3>
      <div class="tags-cloud">
        <NuxtLink v-for="tag in allTags" :key="tag.name" :to="`/archives/${tag.name}`" class="tag">
          {{ tag.name }}
          <span class="ml-1 text-xs">({{ tag.count }})</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Friends -->
    <div class="blog-card">
      <h3>Friends</h3>
      <div class="recent-posts">
        <ul>
          <!-- <li v-for="post in recentPosts" :key="post.id">
            <NuxtLink :to="post.slug">
              {{ post.title }}
            </NuxtLink>
          </li> -->
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { getAllTags } from '~/api';

type Tag = {
  id: number;
  name: string;
  count: number;
  articles: IArticle[];
};

const allTags = ref<Tag[]>([]);

async function getTags() {
  const res = await getAllTags();
  allTags.value = res.data.map((tag: Tag) => {
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
