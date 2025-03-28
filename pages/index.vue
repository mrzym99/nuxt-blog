<template>
  <div>
    <!-- Hero Section -->
    <section class="h-32rem bg-gray-100 flex flex-col items-center justify-center blog-bg">
      <h1 class="text-6xl leading-tight font-bold mb-6">Zym'S Blog</h1>
      <p class="text-xl text-gray-600 mx-auto">A place where I share my journey in technology and life.</p>
    </section>

    <!-- Main Content with Sidebar -->
    <div class="container mx-auto py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Blog Posts -->
        <main class="flex-1">
          <div class="space-y-8">
            <article v-for="post in posts" :key="post.id" class="blog-post group cursor-pointer" @click="navigateTo(post.slug)">
              <div class="flex flex-col md:flex-row md:items-center gap-4">
                <div class="flex-1">
                  <h3 class="post-title">
                    {{ post.title }}
                  </h3>
                  <div class="post-meta">
                    <span>{{ post.date }}</span>
                    <span class="mx-2">·</span>
                    <span>{{ post.readTime }} min read</span>
                  </div>
                  <p class="post-excerpt">{{ post.excerpt }}</p>
                  <div class="tags">
                    <span v-for="tag in post.tags" :key="tag" class="tag">
                      {{ tag }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="read-more"> Read More → </span>
                </div>
              </div>
            </article>
          </div>
        </main>

        <!-- Sidebar -->
        <aside class="sidebar lg:w-80">
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
              <NuxtLink v-for="tag in allTags" :key="tag.name" :to="`/tags/${tag.name}`" class="tag">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Mock data for blog posts
const posts = [
  {
    id: 1,
    title: "Getting Started with Nuxt.js",
    date: "March 28, 2024",
    readTime: 5,
    excerpt: "Learn how to build modern web applications with Nuxt.js, a powerful Vue.js framework.",
    slug: "/posts/getting-started-with-nuxtjs",
    tags: ["Nuxt.js", "Vue.js", "JavaScript"],
  },
  {
    id: 2,
    title: "The Power of UnoCSS",
    date: "March 27, 2024",
    readTime: 4,
    excerpt: "Discover how UnoCSS can help you create beautiful and responsive designs with minimal effort.",
    slug: "/posts/power-of-unocss",
    tags: ["CSS", "UnoCSS", "Frontend"],
  },
  {
    id: 3,
    title: "Building a Personal Blog",
    date: "March 26, 2024",
    readTime: 6,
    excerpt: "A step-by-step guide to creating your own personal blog using modern web technologies.",
    slug: "/posts/building-personal-blog",
    tags: ["Web Development", "Tutorial"],
  },
  {
    id: 4,
    title: "CSS Best Practices",
    date: "March 25, 2024",
    readTime: 7,
    excerpt: "Essential tips and tricks for writing clean, maintainable, and efficient CSS code.",
    slug: "/posts/css-best-practices",
    tags: ["CSS", "Frontend", "Best Practices"],
  },
];

// Compute all unique tags with their counts
const allTags = computed(() => {
  const tagCounts: Record<string, number> = {};
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCounts).map(([name, count]) => ({ name, count }));
});

// Get recent posts for sidebar
const recentPosts = computed(() => {
  return posts.slice(0, 5);
});
</script>

<style scoped>
.blog-post {
  @apply p-6 rounded-lg  transition-colors;
}

.post-title {
  @apply text-2xl font-bold mb-2;
}

.post-meta {
  @apply text-sm text-gray-600 mb-3;
}

.post-excerpt {
  @apply text-gray-600 mb-4;
}

.blog-blog-card {
  @apply p-6 rounded-lg;
}
</style>
