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
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"> GitHub </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"> Twitter </a>
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

    <!-- Recent Posts -->
    <div class="blog-card">
      <h3>Recent Posts</h3>
      <div class="recent-posts">
        <ul>
          <li v-for="post in recentPosts" :key="post.id">
            <NuxtLink :to="post.slug">
              {{ post.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { posts as postsData } from '~/api';

const posts = ref(postsData);
// Compute all unique tags with their counts
const allTags = computed(() => {
  const tagCounts: Record<string, number> = {};
  posts.value.forEach(post => {
    post.tags.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCounts).map(([name, count]) => ({ name, count }));
});

// Get recent posts for sidebar
const recentPosts = computed(() => {
  return posts.value.slice(0, 5);
});
</script>
